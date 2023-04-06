const { response } = require("express");
const Evento = require('../models/Evento'); // No necesito {} porque uso exportacion por defecto

const getEventos = async(req, res = response ) => {

    const eventos = await Evento.find()
                                .populate('user', 'name'); // Traer info del usuario(modelo) relacionado al evento
                                // .populate('user'); // Asi trae todo
    res.status(200).json({
        ok: true,
        eventos
    });
}

const crearEventos = async(req, res = response ) => {

    const evento = new Evento( req.body );

    try {

        evento.user = req.uid;
        const eventoGuardado = await evento.save();
        
        res.json({
            ok: true,
            evento: eventoGuardado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            mgs: 'Hable con el administrador'
        });
    }

    console.log(req.body);
    return res.status(200).json({
        ok: true,
        msg: 'crearEventos'
    });
}

const actualizarEvento = async(req, res = response ) => {

    const eventoId = req.params.id; // Obtengo id de la url

    try {

        const evento = await Evento.findById(eventoId);
        const uid = req.uid;

        if ( !evento ) {
            return res.status(404).json({
                ok:false,
                msg: 'Evento no existe con eso id'
            });
        }

        // Si la persona que creo el evento es la misma que lo quiere actualizar se le permite sino no
        if ( evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: true,
                msg: 'No tiene permiso para editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        // Por defecto al actualizar devuelve el elemento como estaba antes de los cambios
        // Si quiero devolver el elemento modificado siempre agrego { new: true }
        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );
        res.json({
            ok: true,
            evento: eventoActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const eliminarEvento = async(req, res = response ) => {
    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById(eventoId);
        const uid = req.uid;

        if ( !evento ) {
            return res.status(404).json({
                ok:false,
                msg: 'Evento no existe con eso id'
            });
        }

        // Si la persona que creo el evento es la misma que lo quiere eliminar se le permite sino no
        if ( evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: true,
                msg: 'No tiene permiso para eliminar este evento'
            });
        }

        await Evento.findByIdAndRemove(eventoId);
        res.json({ ok: true });
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

    return res.status(200).json({
        ok: true,
        msg: 'eliminarEvento'
    });
}

module.exports = {
    getEventos,
    crearEventos,
    actualizarEvento,
    eliminarEvento
}