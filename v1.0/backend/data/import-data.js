const fs = require('fs');
const mongoose = require('mongoose');
const schoolsSchema = require('../src/models/school')
const classesSchema = require('../src/models/classes')
const studentsSchema = require('../src/models/students')
const examsSchema = require('../src/models/exams')
const marksSchema = require('../src/models/marks')
const RoisSchema = require('../src/models/roi')
const countersSchema = require('../src/models/counter')
const brandsSchema = require('../src/models/brand')
const usersSchema = require('../src/models/users')
const locksSchema = require('../src/models/lock')



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
  .then(() => console.log('mongoose successful'))
  .catch(function () {
    console.log('Promise Rejected');
  });
const school = JSON.parse(fs.readFileSync(`${__dirname}/schools.json`, 'utf-8'));
const student = JSON.parse(fs.readFileSync(`${__dirname}/students.json`, 'utf-8'));
const classes = JSON.parse(fs.readFileSync(`${__dirname}/classes.json`, 'utf-8'));
const exam = JSON.parse(fs.readFileSync(`${__dirname}/exams.json`, 'utf-8'));
const roi = JSON.parse(fs.readFileSync(`${__dirname}/rois.json`, 'utf-8'));
const counter = JSON.parse(fs.readFileSync(`${__dirname}/counters.json`, 'utf-8'));
const brand = JSON.parse(fs.readFileSync(`${__dirname}/brands.json`, 'utf-8'));
const user = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const lock = JSON.parse(fs.readFileSync(`${__dirname}/lock.json`,'utf-8'));

const importData = async () => {
  try {
    const Users = mongoose.model('Users', usersSchema)
    const Schools = mongoose.model('Schools', schoolsSchema)
    const Classes = mongoose.model('Classes', classesSchema)
    const Rois = mongoose.model('Rois', RoisSchema)
    const Students = mongoose.model('Students', studentsSchema)
    const Exams = mongoose.model('Exams', examsSchema)
    const Locks = mongoose.model('Locks', locksSchema);
    const Brands = mongoose.model('Brands', brandsSchema)
    const Counters = mongoose.model('Counters', countersSchema)

    await Schools.create(school);
    await Classes.create(classes);
    await Students.create(student);
    await Exams.create(exam);
    await Rois.create(roi);
    await Counters.create(counter)
    await Brands.create(brand)
    await Users.create(user)
    await Locks.create(lock)

    console.log('Data successfully added');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    const Users = mongoose.model('Users', usersSchema)
    const Schools = mongoose.model('Schools', schoolsSchema)
    const Classes = mongoose.model('Classes', classesSchema)
    const Rois = mongoose.model('Rois', RoisSchema)
    const Students = mongoose.model('Students', studentsSchema)
    const Exams = mongoose.model('Exams', examsSchema)
    const Locks = mongoose.model('Locks', locksSchema);
    const Brands = mongoose.model('Brands', brandsSchema)
    const Marks = mongoose.model('Marks', marksSchema)
    const Counters = mongoose.model('Counters', countersSchema)

    await Schools.deleteMany();
    await Students.deleteMany();
    await Classes.deleteMany()
    await Exams.deleteMany();
    await Marks.deleteMany();
    await Rois.deleteMany();
    await Counters.deleteMany()
    await Brands.deleteMany()
    await Users.deleteMany()
    await Locks.deleteMany()

    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();