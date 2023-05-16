const Joi = require('joi');

const contacts = require('../models/contacts');

const { HttpError } = require('../helpers/HttpError');
const controllerWrapper = require('../helpers/decorators');

const addSchema = Joi.object({
   name: Joi.string().required(),
   email: Joi.string().required(),
   phone: Joi.string().required(),
});

async function getAll(req, res, next) {
   const result = await contacts.listContacts();
   if (!result) {
      throw HttpError(404, 'Not found');
   }
   res.status(200).json(result);
}

async function getContactById(req, res, next) {
   const { contactId } = req.params;
   const result = await contacts.getContactById(contactId);
   if (!result) {
      return res.status(404).json({ message: 'contact not found' });
   }
   res.status(200).json(result);
}

async function addNewContact(req, res, next) {
   const { name, email, phone } = req.body;
   const newContact = {
      name,
      email,
      phone,
   };
   console.log(newContact);
   const { error } = addSchema.validate(newContact);
   if (error) {
      throw HttpError(400, error.message);
   }
   const result = await contacts.addContact(newContact);
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

   const result = await contacts.updateContact(contactId, modifiedContact);
   if (!result) {
      throw HttpError(404, 'Not found');
   }
   res.status(200).json({ result });
}

async function deleteContact(req, res, next) {
   const { contactId } = req.params;
   const result = await contacts.removeContact(contactId);
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
   deleteContact: controllerWrapper(deleteContact),
};
