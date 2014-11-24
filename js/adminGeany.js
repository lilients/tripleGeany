/* adminGeany: interface to create form
* *************************************
* @author Svantje Lilienthal
* @version 2014-06
* @uses functions.js
* @todo move elements up and down between fields
*/

/*********
 * title *
 *********/
$(document).ready(function() {
	logout(d3.select("#title"));
	$("#note").dialog();
	// check if dialog should be opened by reading the cookie
	if (readCookie("note") == 'admin') {
		$("#note").dialog("close");
	}
	$("#tabsLeft").tabs().resizable();
	// .draggable()
	$("#tabsRight").tabs().resizable({
		handles : 'w' // n = top; s = bottom; w = left side; e = right side
	});

	$("button").button();
	$(document).tooltip();

	/*********************************
	 * left side: create/change form *
	 *********************************/

	// array to store fields and elements plus chosen type
	var fields = [];

	var buttonLoc = d3.select("#change").append("div").attr("class", "floatRight");
	clickButton(buttonLoc, "deleteForm", "dieses Formular löschen", "deleteForm()", "trash");

	// create selectlist of forms by reading files in .json
	$.get("../php/scanJSON.php", function(data) {

		// string to array
		var formOptions = data.split(";");
		// trim .json
		for (var i = 0; i < formOptions.length; i++) {
			formOptions[i] = formOptions[i].substr(0, formOptions[i].lastIndexOf("."));
		}

		formOptions.unshift("");
		formOptions.pop();
		//  createForm("new",'');

		// create selectList to change form
		selectList(d3.select("#change"), 'start', 'startselect', "Formular wählen", formOptions, "readForm('')", "");
		makeButton(d3.select("#change"), "makeNewForm", "newForm", "oder", "neues Formular", "createNewForm()");

		form(d3.select("#change"), "data", "adminForm", "post", "../php/admin.php");

		// read session cookie
		if (readCookie("filename") == "" || readCookie("filename") == "new") {
			createNewForm();
		} else {
			readForm(readCookie("filename"));
		}

	});
});

function deleteForm() {
	// read chosen filename
	var list = document.getElementById("start");
	var filename = list.options[list.selectedIndex].text;
	// confirm
	var check = confirm("Dieses Formular wirklich löschen?");
	// delete file
	if (check) {
		writeCookie("filename", "new");
		$.post("../php/deleteForm.php", {
			'filename' : filename
		}, function() {
			alert("Das Formular " + filename + " wurde gelöscht.");
		});
		location.reload();
	}

}

// create form: reads value of the selectlist -> create new form or read existing
function createForm() {

	// remove old form
	$("#mod").remove();
	$("#send").remove();
	$("#accordionsubjectField").remove();

	// add new form
	var adminLoc = d3.select("#adminForm");
	adminLoc.append("div").attr("id", "mod");
	$("#mod").accordion({
		collapsible : true,
		heightStyle : "content"
	});

	field(adminLoc, "subjectField", "Subjekt", "subjectField", 0);

	var buttonLocation = adminLoc.append("div").attr("id", "send");

	submitbutton(buttonLocation, "Formular speichern");

	fields = [];

}

/*******************
 * create new form *
 *******************/
function createNewForm() {
	$("option:selected").prop("selected", false);
	$("#deleteForm").button({
		disabled : true
	});
	writeCookie("filename", "new", 1);
	createForm();
	//	var fieldnumber = fields.length;
	addTitle(d3.select("#mod"), "", "", "");
	subjectField(d3.select("#subjectField"), "", "", "");
	addField(d3.select("#mod"), "0", "");
	addElement("0", "input", "", "", "", "", "", "", "", "");
	// fieldnumber, type, predicate, value, clone, required, options, defaultvalue, explanation, multiple, url, base
}

/***********************
 * read form structure *
 ***********************/
