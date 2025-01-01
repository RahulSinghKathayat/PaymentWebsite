const zod = require("zod")
const express = require("express")
const { User, Account } = require("../db")
const {JWT_SECRET} = require("../config")
const router = express.Router()
const jwt = require("jsonwebtoken")
const { authMiddleware } = require('../middleware')


const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})


router.post('/signup', async (req, res)=>{
    const { success } = signupBody.safeParse(req.body)

    if(!success){
        return res.status(411).json({
            msg: "emailAddress already exist/incorrect inputs   "
        })
    }
    
    const existingUser=await User.findOne({
        username: req.body.username
    })

    if(existingUser){
        return res.status(411).json({
            msg: "Already existing User"
        })
    }

    const user = await User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    })
    const userId = user._id


    await Account.create({
        userId,
        balance: 1 + Math.random()*10000
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET)   

    res.json({
        msg:"User created successfully",
        token: token
    })
})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post('/signin', async function(req, res){
    const {success} = signinBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message:"Incorrect Input"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })


    if(user){
        const token = jwt.sign({
            userId: user._id,
        }, JWT_SECRET)

        res.json({
            token: token
        })
        return
    }

    res.status(411).json({
        message: "error while logging-in"
    })
})



const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

router.put('/', authMiddleware, async function(req, res){
    const {success} = updateBody.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message: "error occur while updating"
        })
    }
    await User.updateOne(req.body,{
        id: req.userId
    })
    res.json({
        message: "updated successfully"
    })
})


router.get('/bulk', async (req,res)=>{
    const filter = req.query.filter || "";
    const users = await User.find({
        $or:[{
            firstName:{
                "$regex": filter
            }
        },{
            lastName:{
                "$regex": filter
            }
        }]
    })
    res.json({
        user: users.map(user =>({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;