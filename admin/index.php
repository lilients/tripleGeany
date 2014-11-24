<?php
// http://aktuell.de.selfhtml.org/artikel/php/loginsystem/
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
       	<a href="../doku/TripleGeany_userGuide.pdf" target="_blank"><img src="../img/questionmark.png" width="18" height="18" alt="User Guide" title="User Guide"></a>
        <meta name="author" content="S" />
        <!-- Date: 2014-02-10 -->
        <link rel="icon" type="image/png" href="../img/tripleG.png">
        <link rel="stylesheet" href="../style/tripleG.css">
        <link rel="stylesheet" type="text/css" href="../style/div.css" />
        <script type="text/javascript" src="../D3/d3.v3.min.js"></script>
        <script src="../jquery/jquery-1.10.2.js"></script>
        <script src="../jquery/jquery-ui-1.10.4.js"></script>
        <script type="text/javascript" src="../js/functions.js" ></script>
    </head>
    <body>
        <div class="title" id="title">
            Administrierung von TripleGeany
        </div>
        <!-- <div class="note" id="note">
        </div>-->
        <div style="clear: both"></div>
        <div class="left" id="left">
            <div id="tabsLeft">
            	<h2>Formular erstellen</h2>
                <div id="change"></div>
            </div>
        </div>
        <div class="right" id="right">
            <div id="tabsRight">
            	<h2>Tripel durchsuchen</h2>
                <div id="search" class="search"></div>
            </div>
        </div>
    </body>
    <script type="text/javascript" src="../js/adminGeany.js" ></script>
    <script type="text/javascript" src="../js/searchGeany.js" ></script>
</html>

