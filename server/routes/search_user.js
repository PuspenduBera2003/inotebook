const express = require('express');
const router = express.Router();
const User = require('../models/User');
const fetchuser = require('../middleware/fetctuser')


// Route 1: For searching users from the database, login required
router.post('/search', fetchuser, async (req, res) => {
    try {
        const { name } = req.body;
        let success = false;
        const regex = new RegExp(`^${name}|${name}$`, 'i'); // 'i' for case-insensitive matching
        const matchedUser = await User.find({
            $or: [
                { name: { $regex: regex } },
                { username: { $regex: regex } }
            ]
        });
        if (matchedUser.length === 0) {
            return res.status(400).json({ success, message: `No user found with initials or ending with ${name}` });
        }
        success = true;
        res.status(200).json({ success, matchedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
});


module.exports = router