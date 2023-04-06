/* 
    Rutas de Eventos
    host + /api/events 
*/

const { Router } = require("express");
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { getEventos, crearEventos, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { validarJWT } = require('../middlewares/validar-jwt');
const { isDate } = require("../helpers/isDate");

const router = Router();

// Todas tienen que pasar por la validacion del JWT
// Se aplica para todas las rutas que estan debajo de esto
router.use( validarJWT );

// Obtener eventos
router.get('/', getEventos);

// Crear evento 
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatorio').custom( isDate ), // implementar validacion personalizada
        check('end', 'Fecha de finalizacion es obligatorio').custom( isDate ),
        validarCampos
    ], 
    crearEventos
);

// Actualizar evento 
router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatorio').custom( isDate ), // implementar validacion personalizada
        check('end', 'Fecha de finalizacion es obligatorio').custom( isDate ),
        validarCampos
    ], 
    actualizarEvento
);

// Actualizar evento 
router.delete('/:id', eliminarEvento);

module.exports = router;