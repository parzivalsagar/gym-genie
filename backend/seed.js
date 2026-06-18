const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  { title: 'Adjustable Dumbbell Set 20kg', description: 'Space-saving adjustable dumbbells with quick-change weight system. Perfect for home gyms.', category: 'Dumbbells', condition: 'New', price: 12999, quantity: 10, location: 'Mumbai', images: ['https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=600&h=400&fit=crop'] },
  { title: 'Rubber Hex Dumbbells Pair 10kg', description: 'Durable rubber-coated hex dumbbells with ergonomic handles.', category: 'Dumbbells', condition: 'Used', price: 2499, quantity: 5, location: 'Delhi', images: ['https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=400&fit=crop'] },
  { title: 'Olympic Barbell 7ft', description: 'Professional 20kg Olympic barbell with 1500lbs load capacity.', category: 'Barbells', condition: 'New', price: 8499, quantity: 7, location: 'Bangalore', images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop'] },
  { title: 'EZ Curl Bar 5ft', description: 'EZ curl bar for bicep and tricep exercises, comfortable grip.', category: 'Barbells', condition: 'New', price: 2999, quantity: 15, location: 'Mumbai', images: ['https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=400&fit=crop'] },
  { title: 'Cast Iron Weight Plates Set 50kg', description: 'Full set of cast iron weight plates from 2.5kg to 10kg pairs.', category: 'Weight Plates', condition: 'Used', price: 5499, quantity: 3, location: 'Pune', images: ['https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&h=400&fit=crop'] },
  { title: 'Bumper Plates Set 100kg', description: 'High-quality rubber bumper plates for deadlifts and olympic lifting.', category: 'Weight Plates', condition: 'New', price: 24999, quantity: 5, location: 'Delhi', images: ['https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&h=400&fit=crop'] },
  { title: 'Cast Iron Kettlebell 16kg', description: 'Single cast iron kettlebell with flat base and wide handle.', category: 'Kettlebells', condition: 'New', price: 1799, quantity: 20, location: 'Mumbai', images: ['https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&h=400&fit=crop'] },
  { title: 'Adjustable Kettlebell 8-24kg', description: 'Adjustable kettlebell with quick-change weight mechanism.', category: 'Kettlebells', condition: 'Used', price: 3999, quantity: 4, location: 'Chennai', images: ['https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&h=400&fit=crop'] },
  { title: 'Adjustable Weight Bench', description: 'Multi-position adjustable bench for incline, decline, and flat presses.', category: 'Benches', condition: 'New', price: 11999, quantity: 6, location: 'Bangalore', images: ['https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&h=400&fit=crop'] },
  { title: 'Flat Utility Bench', description: 'Sturdy flat bench with thick padding, supports up to 300kg.', category: 'Benches', condition: 'Used', price: 3499, quantity: 8, location: 'Hyderabad', images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop'] },
  { title: 'Motorized Treadmill 2HP', description: 'Foldable treadmill with 2HP motor, 12 preset programs, and Bluetooth speakers.', category: 'Treadmills', condition: 'New', price: 34999, quantity: 4, location: 'Mumbai', images: ['https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&h=400&fit=crop'] },
  { title: 'Manual Treadmill', description: 'Non-motorized curved treadmill for walking and jogging.', category: 'Treadmills', condition: 'Used', price: 8999, quantity: 2, location: 'Delhi', images: ['https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&h=400&fit=crop'] },
  { title: 'Spin Exercise Bike', description: 'Magnetic resistance spin bike with LCD display and adjustable seat.', category: 'Exercise Bikes', condition: 'New', price: 15999, quantity: 8, location: 'Pune', images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop'] },
  { title: 'Recumbent Exercise Bike', description: 'Comfortable recumbent bike with back support and arm pedals.', category: 'Exercise Bikes', condition: 'Used', price: 7499, quantity: 3, location: 'Kolkata', images: ['https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&h=400&fit=crop'] },
  { title: 'Resistance Bands Set 5-Pack', description: 'Set of 5 latex resistance bands with different tension levels from light to heavy.', category: 'Resistance Bands', condition: 'New', price: 999, quantity: 50, location: 'Mumbai', images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=400&fit=crop'] },
  { title: 'Loop Resistance Bands 10-Pack', description: '10-piece fabric loop bands set for glute and leg workouts.', category: 'Resistance Bands', condition: 'New', price: 1499, quantity: 30, location: 'Delhi', images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=400&fit=crop'] },
  { title: 'Power Tower Home Gym', description: 'Multi-function power tower with pull-up bar, dip station, and push-up handles.', category: 'Home Gym Systems', condition: 'New', price: 18999, quantity: 5, location: 'Bangalore', images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop'] },
  { title: 'Smith Machine with Cable Crossover', description: 'Complete home gym with Smith machine, cable crossover, lat pulldown, and leg press.', category: 'Home Gym Systems', condition: 'New', price: 74999, quantity: 2, location: 'Mumbai', images: ['https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&h=400&fit=crop'] },
  { title: 'Yoga Mat Extra Thick 10mm', description: 'Non-slip extra thick yoga mat with carrying strap.', category: 'Accessories', condition: 'New', price: 999, quantity: 100, location: 'Delhi', images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=400&fit=crop'] },
  { title: 'Jump Rope Speed Cable', description: 'Adjustable speed jump rope with ball bearings for smooth rotation.', category: 'Accessories', condition: 'New', price: 499, quantity: 200, location: 'Mumbai', images: ['https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&h=400&fit=crop'] },
  { title: 'Weight Lifting Gloves', description: 'Leather weight lifting gloves with wrist support and padded palms.', category: 'Accessories', condition: 'New', price: 799, quantity: 75, location: 'Pune', images: ['https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=400&fit=crop'] },
  { title: 'Gym Water Bottle 1L', description: 'BPA-free shaker bottle with mixing ball for protein shakes.', category: 'Accessories', condition: 'New', price: 399, quantity: 150, location: 'Chennai', images: ['https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=600&h=400&fit=crop'] },
  { title: 'Preacher Curl Bench', description: 'Adjustable preacher curl bench for targeted bicep isolation exercises.', category: 'Benches', condition: 'Used', price: 4499, quantity: 3, location: 'Mumbai', images: ['https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=400&fit=crop'] },
  { title: 'Tricep Rope Attachment', description: 'Steel-core tricep rope for cable machines with rubber ends.', category: 'Accessories', condition: 'New', price: 599, quantity: 60, location: 'Delhi', images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop'] },
  { title: 'Ab Roller Wheel', description: 'Dual-wheel ab roller with knee pad for core workouts.', category: 'Accessories', condition: 'New', price: 699, quantity: 80, location: 'Bangalore', images: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop'] },
  { title: 'Battle Rope 50ft', description: '50ft battle rope for high-intensity interval training.', category: 'Accessories', condition: 'New', price: 2499, quantity: 10, location: 'Hyderabad', images: ['https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&h=400&fit=crop'] },
  { title: 'Squat Stand Adjustable', description: 'Heavy-duty adjustable squat stands with J-hooks and safety catches.', category: 'Home Gym Systems', condition: 'Used', price: 8499, quantity: 4, location: 'Delhi', images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop'] },
  { title: 'Leg Extension Machine', description: 'Plate-loaded leg extension machine for quad development.', category: 'Home Gym Systems', condition: 'Used', price: 15999, quantity: 2, location: 'Mumbai', images: ['https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&h=400&fit=crop'] },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    let seller = await User.findOne({ clerkId: 'demo_seller' });
    if (!seller) {
      seller = await User.create({
        clerkId: 'demo_seller',
        name: 'Gym-Genie Store',
        email: 'store@gym-genie.com',
        role: 'seller',
        location: 'Mumbai',
      });
      console.log('Demo seller created');
    }

    const existing = await Product.countDocuments();
    if (existing > 0) {
      console.log(`${existing} products already exist — deleting and reseeding`);
      await Product.deleteMany({});
    }

    const productDocs = products.map(p => ({
      ...p,
      sellerId: seller._id,
    }));

    await Product.insertMany(productDocs);
    console.log(`Seeded ${products.length} products with images`);

    await mongoose.connection.close();
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