function readForm(filename) {
	$("#deleteForm").button({
		disabled : false
	});

	createForm();

	var loc = document.getElementById("start");

	if (filename == "") {
		// read selectlist
		var filename = loc.options[loc.selectedIndex].text;
	} else {
		// select filename
		for (var count = 0; count < loc.options.length; count++) {
			if (loc[count].value == filename) {
				loc[count].selected = true;
			}
		}
	}
	writeCookie("filename", filename, 1);

	//  d3.select("#adminForm").append("div").attr("id", "mod");
	var loc = document.getElementById("start");
	var filename = loc.options[loc.selectedIndex].text;

	// read JSON from file to get structure
	$.getJSON("../json/" + filename + ".json", function(json) {

		addTitle(d3.select("#mod"), json.title, filename, json.source);

		subjectField(d3.select("#subjectField"), json.subjecttype, json.stringToSubject, json.source);

		// subject: separate multiple values, if there is one value (no ; in the string) split returns the original string
		var sub = json.subject.split(";");
		var s = 0;
		while ( typeof sub[s] != 'undefined' && sub[s] != "") {
			addToSubjectlist(sub[s]);
			$('select[id^="subject"] option[value="' + sub[s] + '"]').attr("selected", "selected");
			s++;
		}

		for ( fieldnumber = 0; fieldnumber < json.field.length; fieldnumber++) {

			var fieldlabel = json.field[fieldnumber].label;
			addField(d3.select("#mod"), fieldnumber, fieldlabel);

			for ( elementnumber = 0; elementnumber < json.field[fieldnumber].element.length; elementnumber++) {

				var type = json.field[fieldnumber].element[elementnumber].type;
				var label = json.field[fieldnumber].element[elementnumber].label;
				var predicate = json.field[fieldnumber].element[elementnumber].predicate;

				if ( typeof json.field[fieldnumber].element[elementnumber].clone == 'undefined') {
					var clone = false;
				} else {
					var clone = json.field[fieldnumber].element[elementnumber].clone;
				}

				var required = json.field[fieldnumber].element[elementnumber].required;

				if ( typeof json.field[fieldnumber].element[elementnumber].defaultvalue != "undefined") {
					var defaultvalue = json.field[fieldnumber].element[elementnumber].defaultvalue;
				} else {
					var defaultvalue = "";
				}

				if ( typeof json.field[fieldnumber].element[elementnumber].explanation != "undefined") {
					var explanation = json.field[fieldnumber].element[elementnumber].explanation;
				} else {
					var explanation = "";
				}

				if ( typeof json.field[fieldnumber].element[elementnumber].multiple == 'undefined') {
					var multiple = false;
				} else {
					multiple = json.field[fieldnumber].element[elementnumber].multiple;
				}

				var options = "";

				switch(type) {
					case "checkbox":
						options = json.field[fieldnumber].element[elementnumber].object;
						break;
					case "selectlist":
						options = json.field[fieldnumber].element[elementnumber].options;
						break;
					case "sparqlselect":
					case "autocomplete":
						options = json.field[fieldnumber].element[elementnumber].query;
						break;
					case "table":
						options = json.field[fieldnumber].element[elementnumber].xlabels + "." + json.field[fieldnumber].element[elementnumber].ylabels;
						break;
					default:
						break;
				}
				addElement(fieldnumber, type, predicate, label, clone, required, options, defaultvalue, explanation, multiple);

				if (required) {
					setSubjectOptions(fieldnumber, elementnumber);
				}
			}
		}
	});
}

