//PARA LAS VALIDACIONES HAY QUE INSTALAR EL MODULO:  npm install express-validator 

/*VALIDA SOLAMENTE QUE LOS CAMPOS SE HAYAN LLENADO Y NO ESTEN VACIOS */

//Lo que necesito en este proyecto de express validator solo necesito check, lo transformo en constatntes.
const {check} = require('express-validator');


module.exports = [
//Chequea todos los campos(inputs) check(name del input)
    check('email')
    .isEmail().withMessage('debe ser un email valido'),

    check('pass')
    .notEmpty().withMessage('la contraseña es requerida')
]
