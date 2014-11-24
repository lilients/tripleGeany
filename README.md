# TripleGeany
TripleGeany is a tool to create forms to generete triples. Users can fill the forms without knowledge of the underlying ontology.
The tool is developed at the interdisciplinary laboratory "Image Knowledge Gestaltung" at the Humboldt-Universität zu Berlin. https://www.interdisciplinary-laboratory.hu-berlin.de/

![tripleG.png](https://bitbucket.org/repo/BenRdX/images/2508877502-tripleG.png)

# Done
 - admin creates a form with subject and predicates for each element
 - admin can seach in triplestore via SPARQL
 - admin can choose between ontologies
 - user fills the form (supported by existing data, calender, etc.)
 - store data as triple (old triples will be overwritten)
 - button to empty all inputfields in user view
 - button to delete whole instances in user view
  
# TODO
https://trello.com/b/tLU63Qb8/triplegeany  
  
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