// create field to select the subject for this form
function subjectField(location, subjecttype, stringToSubject, source) {

	var subjectOptions = new Array();
	selectList(location, "subject", "subject[]", "Subjekt", subjectOptions, "", "Bestimmung der Benennung des jeweiligen Subjekts. Wird automatisch mit Pflichtfeldern gefüllt. Bitte wählen Sie ein oder mehrere Subjekte aus.");
	d3.select("#subject").attr("multiple", "").attr("required", "");
	var numberOfOptions = $('#subject > option').length;
	d3.select("#subject").attr("size", numberOfOptions + 1);

	input(location, "stringToSubject", "stringToSubject", "Subjektergänzung", stringToSubject, "Optional kann ein Subjekt durch eine Zeichenkette ergänzt werden, um die Bezeichnung eindeutiger zu machen. Beispiel: :lunchtalk2014-05-05 statt nur 2014-05-05");
	// SELECT ?s WHERE {?o rdfs:domain ?s }
	autocomplete(location, "subjecttype", "subjecttype", "Subjekttyp", "SELECT ?s WHERE {?s rdf:type rdfs:Class }", source, subjecttype);
	d3.select("#subjecttype").attr("title", "Wählen Sie den impliziten Typ des Subjekts aus. Jeder eingegebene Datensatz beginnt mit einem Tripel: <:diesesSubject> rdf:type <:subjecttype>.");

}

/*************
 * functions *
 *************/
// title of the form
function addTitle(location, value, filename, source) {
	field(location, "", "Meta", "meta", 0);
	/*  $('#meta').coolfieldset({
	 collapsed : false
	 });*/
	var fieldLoc = d3.select("#meta");
	input(fieldLoc, "nameOfFile", "nameOfFile", "Dateiname", filename);
	d3.select("#nameOfFile").attr("required", "");
	input(fieldLoc, "titleOfForm", "titleOfForm", "Formulartitel", value);
	d3.select("#titleOfForm").attr("required", "");

	// read existing ontologies and make selectlist
	$.get("../php/scanOntologies.php", function(data) {
		// string to array
		var formOptions = data.split(";");
		// trim .json
		for (var i = 0; i < formOptions.length; i++) {
			formOptions[i] = formOptions[i].substr(0, formOptions[i].lastIndexOf("."));
		}
		formOptions.unshift("");
		formOptions.pop();

		// create selectList to change form
		selectList(fieldLoc, "source", "source", "Ontologie", formOptions, "changeSource()", "");
		$('select[id^="source"] option[value="' + source + '"]').attr("selected", "selected");
		$("#source").attr("required", "");

	});

}

function changeSource() {

	var loc = document.getElementById("source");
	var source = loc.options[loc.selectedIndex].text;
	var prefixShort = new Array();
	var prefixLong = new Array();

	var query = "SELECT ?s WHERE { ?s rdf:type rdf:Property }";

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
			while (data.results.bindings[i]) {

				availableTags[i] = replaceArray(data.results.bindings[i]["s"].value, prefixLong, prefixShort);

				i++;
			}

			$(".ui-autocomplete-input").autocomplete({
				source : availableTags
			});

		}, "json");
	});

}

// new field with one element
function addNewField() {
	var fieldnumber = fields.length;
	addField(d3.select("#mod"), fieldnumber, "");
	addElement(fieldnumber, "input", "", "", "", "", "", "", "", "");
}

// create field
function addField(location, fieldnumber, fieldlabel) {
	// counter++
	fields.push([]);

	// create field
	field(location, "", "Feld " + fieldnumber + " " + fieldlabel, "field" + fieldnumber, false);

	// fieldLocation
	var fieldLoc = d3.select("#field" + fieldnumber);

	// add buttons
	var buttonsLoc = fieldLoc.append("div").attr("class", "floatRight");
	clickButton(buttonsLoc, "del" + fieldnumber, "dieses Feld löschen", "deleteAdminField(" + fieldnumber + ")", "trash");
	clickButton(buttonsLoc, "up" + fieldnumber, "Feld nach oben verschieben", "moveFieldUp(" + fieldnumber + ")", "arrowthick-1-n");
	clickButton(buttonsLoc, "down" + fieldnumber, "Feld nach unten verschieben", "moveElementDown(" + fieldnumber + ")", "arrowthick-1-s");
	clickButton(buttonsLoc, "add" + fieldnumber, "neues Feld hinzufügen", "addNewField()", "plus");
	clear(fieldLoc);

	// input for fieldlabel
	input(fieldLoc, "fieldTitle" + fieldnumber, "fieldTitle" + fieldnumber, "Feldtitel", fieldlabel);

}

