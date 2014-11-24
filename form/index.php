<?php
// http://aktuell.de.selfhtml.org/artikel/php/loginsystem/
session_start();
$hostname=$_SERVER['HTTP_HOST'];
$path=dirname($_SERVER['PHP_SELF']);
if(!isset($_SESSION['user'])||!$_SESSION['user']) {
header('Location: http://'.$hostname.($path=='/'?'':$path).'/../index.php');
exit ;
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Triple Geany</title>
		<link rel="icon" type="image/png" href="../img/tripleG.png">
		<!-- Dateiupload -->
		<script type="text/php" src="../php/upload.php"></script>
		<!-- Style -->
		<link rel="stylesheet" type="text/css" href="../jquery/jquery.ui.timepicker.css" />
		<link rel="stylesheet" type="text/css" href="../style/tripleG.css" />
		<link rel="stylesheet" type="text/css" href="../style/div.css" />
		<!-- JavaScript -->
		<script type="text/javascript" src="../D3/d3.v3.min.js"></script>
		<script src="//code.jquery.com/jquery-1.10.2.js"></script>
		<script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
		<script type="text/javascript" src="../jquery/jquery.ui.timepicker.js"></script>
		<script type="text/javascript" src="../js/functions.js" ></script>
	</head>
	<body>
		<div class="title" id="title">
			Daten eingeben mit TripleGeany
		</div>
		<a href="../doku/TripleGeany_userGuide.pdf" target="_blank"><img src="../img/questionmark.png" width="18" height="18" alt="User Guide" title="User Guide"></a>

		<div style="clear: both"></div>
		<!--
		<div class="note" id="note">
		</div>-->
		<div class="left" id="left">
			<div id="tabsLeft">
				<h2>Daten eingeben</h2>
				<div id="form"></div>
			</div>
		</div>
		<div class="right">
			<h2>Vorhandene Daten</h2>
			<div id="search"></div>
		</div>
	</body>
	<script type="text/javascript" src="../js/formGeany.js"></script>
	<script type="text/javascript" src="../js/showGeany.js"></script>
</html>

