const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { SECRET_KEY } = process.env;

const User = require('../models/user');

const HttpError = require('../helpers/HttpError');
const controllerWrapper = require('../helpers/decorators');

const registerSchema = Joi.object({
   email: Joi.string().required(),
   password: Joi.string().required(),
   subscription: Joi.string().required(),
});

const loginSchema = Joi.object({
   email: Joi.string().required(),
   password: Joi.string().required(),
});

async function register(req, res) {
   const { email, password } = req.body;
   const user = await User.findOne({ email });

   const { error } = registerSchema.validate(req.body);

   if (error) {
      throw HttpError(400, error.message);
   }

   if (user) {
      throw HttpError(409, 'email in base');
   }

   const hashPassword = await bcrypt.hash(password, 10);

   const newUser = await User.create({ ...req.body, password: hashPassword });

   res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
   });
}

async function login(req, res) {
   const { email, password } = req.body;
   const user = await User.findOne({ email });

   if (!user) {
      throw HttpError(401, 'email or password incorrect');
   }

   const passwordCompare = await bcrypt.compare(password, user.password);

   if (!passwordCompare) {
      throw HttpError(401, 'email or password incorrect');
   }

   const payload = { id: user._id };

   const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
   res.json({ token });
}

module.exports = {
   register: controllerWrapper(register),
   login: controllerWrapper(login),
};
