const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: `admin@admin.com`,
      name: "admin",
      isAdmin: true,
      password: "$2b$10$BFmibvOW7FtY0soAAwujoO9y2tIyB7WEJ2HNq9O7zh9aeejMvRsKu",
    },
  });

  const internal = await prisma.client.upsert({
    where: { email: `internal@admin.com` },
    update: {},
    create: {
      email: `internal@admin.com`,
      name: "internal",
      contactName: "admin",
      number: '123456789',
    },
  })
  const youtubesettings = await prisma.youtubesettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      clientid: `451352924057-ca2m6d0ioeku2i153qndkkqmlf3mu58i.apps.googleusercontent.com`,
      clientsecret: "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",
      privacy: 'private'
      
    },
  })

  console.log({ admin, internal, youtubesettings });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });