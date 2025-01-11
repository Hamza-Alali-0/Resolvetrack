// route.ts

import { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/utils/db';
import User from '@/models/User';

export async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect();
    const users = await User.find({}, 'email');
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function findUsersByEmail(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect();
    const { emails }: { emails: string[] } = req.body;
    const usersWithEmails = await User.find({ email: { $in: emails } }, 'email');
    const foundEmails = usersWithEmails.map(user => user.email);
    res.status(200).json({ emails: foundEmails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getUsers(req, res);
  } else if (req.method === 'POST') {
    return findUsersByEmail(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
