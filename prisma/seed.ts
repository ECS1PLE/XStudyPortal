import bcrypt from 'bcryptjs';
import { PrismaClient, Role, MaterialType, MaterialStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { defaultStartingPrices } from '../src/lib/constants';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required for seed');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.performerReview.deleteMany();
  await prisma.studyMaterial.deleteMany();
  await prisma.performerProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHashes = await Promise.all([
    bcrypt.hash('Admin123!', 10),
    bcrypt.hash('Mentor123!', 10),
    bcrypt.hash('Student123!', 10)
  ]);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@portal.local',
      passwordHash: passwordHashes[0],
      name: 'Алина Админ',
      university: 'ИТМО',
      course: 5,
      role: Role.ADMIN
    }
  });

  const performerUser = await prisma.user.create({
    data: {
      email: 'mentor@portal.local',
      passwordHash: passwordHashes[1],
      name: 'Максим Ментор',
      university: 'ИТМО',
      course: 4,
      role: Role.PERFORMER,
      performerProfile: {
        create: {
          bio: 'Помогаю с базами данных, алгоритмами и разбором проектной документации. Формат работы — только консультации, code review и объяснение решений.',
          subjects: ['SQL', 'PostgreSQL', 'Алгоритмы', 'TypeScript', 'Системный дизайн'],
          telegram: '@mentor_max',
          isVerified: true,
          startingPrices: defaultStartingPrices,
          ratingAverage: 5,
          ratingCount: 1
        }
      }
    },
    include: { performerProfile: true }
  });

  const student = await prisma.user.create({
    data: {
      email: 'student@portal.local',
      passwordHash: passwordHashes[2],
      name: 'Иван Студент',
      university: 'СПбГУ',
      course: 2,
      role: Role.USER
    }
  });

  await prisma.performerReview.create({
    data: {
      performerId: performerUser.performerProfile!.id,
      authorId: student.id,
      rating: 5,
      comment: 'Понравился разбор задачи по SQL: без готового решения, но с понятным объяснением и хорошими примерами.'
    }
  });

  await prisma.studyMaterial.createMany({
    data: [
      {
        authorId: student.id,
        moderatorId: admin.id,
        title: 'Шаблон структуры отчёта по лабораторной',
        description: 'Нейтральный шаблон с разделами: цель, ход работы, выводы, список источников.',
        subject: 'Академическое письмо',
        university: 'ИТМО',
        type: MaterialType.TEMPLATE,
        status: MaterialStatus.APPROVED,
        downloadUrl: 'https://example.com/report-template',
        aiModeration: { verdict: 'allow', source: 'seed', reason: 'Safe educational template' }
      },
      {
        authorId: performerUser.id,
        moderatorId: admin.id,
        title: 'Краткий гайд по индексам в PostgreSQL',
        description: 'Конспект по B-Tree, GIN и GiST с примерами учебных кейсов и объяснением, когда применять каждый тип индекса.',
        subject: 'PostgreSQL',
        university: 'ИТМО',
        type: MaterialType.GUIDE,
        status: MaterialStatus.APPROVED,
        downloadUrl: 'https://example.com/postgres-index-guide',
        aiModeration: { verdict: 'allow', source: 'seed', reason: 'Safe educational guide' }
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
