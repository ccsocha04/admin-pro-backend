const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const login = async( req, res = response ) => {

    const { email, password } = req.body;

    try {

        // Verificar Email
        const userDB = await User.findOne({ email });

        if ( !userDB ) {
            
            return res.status(404).json({
                ok: false,
                msg: 'Email no válido'
            });

        }

        // Verificar Password
        const validatePassword = bcrypt.compareSync( password, userDB.password );
        if ( !validatePassword ) {
            
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });

        }

        // Generar el Token JWT
        const token = await generateJWT( userDB.id );
        
        res.json({
            ok: true,
            token
        });
        
    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })

    }

}

module.exports = {
    login
}