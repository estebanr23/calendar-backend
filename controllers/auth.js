const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async( req, res = response ) => {

    // console.log(req.body);
    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        usuario = new Usuario( req.body ); // usuario le cae encima a la instancia anterior con let
        
        // Encriptar contrasena
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );


        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor, comuniquese con el administrador.'
        });
    }

    /* if (name.length < 5) {
        return res.status(400).json({
            ok: true,
            msg:'El nombre debe ser mayor a 5.',
        });
    } */

    /* const errors = validationResult( req );
    if ( !errors.isEmpty() ) { // Pregunta si el array de errors no esta vacio, es decir hay errores
        return res.status(400).json({
            ok: false,
            errors: errors.mapped() // serealizo los errores
        })
    } */   
}

const loginUsuario = async( req, res = response ) => {

    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar nuestro JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor, comuniquese con el administrador.'
        });
    }
    
    /* res.json({
        ok: true,
        msg: 'login',
        email,
        password
    }); */
}

const revalidarToken = async( req, res = response ) => {

    // Accedo al id y name por medio de la request.
    const uid = req.uid;
    const name = req.name;

    // Generar JWT
    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        uid, name,
        token
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}