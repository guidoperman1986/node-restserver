require('./config/config');

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
 
app.get('/usuario', function (req, res) {
  res.json('Get usuario')
})

app.post('/usuario', function (req, res) {//crear registros
    let body = req.body;

    if (body.nombre === undefined){
        res.status(400).json({
            ok:false,
            mensaje:'El nombre es necesario'
        })
    }else{
        res.json(body)

    }

})

app.put('/usuario/:id', function (req, res) {//actualizar registros

    let id = req.params.id;

    res.json({
        id
    })
})

app.delete('/usuario', function (req, res) {//actualizar registros
  res.json('Delete usuario')
})
 
app.listen(process.env.PORT,()=>console.log(`Escuchando puerto ${process.env.PORT}`));