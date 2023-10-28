const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetctuser')
const secretKey = process.env.SECRET_KEY;

// ROUTE1: Endpoint for /api/auth/createuser : no login required
router.post('/createuser', [
    body('name').isLength({ min: 5 }),
    body('username').isLength({ min: 5 }),
    body('email').isEmail(),
    body("password")
        .isString()
        .isLength({ min: 8 })
        .not()
        .isLowercase()
        .not()
        .isUppercase()
        .not()
        .isNumeric()
        .not()
        .isAlpha()
], async (req, res) => {

    const { username, email } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    let success = false;

    if (existingUser) {
        return res.status(400).json({success, error: 'Duplicate username or email.' });
    }

    else {

        const errors = validationResult(req);

        // If 'name' has less than 5 characters return bad request
        if (!errors.isEmpty() && errors.errors[0].path === 'name') {
            return res.status(400).json({success, error: 'Name must have minimum 5 characters'});
        }

        // If 'username' has less than 5 characters return bad request
        if (!errors.isEmpty() && errors.errors[0].path === 'username') {
            return res.status(400).json({success, error: 'Username must have minimum 5 characters'});
        }

        // If password doesn't contain minimum 8 characters, including minimum one uppercase, one lowercase and one special character return bad request
        if (!errors.isEmpty() && errors.errors[0].path === 'password') {
            return res.status(400).json({success, error: 'Password must contain 8 characters, which includes minimum one uppercase, one lowercase and one special character'});
        }

        if (!errors.isEmpty() && errors.errors[0].path === 'email') {
            return res.status(400).json({success, error: 'Invalid email address. Please try again.'})
        }

        try {
            const salt = await bcrypt.genSalt(10);
            const securedPassword = await bcrypt.hash(req.body.password, salt);
            const user = await User.create({
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: securedPassword,
            });

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, secretKey);
            success = true;
            res.json({success, authToken });
        } catch (err) {
            if (err.code === 11000) {
                success = false;
                res.status(400).json({success, error: 'Duplicate username or email.' });
            } else {
                success = false;
                console.error(err);
                res.status(500).json({success, error: 'Server error.' });
            }
        }
    }
})


// ROUTE2: Endpoint for /api/auth/login : no login required
router.post('/login', [
    body("password").exists(),
    body('username').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() && errors.errors[0].path === 'username') {
        return res.status(400).send('Username cannot be blank');
    }
    if (!errors.isEmpty() && errors.errors[0].path === 'password') {
        return res.status(400).send('Password cannot be blank');
    }

    const { username, password } = req.body;
    try {
        let success = false;
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({success, error: "Please login with correct credentials" });
        }

        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(400).json({success, error: "Please login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, secretKey);
        success = true;
        res.json({success, authToken, user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
})

// ROUTE3: Get details of logged in user. Endpoint: /api/auth/getuser : login required
router.post('/getuser', fetchuser,  async (req, res) => {
    try {
        let userID = req.user.id;
        const user = await User.findById(userID).select('-password');
        res.json({user});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
})
module.exports = router