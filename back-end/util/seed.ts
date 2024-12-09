import { PrismaClient } from '@prisma/client';
import { set } from 'date-fns';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.user.deleteMany();

    const frans = await prisma.user.create({
        data: {
            username: 'frans',
            email: 'frans@frans.be',
            password: 'test',
        }
    });
}

main().then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect();
        process.exit(1);
    })
