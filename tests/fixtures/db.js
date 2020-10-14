const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')


//Users
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Lola',
    email: 'Tomisin@mercurie.ng',
    password: 'my56sense12great',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Ayo',
    email: 'Tomi@mail.ng',
    password: 'my56sense12great',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}//5f87851a17290a6b8fcc04c8

//Tasks

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Hello Hacker',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Hello Dev',
    completed: false,
    owner: userTwo._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Hello Ops',
    completed: false,
    owner: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    
     await new User(userOne).save()
     await new User(userTwo).save()

     await new Task(taskOne).save()
     await new Task(taskTwo).save()
     await new Task(taskThree).save()
}


module.exports = {
    setupDatabase,
    userOneId,
    userOne,
    userTwo,
    taskOne,
    taskTwo
}