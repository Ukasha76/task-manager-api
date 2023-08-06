//will include validator funcation in descrption to check for the script tag to protect from the XSS
const mongoose = require('mongoose')
const validator = require('validator')


const { Schema } = mongoose

const taskSchema = new Schema({
    description : {
        type : String,
        required: true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type: Schema.Types.ObjectId,
        required:true,
        ref : 'User'
    }
  },
  {
    timestamps:true
  });
  


module.exports= mongoose.model('Task', taskSchema);