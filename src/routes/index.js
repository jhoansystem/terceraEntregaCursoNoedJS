const express = require('express')
const app = express()
const path=require('path')
const hbs=require('hbs')
const Estudiante=require('./../models/estudiante');
const directorioViews=path.join(__dirname,'../../template/views');
const directoriopartials=path.join(__dirname,'../../template/partials');
const bcrypt = require('bcrypt');
const session = require('express-session')
const jwt = require('jsonwebtoken');

require('./../helpers/helpers.js');

app.set('view engine','hbs')
app.set('views',directorioViews)
hbs.registerPartials(directoriopartials);

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
 

app.get('/',(req,res)=>{
	res.render('index',{
		titulo:'Inicio'
	})
})


 

 

app.post('/',(req,res)=>{
	let estudiante=new Estudiante({
		nombre: req.body.nombre,
		password: bcrypt.hashSync(req.body.password,10),
		matematica: req.body.matematica,
		ingles: req.body.ingles,
		programacion: req.body.programacion,
	});

	estudiante.save((err,resultado)=>{

		if(err)
		{
			res.render('indexpost',{
				resultado:err
			})
		}
		res.render('indexpost',{
				resultado:resultado
			})
	})
	
})


app.get('/vernotas',(req,res)=>{
	Estudiante.find({}).exec((err,resultado)=>{
		if(err)
		{
			console.log('Error al leer')
		}
		res.render('vernotas',{
				listado:resultado
			})
	})
})

app.get('/vernotas2',(req,res)=>{
	console.log('holaaaaaaaa')
	Estudiante.find({ingles :3}).exec((err,resultado)=>{
		if(err)
		{
			console.log('Error al leer')
		}
		res.render('vernotas',{
				listado:resultado
			})
	})
})

app.get('/actualizar',(req,res)=>{
	
	Estudiante.findById(req.session.usuario, (err,resultado)=>{
		console.log(resultado)
		console.log(req.session)
		if(err)
		{
			return console.log('Error al leer')
		}
		if(!resultado)
		{
			res.redirect('/');
			/*res.render('index',{
				titulo:'Inicio'
			})*/
		}
		res.render('actualizar',{
					nombre: resultado.nombre,
					matematica: resultado.matematica,
					ingles: resultado.ingles,
					
					programacion: resultado.programacion,

				})
		/*console.log(req.resultado);
		
		if(!resultado)
		{
			return res.render('ingresar',{
					mensaje: 'Usuario no encontrado'

				})
		}
		console.log(resultado)
		if(!bcrypt.compareSync(req.body.password,resultado.password))
		{
			return res.render('ingresar',{
					mensaje: 'Contraseña no encontrado'

				})
		}

		req.session.usuario=resultado._id;

			res.render('ingresar',{
					mensaje: 'Bienvenido'+resultado.nombre +req.session.usuario

				})*/
	})

})
app.post('/actualizar',(req,res)=>{
	Estudiante.findOneAndUpdate(
		{nombre: req.body.nombre}, 
		req.body, 

		{new:true,  runValidators: true, context: 'query' }, (err,resultado)=>{
		if(err)
		{
			console.log('Error al leer')
		}
		console.log(resultado)
		res.render('actualizar',{
				nombre: resultado.nombre,
				matematica: resultado.matematica,
				ingles: resultado.ingles,
				
				programacion: resultado.programacion,

			})
	})
})

app.post('/eliminar',(req,res)=>{
	Estudiante.findOneAndDelete({nombre: req.body.nombre}, req.body, (err,resultado)=>{
		if(err)
		{
			console.log('Error al leer')
		}
		if(!resultado)
		{
			res.render('eliminar',{
					nombre: 'Nombre no encontrado'

				})
		}
			res.render('eliminar',{
					nombre: resultado.nombre

				})
	})
})

app.post('/ingresar',(req,res)=>{

	Estudiante.findOne({nombre: req.body.nombre}, (err,resultado)=>{
		console.log(req.resultado);
		if(err)
		{
			return console.log('Error al leer')
		}
		if(!resultado)
		{
			return res.render('ingresar',{
					mensaje: 'Usuario no encontrado'

				})
		}
		console.log(resultado)
		if(!bcrypt.compareSync(req.body.password,resultado.password))
		{
			return res.render('ingresar',{
					mensaje: 'Contraseña no encontrado'

				})
		}
		/* data es variable según gustio de usuario*/
		let token =jwt.sign({
		  data: resultado
		}, 'tdea-curso-virtual', { expiresIn: '1h' });

	
		console.log(token);

		localStorage.setItem('token' , token);

		req.session.usuario=resultado._id;
		req.session.nombre=resultado.nombre;

			res.render('ingresar',{
					mensaje: 'Bienvenido'+resultado.nombre +req.session.usuario,
					sesion:true,
					nombre:resultado.nombre
				})
	})
	
})

app.get('/salir',(req,res)=>{
	/*
		* SALIR CON TOKEN
	*/
	localStorage.setItem('token' , '');
	/*
		* SALIR CON SESSION
	*/
	req.session.destroy((err)=>{
		if(err){ return console.log(err)}
	})
	res.redirect('/');
})

app.get('*',(req,res)=>{
	res.render('error',{
		titulo:'Error'
	})
})


module.exports=app;