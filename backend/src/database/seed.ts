import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { State, City, District, Taluka } from '../entities/location.entity';
import { Category, MetalType } from '../entities/category.entity';
import { Shop, MembershipStatus } from '../entities/shop.entity';
import { Product } from '../entities/product.entity';
import { ProductImage } from '../entities/product-image.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'jewelia',
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();

  console.log('🌱 Starting database seeding...');

  const userRepo = AppDataSource.getRepository(User);
  const stateRepo = AppDataSource.getRepository(State);
  const cityRepo = AppDataSource.getRepository(City);
  const districtRepo = AppDataSource.getRepository(District);
  const talukaRepo = AppDataSource.getRepository(Taluka);
  const categoryRepo = AppDataSource.getRepository(Category);
  const shopRepo = AppDataSource.getRepository(Shop);
  const productRepo = AppDataSource.getRepository(Product);
  const productImageRepo = AppDataSource.getRepository(ProductImage);

  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = userRepo.create({
    name: 'Admin User',
    email: 'admin@jewelia.com',
    phone: '+919876543210',
    password_hash: hashedPassword,
    role: UserRole.ADMIN,
  });
  await userRepo.save(admin);

  const shopOwner1 = userRepo.create({
    name: 'Rajesh Kumar',
    email: 'rajesh@goldenjewelers.com',
    phone: '+919876543211',
    password_hash: hashedPassword,
    role: UserRole.SHOP_OWNER,
  });
  await userRepo.save(shopOwner1);

  const shopOwner2 = userRepo.create({
    name: 'Priya Sharma',
    email: 'priya@silvergems.com',
    phone: '+919876543212',
    password_hash: hashedPassword,
    role: UserRole.SHOP_OWNER,
  });
  await userRepo.save(shopOwner2);

  const customer1 = userRepo.create({
    name: 'Amit Patel',
    email: 'amit@example.com',
    phone: '+919876543213',
    password_hash: hashedPassword,
    role: UserRole.CUSTOMER,
  });
  await userRepo.save(customer1);

  console.log('✅ Users created');

  const maharashtra = stateRepo.create({ name: 'Maharashtra', code: 'MH' });
  await stateRepo.save(maharashtra);

  const gujarat = stateRepo.create({ name: 'Gujarat', code: 'GJ' });
  await stateRepo.save(gujarat);

  const karnataka = stateRepo.create({ name: 'Karnataka', code: 'KA' });
  await stateRepo.save(karnataka);

  const mumbai = cityRepo.create({ name: 'Mumbai', state_id: maharashtra.id });
  await cityRepo.save(mumbai);

  const pune = cityRepo.create({ name: 'Pune', state_id: maharashtra.id });
  await cityRepo.save(pune);

  const ahmedabad = cityRepo.create({ name: 'Ahmedabad', state_id: gujarat.id });
  await cityRepo.save(ahmedabad);

  const bangalore = cityRepo.create({ name: 'Bangalore', state_id: karnataka.id });
  await cityRepo.save(bangalore);

  console.log('✅ States and Cities created');

  const mumbaiSuburban = districtRepo.create({ name: 'Mumbai Suburban', city_id: mumbai.id });
  await districtRepo.save(mumbaiSuburban);

  const puneCity = districtRepo.create({ name: 'Pune City', city_id: pune.id });
  await districtRepo.save(puneCity);

  const andheri = talukaRepo.create({ name: 'Andheri', district_id: mumbaiSuburban.id });
  await talukaRepo.save(andheri);

  const bandra = talukaRepo.create({ name: 'Bandra', district_id: mumbaiSuburban.id });
  await talukaRepo.save(bandra);

  const kothrud = talukaRepo.create({ name: 'Kothrud', district_id: puneCity.id });
  await talukaRepo.save(kothrud);

  console.log('✅ Districts and Talukas created');

  const goldNecklaces = categoryRepo.create({
    name: 'Gold Necklaces',
    slug: 'gold-necklaces',
    metal_type: MetalType.GOLD,
    description: 'Beautiful gold necklaces for all occasions',
  });
  await categoryRepo.save(goldNecklaces);

  const goldRings = categoryRepo.create({
    name: 'Gold Rings',
    slug: 'gold-rings',
    metal_type: MetalType.GOLD,
    description: 'Elegant gold rings',
  });
  await categoryRepo.save(goldRings);

  const silverBracelets = categoryRepo.create({
    name: 'Silver Bracelets',
    slug: 'silver-bracelets',
    metal_type: MetalType.SILVER,
    description: 'Stylish silver bracelets',
  });
  await categoryRepo.save(silverBracelets);

  const diamondEarrings = categoryRepo.create({
    name: 'Diamond Earrings',
    slug: 'diamond-earrings',
    metal_type: MetalType.DIAMOND,
    description: 'Sparkling diamond earrings',
  });
  await categoryRepo.save(diamondEarrings);

  console.log('✅ Categories created');

  const shop1 = shopRepo.create({
    name: 'Golden Jewelers',
    owner_id: shopOwner1.id,
    city_id: mumbai.id,
    taluka_id: andheri.id,
    address: '123 Main Street, Andheri West',
    phone: '+919876543211',
    whatsapp: '+919876543211',
    membership_status: MembershipStatus.PREMIUM,
    verified: true,
    lat: 19.1136,
    lng: 72.8697,
    description: 'Premium gold jewelry with 25 years of experience',
  });
  await shopRepo.save(shop1);

  const shop2 = shopRepo.create({
    name: 'Silver Gems',
    owner_id: shopOwner2.id,
    city_id: pune.id,
    taluka_id: kothrud.id,
    address: '456 Market Road, Kothrud',
    phone: '+919876543212',
    whatsapp: '+919876543212',
    membership_status: MembershipStatus.BASIC,
    verified: true,
    lat: 18.5074,
    lng: 73.8077,
    description: 'Exquisite silver and diamond jewelry',
  });
  await shopRepo.save(shop2);

  console.log('✅ Shops created');

  const product1 = productRepo.create({
    name: '22K Gold Necklace with Traditional Design',
    sku: 'GN-001',
    description: 'Beautiful 22K gold necklace with intricate traditional design. Perfect for weddings and special occasions.',
    price_in_paise: 15000000,
    shop_id: shop1.id,
    category_id: goldNecklaces.id,
    weight_grams: 25.5,
    purity: '22K',
    stock_quantity: 3,
    is_available: true,
    has_ar_model: true,
    ar_model_url: 'https://example.com/ar/gold-necklace-001.glb',
    try_at_home_available: true,
    tags: ['gold', 'necklace', 'traditional', 'wedding'],
  });
  await productRepo.save(product1);

  const product2 = productRepo.create({
    name: 'Diamond Studded Gold Ring',
    sku: 'GR-001',
    description: 'Elegant 18K gold ring with diamond studding. Modern design suitable for daily wear.',
    price_in_paise: 8500000,
    shop_id: shop1.id,
    category_id: goldRings.id,
    weight_grams: 5.2,
    purity: '18K',
    stock_quantity: 5,
    is_available: true,
    has_ar_model: true,
    ar_model_url: 'https://example.com/ar/gold-ring-001.glb',
    try_at_home_available: true,
    tags: ['gold', 'ring', 'diamond', 'modern'],
  });
  await productRepo.save(product2);

  const product3 = productRepo.create({
    name: 'Sterling Silver Bracelet',
    sku: 'SB-001',
    description: 'Handcrafted sterling silver bracelet with oxidized finish. Contemporary design.',
    price_in_paise: 350000,
    shop_id: shop2.id,
    category_id: silverBracelets.id,
    weight_grams: 15.0,
    purity: '925',
    stock_quantity: 10,
    is_available: true,
    has_ar_model: false,
    try_at_home_available: true,
    tags: ['silver', 'bracelet', 'handcrafted', 'contemporary'],
  });
  await productRepo.save(product3);

  const product4 = productRepo.create({
    name: 'Diamond Earrings in White Gold',
    sku: 'DE-001',
    description: 'Stunning diamond earrings set in 18K white gold. Perfect for special occasions.',
    price_in_paise: 12000000,
    shop_id: shop2.id,
    category_id: diamondEarrings.id,
    weight_grams: 3.5,
    purity: '18K',
    stock_quantity: 2,
    is_available: true,
    has_ar_model: true,
    ar_model_url: 'https://example.com/ar/diamond-earrings-001.glb',
    try_at_home_available: false,
    tags: ['diamond', 'earrings', 'white-gold', 'luxury'],
  });
  await productRepo.save(product4);

  console.log('✅ Products created');

  const image1 = productImageRepo.create({
    product_id: product1.id,
    image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
    display_order: 0,
    is_primary: true,
  });
  await productImageRepo.save(image1);

  const image2 = productImageRepo.create({
    product_id: product2.id,
    image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
    display_order: 0,
    is_primary: true,
  });
  await productImageRepo.save(image2);

  const image3 = productImageRepo.create({
    product_id: product3.id,
    image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
    display_order: 0,
    is_primary: true,
  });
  await productImageRepo.save(image3);

  const image4 = productImageRepo.create({
    product_id: product4.id,
    image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
    display_order: 0,
    is_primary: true,
  });
  await productImageRepo.save(image4);

  console.log('✅ Product images created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('Admin: admin@jewelia.com / password123');
  console.log('Shop Owner 1: rajesh@goldenjewelers.com / password123');
  console.log('Shop Owner 2: priya@silvergems.com / password123');
  console.log('Customer: amit@example.com / password123');

  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
