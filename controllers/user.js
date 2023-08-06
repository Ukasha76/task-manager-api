const User = require('../models/user')
const sharp = require('sharp')

require('../db/mongoose')

const showMe = async (req, res) => {
    res.send(req.user)

}
const signup = async (req, res) => {
    try {

        const user1 = new User(req.body)
        const token = await user1.generateAuthToken()
        res.status(201).send({ user1, token })
    }
    catch (e) {
        res.status(400).send('Bad request')
    }

}
const login = async (req, res) => {
    try {
        const user1 = await User.findbyCredentials(req.body.email, req.body.password)
        const token = await user1.generateAuthToken()
        res.send({ user1, token })
    } catch (e) {
        res.status(400).send()
    }

}
const logout = async (req, res) => {
    try {

        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)//in this we are basically removing the user token 

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
}
const logoutAll = async (req, res) => {
    try {
        req.user.tokens = []//empty all tokens
        await req.user.save()
        res.send('Logout Successfully!')
    } catch (e) {
        res.status(500).send()
    }
}

const del = async (req, res) => {
    try {
       await req.user.deleteOne()
        res.send(req.user)
    }
    catch (e) {
        res.status(500).send()
    }
}
const edit = async (req, res) => {
    const allowed = ['name', 'password', 'email']
    const Updates = Object.keys(req.body);
    const isAllowed = Updates.every((update) => allowed.includes(update))


    if (!isAllowed) {
        return res.status(400).send({ error: 'Invalid updates' })
    }


    try {
        // const isUser = await User.findById(req.user._id)
      
        Updates.forEach((update) => req.user[update] = req.body[update])
      await req.user.save()
        res.status(202).send(req.user)
    }
    catch (e) {
        res.status(500).send()
    }
}
const uploadAvatar =async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width:250,height:250 }).png().toBuffer()
    req.user.avatar= buffer

    
    await req.user.save()
    res.send()
}
const delAvatar=async (req, res) => {
    
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}
const showAvatar= async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(400).send()
    }
}
module.exports = {
    edit,
    del,
    login,
    signup,
    showMe,
    uploadAvatar,
    showAvatar,
    logout,
    delAvatar,
    logoutAll
}