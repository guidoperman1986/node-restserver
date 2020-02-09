const express = require('express');
const app = express();

let {verificaToken,verificaAdminRole} = require('../middelwares/autenticacion');


let Categoria = require('../models/categoria');

//Mostrar todas las categorias
app.get('/categoria',(req,res)=>{
    Categoria.find({})
            .sort('descripcion')   
            .populate('usuario','nombre email')
            .exec((err,categorias)=>{
            if (err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                categorias
            })
            })
})

//mostrar una categoria
app.get('/categoria/:id',(req,res)=>{
    let id = req.params.id;

    Categoria.findById(id,(err,categoria)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            categoria
        })
    })
})

//crear nueva categoria
app.post('/categoria',verificaToken,(req,res)=>{    
    let idUsuario = req.usuario._id;    
    let descripcion = req.body.descripcion;

    let categoria = new Categoria({
        descripcion:descripcion,
        usuario:idUsuario
    });

    categoria.save((err,categoria)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!categoria){
            return res.status(400).json({
                ok:false,
                message:'Categoria no insertada'
            })
        }

        res.json({
            ok:true,
            categoria
        })
    })
})

app.put('/categoria/:id',verificaToken,(req,res)=>{
    //actualizar descripcion de la categoria
    let id = req.params.id;
    let descripcion = req.body.descripcion;        
    
    Categoria.findByIdAndUpdate(id, {descripcion}, {new:true,runValidators:true}, (err,categoria)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!categoria){
            return res.status(400).json({
                ok:false,
                message:'Categoria no insertada'
            })
        }

        res.json({
            ok:true,
            categoria
        })
    })
});

app.delete('/categoria/:id',[verificaToken,verificaAdminRole],(req,res)=>{
    //solo un admin puede borrar categorias
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err,categoriaBorrada)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            message: 'Categoria borrada'
        })
    })
});

module.exports = app;
