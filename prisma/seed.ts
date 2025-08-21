// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Начало заполнения базы данных тестовыми данными...');

  // 1. Удаляем существующие данные (опционально, но полезно для тестирования)
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  console.log('Существующие продукты и категории удалены.');

  // 2. Создаем категории
  const electronicsCategory = await prisma.category.create({
    data: { name: 'Электроника' },
  });
  const audioCategory = await prisma.category.create({
    data: { name: 'Аудио' },
  });
  const wearablesCategory = await prisma.category.create({
    data: { name: 'Носимые устройства' },
  });
  const homeAppliancesCategory = await prisma.category.create({
    data: { name: 'Бытовая техника' },
  });
  const booksCategory = await prisma.category.create({
    data: { name: 'Книги' },
  });

  console.log('Категории созданы.');

  // 3. Создаем продукты, ссылаясь на ID категорий
  const products = [
    {
      name: 'Смартфон X',
      description:
        'Мощный смартфон с отличной камерой и долгим временем работы батареи.',
      price: 699.99,
      originalPrice: 799.99,
      image: 'https://example.com/smartphone_x.jpg',
      rating: 4.8,
      reviews: 1250,
      popular: true,
      categoryId: electronicsCategory.id,
    },
    {
      name: 'Ноутбук Pro 15',
      description:
        'Высокопроизводительный ноутбук для профессионалов, легкий и мощный.',
      price: 1299.0,
      image: 'https://example.com/laptop_pro15.jpg',
      rating: 4.5,
      reviews: 890,
      popular: true,
      categoryId: electronicsCategory.id,
    },
    {
      name: 'Наушники SoundFlow',
      description:
        'Беспроводные наушники с шумоподавлением и превосходным качеством звука.',
      price: 149.99,
      image: 'https://example.com/headphones_soundflow.jpg',
      rating: 4.7,
      reviews: 2300,
      popular: false,
      categoryId: audioCategory.id,
    },
    {
      name: 'Умные часы FitTrack',
      description:
        'Отслеживайте свою активность, сон и сердечный ритм с помощью этих стильных часов.',
      price: 199.5,
      originalPrice: 249.99,
      image: 'https://example.com/smartwatch_fittrack.jpg',
      rating: 4.2,
      reviews: 750,
      popular: true,
      categoryId: wearablesCategory.id,
    },
    {
      name: 'Кофемашина LattePro',
      description:
        'Автоматическая кофемашина для приготовления идеального латте и капучино.',
      price: 349.0,
      image: 'https://example.com/coffeemachine_lattepro.jpg',
      rating: 4.9,
      reviews: 500,
      popular: false,
      categoryId: homeAppliancesCategory.id,
    },
    {
      name: 'Книга "Приключения"',
      description: 'Увлекательная история о путешествиях и открытиях.',
      price: 25.0,
      image: 'https://example.com/book_adventure.jpg',
      rating: 4.0,
      reviews: 120,
      popular: false,
      categoryId: booksCategory.id,
    },
  ];

  for (const productData of products) {
    await prisma.product.create({
      data: productData,
    });
  }

  console.log('Заполнение базы данных завершено!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
