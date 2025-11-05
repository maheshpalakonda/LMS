import { uploadFileToS3, deleteFileFromS3 } from "../configs/awsS3.js";
import { v4 as uuidv4 } from 'uuid';
import User from "../models/userModel.js";

export const getCurrentUser = async (req,res) => {
    try {
        const user = await User.findById(req.userId).select("-password").populate("enrolledCourses")
         if(!user){
            return res.status(400).json({message:"user does not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"get current user error"})
    }
}

export const UpdateProfile = async (req,res) => {
    try {
        const userId = req.userId
        const {name , description} = req.body
        let photoUrl
        if(req.file){
            const user = await User.findById(userId);
            if (user && user.photoUrl) {
                const oldKey = user.photoUrl.split('/').pop();
                await deleteFileFromS3(oldKey);
            }
            const key = `profile-photos/${uuidv4()}-${req.file.originalname}`;
            photoUrl = await uploadFileToS3(req.file.path, key);
        }
        const user = await User.findByIdAndUpdate(userId,{name,description,photoUrl})


        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        await user.save()
        return res.status(200).json(user)
    } catch (error) {
         console.log(error);
       return res.status(500).json({message:`Update Profile Error  ${error}`})
    }
}

export const addToWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const { courseId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "student") {
            return res.status(403).json({ message: "Only students can add to wishlist" });
        }

        if (user.wishlistCourses.includes(courseId)) {
            return res.status(400).json({ message: "Course already in wishlist" });
        }

        user.wishlistCourses.push(courseId);
        await user.save();

        return res.status(200).json({ message: "Course added to wishlist", wishlist: user.wishlistCourses });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Add to wishlist error: ${error}` });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const { courseId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "student") {
            return res.status(403).json({ message: "Only students can manage wishlist" });
        }

        user.wishlistCourses = user.wishlistCourses.filter(id => id.toString() !== courseId);
        await user.save();

        return res.status(200).json({ message: "Course removed from wishlist", wishlist: user.wishlistCourses });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Remove from wishlist error: ${error}` });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).populate('wishlistCourses');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "student") {
            return res.status(403).json({ message: "Only students can view wishlist" });
        }

        return res.status(200).json({ wishlist: user.wishlistCourses });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Get wishlist error: ${error}` });
    }
};