/*
 * create element
 */
function addElement(fieldnumber, type, predicate, elementtitle, clone, required, options, defaultvalue, explanation, multiple) {

	var fieldLoc = d3.select("#field" + fieldnumber);
	var elementnumber = fields[fieldnumber].length;
	var nr = "" + fieldnumber + elementnumber;
	var source = readSource();

	// store type in fields
	fields[fieldnumber].push(type);

	// create collapsable field for element
	field(fieldLoc, "", "Element " + elementnumber + " " + elementtitle, "element" + fieldnumber + elementnumber, false);

	// plus and minus buttons
	var elementLoc = d3.select("#element" + fieldnumber + elementnumber);

	// add button for new field
	var buttonsLoc = elementLoc.append("div").attr("class", "floatRight");

	clickButton(buttonsLoc, "del" + fieldnumber + elementnumber, "dieses Element löschen", "deleteAdminElement(" + fieldnumber + "," + elementnumber + ")", "trash");
	clickButton(buttonsLoc, "up" + fieldnumber + elementnumber, "Element nach oben verschieben", "moveElementUp(" + fieldnumber + "," + elementnumber + ")", "arrowthick-1-n");
	clickButton(buttonsLoc, "down" + fieldnumber + elementnumber, "Element nach unten verschieben", "moveElementDown(" + fieldnumber + "," + elementnumber + ")", "arrowthick-1-s");
	clickButton(buttonsLoc, "add" + fieldnumber + elementnumber, "neues Element hinzufügen", "addElement(" + fieldnumber + ", 'input', '','','','','','','','','','')", "plus");
	clear(elementLoc);

	// TODO: read elementtypes from json file	
	// change type (selectlist)
	var typeoptions = new Array("input", "checkbox", "selectlist", "sparqlselect", "autocomplete", "textarea", "file", "date", "time", "number", "image");
	selectList(elementLoc, "type" + fieldnumber + elementnumber, "type" + fieldnumber + elementnumber, "Type", typeoptions, 'changeType("' + fieldnumber + '", "' + elementnumber + '" , "", "' + options + '", "' + multiple + '")');
	//changeType(fieldnumber, elementnumber, type);

	var elementMod = elementLoc.append("div").attr("id", "elementMod" + fieldnumber + elementnumber);

	// title of the element
	input(elementMod, "elementTitle" + fieldnumber + elementnumber, "elementTitle" + fieldnumber + elementnumber, "Elementtitel", elementtitle);

	// predicate (seleclist)
	autocomplete(elementMod, "predicate" + fieldnumber + elementnumber, "predicate" + fieldnumber + elementnumber, "Prädikat", "SELECT ?s WHERE {?s rdf:type rdf:Property }", source, predicate);
	d3.select("#predicate" + fieldnumber + elementnumber).attr("required", "");

	// mandatory
	makeCheckbox(elementLoc, "required" + fieldnumber + elementnumber, "required" + fieldnumber + elementnumber, "Pflicht", required);
	$("#checkboxrequired" + fieldnumber + elementnumber).attr("onclick", "setSubjectOptions(" + fieldnumber + "," + elementnumber + ")");

	// clickButton(elementLoc, "more" + fieldnumber + elementnumber, "", "showMoreElementoptions(" + fieldnumber + "," + elementnumber + "," + clone + ",'" + defaultvalue + "','" + explanation + "')", "arrowthickstop-1-s");

	// defaultvalue and explanation
	var elementoptionsLoc = d3.select("#element" + fieldnumber + elementnumber).append("div").attr("id", "elementoptions" + fieldnumber + elementnumber);
	input(elementoptionsLoc, "defaultvalue" + fieldnumber + elementnumber, "defaultvalue" + fieldnumber + elementnumber, "Defaultwert", defaultvalue, "Wert der standardmäßig angezeigt bzw. ausgewählt werden soll");
	textarea(elementoptionsLoc, "explanation" + fieldnumber + elementnumber, "explanation" + fieldnumber + elementnumber, "Erklärung", explanation, "Erklärung des Elements für den Nutzer. Wird im Formular als Mouseover angezeigt.");

	changeType(fieldnumber, elementnumber, type, options, multiple);
	$(".selector").accordion("refresh");

}

