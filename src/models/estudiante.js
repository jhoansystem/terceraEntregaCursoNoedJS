const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 
const estudianteSchema = new Schema({
  nombre: { 
    type:String,
    require:true,
    trim:true,
    enum:{values:['maria','jesus','teresa'],message:'El nombre no es valido'}
  },
  password: { 
    type:String,
    require:true
  },
   matematica: { 
  	type:Number,
    default:0,
    min:0,
    max:[5,'Ingrese un nùmero de matèmaticas menor a 5']
  },
   ingles: { 
  	type:Number,
    default:0,
    min:0,
    max:5
  },
   programacion: { 
  	type:Number,
    default:0,
    min:0,
    max:5
  }
});
estudianteSchema.plugin(uniqueValidator);


const Estudiante = mongoose.model('Estudiante', estudianteSchema);

module.exports =Estudiante