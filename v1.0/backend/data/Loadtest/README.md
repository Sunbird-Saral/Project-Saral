# Performance testing workspace Setup - Playbook

### _Prerequisites_

Before we begin, ensure that you have the Software Prerequisites installed on your system:
 1. Visual Studio Code (https://code.visualstudio.com/download)
 2. MongoDB Community Edition (https://www.mongodb.com/try/download/community)
 3. MongoDB Databasetool (https://www.mongodb.com/docs/database-tools/installation/installation/)
 4. Apache JMeter (https://jmeter.apache.org/download_jmeter.cgi)
 5. JMeterPluginsCMD utility (https://jmeter-plugins.org/wiki/JMeterPluginsCMD/)

Please go through Performance test strategy (*data\Loadtest\Performance_Test_Strategy.jpg*) to understand the objectives, approach, scope of performance testing effort.
### Steps to create test data for load test
1. Open visual studio code
2. Click on File, Open File and Load the _test_data_generation_v4.py_ file load the python file on VS code
3. Run the file
4. In terminal, _Enter the number of schools to be created, Enter number of users to be created and Enter number of students to be created_ and press enter
5. Once "Test data generation is completed sucessfully" message appears,
_schools.json, users.json, students.json, classes.json, UsernamePassword.csv, classId_1to3.csv and classId_4to8.csv_ files are generated on right side explorer.
6. These files are saved automatically where test_data_generation_v4.py is saved.
7. User can always copy all these files and save it in desired location.
      

*******

## Uploading the test data into local MongoDB database
This document provides a step-by-step guide on how to upload a JSON file to a local MongoDB database using Mongosh. Mongosh is a powerful and user-friendly CLI for MongoDB that allows you to interact with MongoDB instances using JavaScript.

### Prerequisites
Before you can upload a JSON file to a local MongoDB database using Mongosh, you need to have the following installed on your system:
- MongoDB Community Edition
- Mongosh CLI
- MongoDB Databasetool
- JSON files to upload (_schools.json, users.json, students.json, classes.json_)

There are 3 ways to upload json files to the required collection on MongoDB

To upload a JSON file to a local MongoDB database using a GUI mode, such as MongoDB Compass, you can follow these steps
1. Open MongoDB Compass and connect to your local MongoDB database.
2. In the left-hand navigation pane, click on the database that you want to upload the JSON file to.
3. In the top navigation bar, click on the "Collection" tab.
4. Click on the "Create Collection" button to create a new collection, or select an existing collection that you want to upload the JSON file to.
5. In the collection view, click on the "Add Data" button and select "Import File".
6. In the "Import Options" dialog box, select the "JSON" option from the "File Format" dropdown menu.
7. Click on the "Select File" button to browse and select the JSON file that you want to upload.
8. Select the appropriate import options, such as "Import as one document" or "Import as multiple documents", depending on the structure of your JSON file.
9. Click on the "Import" button to start the import process.

Once the import process is complete, you should see the imported data in your collection view.

##### Steps to Upload JSON File to Local MongoDB using commandline (recommended)

To import a JSON file to MongoDB using the command line, you can use the mongoimport tool that comes with the MongoDB installation. Here are the steps to follow:

1. Open a terminal or command prompt on your computer.
2. Navigate to the directory where your JSON file is located.
3. Use the mongoimport command to import the JSON file to your MongoDB database. The basic syntax of the command is as follows:
```sh
mongoimport --db <database_name> --collection <collection_name> --file <path_to_file.json>
```
4. Replace <database_name> with the name of the database you want to import the data into, <collection_name> with the name of the collection you want to import the data into, and <path_to_file.json> with the path to your JSON file.

For example, if you have a JSON file called mydata.json in the directory C:\data and you want to import it to a database called mydb and a collection called mycollection, the command would be:
```sh
mongoimport --db mydb --collection mycollection --file C:\data\mydata.json
```
Note that mongoimport assumes that each line of the input file contains a separate document to be inserted into the specified collection.
Press Enter to execute the command. Depending on the size of your file, it may take a few minutes to import the data.
Once the import is complete, you should see a message indicating how many documents were inserted into the collection.
That's it! You have successfully imported a JSON file to MongoDB using the command line.

Steps to Upload JSON File to Local MongoDB using Mongosh

1. Open a command prompt or terminal window on your system.
2. Start the Mongosh shell by running the following command:

 ```sh
  mongosh
  ```
3. Once the Mongosh shell starts, connect to your local MongoDB instance by running the following command:
 ```sh
use your_database_name
  ```
4. Replace your_database_name with the name of your MongoDB database.
5. Create a new collection by running the following command:(if new collection is needed)

 ```sh
db.createCollection('your_collection_name')
  ```
6. Replace your_collection_name with the name of the collection you want to create.
7. Load the JSON file into a JavaScript variable by running the following command for newly created collection or to an existing one.
 ```sh
var your_data = JSON.parse(cat('/path/to/your/json/file.json'))
  ```
8. Replace /path/to/your/json/file.json with the path to your JSON file.
9. Insert the JSON data into the collection by running the following command:
 ```sh
db.your_collection_name.insertMany(your_data)
  ```
10. Replace your_collection_name with the name of the collection you created in step 4. Replace your_data with the name of the variable you created in step 5.
11. Once the JSON data is uploaded, you can verify it by running the following command:
 ```sh
db.your_collection_name.find()
  ```
12. Replace your_collection_name with the name of the collection you created in step 4. This command will display all the documents in the collection.

#### Conclusion
By following the steps outlined in this guide, you should now be able to upload a JSON file to a local MongoDB database using Mongosh and GUI mode. Mongosh provides a powerful and flexible way to interact with MongoDB instances using JavaScript.

*******

## JMeter Installation and Running JMeter Scripts

Apache JMeter is an open-source software application designed to load test functional behavior and measure performance. In this guide, we will cover the installation process of JMeter on a Windows machine, as well as running JMeter scripts

### _Installation_

Step 1 : Check java is installed on your system java -version
    - If not installed, install java on your machine
Step 2 : Download Jmeter from internet (http://jmeter.apache.org/download_jmeter.cgi)
Step 3 : Unzip and keep Jmeter folder at any location
Step 4 : Start Jmeter by running below file
    - Windows - jmeter/bin - jmeter.bat
    - Mac - open terminal - jmeter/bin - sh jmeter.sh
    
### Running JMeter Scripts

1. Open JMeter by running the jmeter.bat file from the bin directory.
2.  Click on File and select Open to open a JMeter script (saralapp_loadtest.jmx)
3. Once test plan is loaded, Under the Test Plan
In ``` User Defined Variables: URL details ```  specifiy the following variables name
 ```sh
  protocolTYPE, baseURL and portNumber (if test to be run on local)
  ```
    For example: 
    protocolTYPE   http
    baseURL	       localhost
    portNumber     3000

4. Under Thread Group 
 ``` Click on Login credentials CSV Data Set Config ``` and in Filename specifiy the correct file path of _UsernamePassword.csv_  which was created and saved during _test data for load test_         (make sure .csv is added to the csv file in the end)
5. Under Thread Group 
 In  ``` Loop Controller Class1to3  ```  ---> click on    ``` Student ID Class1to3 details CSV Data Set Config  ```  and in Filename specifiy the correct file path of _classId_1to3.csv_  which was created and saved during _test data for load test_   (make sure .csv is added to the csv file in the end)
6. Under Thread Group 
 In     ``` Loop Controller Class4to8     ```  ---> click on      ``` Student ID Class4to8 details CSV Data Set Config    ```  and in Filename specifiy the correct file path of _classId_4to8.csv_  which was created and saved during _test data for load test_   (make sure .csv is added to the csv file in the end)
7. Click on Thread Group and Enter all  ``` thread properties  ``` : Specify the number of Threads, Ramp-up period and loop count. 
8. Click on Save from top menu bar
9.  To run your test, click on the green "play" button located in the toolbar or press the Ctrl+R keyboard shortcut.
10. JMeter will then execute your test plan and display the results in real-time in the Listeners section.
11. Once your test is complete, you can view the test results by navigating to the Aggregate Report listener.
12.  To save your test results, click on Save table data (make sure Include group name and Save Table header checkbox is ticked) and save it to desired loaction

#### Conclusion
In this guide, we covered the installation process of JMeter on a Windows machine, as well as running JMeter scripts. By following these steps, you can easily load test functional behavior and measure performance using JMeter.



#### _Running JMeter Scripts NON-GUI MODE_

Steps to Execute JMeter Script using Non-GUI mode
1. Open a command prompt or terminal window on your system.
2.  Navigate to the bin directory of your JMeter installation folder.
   ```sh
  cd /path/to/jmeter/bin
  ```
3. Execute the following command to run the JMeter script in non-GUI mode:
  ```sh
 ./jmeter -n -t /path/to/your/script.jmx -l /path/to/your/results/file.jtl
  ```
-n: This flag indicates that JMeter should be run in non-GUI mode.
-t: This flag specifies the path to your JMeter script file.
-l: This flag specifies the path to the results file that will be generated by JMeter.

Once you execute the command, JMeter will start executing your script. You will see the progress of the script execution in your command prompt or terminal window.

Once the script execution is completed, you will find the results file specified by the -l flag in the location you specified.

4. Open a terminal or command prompt on your computer.
5. Navigate to the directory where you extracted the JMeterPluginsCMD utility.
6. Use the following command to generate the Aggregate Report:
 ```sh
java -jar JMeterPluginsCMD.jar --generate-csv <output_file_name.csv> --input-jtl <input_jtl_file_name.jtl> --plugin-type AggregateReport
```
Replace <output_file_name.csv> with the name you want to give to the generated report file, and <input_jtl_file_name.jtl> with the name of your JTL file.

For example, if you have a JTL file called results.jtl and you want to generate an aggregate report called aggregate_report.csv, the command would be:

 ```sh
java -jar JMeterPluginsCMD.jar --generate-csv aggregate_report.csv --input-jtl results.jtl --plugin-type AggregateReport
```
Press Enter to execute the command. Depending on the size of your JTL file, it may take a few minutes to generate the report.

Once the report is generated, you can open the output file in a spreadsheet program like Microsoft Excel or Google Sheets to view the aggregate report.

That's it! You have successfully created an aggregate report from a JTL file using the command line.

*To create an HTML report from a JMeter test plan using the command line, you can use the JMeter tool and the JMeterPluginsCMD utility. Here are the steps to follow*

1. Open a terminal or command prompt on your computer.
2. Navigate to the directory where you extracted the JMeterPluginsCMD utility.
3. Use the following command to generate the HTML report:
```sh
java -jar JMeterPluginsCMD.jar --generate-html <output_folder_name> --input-jtl <input_jtl_file_name.jtl> --plugin-type AggregateReport
```
Replace <output_folder_name> with the name you want to give to the generated report folder, and <input_jtl_file_name.jtl> with the name of your JTL file.

For example, if you have a JTL file called results.jtl and you want to generate an HTML report in a folder called report, the command would be:

```sh
java -jar JMeterPluginsCMD.jar --generate-html report --input-jtl results.jtl --plugin-type AggregateReport
```
4. Press Enter to execute the command. Depending on the size of your JTL file, it may take a few minutes to generate the report.

Once the report is generated, you can open the index.html file located in the output folder in a web browser to view the HTML report.

That's it! You have successfully created an HTML report from a JMeter test plan using the command line.

#### Conclusion
By following the steps outlined in this guide, you should now be able to execute JMeter scripts using the non-GUI mode. The non-GUI mode provides a convenient way to run your tests in batch mode or to integrate JMeter into your continuous integration or deployment pipelines.

********************************


