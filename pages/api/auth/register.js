import connectDB from '../../../lib/db';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, password } = req.body;

    // Validate the request
    if (!name || !password) {
      return res.status(400).json({ error: 'Name and password are required' });
    }

    await connectDB();

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ name });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create the new user
      const user = new User({ name, password });
      await user.save();

      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error registering user' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
