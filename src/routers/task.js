const express = require('express')
const router = new express.Router()
const Tasks = require('../models/task')
const { update } = require('../models/task')

router.get('/tasks', async (req, res) => {

    try {
        const tasks = await Tasks.find({})
        res.status(200).send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/task/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Tasks.findById(_id)
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/tasks', async (req, res) => {
    const task = new Tasks(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/task/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed', 'description']
    const isValid = updates.every(update => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(400).send({ error: 'Invalid Update' })
    }
    try {
        const task = await Tasks.findById(req.params.id)

        updates.forEach(update => task[update] = req.body[update]);
         await task.save()
        
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (e) {
        return res.status(400).send(e)
    }
})
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Tasks.findByIdAndDelete(req.params.id)
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router