const express = require('express');
const router = express.Router();
const post = require('../models/post');
const user = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const skills = require('../models/skills');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;


/**
 * GET /
 * check Login
*/
const authMiddleware = (req,res, next) => {

    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: 'You are not logged in'});
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        next();
    }catch(error){
        res.status(401).json({message: 'You are not logged in'});
    }
    
};



//Router
/**
 * GET /
 * Admin Login page
*/
router.get('/admin', async (req,res) => {

    try{
        const locals = {
            title: "Admin",
            description: "simple blog using node js langauge"
        }


        res.render('admin/index',{locals, layout: adminLayout});
    } catch (error) {
        console.log(error)
    }
});


/**
 * GET /
 * Admin check login
*/

router.post('/admin', async (req,res) => {

    try{
        
        const locals = {
            title: "Admin",
            description: "simple blog using node js langauge",
            message : ""
        }


        const {username, password} = req.body;
        
        const _user = await user.findOne({username});
        if(!_user){
            //return res.status(404).json({message: 'Invalide credentials'})
            locals.message ='Invalide user';
            res.render('admin/index',{locals, layout: adminLayout});
        }

        const ispasswordvalid = await bcrypt.compare(password, _user.password);
        if(!ispasswordvalid){
            locals.message ='password is not valid';
            res.render('admin/index',{locals, layout: adminLayout});
            //return res.status(404).json({message: 'password is not valid'});
        }


        const token = jwt.sign({userId: _user._id},jwtSecret);
        /*const token = jwt.sign({userId: _user._id},jwtSecret ,process.env.JWT_SECRET, {
            expiresIn: 3600
        });*/
        res.cookie('token',token,{httpOnly: true});
        res.redirect('/dashboard');

    } catch (error) {
        console.log(error)
    }   
});


/**
 * GET /
 * Admin dashbord
*/

router.get('/dashboard',authMiddleware, async (req,res) => {

    try{
        const locals = {
            title: "Dashboard",
            description: "simple blog using node js langauge"
        }

        const data = await post.find();
        const dataskills = await skills.find();
        res.render('admin/dashboard',{
            locals,
            data,
            dataskills,
            layout: adminLayout
        });
    }catch (error) {
        console.log(error);
    }

});


/**
 * GET /
 * Admin create new post
*/

router.get('/add-post',authMiddleware, async (req,res) => {

    try{
        const locals = {
            title: "Add Post",
            description: "simple blog using node js langauge"
        }

        const data = await post.find();
        res.render('admin/add-post',{
            locals,
            layout: adminLayout
        });
    }catch (error) {
        console.log(error);
    }

});


/**
 * POST /
 * Admin create new post
*/

router.post('/add-post',authMiddleware, async (req,res) => {

    try{
        console.log(req.body);

        try{
            const newPost = new post({
                title: req.body.title,
                body: req.body.body
            })

            await post.create(newPost);
            res.redirect('/dashboard');

        }catch(error){
            console.log(error);
        }

        res.redirect('/dashboard');
    }catch (error) {
        console.log(error);
    }

});



/**
 * GET /
 * Admin create new post
*/

router.get('/edit-post/:id',authMiddleware, async (req,res) => {

    try{

        const locals = {
            title: "Edit Post",
            description: "simple blog using node js langauge"
        }
        const data = await post.findOne({_id: req.params.id});
        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        });

    }catch (error) {
        console.log(error);
    }

});




/**
 * PUT /
 * Admin create new post
*/

router.put('/edit-post/:id',authMiddleware, async (req,res) => {

    try{
        await post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/edit-post/${req.params.id}`);

    }catch (error) {
        console.log(error);
    }

});




/*
router.post('/admin', async (req,res) => {

    try{
        const {username, password} = req.body;
        console.log(req.body);

        if(req.body.username === 'admin' && req.body.password === 'password'){
            res.send('you are logged in');
        }
        else{
            res.send('Wrong username or password');
        }


        //res.render('admin/index',{locals, layout: adminLayout});
        
    } catch (error) {
        console.log(error)
    }   
});
 
*/


/**
 * GET /
 * Admin Register
*/
router.post('/register', async (req,res) => {

    try{
        const {username, password} = req.body;
        
        const hashedpassword = await bcrypt.hash(password, 10);
        try{
            const _user = await user.create({username, password: hashedpassword});
            res.status(201).json({message: 'User created successfully',_user});
        }catch (error) {
            if(error.code === 11000){
                res.status(409).json({message: 'Username already exists'});
            }
            res.status(500).json({message: 'Internal server error'});
        }
        
 
    } catch (error) {
        console.log(error)
    }
    
});


/**
 * DELETE /
 * Admin delete post
*/

router.delete('/delete-post/:id',authMiddleware, async (req,res) => {

    try{
        await post.deleteOne({_id: req.params.id});

        res.redirect('/dashboard');

    }catch (error) {
        console.log(error);
    }

});


/**
 * GET /
 * Admin logout
*/

router.get('/loyout', (req, res)=> {
    res.clearCookie('token');
    //res.json({message: 'logout successful'});
    res.redirect('/')
});




module.exports =router;