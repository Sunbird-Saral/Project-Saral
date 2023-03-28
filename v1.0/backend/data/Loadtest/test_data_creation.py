import json
from pickle import FALSE
import pandas as pd
import numpy as np
import random

# Data to be written
dataSchools = {"$schema": []}

dataUsers = {"$schema": []}

dataStudents = {"$schema": []}


# Serializing json
json_object_Schools = json.dumps(dataSchools, indent=4)
json_object_users = json.dumps(dataUsers, indent=4)

json_object_Students = json.dumps(dataStudents, indent=4)

# Writing to school and users json file sample.json 
with open("schools2.json", "w") as outfileSchools:
    outfileSchools.write(json_object_Schools)

with open("users2.json", "w") as outfileUsers:
    outfileUsers.write(json_object_users)

with open("students2.json", "w") as outfileStudents:
    outfileStudents.write(json_object_Students)


# Python program to update
# JSON
# function to add to JSON Schools
def write_jsonSchools(new_data_Schools, filenameschools='schools2.json'):
	with open(filenameschools,'r+') as fileSchools:
                
		# First we load existing data into a dict.
		file_data_Schools = json.load(fileSchools)
		# Join new_data with file_data inside emp_details
		file_data_Schools["$schema"].append(new_data_Schools)
		# Sets file's current position at offset.
		fileSchools.seek(0)
		# convert back to json.
		json.dump(file_data_Schools, fileSchools, indent = 4)

# function to add to JSON users
def write_jsonUsers(new_data_Users, filenameusers='users2.json'):
	with open(filenameusers,'r+') as fileUsers:
                
		# First we load existing data into a dict.
		file_data_Users = json.load(fileUsers)
		# Join new_data with file_data inside emp_details
		file_data_Users["$schema"].append(new_data_Users)
		# Sets file's current position at offset.
		fileUsers.seek(0)
		# convert back to json.
		json.dump(file_data_Users, fileUsers, indent = 4)
                


def write_jsonStudents(new_data_Students, filenameStudents='students2.json'):
	with open(filenameStudents,'r+') as fileStudents:
                
		# First we load existing data into a dict.
		file_data_Students = json.load(fileStudents)
		# Join new_data with file_data inside emp_details
		file_data_Students["$schema"].append(new_data_Students)
		# Sets file's current position at offset.
		fileStudents.seek(0)
		# convert back to json.
		json.dump(file_data_Students, fileStudents, indent = 4)






# python object to be appended
myJson_Schools = {
    "name": "Dummy school 3",
    "schoolId": "up003", 
    "state": "UP",
    "autoSync": False,
    "autoSyncFrequency": 600000,
    "storeTrainingData": True,
    "tags": False,
    "supportEmail": "abc@gmail.com",
    "offlineMode": True,
    "district": "district3"
    }


myJson_Users = {
	"name": "user1",
    "userId": "98616789",
    "schoolId": "u001",
    "password": "tarento@123"
    }



myJson_Students= {
    "studentClass": [
      {
        "classId": "2",
        "className": "Class-2"
      }
    ],
    "section": "D",
    "name": "Student1",
    "studentId": "1210001",
    "schoolId": "u001"
  }

#input from the users
schoolsCount = int(input("Enter number of schools to be created: "))
usersCount =   int(input("Enter number of users to be created: "))
studentsCount =   int(input("Enter number of students to be created: "))


#print("No. of students created will be userscreated*100 ")
#n = 2
for i in range(0, schoolsCount):
    #print(i)
    #z= "Dummy school" + " " + str(i)
    #print(z)
    myJson_Schools.update({
	    "name":"Dummy school" + " " + str(i),
	    "schoolId": "up00" + "" + str(i),
	    "district": "district"+ " " + str(i)
      })
    write_jsonSchools(myJson_Schools)
    # for i in range(1000)[::5]:
    #     #if i%100==0:
    #           print(i)

#my_variable = 0
countSchoolID = 0
# for san in range(0,schoolsCount ):  # Loop for 20 iterations
#     if san % 5 == 0:  # Check if iteration is divisible by 5
#         my_variable = san
#     print(f"Iteration {san}: {my_variable}")


for j in range(0, usersCount):
    #One schoolID will be assigned to every Five users
    if j % 5 == 0:
        #my_variable = j
        countSchoolID= countSchoolID + 1
        #print(f"Iteration {j}: {my_variable}")
    
    myJson_Users.update({
	    "name":"user" + "" + str(j),
        "userId": "1000"+ "" + str(j),
	    "schoolId": "up00" + "" + str(countSchoolID),
	    "district": "district"+ " " + str(j)
      })
    write_jsonUsers(myJson_Users)
                              
    # userid= "up00" + "" + str(i)
    # print(userid)


countStudents = 0
myvariable=0
classid = 1
# while classid <= 8:
#     #print(classid)
#     classid += 1
# while classid <= 8:
#          classid += 1

# for i in range(2):
#     for j in range(1, 9):
#         print(j)

#rand_int = random.randint(1, 8)
# seq_value = 1
# for ZZ in range(1, 9):
#      seq_value = ZZ
for k in range(0, studentsCount):                
    rand_int = random.randint(1, 8)
    # for x in range(1,9):
    #      print(x)
    #      myvariable= myvariable + x
    #One schoolID will be assigned to every Five users
    if k % 5 == 0:
        #my_variable = j
        countStudents= countStudents + 1
                 
        #print(f"Iteration {j}: {my_variable}")
      
    myJson_Students.update({
    "studentClass": [
      {
        "classId": ""+ str(rand_int),
        "className": "Class-"+ str(rand_int)
      }
    ],
    "section": "A",
    "name": "Student"+"" + str(k),
    "studentId": "450"+"" + str(k),
    "schoolId": "up00" + "" + str(countStudents)
  })
    write_jsonStudents(myJson_Students)