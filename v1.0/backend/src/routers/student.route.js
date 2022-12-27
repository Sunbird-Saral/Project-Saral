const express = require("express");
const router = express.Router();


const { ActionManager } = require("../actions/action-helper");
const {auth} = require("../middleware/auth")
const { GetStudentsandExamData } = require("../actions/schools/get-students-and-exam-data");


router.post("/fetchStudentsandExamsByQuery",auth, function (req, res, next) {
  let action = new GetStudentsandExamData(req.school,req.body);
  ActionManager.execute(action)
    .then((data) => {
      res.status(200).send({ success: true, data: data });
    })
    .catch((error) => {
      res.status(error.status || 400).send({ success: false, data: error.message });
    });
});

module.exports = router;
