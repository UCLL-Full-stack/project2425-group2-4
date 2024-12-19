import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.friends.deleteMany({});
    await prisma.friendRequest.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.chat.deleteMany({});
    await prisma.user.deleteMany({});

    // await prisma.user.createMany({
    //     data: [
    //         {
    //             username: 'yamaha46',
    //             email: 'yamaha46@example.com',
    //             password: await bcrypt.hash('R6fan99', 12),
    //             role: 'user',
    //         },
    //         {
    //             username: 'broski21',
    //             email: 'broski21@example.com',
    //             password: await bcrypt.hash('nuggetslovr6', 12),
    //             role: 'user',
    //         },
    //     ],
    // });

    const yamaha46 = await prisma.user.create({
        data: {
            username: "yamaha46",
            email: "yamahalover46@gmail.com",
            password: await bcrypt.hash('R6fan99', 12),
            role: 'admin'
        }
    });

    const broski21 = await prisma.user.create({
        data: {
            username: "Broski21",
            email: "broskibroski@gmail.com",
            password: await bcrypt.hash('nuggetslovr6', 12),
            role: 'moderator'
        }
    });

    const gentleman43 = await prisma.user.create({
        data: {
            username: "gentleman43",
            email: "gentleman43@gmail.com",
            password: await bcrypt.hash('test123', 12),
            role: 'user'
        }
    });

    const frans = await prisma.user.create({
        data: {
            username: "Frans",
            email: "frans69@frans.be",
            password: await bcrypt.hash('frans123', 12),
            role: 'user'
        }
    });

    const jan = await prisma.user.create({
        data: {
            username: "Jan",
            email: "SuperRizzler@hotmail.com",
            password: await bcrypt.hash('jan123', 12),
            role: 'moderator'
        }
    });

    const frits = await prisma.user.create({
        data: {
            username: "Frits",
            email: "FritsW@yahoo.com",
            password: await bcrypt.hash('frits123', 12),
            role: 'user'
        }
    })

    const admin = await prisma.user.create({
        data: {
            username: "admin",
            email: "admin@diddyscord.com",
            password: await bcrypt.hash('admin123', 12),
            role: 'admin',
        }
    });

    const diddy = await prisma.user.create({
        data: {
            username: "Diddy",
            email: "Diddy@diddyscord.com",
            password: await bcrypt.hash('diddy123', 12),
            role: 'admin'
        }
    });

    await prisma.friends.create({
        data: {
            users: {
                connect: [{ id: diddy.id }, { id: yamaha46.id }]
            }
        }
    });

    await prisma.friends.create({
        data: {
            users: {
                connect: [{ id: diddy.id }, { id: jan.id }]
            }
        }
    });

    await prisma.friends.create({
        data: {
            users: {
                connect: [{ id: diddy.id }, { id: frits.id }]
            }
        }
    });
    await prisma.friends.create({
        data: {
            users: {
                connect: [{ id: diddy.id }, { id: admin.id }]
            }
        }
    });
    await prisma.friends.create({
        data: {
            users: {
                connect: [{ id: admin.id }, { id: yamaha46.id }]
            }
        }
    });
    await prisma.friends.create({
        data: {
            users: {
                connect: [{ id: jan.id }, { id: yamaha46.id }]
            }
        }
    });
    await prisma.friends.create({
        data: {
            users: {
                connect: [{ id: frits.id }, { id: yamaha46.id }]
            }
        }
    });
    await prisma.friends.create({
        data: {
            users: {
                connect: [{ id: gentleman43.id }, { id: frits.id }]
            }
        }
    });
    await prisma.friends.create({
        data: {
            users: {
                connect: [{ id: broski21.id }, { id: frits.id }]
            }
        }
    });



    await prisma.friendRequest.create({
        data: {
            sender: {
                connect: { id: yamaha46.id }
            },
            receiver: {
                connect: { id: frans.id }
            },
            status: 'pending',
            timestamp: new Date()
        },
    });
    await prisma.friendRequest.create({
        data: {
            sender: {
                connect: { id: broski21.id }
            },
            receiver: {
                connect: { id: frans.id }
            },
            status: 'pending',
            timestamp: new Date()
        },
    });
    await prisma.friendRequest.create({
        data: {
            sender: {
                connect: { id: diddy.id }
            },
            receiver: {
                connect: { id: frans.id }
            },
            status: 'pending',
            timestamp: new Date()
        },
    });
    await prisma.friendRequest.create({
        data: {
            sender: {
                connect: { id: gentleman43.id }
            },
            receiver: {
                connect: { id: frans.id }
            },
            status: 'pending',
            timestamp: new Date()
        },
    });
    await prisma.friendRequest.create({
        data: {
            sender: {
                connect: { id: frits.id }
            },
            receiver: {
                connect: { id: frans.id }
            },
            status: 'pending',
            timestamp: new Date()
        },
    });
    await prisma.friendRequest.create({
        data: {
            sender: {
                connect: { id: admin.id }
            },
            receiver: {
                connect: { id: frans.id }
            },
            status: 'pending',
            timestamp: new Date()
        },
    });
    await prisma.friendRequest.create({
        data: {
            sender: {
                connect: { id: jan.id }
            },
            receiver: {
                connect: { id: frans.id }
            },
            status: 'pending',
            timestamp: new Date()
        },
    });


    await prisma.chat.create({
        data: {
            name: 'Developer life',
            createdAt: new Date('2023-10-03T10:00:00Z'),
            users: {
                connect: [
                    { id: yamaha46.id },
                    { id: broski21.id },
                    { id: gentleman43.id },
                    { id: jan.id },
                    { id: frits.id },
                    { id: admin.id },
                    { id: diddy.id },
                ],
            },
            messages: {
                create: [
                    {
                        text: 'Hello!',
                        userId: yamaha46.id,
                        timestamp: new Date('2023-11-18T10:01:00Z'),
                    },
                    {
                        text: 'Hello back, how are you?',
                        userId: broski21.id,
                        timestamp: new Date('2023-11-18T10:01:00Z'),
                    },
                    {
                        text: 'Good good, weather could be better but asides that we gucci',
                        userId: yamaha46.id,
                        timestamp: new Date('2023-10-03T10:03:00Z'),
                    },
                    {
                        text: 'Great to hear that ur doing well! Weather does suck right now..',
                        userId: broski21.id,
                        timestamp: new Date('2023-10-03T10:04:00Z'),
                    },
                ],
            },
        },
    });

    await prisma.chat.create({
        data: {
            name: 'AI is fun',
            createdAt: new Date('2023-10-01T10:00:00Z'),
            users: {
                connect: [
                    { id: yamaha46.id },
                    { id: broski21.id },
                    { id: jan.id },
                ],
            },
            messages: {
                create: [
                    {
                        text: 'I like turtles',
                        messenger: {
                            connect: { id: yamaha46.id },
                        },
                        timestamp: new Date('2023-10-23T13:04:00Z'),
                    },
                    {
                        text: 'me too',
                        messenger: {
                            connect: { id: broski21.id },
                        },
                        timestamp: new Date('2023-10-23T13:12:00Z'),
                    },
                    {
                        text: 'wow ur so cool',
                        messenger: {
                            connect: { id: yamaha46.id },
                        },
                        timestamp: new Date('2023-10-23T13:34:23Z'),
                    },
                    {
                        text: 'i know right',
                        messenger: {
                            connect: { id: broski21.id },
                        },
                        timestamp: new Date('2023-10-23T14:04:34Z'),
                    },
                ],
            },
        },
    });
};

(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();
