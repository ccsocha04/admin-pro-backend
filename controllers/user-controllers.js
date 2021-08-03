const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async (req, res) => {

    const users = await User.find({}, 'name email password img role google');

    res.json({
        ok: true,
        users,
        uid: req.uid
    });

}

const createUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const existEmail = await User.findOne({
            email
        });

        if (existEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            })
        }

        const user = new User(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        // Guardar usuario
        await user.save();

        // Generar el Token JWT
        const token = await generateJWT( user.id )

        res.json({
            ok: true,
            user,
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

const updateUser = async (req, res = response) => {

    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;

    try {

        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con es Id'
            })
        }

        // Actualización
        const { password, google, email, ...fields } = req.body;

        if ( userDB.email !== email ) {
            const existEmail = await User.findOne({ email });
            if (existEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El correo ya está registrado con otro usuario'
                })
            }
        }
        fields.email = email;
        const updatedUser = await User.findByIdAndUpdate( uid, fields, { new: true } );

        res.json({
            ok: true,
            user: updatedUser
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })

    }

}

const deleteUser = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con es Id'
            })
        }

        await User.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
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
    getUsers,
    createUser,
    updateUser,
    deleteUser
}