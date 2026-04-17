import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');
    
    const adminPass = await bcrypt.hash('Admin@123', 10);
    const clientePass = await bcrypt.hash('Cliente@123', 10);
    const basicPass = await bcrypt.hash('Basic@123', 10);

    await prisma.profile.upsert({
        where: { email: 'admin@biopeptidios.com' },
        update: { password: adminPass, isAdmin: true, plan: 'premium' },
        create: {
            email: 'admin@biopeptidios.com',
            name: 'Administrador',
            password: adminPass,
            isAdmin: true,
            plan: 'premium',
        },
    });
    console.log('Admin user seeded (admin@biopeptidios.com / Admin@123)');

    await prisma.profile.upsert({
        where: { email: 'cliente@biopeptidios.com' },
        update: { password: clientePass, isAdmin: false, plan: 'premium' },
        create: {
            email: 'cliente@biopeptidios.com',
            name: 'Cliente Premium',
            password: clientePass,
            isAdmin: false,
            plan: 'premium',
        },
    });
    console.log('Cliente Premium seeded (cliente@biopeptidios.com / Cliente@123)');

    await prisma.profile.upsert({
        where: { email: 'basic@biopeptidios.com' },
        update: { password: basicPass, isAdmin: false, plan: 'basic' },
        create: {
            email: 'basic@biopeptidios.com',
            name: 'Cliente Basic',
            password: basicPass,
            isAdmin: false,
            plan: 'basic',
        },
    });
    console.log('Cliente Basic seeded (basic@biopeptidios.com / Basic@123)');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
