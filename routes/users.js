const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { body, validationResult, check } = require('express-validator');

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route     POST api/users
// @desc      register a user
// @access    Public

router.post(
  '/',
  [
    check('name', 'Please add a name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email }); // findOne is made by mongoose to find if user exists
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // if user does not exist, we can send a new user
      user = new User({
        name,
        email,
        password,
      });

      // Encrypt the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Create in a database
      await user.save();

      // Payload to send user information in a JSON WEB TOKEN
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Get the user token
      jwt.sign(
        payload,
        config.get('jwtsecret'),
        {
          expiresIn: 3600000, // expire login in seconds
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token }); // no error, send the token
        }
      );

      // if there is an error
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
  }
);

// export the router otherwise it won't work
module.exports = router;
