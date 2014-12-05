<?php
/* read formstructure and store to file
 * ************************************
 * @author Svantje Lilienthal
 * @version 2014-12
 * @uses functions.php
 */

include 'functions.php';

// login (source: http://aktuell.de.selfhtml.org/artikel/php/loginsystem/)
session_start();

$hostname = $_SERVER['HTTP_HOST'];
$path = dirname($_SERVER['PHP_SELF']);

if (!isset($_SESSION['admin']) || !$_SESSION['admin']) {
	header('Location: http://' . $hostname . ($path == '/' ? '' : $path) . '/../index.php');
	exit ;
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Administrierung von TripleGeany</title>
		<meta name="author" content="S" />
		<link rel="stylesheet" type="text/css" href="../style/div.css" />
		<link rel="icon" type="image/png" href="../img/tripleG.png">
		<script type="text/javascript" src="../D3/d3.v3.min.js"></script>
		<script type="text/javascript" src="../jquery/jquery-1.10.2.min.js"></script>
		<script language="javascript" type="text/javascript" src="../coolfieldset/js/jquery.coolfieldset.js"></script>
		<link rel="stylesheet" type="text/css" href="../coolfieldset/css/jquery.coolfieldset.css" />
		<script type="text/javascript" src="../js/jsFunctions.js" ></script>
	</head>
	<body>
		<form id="logout" class="logout" name="logout" method="post" action="../logout.php">
			<input class="img" type="image" src="../img/tripleG.png" alt="TripleGeany" title="log out">
		</form>
		<div class="t">
			Vorschau:
			<br>
		</div>
		<?php
		/*
		 * read strucutre + store as JSON
		 */

		// read data from form via post
		$filename = $_POST["nameOfFile"];
		$formTitle = $_POST["titleOfForm"];
		$stringToSubject = $_POST["stringToSubject"];
		$subject = "";
		
		// store each selected subject seperated by ";"
		foreach ($_POST['subject'] as $selectedOption){
			$subject .= $selectedOption . ";";
		}
		
		$subjecttype = $_POST["subjecttype"];

		// store read structure to json
		$json = '{';
		//	$json .= ' "title": "' . $formTitle . '", "subject": "' . $subject . '", "stringToSubject": "' . $stringToSubject . '", "subjecttype":"' . $subjecttype . '", "';
		$json .= writeLine("title", $formTitle) . ", " . writeLine("subject", $subject) . ", " . writeLine("stringToSubject", $stringToSubject) . ", " . writeLine("subjecttype", $subjecttype) . ", ";

		$source = $_POST["source"];
		$json .= writeLine("source", $source) . ", ";
		$vocabulary = json_decode(file_get_contents('../ontologies/' . $source . '.json'), true);

		// begin field
		$json .= ' "field": [';

		$i = 0;
		// loop for each field
		while (isset($_POST["fieldTitle" . $i])) {

			$fieldTitle = $_POST["fieldTitle" . $i];
			$fieldName = strtolower($_POST["fieldTitle" . $i]);
			$fieldClone = isset($_POST["clone" . $i]);

			// field begin
			$json .= '{
			      "label": "' . $fieldTitle . '",
			      "name": "' . $fieldName . '",';

			// element begin
			$json .= '"element":[';

			$j = 0;
			//loop for each element j
			while (isset($_POST["elementTitle" . $i . $j])) {
				// read element data via POST
				$elementType = $_POST["type" . $i . $j]; // mandatory
				$elementTitle = $_POST["elementTitle" . $i . $j]; // mandatory
				$elementName = str_replace(" ", "", strtolower($_POST["elementTitle" . $i . $j])); // generated from elementTitle
				$predicate = $_POST["predicate" . $i . $j];

				$elementRequired = isset($_POST["required" . $i . $j]);

				if(isset($_POST["defaultvalue" . $i . $j]) && $_POST["defaultvalue" . $i . $j] !== "" ){
					$elementDefault = $_POST["defaultvalue" . $i . $j];
				}else{
					$elementDefault = "";
				}
				
				if(isset($_POST["explanation" . $i . $j])&& $_POST["explanation" . $i . $j] !== "" ){
					$elementExplanation = $_POST["explanation" . $i . $j];
				}else{
					$elementExplanation = "";
				}
				

				// store type, name, label and predicate in json variable
				$json .= "{" . writeLine("type", $elementType) . ", " . writeLine("name", $elementName) . ", " . writeLine("label", $elementTitle) . ", " . writeLine("predicate", $predicate);

				switch ($elementType) {
					case 'selectlist' :
						// read options if type is selectlist
						$options = $_POST["options" . $i . $j];
						$json .= "," . writeLine("options", $options);
						break;
					case 'sparqlselect' :
					case "autocomplete" :
						// read sparqlquery if type is sparqlselect
						$options = $_POST["query" . $i . $j];
						$json .= "," . writeLine("query", $options);
						break;
					case 'checkbox' :
						$checkboxObject = $_POST["checkboxObject" . $i . $j];
						$checked = $_POST["defaultvalue" . $i . $j];
						$json .= "," . writeLine("object", $checkboxObject) . "," . writeLine("checked", $checked);
						break;

					default :
						break;
				}

				// element is required
				if ($elementRequired) {
					$json .= ', "required": "true"';
				}
				if (isset($_POST["multiple" . $i . $j])) {
					$json .= ', "multiple": "true"';
				}

				if ($elementDefault !== "") {
					$json .= "," . writeLine("defaultvalue", $elementDefault);
				}

				if ($elementExplanation !== "") {
					$json .= "," . writeLine("explanation", $elementExplanation);
				}

				// end of this element
				$json .= "}";

				$j++;

				// check if this is not the last element to set ','
				if (isset($_POST["elementTitle" . $i . $j])) {
					$json .= ", ";
				}
			}
			// end of field
			$json .= "]}";

			$i++;

			// check if this is not the last field to set ','
			if (isset($_POST["elementTitle" . $i . "0"])) {
				$json .= ", ";
			}

		}

		$json .= "]}";
		// end of all

		if (isJson($json)) {
			echo $json;
			//$json = json_encode($json);
			//displayJSON($json);
			// store to file
			$file = fopen('../json/' . $filename . '.json', 'w');
			fwrite($file, $json);
			fclose($file);
		} else {
			echo "Invalid JSON";
		}
		?>
		<script></script>

		<?php
		/*************
		 * Functions *
		 *************/
		// write triple
		function writeLine($key, $value) {
			return '"' . $key . '": ' . '"' . $value . '" ';
		}

		function isJson($string) {
			json_decode($string);
			return (json_last_error() == JSON_ERROR_NONE);
		}

		// not used
		function displayJSON($json) {
			$output = "<script>var str = JSON.stringify('{$json}', undefined, 4);document.body.appendChild(document.createElement('pre')).innerHTML = str;</script>";
			echo $output;

		}
		?>
		<br />
		<a href="../admin/" title="zurück zum Formular">zurück</a> *** <a href="../form/" title="zur Dateneingabe">Ansehen in der Nutzeransicht</a>
	</body>

</html>