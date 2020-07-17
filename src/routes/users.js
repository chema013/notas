const express = require('express'); 
const router = express.Router();
const User = require('../models/User'); //los .. indican subir un nivel en las carpetas
const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signin', passport.authenticate('local', { //authenticate manda llamar al metodo -local- creado en passport.js
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
})); 

router.post('/users/signup', async (req, res) => { //el async sirve para que se ejecuten cosas asincronas es decir como si fueran hilos
    const { name, email, password, confirm_password} = req.body; //req.body regresa los datos que se envian del formulario
    const errors = [];
    if(name.length <= 0) {
        errors.push({text: 'Please insert your name'});
    }
    if(password != confirm_password) {
        errors.push({text: 'Password do not match'});
    }
    if(password.length < 4) {
        errors.push({text: 'Password must be at least 4 characters'});
    }
    if (errors.length > 0) {
        res.render('users/signup', {errors, name, email, password, confirm_password});
    }else{
        const emailUser = await User.findOne({email: email});
        if(emailUser) {
            req.flash('error_msg', 'The Email is alredy in use');
            res.redirect('/users/signup');
        }else{
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You are registered');
            res.redirect('/users/signin');
        }
    }
});

router.get('/users/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router; 