<?php
 /* delete a triple from the given triplestore
 * ********************************************
 * @author Svantje Lilienthal
 * @version 2014-08
 * @uses functions.php
 */

include 'functions.php';

$triple = $_POST['triple'];
$ontologyFile = $_POST['ontologyFile'];

deleteSubject($triple, $ontologyFile);

function deleteSubject($triple, $ontologyFile) {

	// resolve prefixes
	$encodedTriple = resolvePrefixes($triple, $ontologyFile);

	$json = json_decode(file_get_contents('../ontologies/' . $ontologyFile . '.json'), true);

	// formulate delete query
	$query = $json['url'] . "/statements?update=DELETE%20%7B" . $encodedTriple . "%7D";

	// execute query
	$ch = curl_init($query);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('content-type: application/x-www-form-urlencoded'));
	curl_exec($ch);
	curl_close($ch);

}
   
?>