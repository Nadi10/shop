import { faker } from '@faker-js/faker';
import { PrismaClient, Product } from '@prisma/client';

import * as dotenv from 'dotenv';
import { getRandomNumber } from '../src/utils/random-number';


dotenv.config();
const prisma = new PrismaClient()
const createProducts = async (quantity: number) => {
  const products: Product[] = []
  const imageOptions = {
    width: 500,
    height: 500,
  };

  for (let i = 0; i < quantity; i++) {
    const productName = faker.commerce.productName()
    const product = await prisma.product.create({
      data: {
        name: productName,
        description: faker.commerce.productDescription(),
        price: +faker.commerce.price({ min: 10, max: 999, dec: 0}),        
        image: faker.image.url(imageOptions),
        availableAmount: getRandomNumber(1, 10).toString()
      }
    })
    products.push(product)
   }
}

async function main() {
  await createProducts(10)
}

main()
.catch(e => console.error(e))
.finally(async () => {
  await prisma.$disconnect()
})