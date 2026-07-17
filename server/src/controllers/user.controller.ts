import type { Response, Request } from "express";
import prisma from "../config/prisma.js";


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user.userId;

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};