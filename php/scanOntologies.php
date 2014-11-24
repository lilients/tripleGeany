<?php
/* read content of directory
 * *************************
 * @author Svantje Lilienthal
 * @version 2014-06
 */

$scan = scandir('../ontologies');
$list = "";

foreach ($scan as $file) {
	if (!is_dir("../json/$file")) { // && $file != ""
		$list .= $file.";";
	}
}
echo $list;
?>