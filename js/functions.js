/* functions for the javascript files adminGeany.js, formGeany.js, searchGeany.js and showGeany.js
* **********************************
* @author S
* @version 2014-12
* @uses jQuery, jQuery UI, D3
* @todo drag elements (accordion sortable)
* @todo allow admin to change calender settings (range, language, etc.)
*/

/******************************************
 * functionen to create form and elements *
 ******************************************/

// create a form with method and action
function form(location, name, id, method, action) {
	location.append("form").attr("name", name).attr("id", id).attr("method", method).attr("action", action);
}

// create a field
function field(location, name, label, id, display) {

	location.append("div").attr("class", name).attr("id", "accordion" + id).attr("class", "group").append("h3").html(label);
	d3.select("#accordion" + id).append("div").attr("id", id);

	$("#accordion" + id).accordion({
		collapsible : true,
		active : display,
		heightStyle : "content"
	});
}

// create simple inputfield
function input(location, id, name, label, value, explanation) {
	
	left(location, id, label);
	location.append("div").attr("class", "r").append("input").attr("name", name).attr("id", id).attr("value", value).attr("title", explanation);
	clear(location);
}

// image: create image inputfield with preview
function image(location, id, name, label, value, explanation){
	left(location, name, label);
	var right = location.append("div").attr("class", "r");
	right.append("input").attr("name", name).attr("id", id).attr("value", value).attr("title", explanation);
	right.append("input").attr("id","button"+id).attr("type", "button").attr("value", "Vorschau").attr("onclick","displayImage('"+id+"')");
	clear(location);
	if(value !== ""){
		displayImage(id);
	}
}

function displayImage(id){
	// read adress from input
	var link = $("#"+id).val();
	// display image
	$("#"+id).parent().parent().append("<img src='"+link+"'></img>");
	$("#button"+id).attr("onclick", "hideImage('"+id+"')").attr("value","Verstecken");
}

function hideImage(id){
	var number = parseInt(id.replace(/[^0-9\.]/g, ''), 10);
	$('#element'+number).find('img').remove();
	$("#button"+id).attr("onclick", "displayImage('"+id+"')").attr("value","Vorschau");
	
}

// textarea
function textarea(location, id, name, label, defaultvalue, explanation) {
	left(location, name, label);
	location.append("div").attr("class", "r").append("textarea").attr("id", id).attr("name", name).attr("title", explanation);
	//.attr("cols", "17.8").attr("rows", "4")
	$("#" + id).html(defaultvalue);
	clear(location);
}

