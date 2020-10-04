const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)

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