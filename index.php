<?php
/* index: startpage with login for user and admin
 * **********************************************
 * @author Svantje Lilienthal
 * @version 2014-06
 * @uses: jquery, jquery ui, d3, functions.js
 */
 
// login (source: http://aktuell.de.selfhtml.org/artikel/php/loginsystem/)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	session_start();

	$username = $_POST['username'];
	$password = $_POST['password'];
	$adminname = $_POST['adminname'];
	$adminpassword = $_POST['adminpassword'];

	$hostname = $_SERVER['HTTP_HOST'];
	$path = dirname($_SERVER['PHP_SELF']);

	// check username and passwort of user
	if ($username == 'a' && $password == 'b') {
		$_SESSION['user'] = true;

		header('Location: http://' . $hostname . ($path == '/' ? '' : $path) . '/form');
		exit ;
	}

	// check usesrname and password of admin
	if ($adminname == 'admin' && $adminpassword == 'sudo') {
		$_SESSION['admin'] = true;

		if ($_SERVER['SERVER_PROTOCOL'] == 'HTTP/1.1') {
			if (php_sapi_name() == 'cgi') {
				header('Status: 303 See Other');
			} else {
				header('HTTP/1.1 303 See Other');
			}
		}

		header('Location: http://' . $hostname . ($path == '/' ? '' : $path) . '/admin');
		exit ;
	}
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="de" lang="de">
    <head>
        <meta charset="utf-8">
        <title>TripleGeany</title>
        <link rel="icon" type="image/png" href="img/tripleG.png">
        <link rel="stylesheet" href="style/tripleG.css">
        <link rel="stylesheet" href="style/div.css">
        <script src="//code.jquery.com/jquery-1.10.2.js"></script>
        <script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
        <script src="D3/d3.v3.min.js"></script>
        <script type="text/javascript" src="../js/functions.js"></script>
    </head>
    <body>
        <div class="startpage">
            <div class="t">
                TripleGeany
            </div>
            <div>
                Webanwendung zur erleichterten Erstellung von Tripeln für das Semantic Web
            </div>
            <div>
                <form action="index.php" method="post">
                    <div id="login">
                        <h3> Anmelden als Nutzer </h3>
                        <div>
                        	<img src="img/tripleG.png" class="floatRight"  alt="TripleGeany" title="Daten eingeben mit TripleGeany" height="150px"/>
                            <div class="ll">
                                <label for="username">Nutzername</label>
                            </div>
                            <div class="r">
                                <input type="text" name="username" id="username"/>
                            </div>
                            <div class="ll">
                                <label for="password">Passwort</label>
                            </div>
                            <div class="r">
                                <input id="password" type="password" name="password" />
                            </div>
                            <div class="r">
                                <input type="submit" value="Anmelden" />
                            </div>
                        </div>
                        <h3> Anmelden als Administrator </h3>
                        <div>
                        	<img src="img/tripleG.png" class="floatRight" alt="TripleGeany" title="Administrierung von TripleGeany" height="150px"/>
                            <div class="ll">
                                <label for="username">Nutzername</label>
                            </div>
                            <div class="r">
                                <input type="text" name="adminname" id="adminname"/>
                            </div>
                            <div class="ll">
                                <label for="adminpassword">Passwort</label>
                            </div>
                            <div class="r">
                                <input id="adminpassword" type="password" name="adminpassword" />
                            </div>
                            <div class="r">
                                <input type="submit" value="Anmelden" />
                            </div>
                        </div>
                </form>
            </div>
        </div>
        <script type="text/javascript">
            $("#login").accordion();
        </script>
    </body>
