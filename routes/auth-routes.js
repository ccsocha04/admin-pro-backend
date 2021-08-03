/*
    Ruta: /api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidator } = require('../middlewares/fields-validator');

const { login } = require('../controllers/auth-controllers');

const router = Router();

router.post( '/', 
    [
        check('password', 'El password es obligatorio').notEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        fieldsValidator
    ],
    login 
);

module.exports = router;