import prisma from "./config/prisma.js";

async function main() {
const user = await prisma.user.findMany({
    select:{
        id:true,
        email:true,
        username:true
    }
})
  console.log(user);
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });