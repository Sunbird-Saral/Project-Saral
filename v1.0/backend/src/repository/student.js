const Student = require('../models/students')

class StudentRepository {
  constructor() {
  }

  async getStudentsData(data){
    try{
        const student = await Student.find(data,{ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
        return student

    }catch(error){
        throw error
    }
  }

}
exports.StudentRepository = StudentRepository;
