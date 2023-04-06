const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = ( req, res = response, next ) => {

    // Para revalidar el token se necesita el token actual

    // x-token header / Contiene el token de la peticion
    const token = req.header('x-token');
    // console.log(token);

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }

    try {
        // Si se modifica el payload o la palabra secreta el token sera invalido
        // La firma tambien tambien contiene los datos del payload, si se modifica
        // el payload no va a concidir con la firma y token no es valido.

        const payload =  jwt.verify( // Se puede desestructurar tambien
            token,
            process.env.SECRET_JWT_SEED
        );

        // Creo una request que tiene en el encabezado estos datos para pasarle
        // al metodo del controller cuando se ejecuta next()
        req.uid = payload.uid;
        req.name = payload.name;

        // console.log(payload);
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }

    next();

}

module.exports = {
    validarJWT
}