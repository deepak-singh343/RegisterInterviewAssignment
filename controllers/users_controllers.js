const User = require('../models/user');
const fs=require('fs');
const path=require('path');
module.exports.create =function (req, res)                                  //creating a user
{
    try{
        User.uploadedAvatar(req, res, async function (err) 
        {
            if (err)
                    req.flash('error', err);
            if (req.body.password != req.body.confirm_password)             //if password do not match redirect back
            {                    
                req.flash('error', 'Passwords do not match');
                return res.redirect('back');
            }
            let user=await User.findOne({ email: req.body.email });          //find user by email
            if (!user)                                                   //if user doesnt exist create the user
            {
                let newUser=await User.create(req.body);                        //create new user 
                if (req.file)                                           //if uploaded file exists
                {
                    if(newUser.photo)                                 //if user has already existing profile picture then remove existing one
                    {
                        fs.unlinkSync(path.join(__dirname,'..',newUser.avatar));
                    }
                    newUser.avatar=User.avatarPath+'/'+req.file.filename;        //add profile picture to the new user
                }
                newUser.save();
                req.flash('success', 'Account created, Please login to continue!');
                return res.redirect('back');
            } 
            else 
            {                                                      //if user already has an account redirect him back
                req.flash('error', 'You already have an account, Please login to continue!');
                return res.redirect('back');
            }
        })
    }
    catch (err) 
    {
        req.flash('error', err);
        return;
    }      
}

module.exports.signUp = function (req, res)              //if someone hit url localhost/8000/users/sign_up
{                         
    if (req.isAuthenticated()) 
    {
        return res.redirect('/users/home');                     //if user is logged in then redirect him to homepage
    }
    return res.render('sign_up', {
        title: " Sign Up"                              //else if user is not logged in then redirect him to signup page
    })
}

module.exports.signIn = function (req, res)                 //if someone hit url localhost/8000/users/sign_inp
{                           

    if (req.isAuthenticated()) 
    {
        return res.redirect('/users/home');                     //if user is logged in then redirect him to homepage
    }
    return res.render('sign_up', {
        title: "Sign In",                             //else if user is not logged in then redirect him to signup page
    })
}
module.exports.createSession = function (req, res)              //create session
{                  
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/users/home');
}

module.exports.destroySession = function (req, res)              //logout
{                    
    req.logout();
    req.flash('success', 'Logged out!');
    return res.redirect('/');
}

module.exports.home = async function (req, res)                  //homepage
{                            
    try {
        let users = await User.find({});                              //find all the users
        return res.render('home', {
            title: "Homepage",
            users
        });
    } 
    catch (err) 
    {
        req.flash('error', err);
        return;
    }
}


