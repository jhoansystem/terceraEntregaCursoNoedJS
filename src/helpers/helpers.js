const hbs=require('hbs')
hbs.registerHelper('obtenerpromedio',(nota1,nota2,nota3)=> {
	return (nota1+nota2+nota3)/3
})


hbs.registerHelper('listar',(nota1,nota2,nota3)=> {
	try{
	listaEstudiante = require('./listado.json');
	}
	catch{
		listaEstudiante =[];
	}
	let texto= 'Lista de estudiante<br>'
	listaEstudiante.forEach(estudiante =>{
		texto=texto + 
				'Nombre ' + estudiante.nombre + '<br>' +
				'notas ' +
				'matematicas ' + estudiante.matematica + '<br>'+
				'ingles ' + estudiante.ingles + '<br>'+
				'programacion ' + estudiante.ingles + '<br><br>'
	})
	return texto;
})

hbs.registerHelper('mostrar',(listado)=> {
	
	let texto= '<form action="/eliminar" method="post"> Lista de estudiante<br>';
	console.log(listado);
	listado.forEach(estudiante =>{
		texto=texto + 
				'Nombre ' + estudiante.nombre + '<br>' +
				'notas ' +
				'matematicas ' + estudiante.matematica + '<br>'+
				'ingles ' + estudiante.ingles + '<br>'+
				'programacion ' + estudiante.ingles + '<br><br>' +
				'<button type="submit" class="btn btn-info" name="nombre" value="' + estudiante.nombre + '">Eliminar</button>'
	})
	texto=texto + '</form>'
	return texto;
})

