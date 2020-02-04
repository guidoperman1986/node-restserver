//puerto

process.env.PORT = process.env.PORT || 3000;

//Entorno

process.env.NODE_ENV =  process.env.NODE_ENV || 'dev'

//Base de datos

let urlDB;

if (process.env.NODE_ENV === 'dev'){    
    urlDB='mongodb://localhost:27017/cafe'
}else{
    urlDB=process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//Vencimiento token

process.env.CADUCIDAD_TOKEN = '48h';

//SEED de autenticacion

process.env.SEED = process.env.SEED || 'este es el desarrollo'

//client id para login con google
process.env.CLIENT_ID = process.env.CLIENT_ID || '21318308726-pd83klnc0qipit5o84nf4mr5fqsep8do.apps.googleusercontent.com'