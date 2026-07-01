import jwt from "jsonwebtoken"

export const generateToken=(userId: string)=>{
    try {
        const token =jwt.sign({
    userId
  },
  process.env.JWT_SECRET!,
  {
    expiresIn: "7d"
  })
  return token
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const verifyToken=(token:string)=>{
    try {
       return jwt.verify(token,process.env.JWT_SECRET!) as {userId : string}
    } catch (error) {
        console.log(error)
        throw error;
    }

}