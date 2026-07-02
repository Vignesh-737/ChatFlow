import type { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const createConversation = async (req:Request,res:Response) => {
    try {
        const myUserId = req.user.userId; 
        const friendId =req.body.userId;   

    if (!friendId) {
    return res.status(400).json({
        message: "User ID is required"
         });
    }

    if(friendId===myUserId) return res.status(400).json({message: "You cannot create a conversation with yourself"});

    const friend = await prisma.user.findUnique({
    where: {
        id: friendId
        }
    });

    if(!friend) return res.status(404).json({message:"Friend Not found"})

    return res.status(200).json({myUserId,friendId})
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Something went wrong"})
    }
}