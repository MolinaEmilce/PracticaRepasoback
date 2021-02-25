//MIDDLE DE SESSION

//dato :  usamos session, xq es un middleware de aplicacion es decir que esta configurado en el entrypoint
module.exports= (req,res,next)=>{
    if(req.session.user){ //si existe, si esta levantado el usuario
        next(); //que pase
    }else{ // si no existe, o al cerrar el navegador
        res.redirect('/users/login'); //que te diriga a la pagina
    }
}