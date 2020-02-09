const express = require('express');
const _ = require('underscore')

const { verificaToken } = require('../middelwares/autenticacion')

let app = express();
let Producto = require('../models/producto');

//obtener todas las categorias
app.get('/productos',verificaToken,(req,res)=>{
    //trae todos los productos
    //populate usuario categoria
    //paginado

    let desde = req.query.desde || 0;  //para el desde
    desde = Number(desde)

    let limite = req.query.limite || 5; //para el hasta
    limite = Number(limite)

    Producto.find({disponible:true})
            .populate('usuario')
            .populate('categoria')
            .skip(desde)
            .limit(limite)
            .exec((err, productos)=>{                
                if (err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }

                if (!productos || productos.length == 0){
                    return res.status(400).json({
                        ok:false,
                        message:'No hay porductos'
                    })
                }

                res.json({
                    ok:true,
                    productos
                })




            })

})

//obtener una categoria por id
app.get('/productos/:id',verificaToken,(req,res)=>{        
    let id = req.params.id;

    let desde = req.query.desde || 0;  //para el desde
    desde = Number(desde)

    let limite = req.query.limite || 5; //para el hasta
    limite = Number(limite)

    Producto.findById(id)
            .populate('usuario','nombre email')
            .populate('categoria','nombre')
            .skip(desde)
            .limit(limite)
            .exec((err, productos)=>{                
                if (err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }

                if (!productos || productos.length == 0){
                    return res.status(400).json({
                        ok:false,
                        message:'No hay porductos'
                    })
                }

                res.json({
                    ok:true,
                    productos
                })



    })
})

//buscar productos
app.get('/productos/buscar/:termino',verificaToken,(req,res)=>{
    let termino = req.params.termino;
    let regex = new RegExp(termino,'i'); //con la exp regular hago mas flexible la busqueda

    Producto.find({nombre:regex})
            .populate('categoria','nombre')
            .exec((err, productos)=>{
                if (err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }

                res.json({
                    ok:true,
                    productos
                })
            })
})

//crear un nuevo producto
app.post('/productos',verificaToken,(req,res)=>{        
    let body = req.body;
    
    //crear el objeto con todos los datos enviados
    let producto = new Producto({
        nombre : body.nombre,
        precioUni : body.precioUni,
        descripcion : body.descripcion,
        disponible : body.disponible,
        categoria : body.categoria,
        usuario : body.usuario,
    })
    //grabar
    producto.save((err,producto)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!producto){
            return res.status(400).json({
                ok:false,
                message:'Producto no insertado'
            })
        }

        res.json({
            ok:true,
            producto
        })
    })

})

//actualizar un nuevo producto
app.put('/productos/:id',verificaToken,(req,res)=>{    
    let body = _.pick(req.body,['nombre','precioUni','descripcion','disponible','categoria','usuario']);
    let id = req.params.id;
    
    Producto.findByIdAndUpdate(id, body, {new:true,runValidators:true}, (err,producto)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!producto){
            return res.status(400).json({
                ok:false,
                message:'Producto no actualizado'
            })
        }

        res.json({
            ok:true,
            producto            
        })

    })

})

//actualizar un nuevo producto
app.delete('/productos/:id',verificaToken,(req,res)=>{    
    //disponible a falso> seria actualizar
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {disponible:false}, {new:true,runValidators:true}, (err,producto)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            producto
        })
    })
    

})



module.exports = app;