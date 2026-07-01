import type { Response, Request } from "express";

export const getMe=async(req:Request,res:Response)=>{
    return res.send({message:"Token Verified", userId: req.user.userId})
}