const router = require('express').Router();
const User = require('../model/User');
const bycript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation,loginValidation} = require('../validation');

// Register
router.post('/register', async (req, res) => {

    // Validate data before make a user
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Check if email already in DB
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already taken');

    // Hash password
    const salt = await bycript.genSalt(10);
    const hashPassword = await bycript.hash(req.body.password, salt); 

    //Create a new user 
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    try {
        await user.save(); 
        res.send({user:user._id});
    } catch (err) {
        res.status(400).send(err);
    }
});

// Login
router.post('/login',async(req,res) => {
    // Validate data before login
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if email exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not found');

    // Check if password correct
    const checkPass = await bycript.compare(req.body.password, user.password);
    if (!checkPass) return res.status(400).send('Password is wrong');

    // Make token
    const token = jwt.sign({_id: user.id},process.env.TOKEN);
    res.header('auth-token',token).send(token);
});

module.exports = router;