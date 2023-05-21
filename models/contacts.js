const fs = require('fs/promises');
const path = require('path');
const { nanoid } = require('nanoid');

const contactsPath = path.join(__dirname, '/contacts.json');

const listContacts = async () => {
   const data = await fs.readFile(contactsPath, 'utf-8');
   return JSON.parse(data);
};

const getContactById = async contactId => {
   const contacts = await listContacts();
   const result = contacts.find(contact => {
      return contact.id === contactId;
   });
   return result || null;
};

const removeContact = async contactId => {
   const contacts = await listContacts();
   const index = contacts.findIndex(contact => contact.id === contactId);
   console.log(index);
   if (index === -1) {
      return null;
   }
   const [findedContact] = contacts.splice(index, 1);
   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
   return findedContact;
};

const addContact = async body => {
   const contacts = await listContacts();
   const newContact = {
      id: nanoid(),
      ...body,
   };
   contacts.push(newContact);
   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
   return newContact;
};

const updateContact = async (id, body) => {
   const contacts = await listContacts();
   const contactIndex = contacts.findIndex(element => element.id === id);
   if (contactIndex === -1) {
      return null;
   }
   contacts[contactIndex] = { id, ...body };
   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
   return contacts[contactIndex];
};

module.exports = {
   listContacts,
   getContactById,
   removeContact,
   addContact,
   updateContact,
};
