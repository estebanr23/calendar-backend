const mongoose = require('mongoose');

const dbConnection = async() => {
    try {

        /* mongoose.connect( process.env.DB_CNN, {
            userNewUrlParser: true,
            useUndefinedTopology: true,
            useCreateIndex: true
        } ); */

        mongoose.connect( process.env.DB_CNN );

        console.log('DB online');
        
    } catch (error) {
        console.log(error);
        throw new error('Error a la hora de inicializar DB');
    }
}

module.exports = {
    dbConnection
}