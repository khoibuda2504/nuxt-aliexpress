import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  let product = prisma.products.findFirst({
    where: {
      id: Number(event.context.params.id)
    }
  })
  return product
})