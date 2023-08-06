// const task = require('../models/task')
const Task = require('../models/task')
require('../db/mongoose')
const User = require('../models/user')
require('../db/mongoose')

// Get /tasks?completed=true
// Get /tasks?limit=10&skip=0
//setting pagination limit and skip 
//Get /tasks?sortBy = createdAt:desc
const showall= async (req, res) => {
    const match= {}
    const sort= {}
    if(req.query.completed){
        match.completed= req.query.completed==='true'
    }
    if(req.query.sortBy){
        const parsed = req.query.sortBy.split(':')
        sort[parsed[0]]=parsed[1]
    }

    try {
      await req.user.populate({
        path:'tasks',
        match,
        options:{
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }
      })
      if(!req.user.tasks.length){
        res.status(404).send()
      }
      res.send(req.user.tasks)
    } catch (e) {
        res.status(505).send()
    }

}

const insert=  async (req, res) => {
    const task = new Task ({
        ...req.body,
        owner:req.user._id
    })
 
    try {
        const task1 = await task.save()
        res.status(201).send(task1)
    } catch (e) {
        res.status(500).send()
    }
}

const show = async(req,res)=>{
    const{ id }=  req.params;
    try{
        const task = await Task.findOne({ _id: id , owner: req.user._id });
        if(!task){
        res.status(404).send()
       }
       res.send(task)
    }catch(e){
        res.status(500).send()
    }
}

const del = async(req,res)=>{
    const {id} = req.params;
    try{
        const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });
        if(!task)
        {
        res.status(404).send()
        }
        res.send('Task deleted successfully')
    }
    catch(e){
        res.status(500).send()
    }
}
const edit= async (req,res)=>{
    const allowed = ['description','completed']
    const updates = Object.keys(req.body)
    const isAllowed = updates.every((update)=>allowed.includes(update))
    if(!isAllowed){
        return res.status(400).send({error:'Invalid parameters'})
    }
    const { id } = req.params;
    try {
        const isTask= await Task.findOne({id ,owner: req.user._id})
        if (!isTask) {
            return res.status(404).send()  
        }
        updates.forEach((update)=>isTask[update]=req.body[update])
        updatedTask= await isTask.save()
        res.status(202).send(updatedTask)
    }
    catch (e) {
        res.status(500).send()
    }
}

module.exports ={
    edit,
    del,
    show,
   insert,
   showall
}