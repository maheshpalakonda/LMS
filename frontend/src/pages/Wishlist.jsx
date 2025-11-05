import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Card from '../components/Card';
import { useSelector, useDispatch } from 'react-redux';
import { setWishlist } from '../redux/userSlice';
import { serverUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';

function Wishlist() {
  const dispatch = useDispatch();
  const { userData, wishlist } = useSelector(state => state.user);
  const [wishlistCourses, setWishlistCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData && userData.role === "student") {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [userData]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(serverUrl + "/api/user/wishlist", { withCredentials: true });
      setWishlistCourses(response.data.wishlist);
      const ids = response.data.wishlist.map(course => course._id);
      dispatch(setWishlist(ids));
    } catch (error) {
      toast.error("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  if (!userData || userData.role !== "student") {
    return (
      <div>
        <Nav />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl">Only students can access wishlist</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="min-h-screen py-[130px] px-[20px]">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
        {loading ? (
          <p>Loading...</p>
        ) : wishlistCourses.length === 0 ? (
          <p className="text-gray-500">Your wishlist is empty</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {wishlistCourses.map((course) => (
              <Card
                key={course._id}
                thumbnail={course.thumbnail}
                title={course.title}
                price={course.price}
                category={course.category}
                id={course._id}
                reviews={course.reviews}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
