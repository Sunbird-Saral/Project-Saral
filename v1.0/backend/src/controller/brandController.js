const Schools = require('../models/school')
const Brands = require('../models/brand')


exports.fetchBrandData = async (req, res, next) => {
    try {
        const school = await Schools.findOne({ schoolId: req.school.schoolId })

        const brand = await Brands.findOne({ state: school.state }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, state: 0 })

        if (brand && typeof brand == "object") {
            res.status(200).json(brand)
        } else {
            const defaultBrand = await Brands.find({ state: { $exists: false } }, { appName: 1, themeColor1: 1, themeColor2: 1, logoImage: 1, _id: 0 }).lean()

            if (defaultBrand && defaultBrand.length) {
                let resultObj = defaultBrand[0]
                res.status(200).json({
                    ...resultObj
                });
            } else {
                res.status(404).json({
                    error: "Brand does not exist."
                })
            }
        }

    } catch (e) {
        res.status(400).json({
            e
        });
    }
}

exports.fetchDefaultBrandData = async (req, res, next) => {
    try {
        const brand = await Brands.find({ state: { $exists: false } }, { appName: 1, themeColor1: 1, themeColor2: 1, logoImage: 1, _id: 0 }).lean()
        if (brand.length) {
            let resultObj = brand[0]
            res.status(200).json({ ...resultObj })

        } else {
            res.status(404).json({
                error: "Brand does not exist."
            })
        }

    } catch (e) {
        res.status(400).json({
            e
        });
    }
}