import json
import random
import csv

# To create School, Users and Student json files & Data to be written
schoolsData=[]
usersData=[]
studentsData=[]
classData=[]

#input from the users
schoolsCount =   int(input("Please enter number of schools to be created: "))
usersCount =   int(input("Please enter number of users to be created: "))
studentsCount =   int(input("Please enter number of students to be created: "))

print("JSON files are being created please wait")

#School objects to be appended

for schools in range(0,schoolsCount):
    objSchools = {        
    "name": "Dummy school"+" "+str(schools),
    "schoolId": "900"+str(schools),
    "state": "up",
    "autoSync": False,
    "autoSyncFrequency": 600000,
    "storeTrainingData": True,
    "tags": True,
    "supportEmail": "abc@gmail.com , xyz@gmail.com",
    "offlineMode": True,
    "isAppForceUpdateEnabled": True,
    "district": "district"+str(schools),
    "scanTimeoutMs": 60000,
    "isManualEditEnabled": True
  }
        
    schoolsData.append(objSchools)


#Users objects to be appended

countSchoolID = 0

for users in range(0,usersCount):
  if users % 5 == 0:
     countSchoolID= countSchoolID + 1
  objUsers = {
        
        "name": "user"+str(users),
        "userId": "1000"+str(users),
        "schoolId": "900"+str(countSchoolID),
        "password": "$2a$08$6Ds4yry.6FhIMOylhQyvruuxiXG4Zh8IRrYxoZanlGJDLyBNT8j3S"
  
    }      
        
  usersData.append(objUsers)



#Students objects to be appended
# 400 students per school is created
countStudents = 0

for students in range(0,studentsCount):
  rand_int = random.randint(1, 8)
  if students % 400 == 0:
        countStudents= countStudents + 1

  objStudents = {
      
    "classId": str(rand_int),
    "className": "Class-"+str(rand_int),
    "section": "A",
    "name": "Student"+str(students),
    "studentId": "4500"+str(students),
    "schoolId": "900"+str(countStudents)
    
    }      
                
  studentsData.append(objStudents)


#Classes objects to be appended wrt no. of schools created
countSchoolID_Classes=0
classID=0

for classes in range(0,schoolsCount * 8):
    classID = (classes % 9) + 1
    if classes % 9 == 0:
        countSchoolID_Classes= countSchoolID_Classes+1
      
    objClass = {
    "sections": [
      {
        "section": "A"
      }
                ],
    "classId": str(classID),
    "className": "Class-"+str(classID),
    "schoolId": "900"+""+str(countSchoolID_Classes)
      }
    classData.append(objClass)


# Writing to Schools, Users, Students and Classes json file sample.json
  
with open("schools.json", "w") as fSchools:
    json.dump(schoolsData, fSchools, indent=4)

with open("users.json", "w") as fUsers:
    json.dump(usersData, fUsers, indent=4)

with open("students.json", "w") as fStudents:
    json.dump(studentsData, fStudents, indent=4)

with open("classes.json", "w") as fClass:
    json.dump(classData, fClass, indent=4)


print("schools,users,students,classes JSON files are created successfully")



###############################################



def jsontocsv():

  with open("./users.json") as file:
      userdata = json.load(file)

  fname = "UsernamePassword.csv"

  with open(fname, "w") as file:
      csv_file = csv.writer(file,lineterminator='\n')
      csv_file.writerow(["userId","Password","schoolId"])
      for item in userdata:
          csv_file.writerow([item['userId'],"tarento@123",item['schoolId']])



  # read JSON data from a file
  with open('students.json') as f:
      data = json.load(f)

  # create CSV files
  with open('classId_4to8.csv', mode='w', newline='') as f1, \
      open('classId_1to3.csv', mode='w', newline='') as f2:

      # create CSV writers
      writer1 = csv.writer(f1)
      writer2 = csv.writer(f2)

      # write header row to both files
      writer1.writerow(['StudentID4to8', 'name', 'section', 'schoolId', 'classId', 'className'])
      writer2.writerow(['StudentID1to3', 'name', 'section', 'schoolId', 'classId', 'className'])

      # loop over students in the JSON data
      for student in data:
          classId = int(student['classId'])
          if classId > 3:
              writer1.writerow([student['studentId'], student['name'], student['section'], student['schoolId'], classId, student['className']])
          else:
              writer2.writerow([student['studentId'], student['name'], student['section'], student['schoolId'], classId, student['className']])


jsontocsv()

print('Converted files to CSV and Test data generation is completed sucessfully')