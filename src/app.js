require('./config/config.js');
const express = require('express')
const app = express()
const path=require('path')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const session = require('express-session')
const jwt = require('jsonwebtoken');




const directoriopublico=path.join(__dirname,'../public');
const directorioNodeModules=path.join(__dirname,'../node_modules');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
 

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))


/*
	* MIDDLEWARE
*/
app.use((req,res,next)=>{
	// validacion con jwt
	let token =localStorage.getItem('token');
	console.log(token);
	if(token != null && token != '' && token != undefined)
	{
		jwt.verify(token, 'tdea-curso-virtual', function(err, decoded) {
			resultado=decoded;
			console.log(decoded);
			if(err)
			{
				return next()
			}
			if(decoded)
			{
				res.locals.sesion=true
				res.locals.usuario=decoded.data.nombre
				res.usuario=decoded.data
			}
			
		});
	}
	next()
	// Validación con session 
	/*
		console.log(req.session.nombre)
		if(req.session.usuario)
		{
			res.locals.sesion=true
			res.locals.usuario=req.session.nombre
		}
		next()
	*/
});

app.use(express.static(directoriopublico));

app.use('/js',express.static(directorioNodeModules + '/jquery/dist'));
app.use('/js',express.static(directorioNodeModules + '/popper.js/dist'));

app.use(bodyParser.urlencoded({extended:false}));

app.use(require('./routes/index.js'));


mongoose.connect(process.env.URLDB, {useNewUrlParser: true},
	(err,resultado) =>{
		if(err)
		{
			return console.log('Error');
		}
		console.log('Conectado');
	});

/*
	 * SUBIR EL SERVICIO
*/
app.listen(process.env.PORT, ()=>{
	console.log('Escuchando en el puerto 3000')
})

