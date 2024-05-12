const express = require('express');
const router = express.Router();
const post = require('../models/post');
const skills = require('../models/skills');
const axios = require('axios');

//Router
/**
 * GET /
 * HOME
 */
router.get('', async (req,res) => {
    try{
        const locals = {
            title: "NodeJs Blog",
            description: "simple blog using node js langauge"
        }

        let perPage = 6;
        let page = req.query.page || 1;

        const data = await post.aggregate([{ $sort: {createdAt: -1}}])
        .skip(perPage*page -perPage)
        .limit(perPage)
        .exec()

        const count = await post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage);

        res.render('index',{
            locals , 
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });

    } catch (error) {
        console.log(error)
    }

    
});


/*
router.get('', async (req,res) => {
    //res.send('Hello World!');
    const locals = {
        title: "NodeJs Blog",
        description: "simple blog using node js langauge"
    }

    try{
        const data = await post.find();
        res.render('index',{locals , data});
    } catch (error) {
        console.log(error)
    }

    
});
*/

/**
 * GET /
 * Post
*/

router.get('/post/:id', async (req,res) => {
    //res.send('Hello World!');


    try{

        let slug = req.params.id;
        const data = await post.findById({_id: slug});

        const locals = {
            title: data.title,
            description: "simple blog using node js langauge"
        }
        res.render('post',{
            locals , 
            data,
            currentRoute: `/post/${slug}`
        });
    } catch (error) {
        console.log(error)
    }

    
});


/**
 * GET /
 * post -searchterm
*/
router.post('/search', async (req,res) => {
    

    try{
        const locals = {
            title: "Search",
            description: "simple blog using node js langauge"
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
        const data = await post.find({
            $or: [
                {title: {$regex: new RegExp(searchNoSpecialChar,'i')}},
                {body: {$regex: new RegExp(searchNoSpecialChar,'i')}}
            ]
        });

        res.render('search',{
            data,
            locals,
            currentRoute: '/'
        })

        // const data = await post.find();
        //res.send(searchTerm);
    } catch (error) {
        console.log(error)
    }

    
});



router.get('/abaout', async(req,res) => {
    //res.send('Hello World!');
    try{
        const dataskill = await skills.find();
        res.render('abaout',{
            dataskill,
            currentRoute: '/abaout'
        });


    }catch(error){
        console.log(error);
    }
});

router.get('/contact', (req,res) => {
    //res.send('Hello World!');

    res.render('contact',{
        currentRoute: '/contact'
    });
});


/**
 * chatbot
 */
router.get('/chatbot', (req,res) => {
    //res.send('Hello World!');

    res.render('chatbot',{
        currentRoute: '/chatbot'
    });
});



/*router.post('/chatbot', async (req, res) => {
    try {
        const newMessage = req.body.message;
        console.log(newMessage);

        // Envoi de la requête POST au chatbot Python  http://localhost:3000
        const chatbotResponse = await axios.post('http://localhost:3000/chatbot', {
            message: newMessage
        });

        console.log(chatbotResponse.data);

        // Gérer la réponse du chatbot si nécessaire

        res.status(200).send(chatbotResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});*/



module.exports = router;



/*function insertSkillData (){
    skills.insertMany([
        {
            Skillname: "Python"
        },
        {
            Skillname: "Java"
        },
        {
            Skillname: "C"
        },
        {
            Skillname: "R"
        },
        {
            Skillname: "Machine Learning"
        },
        {
            Skillname: "C++"
        },
        {
            Skillname: "C#"
        },
        {
            Skillname: "MatLab"
        },
        {
            Skillname: "NodeJs"
        },
        {
            Skillname: "MongoDB"
        },
        {
            Skillname: "Data Science"
        }
        
    ]);
    
}
insertSkillData();*/





/*
function insertPostData (){
    post.insertMany([
        {
            title: "My Journey into Web Development",
            body: "I'm excited to start my journey into web development. There's so much to learn and explore!"
        },
        {
            title: "Exploring JavaScript Frameworks",
            body: "Currently, I'm exploring different JavaScript frameworks like React, Vue, and Angular. They all have their unique features and advantages."
        },
        {
            title: "Learning Node.js and Express",
            body: "I've started diving into Node.js and Express. It's fascinating to build server-side applications and APIs using JavaScript."
        },
        {
            title: "Creating RESTful APIs",
            body: "I'm learning how to create RESTful APIs with Node.js and Express. It's essential for building scalable and maintainable applications."
        },
        {
            title: "Mastering React Components",
            body: "React components are powerful building blocks for UI development. I'm focusing on mastering different types of React components and their usage."
        },
        {
            title: "Exploring Data Visualization with D3.js",
            body: "Data visualization is an important aspect of web development. I'm exploring D3.js for creating interactive and engaging visualizations."
        },
        {
            title: "Building Responsive Web Applications",
            body: "Creating responsive web applications ensures a great user experience across different devices and screen sizes. It's a crucial skill for modern web developers."
        },
        {
            title: "Contributing to Open Source Projects",
            body: "I'm passionate about contributing to open source projects. It's a great way to collaborate with others, learn from experienced developers, and give back to the community."
        }
    ]);
    
}
insertPostData();

*/