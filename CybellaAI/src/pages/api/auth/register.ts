// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  await dbConnect();
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    return res.status(201).json({ success: true, user: { id: newUser._id, email: newUser.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Registration failed' });
  }
}
