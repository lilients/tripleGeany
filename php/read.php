<?php
/* read.php: send query to triplestore and return the result
 * ************************************************
 * @author Svantje Lilienthal
 * @version 2014-06
 * @uses functions.php
 */
include 'functions.php';

// default query
$query = 'SELECT ?s WHERE { ?s rdfs:domain ?o .}';

// read query from form if not empty and contains 'select'‚
if (isset($_POST['query'])) {
	$query = $_POST['query'];
	$source = $_POST['source'];
}

$json = json_decode(file_get_contents('../ontologies/'.$source.'.json'), true);
$url = $json['url'];

// formulate query and resolve the prefixes
$query = $url . '?query=' . resolvePrefixes($query, $source);

// initialize a curl session with URL of the database
$ch = curl_init($query);

// define data type of requested data: rdf-json
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/sparql-results+json'));
// 'Accept: application/rdf+json'

// execute request and close connection
curl_exec($ch);
curl_close($ch);
?>