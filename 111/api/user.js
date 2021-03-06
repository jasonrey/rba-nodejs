const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();

router.get('/user/:id', async (req, res) => {
  const user = await User.findOne(
    {
      _id: req.params.id,
    },
    {
      password: 0,
    }
  );

  res.json(user);
});

router.post('/user/register', express.json(), async (req, res, next) => {
  const existingUser = await User.findOne({
    email: req.body.email,
  });

  if (existingUser) {
    return next(new Error('User exist'));
  }

  const user = new User({
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
    name: req.body.name,
    gender: req.body.gender,
  });

  try {
    await user.save();
  } catch (err) {
    return next(err);
  }

  res.json({
    id: user._id,
  });
});

router.post('/user/login', express.json(), async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return next(new Error('No user found'));
  }

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({
      state: false,
    });
  }

  res.json({
    state: true,
  });
});

router.put('/user/:id', express.json(), async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.id,
  });

  if (!user) {
    return next(new Error('User not found.'));
  }

  user.name = req.body.name;
  user.gender = req.body.gender;

  if (
    req.body.oldPassword &&
    req.body.newPassword &&
    (await bcrypt.compare(req.body.oldPassword, user.password))
  ) {
    user.password = await bcrypt.hash(req.body.newPassword, 10);
  }

  try {
    await user.save();
  } catch (err) {
    return next(err);
  }

  res.json({
    id: user._id,
  });
});

module.exports = router;
