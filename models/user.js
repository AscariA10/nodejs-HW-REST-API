const { Schema, model } = require('mongoose');

const MongooseError = require('../helpers/MongooseError');

const userSchema = new Schema(
   {
      password: {
         type: String,
         required: [true, 'Password is required'],
      },
      email: {
         type: String,
         required: [true, 'Email is required'],
         unique: true,
      },
      subscription: {
         type: String,
         enum: ['starter', 'pro', 'business'],
         default: 'starter',
      },
      // token: {
      //    type: String,
      //    default: null,
      // },
   },
   { versionKey: false, timestamps: true }
);

userSchema.post('save', MongooseError);

const User = model('user', userSchema);

module.exports = User;