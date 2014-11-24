<?php
/* functions for the php scripts admin.php, write.php and read.php
 * *************************************************************
 * @author Svantje Lilienthal
 * @version 2014-06
 *
 */

/* resolve prefixes: replace short notation with long one
 * @param  String $data, String $file
 * @return String
 */
function resolvePrefixes($string, $file) {

	// read prefixes from file
	$json = json_decode(file_get_contents('../ontologies/' . $file . '.json'), true);

	// define arrays
	$prefixes = array();
	$pattern = array();
	$replacement = array();

	// fill arrays
	$i = 0;
	while (isset($json['prefix'][$i])) {
		array_push($prefixes, $json['prefix'][$i]['short']);
		array_push($pattern, '/' . $json['prefix'][$i]['short'] . '/');
		array_push($replacement, urlencode('<' . $json['prefix'][$i]['long']));
		$i++;
	}

	// seperate string to array of words
	$array = explode(" ", $string);

	// replace prefixes with according urls
	foreach ($array as &$value) {

		foreach ($prefixes as $prefix) {
			if (contains_substr($value, $prefix) && !contains_substr($value, '"')) {
				$value = preg_replace($pattern, $replacement, $value);
				$value .= "%3E";
			}

		}

	}

	// store and return manipulated string
	$string = implode("%20", $array);
	return $string;
}

// delete triple from the ontology described in the ontologyFile
function deleteFromTS($triple, $ontologyFile) {

	// resolve prefixes
	$encodedTriple = resolvePrefixes($triple, $ontologyFile);

	$json = json_decode(file_get_contents('../ontologies/' . $ontologyFile . '.json'), true);

	// formulate delete query
	$query = $json['url'] . "/statements?update=DELETE%20DATA%20%7B" . $encodedTriple . "%7D";

	// execute query
	$ch = curl_init($query);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('content-type: application/x-www-form-urlencoded'));
	curl_exec($ch);
	curl_close($ch);

}

// write data to the triplestore described by the ontologyfile
function writeToTS($data, $ontologyFile) {

	// read prefixes from file
	$json = json_decode(file_get_contents('../ontologies/' . $ontologyFile . '.json'), true);

	$prefixes = '';

	$i = 0;
	while (isset($json['prefix'][$i])) {
		$prefixes .= '@prefix ' . $json['prefix'][$i]['short'] . '<' . $json['prefix'][$i]['long'] . '> .';
		$i++;
	}

	// initialize a curl session with URL of the database
	$ch = curl_init($json['url'] . '/statements');
	
	// TODO error check (rückgabe triplestore)

	// set options
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('content-type: application/x-turtle'));
	// rdf+json or x-turtle
	curl_setopt($ch, CURLOPT_POSTFIELDS, $prefixes . $data);
	// $json or $turtle

	//execute post and close connection
	$result = curl_exec($ch);
	curl_close($ch);

}

/*
 * Help functions
 */

/*
 * Simple helper to debug to the console
 * @param  Array, Object, String $data
 * @return String
 * Quelle: http://bueltge.de/einfaches-php-debugging-in-browser-console/
 */
function console($data) {

	$output = '';

	if (is_array($data)) {
		$output .= "<script>console.warn( 'Debug Objects with Array.' ); console.log( '" . implode(',', $data) . "' );</script>";
	} else if (is_object($data)) {
		$data = var_export($data, TRUE);
		$data = explode("\n", $data);
		foreach ($data as $line) {
			if (trim($line)) {
				$line = addslashes($line);
				$output .= "console.log( '{$line}' );";
			}
		}
		$output = "<script>console.warn( 'Debug Objects with Object.' ); $output</script>";
	} else {
		$output .= "<script>console.log( 'Debug Objects: {$data}' );</script>";
	}

	echo $output;
}

// check if $str is part of the $mainStr
function contains_substr($mainStr, $str, $loc = false) {
	if ($loc === false)
		return (strpos($mainStr, $str) !== false);
	if (strlen($mainStr) < strlen($str))
		return false;
	if (($loc + strlen($str)) > strlen($mainStr))
		return false;
	return (strcmp(substr($mainStr, $loc, strlen($str)), $str) == 0);
}

// remove umlauts and blanks
// TODO: read umlauts from json file
function removeUmlauts($string) {

	$umlauts = array(" ", "ä", "Ä", "ö", "Ö", "ü", "Ü", "ß");
	$replacement = array("", "ae", "Ae", "oe", "Oe", "ue", "Ue", "ss");
	$newString = str_replace($umlauts, $replacement, $string);
	return $newString;

}
?>