let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let circuitSchema = new Schema({
    circuitId:String,
    circuitName:String,
    url:String,
    imageUrl:String,
    desc:String,
    location:{
        locality:{
            type:String
        },
        country:{
            type:String,
        },
        lat:{
            type:Number,
        },
        long:{
            type:Number,
        }
    }
});

let Circuits= mongoose.model('Circuit',circuitSchema,'Circuit');
module.exports=Circuits;
