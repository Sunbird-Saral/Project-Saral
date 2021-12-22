## This readme is created for loading data in the database .

* commands:- 
First you need to come under docker container
* docker exec -it saral-backend bash

# for loading data in database
* node ./data/import-data.js --import
for deleting current data in database
*  node ./data/import-data.js --delete

# state:- UP

## schoolId:d001
>> `school:- Dummy school 1`
>> `classes:- 2,3,4,5,6,7,8`
>> `student:- no of student 7` 

* name of student in up school:- 

|STUDENT NAME| STUDENT ID|Class|
|---|---|---|
|Arman| 122|4|
|Jaya| 123|4|
|Deepti| 124|4|
|Shivani Kutiyal| 945|4|
|Deeksha Negi| 928|4|
|Nitin Agarwal| 888|4|
|Swapnil Kanayal| 826|4|
|Neetu Bhatt| 836|4|
|Geet Nayal| 846|4|
|Harshit Singh| 856|4|
|Vandana Yadav| 936|4|
|Rajesh| 181|8|
|Raju:| 182|8|
|Prajesh| 183|8|


## roi:-
**type:- SAT**
**ROLLNUMBER:- for UP SAT MULTI SUBJECT we have 3 digit roll number**

| SUBJECT | STATE | TYPE | CLASS | EXAM ID|
|---|---|---|---|---|
|Multi-Subject|UP|SAT|4|3|
|Multi-Subject|UP|SAT|8|7|

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
|Neha Rawat |       1210003|6|
|Monika Gupta|      1212603|6|
|Aman Agarwal|      1230003|6|
|Rishabh Pant|      1240003|6|
|Sakshi Pant|       1250003|6|
|Neetu Khayant|     1260003|6|
|Kanchan Sah|       1278003|6|
|Mohit Negi|        1216704|7|
|Tushar Murthy|     1213564|7|
|Ankita Verma|      1217894|7|
|Ankit Negi  |      1210004|7|
|Khusbhoo Sharma|   1210005|5|
|Parul Sirohi|      1212005|5|
|Shivani Rawat|     1213005|5|
|Kamal Guar|        1214005|5|
|Lalit Mehta|       1215005|5|
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
## schoolID: d002
>> `school:- Dummy school 2`
>> `classes:- 2,3`
>> `name of student in ODISHA school:-`  

|STUDENT NAME |STUDENT ID|Class|
|---|---|---|
|Ajay       |  2204000000000001|2|
|Bharat Mehta| 2234567899984301|2|
|Yogita Negi|  2234567899984311|2|
|Ritika Joshi| 2234567890084311|2|
|Megha Mehra|  2233567890084311|2|
|Mansi Mehta|  2233507890084311|2|
|abhay      |  2203000000000001|3|
|Deepankar Bisht| 2203300000000001|3|
|Akshay Kumar|    2203400000000001|3|
|Jatin Kumar|     2203500000000001|3|
|Aditya Birla|    2203600000000001|3|
|Rishab Sharma|   2203000000000002|2|
|Anjali Bhatt|    2203000000000112|2|
|Hema Joshi|      2203000000000122|2|
|Sikha Kandpal|   2203000000000132|2|
|Prince Kandpal|  2203000000000142|2|
|Nishant Bhatt|   2203000000000004|2|
|Harshita Bhatt|  2203000000000003|3|
|Yogita Bhatt|    2203000000000043|3|
|Kirti Tiwari|    2203000000000053|3|
|Hitesh Bisht|    2203000000000063|3|
|Manish Nagarkoti|2203000000000073|3|
|Yuvika Jha|      2203000000000083|3|

## roi:- 

**type:- SAT**
**ROLLNUMBER:- 16 digit student Id**

|SUBJECT|STATE|TYPE|CLASS|EXAM|
|---|---|---|---|---|
|hindi|odisha|SAT|2| 11|
|hindi|odisha|SAT|3|12|
|math|odisha|SAT|2|13|

# state: gujrat
## schoolId: d003
>> `school:- Dummy school 3`
>> `classes:- 3,4,5`

name of student in gujrat school:- 

|STUDENT NAME| STUDENT ID| Class| 
|---|---|---|
|Aarti Bhatt     |3304001|3|
|Kaushal Singh     |3394871|3|
|Shivam Manral     |3365871|3|
|Bhavna Bisht     |3365851|3|
|Arun Bisht     |3365831|3|
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

|STUDENT NAME| STUDENT ID| Class|
|---|---|---|
|Divya Negi|	3000001|4|
|Kamla Dharamwal|	3000002|4|
|Jayanti Bisht|	3000003|4|
|Chetan Negi| 3000004|4|
|Bhanu Joshi| 3000005|4|
|Indra Pawar| 3000006|4|
|Rekha Joshi| 3000007|4|


## roi:-
|SUBJECT|STATE|TYPE|CLASS|EXAM|
|---|---|---|---|---|
|hindi|	gujrat|	gujrat_hindi_1s|4|18|

## type:- gujrat_5q_multichoice 
## ROLLNUMBER:- 7 digit student Id name of student in Gujrat_HINDI_4S:-

|STUDENT NAME| STUDENT ID| Class|
|---|---|---|
|Priya Sood|	3302004|5|
|Ram Kapoor|	3302005|5|
|Rashmi Desai|  3872645|5|
|Astha Chaudary| 3901345|5|
|Aparna Dixit|   4987654|5|
|Develoeena|     4765432|5|
|Soni Suyal|     4963432|5|
|Gaurav Pandey| 4963431|5|
|Pushpendara Rana| 4963471|5|
|Nitin Verma|      4963461|5|


## roi:-
|SUBJECT|STATE|TYPE|CLASS|EXAM|
|---|---|---|---|---|
|hindi|	gujrat|	gujrat_5q_multichoice|5|19|

# state:- UP(For multiple students)
## schoolId:-d004
>> `school:- Dummy school 4`
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
|Kanchan Joshi    |4204009|
|Pragati Singh    |4204010|
|Saurav Joshi     |4204011|
|Shivam Manral    |4204012|
|Adita Agarwal    |4204013|
|Aditya Agarwal   |4204014|
|Vimal Daramwal   |4204015|
|Smriti Arora     |4204016|
|Vishakha Gupta   |4204017|
|Shubham Tiwari   |4204018|
|Venkat Rao       |4204019|
|Vicky Kaushal    |4204020|
|Ritika Nagarkoti |4204021|


## roi:- 
**type:- PAT**
**ROLLNUMBER:- 7 digit studentId**

|SUBJECT |STATE |TYPE |CLASS ID |EXAM ID |
|---|---|---|---|---|
|hindi|UP|PAT|2|17|
|Maths|UP|PAT|2|19|
| english|UP|PAT| 2| 18|