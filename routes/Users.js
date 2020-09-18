const express = require("express")
const users = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const nodemailer=require("nodemailer")

const User = require("../models/User")
users.use(cors())

process.env.SECRET_KEY = 'secret'


//REGISTER
users.post('/register', (req, res) => {
    const today = new Date()
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        //isVerified: req.body.isVerified,
        created: today
    }
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        //Send verification email
        if (!user) {
            const hash = bcrypt.hashSync(userData.password, 10)
                userData.password = hash
                User.create(userData)
                .then(user => {
                    let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    })
                    const url = `http://localhost:4200/users/confirmation/${token}`
                    //var nodemailer=require('nodemailer')
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'randomtest20209@gmail.com',
                          pass: 'Test@123'
                        }
                      });
                      console.log("Email: " + userData.email)
                    var mailOptions = {
                        from: 'r@gmail.com',
                        //replyTo: userData.email,
                        //to: 'myfriend@yahoo.com, myotherfriend@yahoo.com',
                        to: userData.email,
                        subject: 'Confirmation email',
                        //text: 'That was easy!'
                        html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
                      };
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                          res.send('Mail sending erro'+error)
                        } else {
                          console.log('Email sent: ' + info.response);
                          res.send('Email sent: ' + info.respones)
                        }
                      });

                    //res.json({ token: token })
                })
                .catch(err => {
                    res.send('error: ' + err)
                })
        } else {
            res.json({ error: 'User already exists' })
        }

    })
    .catch(err => {
        res.send('error: ' + err)
    })
})


//LOGIN
users.post('/login',(req,res) => {
    console.log('Route post')
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user=> {
        console.log('Verified: ' + user.isVerified)
        if(!user.isVerified){
            res.send('Please confirm your email to login')
        }
        else if(bcrypt.compareSync(req.body.password, user.password)) {
            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                expiresIn: 1440
            })
            res.json({token: token})
        }else{
            res.send('User does not exists(login)')
        }
    })
    .catch(err => {
        res.send('Route login error: ' + err)
    })
})

//PROFILE
users.get('/profile', (req,res)=> {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    console.log('Profile get request')
    User.findOne({
        where: {
            id: decoded.id,
            isVerified: true
        }
    })
    .then(user => {
        if(user) {
            res.json(user)
        }else{
            res.send('User does not exists (profile)')
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

users.get('/confirmation/:token', (req,res)=> {
    var decoded = jwt.verify(req.params.token, process.env.SECRET_KEY)
    console.log('Confirmation get request')
    User.update({isVerified:true}, {where:{id: decoded.id}})
    .catch(err => {
        res.send('error: ' + err)
    })
    return res.redirect('/profile')
})



module.exports = users
