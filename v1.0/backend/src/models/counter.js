const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    counter_value: { 
        type: Number
    }

})

counterSchema.statics.getValueForNextSequence = async (counterOfName) => {
    let match ={ 
        _id: counterOfName
    }
    let update = { $inc: {counter_value: 1} }
    let options = { upsert: true, 'new': true  } ;
    const seqData = await Counter.findOneAndUpdate(match,update,options)
    return seqData.counter_value
}


const Counter = mongoose.model('counter', counterSchema)

module.exports = Counter
