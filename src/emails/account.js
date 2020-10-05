const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'Tomisin.akinfemiwa@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const CancelMail = (email, name) => {
    sgMail.send({
        to: email, 
        from: 'Tomisin.akinfemiwa@gmail.com',
        subject: 'Sad to see you leave',
        text: `Good bye ${name}. We are sad to see you leave is there anything we could have done better?`
    })
}


module.exports ={
    sendWelcomeEmail,
    CancelMail
}