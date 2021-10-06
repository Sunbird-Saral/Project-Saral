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
name of student in up school:- Apurva,Arman,Jaya,Deepti,Rajesh,Raju,Prajesh
exam:- hindi,maths
roi:-
type:- SAT
rollId:-  for UP SAT we have 3 digit roll number
1. class 2,UP,HINDI,SAT,examId 1
2. class 3,UP,HINDI,SAT,examId 2
3. class 3,UP,MATH,SAT,examId 3
4. class 4,UP,MATH,SAT,examId 4
5. class 5,UP,MATH,SAT,examId 5
6. class 4,UP,HINDI,SAT,examId 6
7. class 5,UP,HINDI,SAT,examId 7
8. class 6,UP,HINDI,SAT,examId 8
9. class 7,UP,HINDI,SAT,examId 9 
10. class 8,UP,HINDI,SAT,examId 10


state:- odisha
schoolID:2
school:- Aditya Birla Public School, Rayagada.
classes:- 2
student:- ajay,abhay
exam:- hindi,maths
roi:- 
studentId:-  for UP SAT we have 16 digit student Id
1. hindi,odisha,SAT,class 2,examId 11
2. hindi,odisha,SAT,class 3,examId 12
2. math,odisha,SAT,class 2,eamxId 13

state: gujrat
schoolId:3
school:- Sainik School
classes:- 3,4,5
student:- aarti,smriti,shristi,priyanka
exam: hindi,maths and english
roi:-
studentId:- for GUJRAT PAT 7 digit student Id
1. hindi,gujrat,PAT,class 3, examId 14
2. maths,gujrat,PAT,class 3, examId 15
3. english,gujrat,PAT,class 3, examId 16

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