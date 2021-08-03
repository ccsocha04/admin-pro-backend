/*
    Ruta: /api/users
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidator } = require('../middlewares/fields-validator');

const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/user-controllers');
const { validateJWT } = require('../middlewares/jwt-validator');
 
const router = Router();

router.get( '/', validateJWT, getUsers );

router.post( '/', 
    [
        check('name', 'El nombre es obligatorio').notEmpty(),
        check('password', 'El password es obligatorio').notEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        fieldsValidator
    ], 
    createUser 
);

router.put( '/:id', 
    [
        validateJWT,
        check('name', 'El nombre es obligatorio').notEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('role', 'El role es obligatorio').notEmpty(),
        fieldsValidator
    ],
    updateUser
);

router.delete( '/:id', validateJWT, deleteUser );


module.exports = router;