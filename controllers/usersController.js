const fs =require('fs');
const path =require('path');
//Base de datos ya parseado:
const users_db = JSON.parse(fs.readFileSync('./data/users.json','utf-8'));

//encriptar contraseña
const bcrypt = require('bcrypt');

const {validationResult} = require('express-validator'); //Validaciones ya procesadas en el middleware
//se encarga de capturar los erores



module.exports = {
    register : (req,res)=>{
    res.render('register');
    },
    processRegister : (req,res)=>{
//-------------Validaciones de errores, mensajes------------------------
        let errores = validationResult(req); 
      /*Para mostrar que funcionan las validaciones de errores y pueda mostrarse los mensajes: 
        res.send(errores);
            resultado y ejemplo: 
            {"errors":[
                {"value":"emilcedaiana117@gmail.com","msg":"Error, el mail esta registrado","param":"email","location":"body"},
                {"value":"44454","msg":"error, minimo 6 y maximo 12","param":"pass","location":"body"},
                {"value":"546565656","msg":"las contraseñas no coinciden!!!","param":"pass2","location":"body"}
            ]}
      Entonces como se que llegan los errores colocamos una condicion.......*/  
        if(!errores.isEmpty()){ // si no esta vacio errores, es decir que la variable tiene cantidad de errores
            return res.render('register',{ //nos manda a la vista de registro
                errores : errores.errors //pero mandamos una variable con los valores de los errores entrando al arrays errors(que dentro de ella hay objetos literales con los errores encontrados)
            });
        }else{//si no hay errores
        //--------------------------Que cree el nuevo usuario, es decir que se registre---------------------------------------
        /*Para verificar que es lo que se captura una vez enviado el formulario
        res.send(req.files);
        
        resultado : 
        [{"fieldname":"avatar",  -> es el campo "name"  que le damos al input del formulario
        "originalname":"loguitoportada.jpg", --> nombre original con el que se subio 
        "encoding":"7bit", 
        "mimetype":"image/jpeg", --> tipo de imagen
        "destination":"public/images",  --> la ruta donde se va guardar la imagen
        "filename":"avatar-1614048345011.jpg", --> el nombre que se le crea al guardar la imagen y con la que se va almacenar en la base de datos/json
        "path":"public\\images\\avatar-1614048345011.jpg", -->ruta comlpeta de la imagen
        "size":461489}]
    
        Nos devuelve un array
        */
        const {username,email,pass} = req.body;

        let lastID = 0;
        users_db.forEach(cadaUser => {
            if(cadaUser.id > lastID){
                lastID = cadaUser.id;
            }
        });
    
        //Nuevo usuario 
    
        //Hasheamos/encriptamos la contraseña mandada por el form, para eso primero hay que installar un modulo de crasheo: bcrypt
        let hashPass = bcrypt.hashSync(pass,12); 
        let newUser = {
            id : +lastID + 1,
            username,
            email,
            pass : hashPass, // cambiamos los caracteres mandados por el formulario con la contraseña crasheada.
            avatar : req.files[0].filename /*Como lo capturado del formulario nos devuelve un array con varias propiedades 
            mencionas arriba, para accedar al archivo de imagen(avatar), tenemos que acceder a la posicion del array(aunqe solo haya un valor), y llamar a la
            propiedad filename (donde el nombre creado del archivo sera ese) */
    
        }
        //se agrega el nuevo usuario a la base de datos 
        users_db.push(newUser);
        //reescribmos en el archivo json, con los otros datos(convertidos en json)
        fs.writeFileSync('./data/users.json',JSON.stringify(users_db,null,2));
        // (donde se va aguardar,  convierto en json la variable (variable con datos agregados,null,2 significa que pone abajo cada usuario creado));
        return res.redirect('/users/login'); //return para que quede mas seguro que me mande a esa ruta
    
        }


    
    
    },
    login :(req,res)=>{
        res.render('login');
    },
    processLogin : (req,res)=>{
       //res.send(req.body); 
        let errores = validationResult(req); //de los errores que recibe

        if(!errores.isEmpty()){ //si no estan vacios los errores, es decir que estan cargados
            return res.render('login',{ //muestra la vista login
                errores : errores.errors //con los errores que vienen
            });
        }else{//de lo contrario que me loguee es decir q me deja entrar
            const {email,pass,recordar} = req.body; //captura la info que pasa por el form
            //busco en la base de datos con el email que le estamos mandando
             let result = users_db.find(cadausuario => cadausuario.email === email);

             if(result){//si hay valor es porque es true, de lo contrario false
                 //Aca indica si coincide la contraseña, compara 
                 if(bcrypt.compareSync(pass.trim(),result.pass)){ //o las contraseñas coinciden
                    //SE LEVANTA SESSION.......
                    //creamos una variable de session, ES DECIR CREAMOS UNA SESSION PARA EL USUARIO
                        req.session.user = { //ahora user(variable creada), ahora va a ser el objeto de session
                            id : result.id,
                            username : result.username,
                            avatar : result.avatar
                        }
                        if(recordar != 'undefined'){ //si hay recordar 
                            //se va a crear la cookie del lado del navegador, se crea en la pc del lado del cliente, siempre y cuando se haya elegido la opcion RECORDARME
                            res.cookie('userCom4',req.session.user,{
                                //tiempo de vida que va a atener en la computadora, estando dentro o fuera de la pagina
                                maxAge: 1000 * 60 //1000 : 1segundo , 1000*60 : 1 minuto, 1000*60*60 : 1 hora , 1000960*60*24: 1 dia
                                    
                            });
                            /*(1°nombre con el q se va llamar la cookie,
                             2° el valor de esa cookie va a ser req.session.user, 
                             3° objeto literal)*/
                        }
                    //CUANDO SE LEVANTA SESSION DE USUARIO ACCEDE A LA SIGUIENTE INFORMACION DE ABAJO...
                    return res.redirect('/users/profile');
                    }
                }//si no se cumple la anterior condicion, pasa a la siguiente linea de abajo
                return res.render('login',{
                    //se muestra este mensaje al  ver que las contraseña es incorrecta
                    errores : [ //recreamos un errors, la contrucciones deerrores
                        {
                            msg : "credenciales invalidasss"
                        }
                    ]
                });


        }
    },
    profile : (req,res)=>{
        res.render('profile');
    },
    eliminar : (req,res)=>{
        users_db.forEach(cadauser=>{
            if(cadauser.id === Number(req.params.id)){
                //nos va a eliminar tambien la imagen/archivo que se almaceno en nuestra base de datos
                if(fs.existsSync(path.join('public','images',cadauser.avatar))){
                    fs.unlinkSync(path.join('public','images',cadauser.avatar));
                }
                 aEliminar =  users_db.indexOf(cadauser); //busca la posicion
                users_db.splice(aEliminar,1); //segun la posicion lo elimina
            }
        });
        fs.writeFileSync('./data/users.json',JSON.stringify(users_db,null,2));
        res.redirect('/');
    },
    cerrarSesion : (req,res)=>{
        //destruir la sesion
        req.session.destroy();
        //para q la cookie no este dando vuelta y se muera
        if(req.cookies.userCom4){ //si dentro del objeto COOKIES, hay alguna cookie como x ejemplo la de userCom4
           /*1°El nombre de la cookie, 2°sobreescribis la cokie e decir el valor va a ser nada, 3°mata la cookie */
            res.cookie('userCom4','',{
                maxAge: -1 //NO HAY TIEMPO, ES DECIR MATAS LA COOKIE
            }); //es como que sobreescribis la cookie
        }
        res.redirect('/');
    }
}

/*req.body :  para que capute toda la info del formulario y lo muestro en la pagina 
req.files : lo mismo que arriba,  pero cuando usamos  archivos para subir es necesario usar 
este para ver todos los datos que se pasan a traves del formi

*/