import json
import csv


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
with open('classId_4to82.csv', mode='w', newline='') as f1, \
     open('classId_1to32.csv', mode='w', newline='') as f2:

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
