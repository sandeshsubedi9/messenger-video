// import { PrismaClient } from "@prisma/client";

// declare global{
//     var prisma: PrismaClient | undefined
// }

// const client= globalThis.prisma || new PrismaClient()

// if(process.env.NODE_ENV !== 'production') globalThis.prisma = client

// export default client

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as NodeJS.Global & typeof globalThis & { prisma?: PrismaClient };

const client = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;

export default client;



