//middleware de aplicacion
//El objeto(locals) que le pertenece al responde
//Locals: puede almacenar informacion

module.exports =(req,res,next)=>{
    if(req.session.user){//si esta levantado session
    //en el objeto responde llamamos a locals y creamos una variable user 
    //es decir que en local se va almacenar la session del usuario   
    res.locals.user = req.session.user
    /* a traves del objeto response, llamamos al objeto locals y mediante ello creamos una variable que va a ser user. Es decir = req.locals.user 
    La variable que se creó en controller atraves de session, para almacenar los datos, es decir el res.session.user        
    Y ahora todo lo almacenado en session.user, se va almacenar en locals.user.
    
    Y como se configuro el middleware en manera de aplicacion, es decir que va a ser global 
    y va a poder ser utilizada en toda la aplicacion.
    En los archivos html para poder acceder a los datos : user.propiedad(la propiedad que haya almacenado en esa variable)
    
    */
    }
    next();
}