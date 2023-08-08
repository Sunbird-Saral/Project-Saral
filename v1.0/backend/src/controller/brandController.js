const Schools = require('../models/school')
const Brands = require('../models/brand')


exports.fetchBrandData = async (req, res, next) => {
    try {
        const school = await Schools.findOne({ schoolId: req.school.schoolId , $comment: "Find School Data"})

        const brand = await Brands.findOne({ state: school.state ,  $comment: "Fetch Brand Data API For Find Brand according to state." }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })

        if (brand && typeof brand == "object") {
            res.status(200).json(brand)
        } else {
            const defaultBrand = await Brands.find({ state: { $exists: false } , $comment: "Fetch Brand Data API For Find Brand where state is not present."  }, { appName: 1, themeColor1: 1, themeColor2: 1,themeColor3: 1,themeColor4: 1,themeColor5: 1, logoImage: 1, _id: 0 }).lean()

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
        const brand = await Brands.find({ state: { $exists: false } ,$comment: "Fetch Default Brand Data API For Find Brand where state is not present."}, { appName: 1, themeColor1: 1, themeColor2: 1,themeColor3: 1,themeColor4: 1,themeColor5: 1, logoImage: 1,screenLabels:1, _id: 0 }).lean()
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