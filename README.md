# MongoDB Query Analyser

This little JavaScript file, which is executed on the mongo shell (mongo/mongosh) takes in a query, explains it and
prints the results in a nice understandable way.


## How to use

- Have a look at setup.js
- Change the constants in that file to your liking
- Change QUERY to the query you want to analyse. This is required
- Save the file and transfer it to a MongoDB server together with the query_analyser.js
- Connect to the node by using mongo or mongosh [connection string] [connection params] setup.js query_analyser.js
- The order of the JavaScript files does matter, setup.js must be first to declare the constants


## How to run

[![Watch how to run](https://raw.githubusercontent.com/totally-nerdy/tn-mdb-query-analyser/main/How-To-Run.jpg)](https://raw.githubusercontent.com/totally-nerdy/tn-mdb-query-analyser/main/How-To-Run.mp4)


## Notes
- Developed on MongoDB v6.0.0