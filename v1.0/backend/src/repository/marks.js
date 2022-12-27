const Marks = require('../models/marks')

class MarksRepository {
  constructor() {
  }

  async findStudentMarks(data){
    try{
        console.log(data)
        const marks = await Marks.find(data)
        return marks

    }catch(error){
        console.log(error)
        throw error
    }
  }

//   async getSetFolderByName(project_id, folder_name) {
//     try {
//       const SetFolder = this.dbConnection.models.set_folder;
//       return await SetFolder.find({
//         delete: 0,
//         project_id: project_id,
//         folder_name: folder_name,
//       }).lean();
//     } catch (error) {
//       throw error;
//     }
//   }
}
exports.MarksRepository = MarksRepository;
