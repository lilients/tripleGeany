<?php
/* upload file
 * ************************************
 * @author Svantje Lilienthal
 * @version 2014-06
 */

	$filename = $_FILES['datei']['tmp_name'];
	$destination = '../upload/'.basename($_FILES['datei']['name']);
	move_uploaded_file($filename, $destination);
	echo "Datei hochgeladen";
?>