//will include validator funcation in strings to check for the script tag to protect from the XSS

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const {welcomEmail , exitEmail}= require('../emails/account')
const { Schema } = mongoose
const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate:
    {
      validator: function (value) {
        return !value.includes('password')
      },
      message: 'Password does not  includes {Password}'
    }
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value)
      },
      message: 'Email is not correct'
    },
    
  },
  tokens: [
    {
          token: {
            type: String,
            required: true
          }
     }],
     avatar:{
      type: Buffer
     }
},{
  timestamps:true
});
userSchema.virtual('tasks',{
  ref:'Task',
  localField:'_id',
  foreignField:'owner'
})
//this method automatically called when we call res.send() > res.send()->call toJSON(to convert data into json format )->use use json to alter datas
userSchema.methods.toJSON= function(){
  const userobj = this.toObject()
  delete userobj.password
  delete userobj.tokens
  delete userobj.avatar
  return userobj
}
userSchema.methods.generateAuthToken = async function () {
  const { _id } = this
  const token = jwt.sign({ _id }, process.env.JWT_SECRET)//generating token

  this.tokens.push({token})
  
  
  await this.save()
  welcomEmail(this.email,this.name)
  return token
}


userSchema.statics.findbyCredentials = async (email, password) => {

  const user = await User.findOne({ email })

  if (!user) {
    throw Error('Invalid Email or Password')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Invalid Email or Password(1)')
  }
  return user

}
userSchema.pre('deleteOne',{ document: true, query: false }, async function (next) {
  // console.log('reached here')
  await Task.deleteMany({ owner: this._id })
  exitEmail(this.email,this.name)
   next()
 });
 

userSchema.pre('save', async function (next) {

  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})

const User = mongoose.model('User', userSchema);






module.exports = User