const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();
    res.json({ message: 'User created' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Wrong password' });
    
    req.session.user = { id: user._id, email: user.email, role: user.role };
    res.json({ message: 'Login success', role: user.role });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;