const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const path = require('path');
const Jimp = require('jimp');

const gravatar = require('gravatar');

require('dotenv').config();

const { SECRET_KEY } = process.env;

const User = require('../models/user');

const HttpError = require('../helpers/HttpError');
const controllerWrapper = require('../helpers/decorators');

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

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

   const baseImgURL = await gravatar.profile_url(email, { protocol: 'http', format: 'jpeg' });

   const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL: baseImgURL,
   });

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

   await User.findByIdAndUpdate(user._id, { token });
   res.json({ token });
}

async function current(req, res) {
   const { email } = req.user;

   res.json({ email });
}

async function logout(req, res) {
   const { _id } = req.user;
   await User.findByIdAndUpdate(_id, { token: '' });

   res.json({ message: 'googBye' });
}

async function changeAvatar(req, res) {
   const { _id } = req.user;
   console.log(req.file);
   const { path: tempUpload, originalname } = req.file;
   const filename = `${_id}_${originalname}`;
   const resultUpload = path.join(avatarsDir, filename);
   await fs.rename(tempUpload, resultUpload);
   const avatarURL = path.join('avatars', filename);
   await User.findByIdAndUpdate(_id, { avatarURL });

   res.json({ avatarURL });
}

module.exports = {
   register: controllerWrapper(register),
   login: controllerWrapper(login),
   current: controllerWrapper(current),
   logout: controllerWrapper(logout),
   changeAvatar: controllerWrapper(changeAvatar),
};
