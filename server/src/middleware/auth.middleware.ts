import type { Request,Response,NextFunction } from "express"
import { verifyToken } from "../utils/jwt.js"

export const authMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const token = req.cookies.accessToken;

    if (!token) {
    return res.status(401).json({
        message: "Unauthorized",
    });
    }
    
    try {
        const payload = verifyToken(token);
        req.user=payload
        next();
    } catch (error) {
        console.error(error)
         return res.status(403).json({ message: "Invalid or expired token" });
    }
}