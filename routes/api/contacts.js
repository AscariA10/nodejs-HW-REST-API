const express = require('express');
const { request } = require('../../app');

const router = express.Router();

const contacts = require('../../models/contacts');

router.get('/', async (req, res, next) => {
   const result = await contacts.listContacts();
   res.json(result);
});

router.get('/:contactId', async (req, res, next) => {
   const { contactId } = req.params;
   const result = await contacts.getContactById(contactId);
   if (!result) {
      return res.status(404).json({ message: 'contact not found' });
   }
   res.json(result);
});

router.post('/', async (req, res, next) => {
   const { name, email, phone } = req.body;
   const newContact = {
      name,
      email,
      phone,
   };
   const result = await contacts.addContact(newContact);
   res.json(result);
});

router.delete('/:contactId', async (req, res, next) => {
   const { contactId } = req.params;
   const result = await contacts.removeContact(contactId);
   res.json({ message: `${contactId} was deleted` });
});

router.put('/:contactId', async (req, res, next) => {
   const { contactId } = req.params;
   const { name, email, phone } = req.body;
   const result = await contacts.updateContact(contactId, { name, email, phone });
   res.json({ status: 'success', code: 200, data: { result } });
});

module.exports = router;