// add an input with datepicker to the location
function date(location, id, name, label, defaultvalue, explanation) {
	left(location, name, label);
	//var currentDate = getCurrentDate();
	location.append("div").attr("class", "r").append("input").attr("id", id).attr("name", name).attr("title", explanation).attr("value", defaultvalue).text(defaultvalue);
	//.attr("value", currentDate);
	$(function() {
		$("#" + id).datepicker({
			changeMonth : true,
			changeYear : true,
			yearRange : '-10000:+1000',
			minDate : '-1000y',
			maxDate : '+100y',
			dateFormat : "yy-mm-dd",
			monthNames : ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
			monthNamesShort : ["Jan", "Feb", "März", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
			dayNames : ["Sonntag", "Montag", "Dienstag", "Mitwoch", "Donnerstag", "Freitag", "Samstag"],
			dayNamesMin : ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
			firstDay : 1,

		});
	});
	clear(location);
}

// add a timefield
// https://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
// https://fgelinas.com/code/timepicker/
function time(location, id, name, label, defaultvalue, explanation) {
	left(location, name, label);
	//   var currentTime = getCurrentTime();
	location.append("div").attr("class", "r").append("input").attr("id", id).attr("name", name).attr("title", explanation).attr("value", defaultvalue).text(defaultvalue);
	//.attr("value", currentTime);

	$('#' + id).timepicker({
		showPeriodLabels : false,
		hourText : 'Stunde',
		minuteText : 'Minuten'
	});
	clear(location);
}

// number input
// https://fgelinas.com/code/timepicker/
// current time not used at the moment
function number(location, id, name, label, defaultvalue, explanation) {
	left(location, name, label);
	//   var currentTime = getCurrentTime();
	location.append("div").attr("class", "r").append("input").attr("id", id).attr("name", name).attr("title", explanation).text(defaultvalue);
	//.attr("value", currentTime);
	$('#' + id).spinner();
	clear(location);
}

// fancy checkbox
function checkbox(location, id, name, selected) {
	var div = location.append("div").attr("class", "onoffswitch");
	if (selected) {
		div.append("input").attr("type", "checkbox").attr("id", id).attr("name", name).attr("class", "onoffswitch-checkbox").attr("checked", "checked");
	} else {
		div.append("input").attr("type", "checkbox").attr("id", id).attr("name", name).attr("class", "onoffswitch-checkbox");
	}
	var label = div.append("label").attr("class", "onoffswitch-label").attr("for", id);
	label.append("div").attr("class", "onoffswitch-inner");
	label.append("div").attr("class", "onoffswitch-switch");
}

function makeCheckbox(location, id, name, label, selected) {
	left(location, id, label);
	var right = location.append("div").attr("id", id).attr("class", "r");
	checkbox(right, "checkbox" + id, name, selected);
	clear(location);
}

function radiobutton(location, id) {
	location.append("input").attr("type", "radio").attr("id", id);
}

// radiobutton with layout
function makeRadiobutton(location, id, label) {
	left(location, id, label);
	var right = location.append("div").attr("id", id).attr("class", "r");
	radiobutton(right, id);
	clear(location);
}

// selectlist: options are given in an array
function selectList(location, id, name, label, options, onchange, title) {
	left(location, id, label);
	var loc = location.append("div").attr("class", "r").append("select").attr("id", id).attr("name", name).attr("onChange", onchange).attr("title", title);

	// append empty option
	//	d3.select("#" + id).append("option").attr("value", "").html("");

	$.each(options, function(i, val) {
		loc.append("option").html(val).attr("value", val);
	});
	clear(location);
}

// selectlist with default values from triplestore
function sparqlselect(location, id, name, label, query, source, selected) {
	$(document).ready(function() {
		selectList(location, id, name, label, "", "");

		d3.select("#" + id).append("option").attr("value", "").html("");

		var prefixShort = new Array();
		var prefixLong = new Array();

		$.getJSON("../ontologies/" + source + ".json", function(data) {

			for (var i = 0; i < data.prefix.length; i++) {
				prefixShort.push(data.prefix[i]['short']);
				prefixLong.push(data.prefix[i]['long']);
			}
			// read JSON from TripleStore via read.php
			$.post("../php/read.php", {
				'query' : query,
				'source' : source,
			}, function(json) {
				var i = 0;
				var value = "";

				while (json.results.bindings[i]) {
					value = json.results.bindings[i]["s"]['value'];

					for (var j = 0; j < prefixShort.length; j++) {
						value = value.replace(prefixLong[j], prefixShort[j]);
					}

					if (value == selected) {
						d3.select("#" + id).append("option").attr("value", value).attr("selected", "selected").html(value);
					} else {
						d3.select("#" + id).append("option").attr("value", value).html(value);
					}
					i++;
				}
			}, "json");
		});

	});
}

function replaceArray(string, pattern, replace) {

	for (var i = 0; i < pattern.length; i++) {
		string = string.replace(pattern[i], replace[i]);
	}

	return string;
}

// create inputfield with autocomplete: query asks triplestore
function autocomplete(location, id, name, label, query, source, defaultvalue) {
	left(location, id, label);
	var loc = location.append("div").attr("class", "r").append("input").attr("id", id).attr("name", name).attr("value", defaultvalue);

	var prefixShort = new Array();
	var prefixLong = new Array();

	$.getJSON("../ontologies/" + source + ".json", function(data) {

		for (var i = 0; i < data.prefix.length; i++) {
			prefixShort.push(data.prefix[i]['short']);
			prefixLong.push(data.prefix[i]['long']);
		}

		// get values from TS via ajax + php
		$.post("../php/read.php", {
			'query' : query,
			'source' : source
		}, function(data) {
			var availableTags = new Array();
			var tag = "";

			var i = 0;
			var value = "";

			if ( typeof data.results.bindings[i] != "undefined") {
				while (data.results.bindings[i]) {
					value = data.results.bindings[i]["s"]['value'];
					availableTags[i] = replaceArray(value, prefixLong, prefixShort);
					i++;
				}
			}

			$("#" + id).autocomplete({
				source : availableTags
			});

		}, "json");
	});

	clear(location);
}

// fileupload
function file(location, name, id, label, action) {
	location.append("div").attr("class", "l").attr("id", "up01").append("label").attr("for", id).html(label);
	// id für Anhängen des verlinkten Dateinamens
	var form = location.append("div").attr("id", name).attr("class", "r").append("form").attr("action", "").attr("method", "post").attr("enctype", "multipart/form-data");
	form.append("input").attr("name", "datei").attr("type", "file").attr("id", "file");
	form.append("input").attr("type", "button").attr("value", "Upload").attr("onclick", action);
	clear(location);
}

// upload a file (source: http://www.it-gecko.de/html5-file-upload-fortschrittanzeige-progressbar.html)
// calls upload.php and returnd filename
function uploadFile() {
	var file = document.getElementById("file").files[0];
	//FormData Objekt erzeugen
	var formData = new FormData();
	//Fügt dem formData Objekt unser File Objekt hinzu
	formData.append("datei", file);
	//XMLHttpRequest Objekt erzeugen
	var client = new XMLHttpRequest();
	client.open("POST", "../php/upload.php");
	client.send(formData);
	// Hochgeladene Datei verlinkt anzeigen
	d3.select("#up01").append("br");
	d3.select("#up01").append("a").attr("href", "./upload/" + file.name).html(file.name);
}

// upload a JSON file - not used at the moment
function uploadJSON() {
	var file = document.getElementById("file").files[0];
	var formData = new FormData();
	formData.append("datei", file);
	var client = new XMLHttpRequest();
	client.open("POST", "uploadJSON.php");
	client.send(formData);
	d3.select("#up01").append("br");
	d3.select("#up01").append("a").attr("href", "./JSONupload/" + file.name).html(file.name);
}

// delete a field
function deleteField(fieldnumber) {
	$("#field" + fieldnumber).remove();
}

// delete an element
function deleteElement(fieldnumber, elementnumber) {
	$("#element" + fieldnumber + elementnumber).remove();
}

/********************
 * layout functions *
 ********************/

// logout with logo
function logout(location) {
	form(location, "logout", "logout", "post", "../logout.php");
	d3.select("#logout").attr("class", "logout");
	d3.select("#logout").append("input").attr("type", "image").attr("src", "../img/tripleG.png").attr("alt", "TripleGeany").attr("title", "log out").attr("class", "img");
}

// creates left side of form with label
function left(location, id, label) {
	location.append("div").attr("class", "l").append("label").attr("for", id).html(label);
}

// clear location
function clear(location) {
	location.append("div").attr("class", "a");
	location.append("div").attr("style", "clear:both");
}

// Buttons
function button(location, id, name, onclick) {
	location.append("input").attr("type", "button").attr("id", id).attr("name", name).attr("onclick", onclick);
}

function makeButton(location, id, name, label, value, action) {
	left(location, id, label);
	location.append("div").attr("class", "r").append("input").attr("id", id).attr("name", name).attr("type", "button").attr("value", value).attr("onclick", action);
	clear(location);
}

function clickButton(location, id, title, onclick, type) {
	location.append("button").attr("type", "button").attr("id", id).attr("title", title).attr("onclick", onclick);
	$(function() {
		$("#" + id).button({
			icons : {
				primary : "ui-icon-" + type
			},
			text : false,
		});
	});
}

function submitbutton(location, label) {
	location.append("div").attr("class", "l");
	if (label == "") {
		label = "Daten absenden";
	}
	location.append("div").attr("class", "r").append("button").attr("value", label).text(label);
	clear(location);
}

/******************
 * help functions *
 ******************/
// create a cookie (source: http://stackoverflow.com/questions/2257631/how-create-a-session-using-javascript)
function writeCookie(name, value, days) {
	var date, expires;
	if (days) {
		date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString();
	} else {
		expires = "";
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}

// read a cookie (source: http://stackoverflow.com/questions/2257631/how-create-a-session-using-javascript)
function readCookie(name) {
	var i, c, ca, nameEQ = name + "=";
	ca = document.cookie.split(';');
	for ( i = 0; i < ca.length; i++) {
		c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1, c.length);
		}
		if (c.indexOf(nameEQ) == 0) {
			return c.substring(nameEQ.length, c.length);
		}
	}
	return '';
}

// returns current date
function getCurrentDate() {
	var d = new Date();
	var currentDate = d.getFullYear();
	currentDate += "-" + (d.getMonth() + 1);
	currentDate += "-" + d.getDate();
	return currentDate;
}

// returns current time
function getCurrentTime() {
	var t = new Date();
	var currentTime = t.getHours() + ":";
	currentTime += t.getMinutes();
	return currentTime;
}

// Erstes Zeichen eines String groß, restliche Zeichen, bleiben unverändert
function upperCaseFirst(string) {
	return string.substring(0, 1).toUpperCase() + string.substring(1);
}

// check if vlaue ist part of list
function isPartOf(list, value) {
	var isPart = false;
	for ( i = 0; i < list.length; ++i) {
		if (list.options[i].value == value) {
			isPart = true;
		}
	}
	return isPart;
}

// hide the info box
function hideNote(name) {
	writeCookie("note", name, 1);
	$("#note").dialog("close");
}

// insert a node after an other node
function insertAfter(referenceNode, newNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
