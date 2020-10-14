const request = require('supertest');
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')


beforeEach(setupDatabase)

test('Should sign up a new user', async () => {
   const response = await request(app).post('/users').send({
        name: 'Tomisin',
        email: 'Tomisin.akinfemiwa@gmail.com',
        password: 'MyPass777'
    }).expect(201)

    //Assert that the databease was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertion about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Tomisin',
            email: 'tomisin.akinfemiwa@gmail.com'
        },
        token: user.tokens[0].token
    })
    expect(user.passowrd).not.toBe('MyPass777')
})

test('Should log in ', async () =>{
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    
    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login user', async () =>{
    await request(app).post('/users/login').send({
        email: 'Hellow@mail.com',
        password: 'Helloahhh'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})


test('Should not get profile for unathenticated user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async() => {
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatars','tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'New User'
        })
        .expect(200)

        const user = await User.findById(userOneId)
        expect(user.name).toEqual(expect.any(String))
})

test('Should not update invalid fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Lagos'
        })
        .expect(400)
})