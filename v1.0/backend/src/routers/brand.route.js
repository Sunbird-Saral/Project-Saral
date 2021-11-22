const express = require('express')
const router = new express.Router()
const { auth } = require('../middleware/auth')
const School = require('../models/school')
const Brand = require('../models/brand')


router.post('/brand?', auth, async (req, res) => {
    try { 
        const inputKeys = Object.keys(req.body)
        const allowedUpdates = ['logoImage', 'themeColor1', 'themeColor2', 'appName']
        const isValidOperation = inputKeys.every((input) => allowedUpdates.includes(input))
   
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invaid Input' })
        }
        let brandExist = {}
        
        if (!req.query.default) {
            let lookup = {
                schoolId: req.school.schoolId
            }      
            let school = await School.findOne(lookup)
            brandExist = await Brand.find({ state: school.state })
                req.body.state = school.state
        } else {
            let defaultBrand = await Brand.find()
            brandExist = defaultBrand.filter((brand) => !brand.state);
        }
    
        if (brandExist.length < 1) {
                await Brand.create(req.body)
            res.status(201).send({ message: "Brand has been created successfully ." })
        } else {
            res.status(403).send({ message: "Brand already exist." })
            }
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/brand', auth, async (req, res) => {
    try { 

        const school = await School.findOne({ schoolId: req.school.schoolId })
        const brand = await Brand.findOne({ state: school.state }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, state: 0 })
        if (brand) {
            res.status(200).send(brand)
        } else {
            const defaultBrand = await Brand.find().lean()
            const brandRes = defaultBrand.filter((brand) => !brand.state);
            if (brandRes.length) {
                let resultObj = {
                    appName: brandRes[0].appName,
                    themeColor1: brandRes[0].themeColor1,
                    themeColor2: brandRes[0].themeColor2,
                    logoImage: brandRes[0].logoImage
                }
                res.status(200).send(resultObj)
            } else {
            res.status(404).send({ error: "Brand does not exist." })
        }
        }

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/brand/default', async (req, res) => {
    try {

        const brand = await Brand.find().lean()
        if (brand.length) {
        const brandRes = brand.filter((brand) => !brand.state);
            if (brandRes.length) {
        let resultObj = {
            appName: brandRes[0].appName,
            themeColor1: brandRes[0].themeColor1,
            themeColor2: brandRes[0].themeColor2,
            logoImage: brandRes[0].logoImage
        }
            res.status(200).send(resultObj)
        } else {
            res.status(404).send({ error: "Brand does not exist." })
        }
        }else{
            res.status(404).send({ error: "Brand does not exist." })
        } 
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/brand',auth, async (req, res) => {
    try { 
        const school = await School.findOne({schoolId: req.school.schoolId})
        const brand = await Brand.deleteOne({state: school.state},{ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 ,state:0 })
        if(brand.deletedCount > 0){
            res.status(200).send({message: "Brand has been deleted successfully."})
        }else{
            res.status(404).send({error: "Brand does not exist."})
        }
    
    } catch (e){   
        res.status(400).send(e)
    }
})

router.put('/brand',auth, async (req, res) => {
    try { 
        const inputKeys = Object.keys(req.body)
        const allowedUpdates = ['logoImage', 'themeColor1','themeColor2', 'appName']
        const isValidOperation = inputKeys.every((input) => allowedUpdates.includes(input))
   
        if(!isValidOperation) {
            return res.status(400).send({ error: 'Invaid Input' })
        }
       
        const school = await School.findOne({schoolId: req.school.schoolId})
        let update = req.body
        const updateBrand = await Brand.update({state: school.state},update)

        res.status(200).send({message: "Brand has been updated successfully."})
    
    } catch (e){   
        res.status(400).send(e)
    }
})
module.exports = router