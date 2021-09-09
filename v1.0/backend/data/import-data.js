const fs = require('fs');
const mongoose = require('mongoose');
const School = require('../src/models/school')
const ClassModel = require('../src/models/classModel')
const Student = require('../src/models/students')
const Exam = require('../src/models/exams')
const Marks = require('../src/models/marks')
const ROI = require('../src/models/roi')
const Counter = require('../src/models/counter')

const dotenv = require('dotenv');
dotenv.config({ path: './config/dev.env' });

const DB = process.env.MONGODB_URL
console.log(DB)
mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Connection successful'))
  .catch(function () {
    console.log('Promise Rejected');
  });
const school = JSON.parse(fs.readFileSync(`${__dirname}/schools.json`, 'utf-8'));
const student = JSON.parse(fs.readFileSync(`${__dirname}/students.json`, 'utf-8'));
const classes = JSON.parse(fs.readFileSync(`${__dirname}/classes.json`, 'utf-8'));
const exam = JSON.parse(fs.readFileSync(`${__dirname}/exams.json`, 'utf-8'));
const marks = JSON.parse(fs.readFileSync(`${__dirname}/marks.json`, 'utf-8'));
const roi = JSON.parse(fs.readFileSync(`${__dirname}/rois.json`, 'utf-8'));
const counter = JSON.parse(fs.readFileSync(`${__dirname}/counters.json`, 'utf-8'));

const importData = async () => {
  try {
    await School.create(school);
    await ClassModel.create(classes);
    await Student.create(student);
    await Exam.create(exam);
    await Marks.create(marks);
    await ROI.create(roi);
    await Counter.create(counter)

    console.log('Data successfully added');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await School.deleteMany();
    await Student.deleteMany();
    await ClassModel.deleteMany()
    await Exam.deleteMany();
    await Marks.deleteMany();
    await ROI.deleteMany();
    await Counter.deleteMany()
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();
