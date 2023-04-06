const { Schema, model } = require('mongoose');

const EventoSchema = Schema({
   
    title: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, // Inidico que va a ser una referencia a otro schema
        ref: 'Usuario', // Nombre del schema de usuario
        required: true
    }

});

// Para cambiar _id por id y eliminar __v de la respuesta json
EventoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject(); // Con esto obtengo la referencia del objeto mismo
    object.id = _id;
    return object;
})

module.exports = model('Evento', EventoSchema);