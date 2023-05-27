const Joi = require('joi');

const Contact = require('../models/contact');

const HttpError = require('../helpers/HttpError');
const controllerWrapper = require('../helpers/decorators');

const addSchema = Joi.object({
   name: Joi.string().required(),
   email: Joi.string().required(),
   phone: Joi.string().required(),
   favorite: Joi.boolean(),
});

async function getAll(req, res, next) {
   const result = await Contact.find();
   if (!result) {
      throw HttpError(404, 'Not found');
   }
   res.status(200).json(result);
}

async function getContactById(req, res, next) {
   const { contactId } = req.params;
   const result = await Contact.find({ _id: contactId });
   if (!result) {
      return res.status(404).json({ message: 'contact not found' });
   }
   res.status(200).json(result);
}

async function addNewContact(req, res, next) {
   const { name, email, phone, favorite } = req.body;
   const newContact = {
      name,
      email,
      phone,
      favorite,
   };
   const { error } = addSchema.validate(newContact);
   if (error) {
      throw HttpError(400, error.message);
   }
   const result = await Contact.create(newContact);
   res.status(201).json(result);
}

async function updateContact(req, res, next) {
   const { name, email, phone } = req.body;
   const modifiedContact = {
      name,
      email,
      phone,
   };
   const { error } = addSchema.validate(modifiedContact);
   if (error) {
      throw HttpError(400, error.message);
   }
   const { contactId } = req.params;

   const result = await Contact.findByIdAndUpdate({ _id: contactId }, modifiedContact, {
      new: true,
   });
   if (!result) {
      throw HttpError(404, 'Not found');
   }
   res.status(200).json({ result });
}

async function updateContactFavorite(req, res, next) {
   const { contactId } = req.params;
   if (!req.body) {
      throw HttpError(400, 'missing field favorite');
   }
   const result = await Contact.findOneAndUpdate({ _id: contactId }, req.body, { new: true });
   if (!result) {
      throw HttpError(404, 'Not found');
   }

   res.status(200).json({ result });
}

async function deleteContact(req, res, next) {
   const { contactId } = req.params;
   const result = await Contact.findByIdAndRemove({ _id: contactId });
   if (!result) {
      throw HttpError(404, 'Not found');
   }
   res.status(200).json({ message: `${contactId} was deleted` });
}

module.exports = {
   getAll: controllerWrapper(getAll),
   getContactById: controllerWrapper(getContactById),
   addNewContact: controllerWrapper(addNewContact),
   updateContact: controllerWrapper(updateContact),
   updateContactFavorite: controllerWrapper(updateContactFavorite),
   deleteContact: controllerWrapper(deleteContact),
};
