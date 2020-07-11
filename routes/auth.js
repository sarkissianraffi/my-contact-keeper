const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { body, validationResult, check } = require('express-validator');

const User = require('../models/User');

// @route     GET api/auth
// @desc      Get logged in user
// @access    Private
router.get('/', auth, async (req, res) => {
  try {
    // Get user to the database (but remove the password)
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/auth
// @desc      Auth user and get token
// @access    Public
router.post(
  '/',
  [
    check('email', 'Please include a valide email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email }); // find userId
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // check if user and password match
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // If ok, then signin
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
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Serer error');
    }
  }
);

// export the router otherwise it won't work
module.exports = router;