/*
 * fill list of subjects - function is called when an element is marked as required
 */
function setSubjectOptions(fieldnumber, elementnumber) {

	var checkbox = document.getElementById("checkboxrequired" + fieldnumber + elementnumber);
	var value = document.getElementById("elementTitle" + fieldnumber + elementnumber).value;
	var subjectlist = document.getElementById("subject");
	var existent = isPartOf(subjectlist, value);

	if (checkbox.checked) {
		if (value == "") {
			alert("Bitte geben Sie erst einen Titel ein");
			checkbox.checked = false;
		} else {
			if (!existent) {
				// add option to subjectlist
				addToSubjectlist(value);
			}
		}
	} else {
		if (existent) {
			// remove option if checkbox is not checked
			for ( i = 0; i < subjectlist.length; ++i) {
				if (subjectlist.options[i].value == value) {
					subjectlist.remove(i);
				}
			}
		}
	}
	d3.select("#subject").attr("size", $('#subject > option').length);
}

function addToSubjectlist(value) {
	var option = document.createElement("option");
	option.text = value;
	option.value = value;
	var subject = document.getElementById("subject");
	subject.appendChild(option);
}

// TODO: get default value from file
function readSource() {
	var sourceLoc = document.getElementById("source");
	if (sourceLoc == null) {
		var source = "handbook";

	} else {
		var source = sourceLoc.options[sourceLoc.selectedIndex].text;
	}
	return source;
}

/*
 * change the type of an element
 */
