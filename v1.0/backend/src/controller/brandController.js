const School = require('../models/school')
const Brand = require('../models/brand')


exports.fetchBrandData = async (req, res, next) => {
    try {
        const school = await School.findOne({ schoolId: req.school.schoolId })
        const brand = await Brand.findOne({ state: school.state, schoolId: school.schoolId }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, state: 0 })

        if (brand && typeof brand == "object") {
            res.status(200).json(brand)
        } else {
            const defaultBrand = await Brand.find({ state: { $exists: false } }, { appName: 1, themeColor1: 1, themeColor2: 1, logoImage: 1, _id: 0 }).lean()

            if (defaultBrand && defaultBrand.length) {
                let resultObj = defaultBrand[0]
                res.status(200).json({
                    status: 'success',
                    ...resultObj
                });
            } else {
                res.status(404).json({
                    status: "fail",
                    error: "Brand does not exist."
                })
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
        const brand = await Brand.find({ state: { $exists: false } }, { appName: 1, themeColor1: 1, themeColor2: 1, logoImage: 1, _id: 0 }).lean()
        if (brand.length) {
            let resultObj = brand[0]
            res.status(200).json({ status: 'success', ...resultObj })

        } else {
            res.status(404).json({
                status: "fail",
                error: "Brand does not exist."
            })
        }

    } catch (e) {
        res.status(400).json({
            status: 'fail',
            e
        });
    }
}