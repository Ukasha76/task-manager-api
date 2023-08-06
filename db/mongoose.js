const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(process.env.MONGOOSE, {
    useNewUrlParser: true,
})
.then(()=>{
  console.log('Mongoose connected')
})
.catch((e)=>{
  console.log('Error: ',e)
})