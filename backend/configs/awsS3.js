import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const uploadFileToS3 = async (filePath, key) => {
    try {
        console.log(`[DEBUG] Starting upload to S3: filePath=${filePath}, key=${key}`);
        if (!filePath) {
            console.log(`[DEBUG] No filePath provided for key=${key}`);
            return null;
        }

        console.log(`[DEBUG] Reading file content from ${filePath}`);
        const fileContent = fs.readFileSync(filePath);
        console.log(`[DEBUG] File content read, size=${fileContent.length} bytes`);

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: fileContent,
        };
        console.log(`[DEBUG] Upload params: Bucket=${params.Bucket}, Key=${params.Key}`);

        console.log(`[DEBUG] Sending PutObjectCommand to S3`);
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        console.log(`[DEBUG] S3 upload successful for key=${key}`);

        console.log(`[DEBUG] Removing local file: ${filePath}`);
        fs.unlinkSync(filePath); // Remove the local file after upload

        const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
        console.log(`[DEBUG] Generated URL: ${url}`);
        return url;
    } catch (error) {
        console.error("[DEBUG] Error uploading file to S3:", error);
        if (fs.existsSync(filePath)) {
            console.log(`[DEBUG] Removing local file due to error: ${filePath}`);
            fs.unlinkSync(filePath);
        }
        return null;
    }
};

const deleteFileFromS3 = async (key) => {
    try {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
        };

        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);
        return true;
    } catch (error) {
        console.error("Error deleting file from S3:", error);
        return false;
    }
};

export { uploadFileToS3, deleteFileFromS3 };