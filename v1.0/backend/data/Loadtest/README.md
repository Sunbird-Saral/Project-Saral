# JMeter Installation and Running JMeter Scripts

Apache JMeter is an open-source software application designed to load test functional behavior and measure performance. In this guide, we will cover the installation process of JMeter on a Windows machine, as well as running JMeter scripts

## _Installation_

Step 1 : Check java is installed on your system java -version
    - If not installed, install java on your machine
Step 2 : Download Jmeter from internet (http://jmeter.apache.org/download_jmeter.cgi)
Step 3 : Unzip and keep Jmeter folder at any location
Step 4 : Start Jmeter by running below file
    - Windows - jmeter/bin - jmeter.bat
    - Mac - open terminal - jmeter/bin - sh jmeter.sh
    
## Running JMeter Scripts

- Open JMeter by running the jmeter.bat file from the bin directory.
- Click on File and select Open to open an existing JMeter script (.jmx file).
- Once your test plan is loaded, you can configure the settings for your test, such as thread group settings, HTTP request settings, and timers.
- Add an "Aggregate Report" listener to your test plan. To do this, right-click on the thread group and select "Add > Listener > Aggregate Report"
- To run your test, click on the green "play" button located in the toolbar or press the Ctrl+R keyboard shortcut.
- JMeter will then execute your test plan and display the results in real-time in the Listeners section.
- Once your test is complete, you can view the test results by navigating to the Results Tree listener.
- To save your test results, click on Save table data (make sure Include group name and Save Table header checkbox is ticked).


## Conclusion
In this guide, we covered the installation process of JMeter on a Windows machine, as well as running JMeter scripts. By following these steps, you can easily load test functional behavior and measure performance using JMeter.


