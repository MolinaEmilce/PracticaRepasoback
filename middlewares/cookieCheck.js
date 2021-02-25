module.exports = (req,res,next)=>{
    //req.cookies -> de las cokies que estan en mi sistema
    if(req.cookies.userCom4){ 
        //le damos valor a session
        req.session.user = req.cookies.userCom4;
    }
    next(); //ES IMPORTANTE ponerlo, xq en este caso si todo funciona, significa que vamos a seguir haciendo los otros pasos, no se le pone next en los casos de las autenticaciones
}