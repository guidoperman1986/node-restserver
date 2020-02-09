const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload())

app.put('/upload/:tipo/:id', (req,res)=>{

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files){
        return res.status(400)
                    .json({
                        ok:false,
                        message:'No se ha seleccionado ningun archivo'
                    })
    }

    //Validar tipo
    let tiposValidos = ['productos','usuarios'];

    if (tiposValidos.indexOf(tipo) < 0){
        return res.status(400)
                    .json({
                        ok:false,
                        message:'Las tipos permitidos son '+ tiposValidos.join(', ')                        
                    })
    }

    //Extenciones permitidas 
    let extencionesValidas = ['png','jpg','gif','jpeg'];

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    if (extencionesValidas.indexOf(extension) < 0){
        return res.status(400)
                    .json({
                        ok:false,
                        message:'Las extenciones permitidas son '+ extencionesValidas.join(', '),
                        ext: extension
                    })
    }

    //Cambiar el nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`,(err)=>{
        if (err){
            return res.status(500)
                    .json({
                        ok:false,
                        err
                    })
        }

        if (tipo == 'usuarios'){
            imagenUsuario(id,res,nombreArchivo);
        }
        if (tipo == 'productos'){
            imagenProducto(id,res,nombreArchivo)
        }

        //res.json({
        //    ok:true,
        //    message:'Imagen subida correctamente'
        //})
    })

    
    
    
    
    
    
})

function imagenUsuario(id,res,nombreArchivo){
    Usuario.findById(id,(err,usuario)=>{
        if (err){
            borrarArchivo(nombreArchivo,'usuarios')

            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!usuario){
            borrarArchivo(nombreArchivo,'usuarios')

            return res.status(500).json({
                ok:false,
                err:'Usuario no existe'
            })
        }

        borrarArchivo(usuario.img,'usuarios')

        usuario.img = nombreArchivo;

        usuario.save((err,usuarioGuardado)=>{

            res.json({
                ok:true,
                usuarioGuardado,
                img:nombreArchivo
            })
        })


    })
}

function imagenProducto(id,res,nombreArchivo){
    Producto.findById(id,(err,producto)=>{
        if (err){
            borrarArchivo(nombreArchivo,'productos')

            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!producto){
            borrarArchivo(nombreArchivo,'productos')

            return res.status(500).json({
                ok:false,
                err:'Producto no existe'
            })
        }

        borrarArchivo(producto.img,'productos')

        producto.img = nombreArchivo;

        producto.save((err,productoGuardado)=>{

            res.json({
                ok:true,
                productoGuardado,
                img:nombreArchivo
            })
        })


    })

}

function borrarArchivo(nombreImagen,tipo){
    
    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;