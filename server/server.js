require('./config/config');

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')



const app = express()

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname,'../public')))
    
//config global de rutas
let rutas = require('./routes/index')

app.use(rutas);

mongoose.connect(process.env.URLDB,
    {useNewUrlParser:true, useCreateIndex:true},
    (err,res)=>{
    if (err) throw err;

    console.log('Base de datos Online\n');
}) 

app.listen(process.env.PORT,()=>console.log(`Escuchando puerto ${process.env.PORT}`));