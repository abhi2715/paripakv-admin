/**
 * Seed script — creates the initial admin user.
 * Run: node scripts/seed.mjs
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://abhishekks27105_db_user:12345@cluster0.pstzosv.mongodb.net/paripakv?retryWrites=true&w=majority';

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Admin' },
}, { timestamps: true });

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

  const existing = await Admin.findOne({ email: 'admin@paripakv.org' });
  if (existing) {
    console.log('Admin user already exists. Skipping.');
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash('paripakv2026', 12);
  await Admin.create({
    email: 'admin@paripakv.org',
    password: hashedPassword,
    name: 'Paripakv Admin',
  });

  console.log('✅ Admin user created!');
  console.log('   Email: admin@paripakv.org');
  console.log('   Password: paripakv2026');
  console.log('   ⚠️  Change this password after first login!');
  await mongoose.disconnect();
}

seed().catch(console.error);
