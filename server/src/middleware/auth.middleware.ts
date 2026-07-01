import type { Request,Response,NextFunction } from "express"
import { verifyToken } from "../utils/jwt.js"

export const authMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const header= req.headers.authorization
    if(!header||!header.startsWith("Bearer ")) return res.status(401).json({message:"No Token Provided"})
    const token = header.split(" ")[1]
    if(!token) return res.status(401).json({message:"No Token Provided"})
    try {
        const payload = verifyToken(token);
        req.user=payload
        next();
    } catch (error) {
        console.error(error)
         return res.status(403).json({ message: "Invalid or expired token" });
    }
}