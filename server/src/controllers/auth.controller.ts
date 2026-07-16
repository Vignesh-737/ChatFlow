import type { Request, Response } from "express";
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt"
import { generateToken } from "../utils/jwt.js";


//Register

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) return res.status(400).json({
            message: "All fields are required",
        });
        

        const existingUser= await prisma.user.findUnique({
            where:{
                email
            },
            select: { id: true }
        })
       
        if(existingUser) return res.status(409).json({
                message:"User Already Exist"
            })
        

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
        const user=await prisma.user.findUnique({where:{email},select:{id:true,password:true}})
        if(!user) return res.status(404).json({message:"User not found, Please register"}); 
        const checkPass= await bcrypt.compare(password,user.password)
        if(!checkPass) return res.status(401).json({message:"Invalid Password"}); 
        const token = generateToken(user.id);
        res.cookie("accessToken", token, {
        httpOnly: true,
        secure: false, // true in production with HTTPS
        sameSite: "lax", // use "none" if frontend/backend are on different domains with HTTPS
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });

        return res.status(200).json({
        message: "Login Successful",
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Something went wrong"}); 
    }
}

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};


export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};