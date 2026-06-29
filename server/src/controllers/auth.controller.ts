import type { Request, Response } from "express";
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt"


//Register

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {

        return res.status(400).json({
            message: "All fields are required",
        });
        }

        const existingUser= await prisma.user.findUnique({
            where:{
                email
            },
            select: { id: true }
        })
       
        if(existingUser){
            return res.status(409).json({
                message:"User Already Exist"
            })
        }

        const hashedPassword= await bcrypt.hash(password,10)

        const User=await prisma.user.create({
             data: {
                email,
                username,
                password: hashedPassword
                }
        })

            return res.status(201).json({
            id: User.id,
            username: User.username
            });


    } catch (error) {
        console.log(error)
       return res.status(500).json({message:"something went wrong"})
    }
};

//Login

export const login =async(req:Request,res:Response)=>{
    try {
        const {email,password}=req.body
        if(!email||!password) return res.status(400).json({message:"All fields are required"});
        const user=await prisma.user.findUnique({where:{email},select:{password:true}})
        if(!user) return res.status(404).json({message:"User not found, Please register"}); 
        const checkPass= await bcrypt.compare(password,user.password)
        if(!checkPass) return res.status(401).json({message:"Invalid Password"}); 
        return res.status(200).json({message:"Login Successfull"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Something went wrong"}); 
    }
}