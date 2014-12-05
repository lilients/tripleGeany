<?php
/* read JSON, read data from form and store to triplestore
 * *******************************************************
 * @author Svantje Lilienthal
 * @version 2014-06
 * @uses functions.php
 * @todo check if subject already exists
 */

include 'functions.php';

// read the json of the selected form
$formtype = $_POST["startselect"];

$json = json_decode(file_get_contents('../json/' . $formtype . '.json'), true);

// get title, subject and stringToSubject of this formtype
$titleOfForm = $json['title'];

// get formdata: subject and subjecttype
if (isset($json['stringToSubject'])) {
	$stringToSubject = $json['stringToSubject'];
} else {
	$stringToSubject = "";
}

$thisSubject = ":" . $stringToSubject;
$subject = strtolower(str_replace(" ","",$json['subject']));
$subjectArray = explode(";", $subject);

foreach ($subjectArray as $subject) {
	if(isset($_POST[$subject])){
		$thisSubject .= removeUmlauts($_POST[$subject]);
	}
}

$subjecttype = $json['subjecttype'];

if (isset($_POST["value" . $subject]) && $_POST[$subject] == $_POST["value" . $subject]) {
	$triples = "";
} else {
	// create first triple in turtle format
	if (isset($subjecttype) && $subjecttype != "") {
		$triples = $thisSubject . " rdf:type " . $subjecttype . " . ";
	}
}

// according ontology name
$source = $json['source'];

// read data from the form
for ($i = 0; $i < count($json["field"]); $i++) {
	for ($j = 0; $j < count($json["field"][$i]["element"]); $j++) {

		// get variables from json
		$label = $json["field"][$i]["element"][$j]["label"];
		$name = $json["field"][$i]["element"][$j]["name"];
		$predicate = $json["field"][$i]["element"][$j]["predicate"];
		$type = $json["field"][$i]["element"][$j]["type"];
		
		if (isset($json["field"][$i]["element"][$j]["multiple"]) && $json["field"][$i]["element"][$j]["multiple"] == "true") {
			$multiple = true;
		}else{
			$multiple = false;
		}

		// read default value from form
		if (isset($_POST["value" . $name])) {
			$default = $_POST["value" . $name];
		} else {
			$default = "";
		}
		
		$defaults = explode(";", $default);
		
		// delete all old values
		foreach ($defaults as $key => $value) {
			
			// exeption for inputtype time because of the ":" inside
			if (contains_substr($defaults[$key], ":") && $type != "time") {
				deleteFromTS($thisSubject . ' ' . $predicate . ' ' . $defaults[$key] . ' . ', $source);
			} else {
				deleteFromTS($thisSubject . ' ' . $predicate . ' "' . $defaults[$key] . '" . ', $source);
			}
			
		}
		
		// read object from form
		if (isset($_POST[$name])) {
			$object = $_POST[$name];
			$triples = "";
			
				if(is_array($object)){
			
					foreach ($object as $key => $value) {
						if (!contains_substr($object[$key], ":")) {
								$object[$key] = '"' . $object[$key] . '"';
							}
							$triples .= $thisSubject . ' ' . $predicate . ' ' . $object[$key] . ' . ';
						}
					
				}else{
					switch ($type) {
						case 'selectlist' :
						case 'sparqlselect' :
							if (!contains_substr($object, ":")) {
								$object = "'" . $object . "'";
							}
							$triples .= $thisSubject . ' ' . $predicate . ' ' . $object . ' . ';
							break; 
						case "checkbox":
							if($object == "on"){
								$object = 	$type = $json["field"][$i]["element"][$j]["object"];
								$triples .= $thisSubject . ' ' . $predicate . ' "' . $object . '" . ';
							}
							break;
						case 'time':
							$triples .= $thisSubject . ' ' . $predicate . ' "' . $object . '" . ';
							break;
						case 'file' :
							// TODO
							break;
						default :
							$triples .= $thisSubject . ' ' . $predicate . ' "' . $object . '" . ';
							break;
					}
				}
						
		} 
		
	}
}

// write new values
//writeToTS($triples, $source);

// go back
$hostname = $_SERVER['HTTP_HOST'];
$path = dirname($_SERVER['PHP_SELF']);
// header('Location: http://' . $hostname . ($path == '/' ? '' : $path) . '/../form/');
echo $triples;
 
?>