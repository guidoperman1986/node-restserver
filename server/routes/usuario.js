const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const _ = require('underscore')

const Usuario = require('../models/usuario')
const { verificaToken, verificaAdminRole } = require('../middelwares/autenticacion')

app.get('/usuario', verificaToken, (req, res)=> {
    
    let desde = req.query.desde || 0;  //para el desde
    desde = Number(desde)

    let limite = req.query.limite || 5; //para el hasta
    limite = Number(limite)

    //let estado = 

    Usuario.find({estado:true},'nombre email role estado')  
            .skip(desde)
            .limit(limite)            
            .exec((err, usuarios)=>{
                 if (err){
                     return res.status(400).json({
                         ok:false,
                         err
                     })
                 }

                 Usuario.count({estado:true},(err,conteo)=>{
                     res.json({
                         ok:true,
                         usuarios,
                         conteo
                     })
                 })
            })
})
  
app.post('/usuario',[verificaToken,verificaAdminRole], function (req, res) {//crear registros
    let body = req.body;

    let usuario = new Usuario({
        nombre:body.nombre,
        email:body.email,
        password:bcrypt.hashSync(body.password,10),
        role:body.role
    })

    usuario.save((err,usuadioDB)=>{
        if (err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        //delete usuadioDB.password;

        res.json({
            ok:true,
            usuario:usuadioDB
        })

    })
})
  
app.put('/usuario/:id',[verificaToken,verificaAdminRole] ,function (req, res) {//actualizar registros
  
    let id = req.params.id;
    let body = _.pick(req.body,['nombre','email','img','role','estado']);

    //new es para que me actualize el registro y me mande los datos actualizados
    //runValidators sirve para que en el put se corran las mismas validaciones que en el post
    Usuario.findByIdAndUpdate(id, body,{new:true,runValidators:true}, (err,usuarioDB) => {
        if (err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            usuario:usuarioDB,
            id
        })
    })

  
})
  
app.delete('/usuario/:id', [verificaToken,verificaAdminRole],function (req, res) {//eliminar registros
    let id = req.params.id;

    //Usuario.findByIdAndRemove(id, (err,usuarioBorrado)=>{
    let cambiaEstado = {
        estado:false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, (err,usuarioBorrado)=>{
        if (err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        if (usuarioBorrado === null){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok:true,
            usuario:usuarioBorrado,
            id
        })

    })
    
})

module.exports = app;