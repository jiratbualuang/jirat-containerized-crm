import { addNewContact, deleteContact, getContacts, getContactWithID, updateContact } from '../controllers/crmControllers.js';
import { login, loginRequired, register } from '../controllers/userController.js';

const routes = (app) => {
    app.route('/contact')
    // get all contacts
    .get((req,res, next) => {
        // middleware
        console.log(`Request from: ${req.originalUrl}`)
        console.log(`Request type: ${req.method}`)
        next();  
    }, loginRequired, getContacts)

    // post a new contact
    .post(loginRequired, addNewContact);

    app.route('/contact/:contactId')
    // get specific contact
    .get(loginRequired, getContactWithID)

    .put(loginRequired, updateContact)

    .delete(loginRequired, deleteContact)

    app.route('/auth/register')
        .post(register);

    app.route('/login')
        .post(login);
}

export default routes;