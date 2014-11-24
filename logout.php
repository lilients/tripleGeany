<?php
/* logout: for user and admin
 * ***************************
 * @author Svantje Lilienthal
 * @version 2014-06
 */
 
session_start();
session_destroy();

$hostname = $_SERVER['HTTP_HOST'];
$path = dirname($_SERVER['PHP_SELF']);

header('Location: http://' . $hostname . ($path == '/' ? '' : $path) . '/');
?>