function changeType(fieldnumber, elementnumber, type, options, multiple) {

	// remove old stuff
	$("#mod" + fieldnumber + elementnumber).remove();
	// add new div
	var typeLocation = d3.select("#elementMod" + fieldnumber + elementnumber);
	var elementModLoc = typeLocation.append("div").attr("id", "mod" + fieldnumber + elementnumber);

	// get or set type
	if (type == "") {
		// read selected type from selectlist
		type = $('#type' + fieldnumber + elementnumber + '>option:selected').text();
	} else {
		// set value of selectList to type
		$('select[id^="type' + fieldnumber + elementnumber + '"] option[value="' + type + '"]').attr("selected", "selected");
	}
	if (options == "undefined") {
		options = "";
	}

	// modify mod if needed
	switch(type) {
		case "checkbox":
			var source = readSource();
			autocomplete(elementModLoc, "checkboxObject" + fieldnumber + elementnumber, "checkboxObject" + fieldnumber + elementnumber, "Objekt", "SELECT ?s WHERE {?o rdfs:range ?s} GROUP BY ?s", source, options);
			d3.select("#checkboxObject" + fieldnumber + elementnumber).attr("required", "");
			// checkbox(location, id, name, selected)
			$("#defaultvalue" + fieldnumber + elementnumber).replaceWith("<input type='checkbox' id='defaultvalue" + fieldnumber + elementnumber + "'>");
			// input(elementModLoc, "checkbox" + fieldnumber + elementnumber, "checkbox" + fieldnumber + elementnumber, "Objekt", options, "Wählen Sie ein Objekt aus.");
			break;
			//	case "table":
			//		input(elementModLoc, "xlabels" + fieldnumber + elementnumber, "xlabels" + fieldnumber + elementnumber, "xlabels", options, "Trennen Sie mehrere Optionen mit einem Komma.");
			//		input(elementModLoc, "ylabels" + fieldnumber + elementnumber, "ylabels" + fieldnumber + elementnumber, "ylabels", options, "Trennen Sie mehrere Optionen mit einem Komma.");
			break;
		case "selectlist":
			makeCheckbox(elementModLoc, "multiple" + fieldnumber + elementnumber, "multiple" + fieldnumber + elementnumber, "Mehrfachauswahl", multiple);
			input(elementModLoc, "options" + fieldnumber + elementnumber, "options" + fieldnumber + elementnumber, "Optionen", options, "Trennen Sie mehrere Optionen mit einem Komma.");
			$("#defaultvalue" + fieldnumber + elementnumber).replaceWith("<input type='input' id='defaultvalue" + fieldnumber + elementnumber + "'>");
			break;
		case "sparqlselect":
			makeCheckbox(elementModLoc, "multiple" + fieldnumber + elementnumber, "multiple" + fieldnumber + elementnumber, "Mehrfachauswahl", multiple);
			// input: location, id, name, label, default, title
			if (options == "") {
				options = "SELECT ?s WHERE {?s rdf:type :addTypeHere .} ";
			}
			// location, id, name, label, defaultvalue, explanation
			textarea(elementModLoc, "query" + fieldnumber + elementnumber, "query" + fieldnumber + elementnumber, "SPARQL", options, "Geben Sie eine SPARQL Abfrage ein.");
			//d3.select("#query" + fieldnumber + elementnumber).text(options).attr("value", options)
			$("#defaultvalue" + fieldnumber + elementnumber).replaceWith("<input type='input' id='defaultvalue" + fieldnumber + elementnumber + "'>");
			break;
		case "autocomplete":
			// input: location, id, name, label, default, title
			if (options == "") {
				options = "SELECT ?s WHERE {?s rdf:type :addTypeHere .} ";
			}
			// sparql query
			textarea(elementModLoc, "query" + fieldnumber + elementnumber, "query" + fieldnumber + elementnumber, "SPARQL", options, "Geben Sie eine SPARQL Abfrage ein.");
			// objectType
			input(elementModLoc, "objectType" + fieldnumber + elementnumber, "objectType" + fieldnumber + elementnumber, "objectType", "", "objectType");
			// replace defaultinputfield
			$("#defaultvalue" + fieldnumber + elementnumber).replaceWith("<input type='input' id='defaultvalue" + fieldnumber + elementnumber + "'>");
			break;
		default:
			$("#defaultvalue" + fieldnumber + elementnumber).replaceWith("<input type='input' id='defaultvalue" + fieldnumber + elementnumber + "'>");
			break;
	}

}

/*
 * move fields and elements up and down
 */
function moveFieldUp(fieldnumber) {
	if (fieldnumber > 0) {
		var previousField = $("#accordionfield" + (fieldnumber - 1));
		$("#accordionfield" + fieldnumber).detach().insertBefore(previousField);
		// change ids of the elements + TODO: in the array fields
		renumberField(fieldnumber - 1, fieldnumber);
		renumberField(fieldnumber, fieldnumber - 1);

	}
	$("#accordionelement" + fieldnumber).accordion("refresh");
	$("#accordionelement" + fieldnumber - 1).accordion("refresh");
}

function moveFieldDown(fieldnumber) {
	if (fieldnumber < fields.length - 1) {
		var nextField = $("#accordionfield" + (fieldnumber + 1));
		$("#accordionfield" + fieldnumber).detach().insertAfter(nextField);
		// change ids of the elements + in the array fields
		renumberField(fieldnumber, fieldnumber + 1);
		renumberField(fieldnumber + 1, fieldnumber);
	}
	$("#accordionelement" + fieldnumber).accordion("refresh");
	$("#accordionelement" + fieldnumber + 1).accordion("refresh");
}

function moveElementUp(fieldnumber, elementnumber) {
	if (elementnumber > 0) {
		var previousElement = $("#accordionelement" + fieldnumber + (elementnumber - 1));
		$("#accordionelement" + fieldnumber + elementnumber).detach().insertBefore(previousElement);
		// change ids of the elements + in the array fields
		renumberElement(fieldnumber, fieldnumber, elementnumber - 1, elementnumber);
		renumberElement(fieldnumber, fieldnumber, elementnumber, elementnumber - 1);
	}
	$("#accordionelement" + fieldnumber + elementnumber).accordion("refresh");
	$("#accordionelement" + fieldnumber + (elementnumber - 1)).accordion("refresh");
}

