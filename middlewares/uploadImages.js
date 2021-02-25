
//MULTER :  subida de archivos externos, atraves del formulario
//procesamiento de archivos subidos del formulario

const multer = require('multer');

const path = require('path');

//CONFIGURACION MULTER
/*diskStorage() : el metodo recibe por parametro un objeto literal con dos propiedades que asu vez esas 
propiedades son funciones */
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{//destino
        cb(null,'public/images'); //donde se vana  guardar los archivos externos
    },
    filename: (req,file,cb)=>{//nombre de archivo
        cb(null,file.fieldname+'-'+ Date.now() + path.extname(file.originalname));
             //fieldname: nombre del campo(del name de input tipo file)   
        
    
    }
});


module.exports = multer({storage});