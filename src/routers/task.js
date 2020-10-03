const express = require('express')
const router = new express.Router()
const Tasks = require('../models/task')
const auth =require('../middleware/auth');
const User = require('../models/user');


// GET tasks?completed==true
// GET /tasks? limit=10&skip=0
// GET /asks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] =='desc' ? -1 : 1
        console.log(sort)
    }
    try {
        const user = await User.findById(req.user._id)
        await user.populate({
            path: 'userTasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(user.userTasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task =await Tasks.findOne({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }
}) 

router.post('/tasks', auth, async (req, res) => {
    const task = new Tasks({
        ...req.body,
        owner: req.user._id
    }) 
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/task/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed', 'description']
    const isValid = updates.every(update => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(400).send({ error: 'Invalid Update' })
    }
    try {
        const task = await Tasks.findOne({ _id: req.params.id, owner: req.user._id})    
        
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save()

        res.send(task)
    } catch (e) {
        return res.status(400).send(e)
    }
})
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Tasks.findOneAndDelete({ _id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router