function moveElementDown(fieldnumber, elementnumber) {
	if (elementnumber < fields[fieldnumber].length - 1) {
		var nextElement = $("#accordionelement" + fieldnumber + (elementnumber + 1));
		$("#accordionelement" + fieldnumber + elementnumber).detach().insertAfter(nextElement);
		// change ids of the elements + in the array fields
		renumberElement(fieldnumber, fieldnumber, elementnumber, elementnumber + 1);
		renumberElement(fieldnumber, fieldnumber, elementnumber + 1, elementnumber);
	}

	$("#accordionelement" + fieldnumber + elementnumber).accordion("refresh");
	$("#accordionelement" + fieldnumber + (elementnumber + 1)).accordion("refresh");

}

/*
 * delete admin field
 */
function deleteAdminField(fieldnumber) {
	if (fields.length > 1) {
		$("#accordionfield" + fieldnumber).remove();
		// remove this field from the array fields
		fields.splice(fieldnumber, 1);

		var oldfield = fieldnumber + 1;

		// renumber all fields after deleted one, if it isn't the last one

		for (var i = 0; i < fields.length; i++) {
			renumberField(oldfield, fieldnumber);
			oldfield++;
			fieldnumber++;
		}

	}
}

/*
 * delete admin element
 */
function deleteAdminElement(fieldnumber, elementnumber) {

	if (fields[fieldnumber].length > 1) {

		// remove element in form
		$("#accordionelement" + fieldnumber + elementnumber).remove();

		// remove element in fields
		fields[fieldnumber].splice(elementnumber, 1);
		console.log("fields: ");
		console.log(fields);

		var oldnumber = elementnumber + 1;

		// renumber elements
		for ( i = 0; i <= fields[fieldnumber].length; i++) {
			renumberElement(fieldnumber, fieldnumber, oldnumber, elementnumber);
			oldnumber++;
			elementnumber++;
		}
	}
}

/*
 * renumber fields and elements
 */
function renumberField(fieldnumber, newnumber) {

	// change id and title of field
	$("#accordionfield" + fieldnumber).attr("id", "accordionfield" + newnumber).children("h3").attr("id", "ui-accordion-accordionfield" + newnumber + "-header-0").html("Feld " + newnumber);
	$("#field" + fieldnumber).attr("id", "field" + newnumber);

	// change id and name of titlefield
	$("#fieldTitle" + fieldnumber).attr("id", "fieldTitle" + newnumber).attr("name", "fieldTitle" + newnumber);

	// change id and name of checkboxclone
	$("#checkboxclone" + fieldnumber).attr("id", "checkboxclone" + newnumber).attr("name", "checkboxclone" + newnumber);
	$("#up" + fieldnumber).attr("id", "up" + newnumber).attr("onclick", "moveFieldUp(" + newnumber + ")");
	$("#down" + fieldnumber).attr("id", "down" + newnumber).attr("onclick", "moveFieldDown(" + newnumber + ")");

	// renumber delete and add buttons
	$("#del" + fieldnumber).attr("id", "del" + newnumber).attr("onclick", "deleteAdminField(" + newnumber + ")");
	$("#add" + fieldnumber).attr("id", "add" + newnumber).attr("onclick", "addNewField(" + newnumber + ")");

	// renumber each element

	for ( i = 0; i < fields[newnumber].length; i++) {
		renumberElement(fieldnumber, newnumber, i, i);
	}

	// clean up
	$("#accordionfield" + newnumber).accordion("refresh");
	$(".ui-tooltip").remove();

}

