## This readme is created for loading data in the database .

* commands:- 
First you need to come under docker container
* docker exec -it saral-backend bash

# for loading data in database
* node ./data/import-data.js --import
for deleting current data in database
*  node ./data/import-data.js --delete


# state:- UP

## schoolId:u001
>> `school:- Dummy school 1`
>> `classes:- 2,3,4,5,6,7,8`
>> `student:- no of student 7` 

* name of student in up school:- 

|STUDENT NAME| STUDENT ID|Class|
|---|---|---|
|Student1| 122|4|
|Student2| 123|4|
|Student3| 124|4|
|Student4| 945|4|
|Student5| 928|4|
|Student6| 888|4|
|Student7| 826|4|
|Student8| 836|4|
|Student9| 846|4|
|Student10| 856|4|
|Student11| 936|4|
|Student1| 181|8|
|Student2| 182|8|
|Student3| 183|8|


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

|STUDENT NAME|STUDENT ID|CLASS|SEC|
|---|---|---|---|
|Student1|     1210001|2|D|  
|Student2|     1220002|2|D|
|Student3|     1220003|2|D|
|Student4|     1220004|2|D|
|Student5|     1220005|2|D|
|Student1|      1210003|6|D|
|Student2|      1212603|6|D|
|Student3|      1230003|6|D|
|Student4|      1240003|6|D|
|Student5|       1250003|6|D|
|Student6|     1260003|6|D|
|Student7|       1278003|6|D|
|Student1|        1216704|7|D|
|Student2|     1213564|7|D|
|Student3|      1217894|7|D|
|Student4|      1210004|7|D|
|Student1|   1210005|5|D|
|Student2|      1212005|5|D|
|Student3|     1213005|5|D|
|Student4|        1214005|5|D|
|Student5|       1215005|5|D|
|Student1|           2000001|5|B|
|Student2|       2000002|5|B|
|Student3|      2000003|5|B|
|Student4| 2000004|5|B|

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

|STUDENT NAME|STUDENT ID|CLASS|SEC|
|---|---|---|---|
|Student1|        1000001|3|D|
|Student2|         1000002|3|D|
|Student3|         1000002|3|D|

## roi
| SUBJECT | STATE | TYPE | CLASSID | EXAMID|
|---|---|---|---|---|
|Hindi|UP|UP_HINDI_3S|3|2|

# state:- odisha
## schoolID: od001
>> `school:- Dummy school 2`
>> `classes:- 2,3`
>> `name of student in ODISHA school:-`  

|STUDENT NAME |STUDENT ID|Class| SEC|
|---|---|---|---|
|Student1|    2204000000000001|2|D|
|Student2|    2234567899984301|2|D|
|Student3|    2234567899984311|2|D|
|Student4|    2234567890084311|2|D|
|Student5|    2233567890084311|2|D|
|Student6|    2233507890084311|2|D|
|Student1|    2203000000000001|3|C|
|Student2|    2203300000000001|3|C|
|Student3|    2203400000000001|3|C|
|Student4|    2203500000000001|3|C|
|Student5|    2203600000000001|3|C|
|Student1|    2203000000000002|2|B|
|Student2|    2203000000000112|2|B|
|Student3|    2203000000000122|2|B|
|Student4|    2203000000000132|2|B|
|Student5|    2203000000000142|2|B|
|Student6|    2203000000000004|2|B|
|Student1|    2203000000000003|3|B|
|Student2|    2203000000000043|3|B|
|Student3|    2203000000000053|3|B|
|Student4|    2203000000000063|3|B|
|Student5|    2203000000000073|3|B|
|Student|      2203000000000083|3|B|

## roi:- 

**type:- SAT**
**ROLLNUMBER:- 16 digit student Id**

|SUBJECT|STATE|TYPE|CLASS|EXAM|
|---|---|---|---|---|
|hindi|odisha|SAT|2| 11|
|hindi|odisha|SAT|3|12|
|math|odisha|SAT|2|13|

# state: gujrat
## schoolId: DemoUser
>> `school:- Dummy school 3`
>> `classes:- 3,4,5`

name of student in gujrat school:- 

|STUDENT NAME| STUDENT ID| Class| SEC|
|---|---|---|---|
|Student1     |3304001|3|D|
|Student2     |3394871|3|D|
|Student3     |3365871|3|D|
|Student4     |3365851|3|D|
|Student5     |3365831|3|D|
|Student1     |3302001|3|B|
|Student2     |3302002|3|B|
|Student3     |3302003|3|B|

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

