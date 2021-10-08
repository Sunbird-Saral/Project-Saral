## This readme is created for loading data in the database .

* commands:- 
First you need to come under docker container
* docker exec -it saral-backend bash

# for loading data in database
* node ./data/import-data.js --import
for deleting current data in database
*  node ./data/import-data.js --delete

# state:- UP

## schoolId:1
>> school:- Fountainhead School
>> classes:- 2,3,4,5,6,7,8
>> student:- no of student 7 

* name of student in up school:- 

|STUDENT NAME| STUDENT ID|
|---|---|
|Arman| 122|
|Jaya| 123|
|Deepti| 124|
|Rajesh| 181|
|Raju:| 182|
|Prajesh| 183|


## roi:-
**type:- SAT**
**ROLLNUMBER:- for UP SAT we have 3 digit roll number**

| SUBJECT | STATE | TYPE | CLASS | EXAM ID|
|---|---|---|---|---|
|MATH|UP|SAT|3|3|
|MATH|UP|SAT|4|4|
|MATH|UP|SAT|5|5|
|HINDI|UP|SAT|4|6|
|HINDI|UP|SAT|8|10|

**type:- UP_HINDI_4S**
**ROLLNUMBER:- for UP_HINDI_4S it accept 7 digit roll number**

* name of student in UP_HINDI_4S school:- 

|STUDENT NAME|STUDENT ID|
|---|---|
|Apurva |           1210001|  
|Navin Nair|        1210002|
|Neha Rawat |       1210003|
|Ankit Negi  |      1210004|
|Khusbhoo Sharma|   1210005|

## roi

| SUBJECT | STATE | TYPE | CLASSID | EXAMID|
|---|---|---|---|---|
|Hindi|UP|UP_HINDI_4S|2|1|
|Hindi|UP|UP_HINDI_4S|3|2|
|Hindi|UP|UP_HINDI_4S|5|7|
|Hindi|UP|UP_HINDI_4S|6|8|
|Hindi|UP|UP_HINDI_4S|7|9|


# state:- odisha
## schoolID:2
>> school:- Aditya Birla Public School, Rayagada.
>> classes:- 2,3
>> name of student in ODISHA school:-  

|STUDENT NAME |STUDENT ID|
|---|---|
|ajay       |2204000000000001|
|abhay      |2203000000000001|
|Rishab Sharma  | 2203000000000002|
|Harshita Bhatt|  2203000000000003|
|Nishant Bhatt|   2203000000000004|


## roi:- 
**type:- SAT**
**studentId:-  for ODISHA SAT we have 16 digit student Id**

|SUBJECT|STATE|TYPE|CLASS|EXAM|
|---|---|---|---|---|
|hindi|odisha|SAT|2| 11|
|hindi|odisha|SAT|3|12|
|math|odisha|SAT|2|13|

# state: gujrat
## schoolId:3
>> school:- Sainik School
>> classes:- 3,4,5
>> name of student in gujrat school:- 

|STUDENT NAME| STUDENT ID| 
|---|---|
|aarti      |3304001|
|smriti     |3302001|
|shristi    |3302002|
|priyanka   |3302003|

## roi:-
**type:- PAT**
**ROLLNUMBER:- 7 digit student Id**

|SUBJECT|STATE|TYPE|CLASS|EXAM|
|---|---|---|---|---|
| hindi|gujrat|PAT| 3|14|
| maths|gujrat|PAT|3|15|
|english|gujrat|PAT|3|16|

# state:- UP(For multiple students)
school:- Amtul's Public School
## schoolId:-4
>> classes:- 2,3,4,5
>> name of student in MULTI UP school:- 

|STUDENT NAME| STUDENT ID|
|---|---|
|Niti Joshi       |4204001|
|Chesta Bisht     |4204002|
|Megha Kanyal     |4204003|
|Mousumee Alam    |4204004|
|Ruchika Kandpal  |4304001|
|Ruchika Joshi    |4404001|
|Shantanu Bankoti |4504001|


## roi:- 
**type:- PAT**
**ROLLNUMBER:- 7 digit studentId**

|SUBJECT |STATE |TYPE |CLASS ID |EXAM ID |
|---|---|---|---|---|
|hindi|UP|PAT|2|17|
|Maths|UP|PAT|2|19|
| english|UP|PAT| 2| 18|