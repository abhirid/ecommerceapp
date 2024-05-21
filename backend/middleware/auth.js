import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { userModel } from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers; // Use req.headers instead of req.header
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized login again" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Assuming token_decode contains the user ID
        const userId = token_decode;

        // Convert userId to ObjectId
        const userIdObjectId = new ObjectId(userId);

        // Set req.body.userId to the ObjectId
        req.body.userId = userIdObjectId;
       
        next();
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(401).json({ success: false, message: error.message }); // Send the specific error message back to the client
    }
}

export default authMiddleware;
