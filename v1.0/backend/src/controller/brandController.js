const School = require('../models/school')
const Brand = require('../models/brand')


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