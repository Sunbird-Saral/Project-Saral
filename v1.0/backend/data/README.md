## This readme is created for loading data in the database .

* commands:- 
First you need to come under docker container
* docker exec -it saral-backend bash

# for loading data in database
* node ./data/import-data.js --import
for deleting current data in database
*  node ./data/import-data.js --delete

# state:- UP

## schoolId:up001
>> `school:- Fountainhead School`
>> `classes:- 2,3,4,5,6,7,8`
>> `student:- no of student 7` 

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
**ROLLNUMBER:- for UP SAT MULTI SUBJECT we have 3 digit roll number**

| SUBJECT | STATE | TYPE | CLASS | EXAM ID|
|---|---|---|---|---|
|Multi-Subject|UP|SAT|4|3|
||Multi-Subject|UP|SAT|8|7|

**type:- UP_HINDI_4S**
**ROLLNUMBER:- UP_HINDI_4S it accept 7 digit roll number**

* name of student in UP_HINDI_4S school:- 

|STUDENT NAME|STUDENT ID|CLASS|
|---|---|---|
|Apurva |           1210001|2|  
|Himani Bisht|      1220002|2|
|Sandeep Kumar|     1220003|2|
|Gopal Bhatt|       1220004|2|
|Mukul|             1220005|2|
|Neha Rawat |       1210003|2|
|Ankit Negi  |      1210004|2|
|Khusbhoo Sharma|   1210005|2|
|Sherlyn|           2000001|5|
|Rita Bhojak|       2000002|5|
|Karan Bhojak|      2000003|5|
|Aayushi Dhondiyal| 2000004|5|

## roi

| SUBJECT | STATE | TYPE | CLASSID | EXAMID|
|---|---|---|---|---|
|Hindi|UP|UP_HINDI_4S|2|1|
|Hindi|UP|UP_HINDI_4S|5|4|
|Hindi|UP|UP_HINDI_4S|6|5|
|Hindi|UP|UP_HINDI_4S|7|7|

**type:- UP_HINDI_3S**
**ROLLNUMBER:- UP_HINDI_3S it accept 7 digit roll number**


* name of student in UP_HINDI_3S school:- 

|STUDENT NAME|STUDENT ID|CLASS|
|---|---|---|
|Navin Nair|        1000001|3|
|Deepankar|         1000002|3|
|Jatin|         1000002|3|

## roi
| SUBJECT | STATE | TYPE | CLASSID | EXAMID|
|---|---|---|---|---|
|Hindi|UP|UP_HINDI_3S|3|2|

# state:- odisha
## schoolID: odisha001
>> `school:- Aditya Birla Public School, Rayagada.`
>> `classes:- 2,3`
>> `name of student in ODISHA school:-`  

|STUDENT NAME |STUDENT ID|
|---|---|
|ajay       |2204000000000001|
|abhay      |2203000000000001|
|Rishab Sharma  | 2203000000000002|
|Harshita Bhatt|  2203000000000003|
|Nishant Bhatt|   2203000000000004|


## roi:- 

**type:- SAT**
**ROLLNUMBER:- 16 digit student Id**

|SUBJECT|STATE|TYPE|CLASS|EXAM|
|---|---|---|---|---|
|hindi|odisha|SAT|2| 11|
|hindi|odisha|SAT|3|12|
|math|odisha|SAT|2|13|

# state: gujrat
## schoolId:gujrat001
>> `school:- Sainik School`
>> `classes:- 3,4,5`

name of student in gujrat school:- 

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

## type:- Gujrat_HINDI_1S 
## ROLLNUMBER:- 7 digit student Id name of student in Gujrat_HINDI_4S:-

|STUDENT NAME| STUDENT ID| 
|---|---|
|divya negi|	3000001|
|Kamla Dharamwal|	3000002|
|Jayanti Bisht|	3000003|

## roi:-
|SUBJECT|STATE|TYPE|CLASS|EXAM|
|---|---|---|---|---|
|hindi|	gujrat|	gujrat_hindi_1s|4|18|

## type:- gujrat_5q_multichoice 
## ROLLNUMBER:- 7 digit student Id name of student in Gujrat_HINDI_4S:-

|STUDENT NAME| STUDENT ID| 
|---|---|
|Priya Sood|	3302004|
|Ram Kapoor|	3302005|


## roi:-
|SUBJECT|STATE|TYPE|CLASS|EXAM|
|---|---|---|---|---|
|hindi|	gujrat|	gujrat_5q_multichoice|5|19|

# state:- UP(For multiple students)
## schoolId:-up002
>> `school:- Amtul's Public School`
>> `classes:- 2,3,4,5`
>> `name of student in MULTI UP school` 

|STUDENT NAME| STUDENT ID|
|---|---|
|Niti Joshi       |4204001|
|Chesta Bisht     |4204002|
|Megha Kanyal     |4204003|
|Mousumee Alam    |4204004|
|Ruchika Kandpal  |4204005|
|Ruchika Joshi    |4204006|
|Shantanu Bankoti |4204007|
|Kavita kuwarbi   |4204008|


## roi:- 
**type:- PAT**
**ROLLNUMBER:- 7 digit studentId**

|SUBJECT |STATE |TYPE |CLASS ID |EXAM ID |
|---|---|---|---|---|
|hindi|UP|PAT|2|17|
|Maths|UP|PAT|2|19|
| english|UP|PAT| 2| 18|