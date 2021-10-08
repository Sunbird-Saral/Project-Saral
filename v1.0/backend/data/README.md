This readme is created for loading data in the database .

commands:- 
First you need to come under docker container
-> "docker exec -it saral-backend bash"
for loading data in database
1. node ./data/import-data.js --import
for deleting current data in database
2.  node ./data/import-data.js --delete

state:- UP
schoolId:1
school:- Fountainhead School
classes:- 2,3,4,5,6,7,8
student:- no of student 7 
name of student in up school:- 
name   id
Arman: 122
Jaya: 123
Deepti: 124
Rajesh: 181
Raju: 182
Prajesh: 183
exam:- hindi,maths
roi:-
type:- SAT
rollId:-  for UP SAT we have 3 digit roll number
1. class 3,UP,MATH,SAT,examId 3
2. class 4,UP,MATH,SAT,examId 4
3. class 5,UP,MATH,SAT,examId 5
4. class 4,UP,HINDI,SAT,examId 6
5. class 8,UP,HINDI,SAT,examId 10

type:- UP_HINDI_4S
rollId:- for UP_HINDI_4S it accept 7 digit roll number
student:
Name              id
Apurva            1210001  
Navin Nair        1210002
Neha Rawat        1210003
Ankit Negi        1210004
Khusbhoo Sharma   1210005
1. class 2,UP,HINDI,UP_HINDI_4S,examId 1,roiId 1
2. class 3,UP,HINDI,UP_HINDI_4S,examId 2,roiId 2
3. class 5,UP,HINDI,UP_HINDI_4S,examId 7,roiId 7
4. class 6,UP,HINDI,UP_HINDI_4S,examId 8,roiId 8
5. class 7,UP,HINDI,UP_HINDI_4S,examId 9,roiId 9


state:- odisha
schoolID:2
school:- Aditya Birla Public School, Rayagada.
classes:- 2
student:- 
Name               id
ajay            2204000000000001
abhay           2203000000000001
Rishab Sharma   2203000000000002
Harshita Bhatt  2203000000000003
Nishant Bhatt   2203000000000004
exam:- hindi,maths
roi:- 
studentId:-  for UP SAT we have 16 digit student Id
1. hindi,odisha,SAT,class 2,examId 11,roiId 11
2. hindi,odisha,SAT,class 3,examId 12,roiId 12
2. math,odisha,SAT,class 2,eamxId 13,roiId 13

state: gujrat
schoolId:3
school:- Sainik School
classes:- 3,4,5
student:- 
name       id 
aarti      3304001
smriti     3302001
shristi    3302002
priyanka   3302003
exam: hindi,maths and english
roi:-
studentId:- for GUJRAT PAT 7 digit student Id
1. hindi,gujrat,PAT,class 3, examId 14,roiId 14
2. maths,gujrat,PAT,class 3, examId 15,roiId 15
3. english,gujrat,PAT,class 3, examId 16,roiId 16

state:- UP(For multiple students)
school:- Amtul's Public School
schoolId:-4
classes:- 2,3,4,5
student:- Niti Joshi,Chesta Bisht, Megha Kanyal,Mousumee Alam,Ruchika Kandpal,Ruchika Joshi,Shantanu Bankoti
exam:- hindi,maths and english for class 2 and maths exam for class 3
marks:- hindi,maths and english for class 2 and maths marks save for class 3
roi:- 
type :PAT
studentId:- 7 digit studentId
1. hindi,UP,PAT,class 2,examId 17
2. Maths,UP,PAT,class 2, examid 19
3. english,UP,PAT,class 2, examID 18