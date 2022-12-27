const Exam = require('../models/exams')

class ExamRepository {
  constructor() {
  }

  async getExamsData(data){
    try{
        const exams = await Exam.find(data,{ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
        return exams

    }catch(error){
        throw error
    }
  }

}
exports.ExamRepository = ExamRepository;
