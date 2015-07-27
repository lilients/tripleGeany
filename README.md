# TripleGeany
TripleGeany is a tool to create forms to generate triples. Users can fill the forms without knowledge of the underlying ontology.
The tool is developed at the [interdisciplinary laboratory "Image Knowledge Gestaltung"](https://www.interdisciplinary-laboratory.hu-berlin.de/) at the Humboldt-Universität zu Berlin. 

![tripleG.png](https://bitbucket.org/repo/BenRdX/images/2508877502-tripleG.png)

# Features
 - admin creates a form with subject and predicates for each element
 - admin can seach in triplestore via SPARQL
 - admin can choose between ontologies
 - user fills the form (supported by existing data, calender, etc.)
 - store data as triple (old triples will be overwritten)
 - button to empty all inputfields in user view
 - button to delete whole instances in user view
  
# TODO
https://trello.com/b/tLU63Qb8/triplegeany  

# First steps
To install TripleGeany, follow the following steps:
1. install [xampp](https://www.apachefriends.org/de/index.html)
1. clone the repo from bitbucket to the htdocs folder of your xampp installation 
1. install a triplestore (eg. [sesame](http://rdf4j.org/) with tomcat)
1. create a new repository in the triplestore and add your existing ontology (if you have none, you can use [protégé](http://protege.stanford.edu/) to create one)
1. add the triplestore to TripleGeany by copying the example.json in the folder ontologies and change the data inside accordingly
  
# About
- functions.js: functions for all java scripts
- adminGeany.js: interface to create form
- formGeany.js: generate form from json
- seachGeany.js: searches for triples in the TS and displays the results
- showGeany.js: shows existing data matching the selected formtype
- index.php and logout.php = startpage
- functions.php: functions for the php scripts admin.php, write.php and read.php
- admin.php: read data from the admin and store as json 
- read.php: read JSON data from sesame
- write.php: read JSON, read data from form and store to triplestore
- delete.php: delete a triple 
- deleteForm.php: delete a form
- upload.php: upload a file