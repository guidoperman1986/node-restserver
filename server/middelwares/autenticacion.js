//Verificacion de token

const jwt = require('jsonwebtoken')

let verificaToken = (req, res, next) =>{
    let token = req.get('token');  //para leer los headers

    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if (err){
            return res.status(401).json({
                ok:false,
                err:'token no valido'
            })
        }

        req.usuario = decoded.usuario;
        next();
    })   
};


let verificaAdminRole = (req,res,next) => {

    let usuario = req.usuario;

    if (usuario.role != "ADMIN_ROLE"){
        res.json({
            ok:false,
            err:{
                message:'El usuario no es administrador'
            }
        })
    }else{
        next();
    }
}

module.exports = {
    verificaToken,
    verificaAdminRole
}