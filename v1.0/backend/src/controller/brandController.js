const schoolsSchema = require('../models/school')
const brandsSchema = require('../models/brand')
const logger = require('../logging/logger')


exports.fetchBrandData = async (req, res, next) => {
    try {
        const startTime = new Date()

        let connection = req.dbConnection;
        const Schools = connection.model('Schools', schoolsSchema)
        const Brands = connection.model('Brands', brandsSchema)

        const school = await Schools.findOne({ schoolId: req.school.schoolId , $comment: "Find School Data"})
        const brand = await Brands.findOne({ state: school.state ,  $comment: "Fetch Brand Data API For Find Brand according to state." }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })

        if (brand && typeof brand == "object") {
            const endTime = new Date();
            const executionTime = endTime - startTime;
    
            logger.info(`Execution time for Get Brand API : ${executionTime}ms`);
            res.status(200).json(brand)
        } else {
            const defaultBrand = await Brands.find({ state: { $exists: false } , $comment: "Fetch Brand Data API For Find Brand where state is not present."  }, { appName: 1, themeColor1: 1, themeColor2: 1, logoImage: 1, _id: 0 }).lean()

            if (defaultBrand && defaultBrand.length) {
                let resultObj = defaultBrand[0]
                const endTime2 = new Date();
                const executionTime2 = endTime2 - startTime;
        
                logger.info(`Execution time for Get Brand (DEFAULT) API : ${executionTime2}ms`);
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
        logger.warn(e)
        res.status(400).json({
            e
        });
    }finally {
        next()
      }
}

exports.fetchDefaultBrandData = async (req, res, next) => {
    try {
        const startTime = new Date();
        let connection = req.dbConnection;
        const Brands = connection.model('Brands', brandsSchema)
        const brand = await Brands.find({ state: { $exists: false } , $comment: "Fetch Brand Data API For Find Brand where state is not present."  }, { appName: 1, themeColor1: 1, themeColor2: 1, logoImage: 1, _id: 0 }).lean()
     
        if (brand.length) {
            let resultObj = brand[0]
            const endTime = new Date();
            const executionTime = endTime - startTime;
    
            logger.info(`Execution time for Get Default Brand API : ${executionTime}ms`);
            res.status(200).json({ ...resultObj })

        } else {
            res.status(404).json({
                error: "Brand does not exist."
            })
        }

    } catch (e) {
        logger.warn(e)
        res.status(400).json({
            e
        });
    } finally {
        next()
      }
}