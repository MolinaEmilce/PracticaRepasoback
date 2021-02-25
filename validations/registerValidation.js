//PARA LAS VALIDACIONES HAY QUE INSTALAR EL MODULO:  npm install express-validator
const fs = require('fs');

//Lo que necesito en este proyecto de express validator solo necesito check y body, lo transformo en constatntes.
const {check,body} = require('express-validator');
const users_db = JSON.parse(fs.readFileSync('./data/users.json','utf-8')); //base de datos json


module.exports = [

    //check() recibe el elemento del formulario
    //body()  es una validacion personalizada, customizada. .custom(recibe el valor del campo que llama body, es decir un callback)

//Chequea todos los campos(inputs)
    check('username')
    .notEmpty().withMessage('el username es requerido'),
//----------Comparacion : email ingresado en el campo(input), y con el que hay en el json(si es que existe)-----------
    check('email')
    .isEmail().withMessage('debe ser un email valido'),

    body('email').custom(value =>{ //indicamos si el email ya esta en el json
        let result = users_db.find(cadauser=> cadauser.email === value);

        if(result){//si encontramos valor en el result (es decir que encontro el email en el json)
            return false; //que no pase, es decir va a mostrar el mensaje que pusimos abajo. NO PASO LA VALIDACION Y NO TE VA A DEJAR SEGUIR
        }else{
            return true; //que si pase, es decir se va a registrar
        }
    }).withMessage('Error, el mail esta registrado'),
//---------------------------------------------------------------------------------------------------------------------------
//-------------comparacion: de pass2 y pass 1 que viene por el formulario, es decir si las contraseñas coinciden-------------
    check('pass')
    .isLength({ //caracteres
        min : 6,
        max:12
    }).withMessage('error, la contraseña debe tener un minimo 6 y maximo 12'),

    //uso body xq quiero hacer un custom(el valor de pass2, objeto request tiene ir con llaves xq es un objeto literal)
    body('pass2').custom((value,{req})=>{
        if(value !== req.body.pass){ //si value de pass2 es distinto a lo que habia ingresado por el form PERO solo pass (1)
            return false; //no pasa
        }else{
            return true; //si pasa 
        }
    }).withMessage('las contraseñas no coinciden!!!')
//----------------------------------------------------
]
