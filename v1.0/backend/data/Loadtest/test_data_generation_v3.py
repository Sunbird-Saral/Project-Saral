import json
import random

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
    "schoolId": "u00"+str(schools),
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
        "schoolId": "u00"+str(countSchoolID),
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
    "schoolId": "u00"+str(countStudents)
    
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
    "schoolId": "u00"+""+str(countSchoolID_Classes)
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


print("JSON files are created successfully")