const moment = require('moment');

const isDate = ( value ) => {

    if ( !value ) {
        return false;
    }

    const fecha = moment( value );
    if ( fecha.isValid() ) { // isValid verifica que sea una fecha valida
        return true;
    } else {
        return false;
    }
}

module.exports = { isDate };