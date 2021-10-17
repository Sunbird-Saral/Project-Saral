const express = require('express')
const router = new express.Router()
const { auth } = require('../middleware/auth')
const School = require('../models/school')
const Brand = require('../models/brand')


router.post('/brand',auth, async (req, res) => {
    try { 
        const inputKeys = Object.keys(req.body)
        const allowedUpdates = ['logoImage', 'themeColor1','themeColor2', 'Appname']
        const isValidOperation = inputKeys.every((input) => allowedUpdates.includes(input))
   
        if(!isValidOperation) {
            return res.status(400).send({ error: 'Invaid Input' })
        }
    
        let lookup={
            schoolId: req.school.schoolId
        }
       console.log(lookup)
        const school = await School.findOne(lookup)
        console.log("hi",school)
        req.body.state = school.state
        await Brand.create(req.body)
        res.status(201).send({message:"Brand create successfully ."})
    
    } catch (e){   
        res.status(400).send(e)
    }
})

router.get('/brand',auth, async (req, res) => {
    try { 

        const school = await School.findOne({schoolId: req.school.schoolId})
        const brand = await Brand.findOne({state: school.state},{ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 ,state:0 })
        console.log(brand)
        res.status(200).send(brand)
    
    } catch (e){   
        res.status(400).send(e)
    }
})

router.put('/brand',auth, async (req, res) => {
    try { 
        const inputKeys = Object.keys(req.body)
        const allowedUpdates = ['logoImage', 'themeColor1','themeColor2', 'Appname']
        const isValidOperation = inputKeys.every((input) => allowedUpdates.includes(input))
   
        if(!isValidOperation) {
            return res.status(400).send({ error: 'Invaid Input' })
        }
       
        const school = await School.findOne({schoolId: req.school.schoolId})
        let update = req.body
        const updateBrand = await Brand.update({state: school.state},update)

        res.status(200).send({message: "Brand updated successfully."})
    
    } catch (e){   
        res.status(400).send(e)
    }
})
module.exports = router