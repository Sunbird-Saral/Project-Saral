const School = require('../models/school')
const Brand = require('../models/brand')


exports.createBrandData = async (req, res, next) => {
    try {
        const inputKeys = Object.keys(req.body)

        let brandExist = {}

        if (!req.query.default) {
            let lookup = {
                schoolId: req.school.schoolId
            }
            let school = await School.findOne(lookup)
            brandExist = await Brand.find({ state: school.state, schoolId: school.schoolId })
            req.body.state = school.state
            req.body.schoolId = school.schoolId
        } else {
            let defaultBrand = await Brand.find()
            brandExist = defaultBrand.filter((brand) => !brand.state);
        }

        if (brandExist.length < 1) {
            await Brand.create(req.body)
            res.status(201).json({ message: "Brand has been created successfully ." })
        } else {
            res.status(403).json({ message: "Brand already exist." })
        }

    } catch (e) {
        res.status(400).json({
            status: 'fail',
            e
        });

    }
}

exports.fetchBrandData = async (req, res, next) => {
    try {
        const school = await School.findOne({ schoolId: req.school.schoolId })
        const brand = await Brand.findOne({ state: school.state, schoolId: school.schoolId }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, state: 0 })
        if (brand) {
            res.status(200).json({
                status: 'success',
                brand
            });
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

                res.status(200).json({
                    status: 'success',
                    ...resultObj
                });
            } else {
                res.status(404).json({ message: "Brand does not exist." })
            }
        }

    } catch (e) {
        res.status(400).json({
            status: 'fail',
            e
        });
    }
}

exports.fetchDefaultBrandData = async (req, res, next) => {
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
                res.status(200).json({ status: 'success', ...resultObj })
            } else {
                res.status(404).json({ message: "Brand does not exist." })
            }
        } else {
            res.status(404).json({ message: "Brand does not exist." })
        }


    } catch (e) {
        res.status(400).json({
            status: 'fail',
            e
        });
    }
}

exports.deleteBrandData = async (req, res, next) => {
    try {
        const school = await School.findOne({ schoolId: req.school.schoolId })
        const brand = await Brand.deleteOne({ state: school.state }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, state: 0 })
        if (brand.deletedCount > 0) {
            res.status(200).json({ status: 'success', message: "Brand has been deleted successfully." })
        } else {
            res.status(404).json({ message: "Brand does not exist." })
        }

    } catch (e) {
        res.status(400).json({
            status: 'fail',
            e
        });
    }
}

exports.updateBrandData = async (req, res, next) => {
    try {
        const inputKeys = Object.keys(req.body)
        const allowedUpdates = ['logoImage', 'themeColor1', 'themeColor2', 'appName']
        const isValidOperation = inputKeys.every((input) => allowedUpdates.includes(input))

        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invaid Input' })
        }

        const school = await School.findOne({ schoolId: req.school.schoolId })
        let update = req.body
        let updateData = await Brand.update({ state: school.state }, update)

        if(updateData.nModified == 1 ){
            res.status(200).json({ status: 'success', message: "Brand has been updated successfully." })
        }else{
            res.status(404).json({ status: 'fail', message: "Brand has not been updated successfully." })

        }

    } catch (e) {
        res.status(400).json({
            status: 'fail',
            e
        });

    }
}