|STUDENT NAME| STUDENT ID| Class| SEC|
|---|---|---|---|
|Student1|	3000001|4|B|
|Student2|	3000002|4|B|
|Student3|	3000003|4|B|
|Student4| 3000004|4|B|
|Student5| 3000005|4|B|
|Student6| 3000006|4|B|
|Student7| 3000007|4|B|


## roi:-
|SUBJECT|STATE|TYPE|CLASS|EXAM|
|---|---|---|---|---|
|hindi|	gujrat|	gujrat_hindi_1s|4|18|

## type:- gujrat_5q_multichoice 
## ROLLNUMBER:- 7 digit student Id name of student in Gujrat_HINDI_4S:-

|STUDENT NAME| STUDENT ID| Class| SEC|
|---|---|---|---|
|Student1|	3302004|5|D|
|Student2|	3302005|5|D|
|Student3|  3872645|5|D|
|Student4|  3901345|5|D|
|Student5|  4987654|5|D|
|Student6|  4765432|5|D|
|Student7|  4963432|5|D|
|Student8|  4963431|5|D|
|Student9|  4963471|5|D|
|Student10| 4963461|5|D|


## roi:-
|SUBJECT|STATE|TYPE|CLASS|EXAM|
|---|---|---|---|---|
|hindi|	gujrat|	gujrat_5q_multichoice|5|19|

# state:- UP(For multiple students)
## schoolId:-u002
>> `school:- Dummy school 4`
>> `classes:- 2,3,4,5`
>> `name of student in MULTI UP school` 

|STUDENT NAME| STUDENT ID| CLASS|
|---|---|---|
|Student1       |4204001|2|
|Student2     |4204002|2|
|Student3     |4204003|2|
|Student4    |4204004|2|
|Student5  |4204005|2|
|Student6    |4204006|2|
|Student7 |4204007|2|
|Student8   |4204008|2|
|Student9    |4204009|2|
|Student10    |4204010|2|
|Student11    |4204011|2|
|Student12    |4204012|2|
|Student13    |4204013|2|
|Student14    |4204014|2|
|Student15    |4204015|2|
|Student16    |4204016|2|
|Student17    |4204017|2|
|Student18    |4204018|2|
|Student19    |4204019|2|
|Student20    |4204020|2|
|Student21    |4204021|2|
|Student22    |4204022|2|
|Student23    |4204023|2|
|Student24    |4204024|2|
|Student25    |4204025|2|
|Student26    |4204026|2|
|Student27    |4204027|2|
|Student28    |4204028|2|
|Student29    |4204029|2|
|Student30    |4204030|2|
|Student31    |4204031|2|
|Student32    |4204032|2|
|Student33    |4204033|2|
|Student34    |4204034|2|
|Student35    |4204035|2|
|Student36    |4204036|2|
|Student37    |4204037|2|
|Student38    |4204038|2|
|Student39    |4204039|2|
|Student40    |4204040|2|
|Student41    |4204041|2|
|Student42    |4204042|2|
|Student43    |4204043|2|
|Student44    |4204044|2|
|Student45    |4204045|2|
|Student46    |4204046|2|
|Student47    |4204047|2|
|Student48    |4204048|2|
|Student49    |4204049|2|
|Student50    |4204050|2|
|Student51    |4204051|2|
|Student52    |4204052|2|
|Student53    |4204053|2|


## roi:- 
**type:- PAT**
**ROLLNUMBER:- 7 digit studentId**

|SUBJECT |STATE |TYPE |CLASS ID |EXAM ID |
|---|---|---|---|---|
|hindi|UP|PAT|2|17|
|Maths|UP|PAT|2|19|
| english|UP|PAT| 2| 18|


# state:- assam
## schoolId:-a001
>> `school:- Dummy school 5`
>> `classes:- 2,3`
>> `name of student in Assam school` 

|STUDENT NAME| STUDENT ID| Class| SEC|
|---|---|---|---|
|Student1     |543210|2|A|
|Student2     |543211|2|A|
|Student3     |543212|2|A|
|Student1     |543213|3|A|
|Student2     |543214|3|A|
|Student3     |543215|3|A|
|Student4     |543216|3|A|
|Student5     |543217|3|A|
|Student6     |543218|3|A|
|Student7     |543219|3|A|
|Student8     |543220|3|A|
|Student9     |543222|3|A|
|Student10     |543223|3|A|

## roi:- 
**type:- any_10s_10q,any_1s_10q**
**ROLLNUMBER:- 6 digit studentId**

|SUBJECT |STATE |TYPE |CLASS ID |EXAM ID |
|---|---|---|---|---|
|hindi|assam|any_1s_10q|2|25|
|hindi|assam|any_10s_10q|3|26|
