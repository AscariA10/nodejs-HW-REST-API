const express = require('express');
const { request } = require('../../app');

const router = express.Router();

const authenticate = require('../../middlewares/authenticate');

const contactsController = require('../../controllers/contact-controllers');

router.get('/', authenticate, contactsController.getAll);

router.get('/:contactId', authenticate, contactsController.getContactById);

router.post('/', authenticate, contactsController.addNewContact);

router.put('/:contactId', authenticate, contactsController.updateContact);

router.patch('/:contactId/favorite', authenticate, contactsController.updateContactFavorite);

router.delete('/:contactId', authenticate, contactsController.deleteContact);

module.exports = router;
