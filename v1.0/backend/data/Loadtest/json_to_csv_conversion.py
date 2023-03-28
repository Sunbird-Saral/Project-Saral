import json
import csv
with open("./users2.json") as file:
    data = json.load(file)

fname = "UsernamePassword3.csv"

with open(fname, "w") as file:
    csv_file = csv.writer(file,lineterminator='\n')
    csv_file.writerow(["schoolId","userId","password"])
    for item in data["$schema"]:
        csv_file.writerow([item['schoolId'],item['userId'],item['password']])

#for writing student id's to csv file
with open("./students2.json") as filestudent:
    datastudent = json.load(filestudent)

fnamestudent = "StudentID.csv"

with open(fnamestudent, "w") as filestudent:
    csv_file_student = csv.writer(filestudent,lineterminator='\n')
    csv_file_student.writerow(["StudentID4to8","classId","schoolId"])
    for itemstudent in datastudent["$schema"]:
        csv_file_student.writerow([itemstudent['studentId'],itemstudent['studentClass'][0]['classId'],itemstudent['schoolId']])

