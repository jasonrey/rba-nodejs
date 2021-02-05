const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const auth = require('../middlewares/auth');
const User = require('../models/user');

const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads');
    },
    filename(req, file, cb) {
      console.log(file);
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

router.put('/user/avatar', auth, upload.single('avatar'), async (req, res) => {
  await User.updateOne(
    {
      _id: req.user.id,
    },
    {
      $set: {
        avatar: req.file.path,
      },
    }
  );

  res.json({
    path: req.file.path,
  });
});

router.get('/user', auth, async (req, res) => {
  const user = await User.findOne(
    {
      _id: req.user.id,
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

  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );

  res.json({
    token,
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

  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );

  res.json({
    token,
  });
});

router.put('/user', auth, express.json(), async (req, res, next) => {
  const user = await User.findOne({
    _id: req.user.id,
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
