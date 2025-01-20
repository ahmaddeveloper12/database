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
      // Find the user by name
      const user = await User.findOne({ name });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare the password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error logging in' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
