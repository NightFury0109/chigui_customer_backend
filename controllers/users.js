const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

exports.loadUser = async (req, res) => {
  // console.log(req.user);
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

exports.signup = async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  if (!req.file) {
    errors.avatar = "Elige tu avatar";
    return res.status(400).json(errors);
  }

  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      errors.email = "Este correo electrónico ya estaba registrado";
      return res.status(400).json(errors);
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      birthday: req.body.birthday,
      address: req.body.address,
      phone: req.body.phone,
      avatar: req.file.path
    });

    const salt = await bcrypt.genSalt(10);

    newUser.password = await bcrypt.hash(req.body.password, salt);

    await newUser.save();

    res.json({ msg: "Registrado exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

exports.signin = async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      errors.email = "Este correo electrónico no está registrado";
      return res.status(400).json(errors);
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      errors.password = "Contraseña incorrecta";
      return res.status(400).json(errors);
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: '1 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token: token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}