function renumberElement(oldFieldnumber, newFieldnumber, oldElementnumber, newElementnumber) {

	$("#accordionelement" + oldFieldnumber + oldElementnumber).attr("id", "accordionelement" + newFieldnumber + newElementnumber).children("h3").attr("id", "ui-accordion-accordionelement" + newFieldnumber + newElementnumber + "-header-0").html("Element " + newElementnumber);
	$("#element" + oldFieldnumber + oldElementnumber).attr("id", "element" + newFieldnumber + newElementnumber);

	$("#type" + oldFieldnumber + oldElementnumber).attr("id", "type" + newFieldnumber + newElementnumber).attr("name", "type" + newFieldnumber + newElementnumber).attr("onchange", "changeType(" + newFieldnumber + "," + newElementnumber + ",'','','')");
	$("#elementTitle" + oldFieldnumber + oldElementnumber).attr("id", "elementTitle" + newFieldnumber + newElementnumber).attr("name", "elementTitle" + newFieldnumber + newElementnumber);
	$("#predicate" + oldFieldnumber + oldElementnumber).attr("id", "predicate" + newFieldnumber + newElementnumber).attr("name", "predicate" + newFieldnumber + newElementnumber);
	$("#elementMod" + oldFieldnumber + oldElementnumber).attr("id", "elementMod" + newFieldnumber + newElementnumber);

	$("#clone" + oldFieldnumber + oldElementnumber).find("label").attr("for", "checkboxclone" + newFieldnumber + newElementnumber);
	$("#clone" + oldFieldnumber + oldElementnumber).attr("id", "clone" + newFieldnumber + newElementnumber);
	$("#required" + oldFieldnumber + oldElementnumber).find("label").attr("for", "checkboxrequired" + newFieldnumber + newElementnumber);
	$("#required" + oldFieldnumber + oldElementnumber).attr("id", "required" + newFieldnumber + newElementnumber);

	$("#checkboxrequired" + oldFieldnumber + oldElementnumber).attr("id", "checkboxrequired" + newFieldnumber + newElementnumber).attr("name", "required" + newFieldnumber + newElementnumber).attr("onclick", "setSubjectOptions(" + newFieldnumber + ", " + newElementnumber + ")");

	$("#checkboxclone" + oldFieldnumber + oldElementnumber).attr("id", "checkboxclone" + newFieldnumber + newElementnumber).attr("name", "checkboxclone" + newFieldnumber + newElementnumber);

	$("#elementoptions" + oldFieldnumber + oldElementnumber).attr("id", "elementoptions" + newFieldnumber + newElementnumber);
	$("#defaultvalue" + oldFieldnumber + oldElementnumber).attr("id", "defaultvalue" + newFieldnumber + newElementnumber).attr("name", "defaultvalue" + newFieldnumber + newElementnumber);
	$("#explanation" + oldFieldnumber + oldElementnumber).attr("id", "explanation" + newFieldnumber + newElementnumber).attr("name", "explanation" + newFieldnumber + newElementnumber);

	// renumber delete and add buttons
	$("#del" + oldFieldnumber + oldElementnumber).attr("id", "del" + newFieldnumber + newElementnumber).attr("onclick", "deleteAdminElement(" + newFieldnumber + "," + newElementnumber + ")");

	// addElement: fieldnumber, type, predicate, value, clone, required, options
	$("#add" + oldFieldnumber + oldElementnumber).attr("id", "add" + newFieldnumber + newElementnumber).attr("onclick", "addElement(" + newFieldnumber + ",'','','','','','','','','','')");
	$("#up" + oldFieldnumber + oldElementnumber).attr("id", "up" + newFieldnumber + newElementnumber).attr("onclick", "moveElementUp(" + newFieldnumber + "," + newElementnumber + ")");
	$("#down" + oldFieldnumber + oldElementnumber).attr("id", "down" + newFieldnumber + newElementnumber).attr("onclick", "moveElementDown(" + newFieldnumber + "," + newElementnumber + ")");

	// clean up
	$("#accordionelement" + newFieldnumber + newElementnumber).accordion("refresh");
	$(".ui-tooltip").remove();
}

