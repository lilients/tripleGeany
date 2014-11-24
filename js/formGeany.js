/* formGeany: generate form from json
* *************************************************************
* reads json file with formstructure, generates the form and
* calls showGeany.js to show data from the triplestore (showExistingData();)
*
* @author Svantje Lilienthal
* @version 2014-06
* @uses functions.js
*/

/**************
 * page setup *
 **************/
$(document).ready(function() {
	logout(d3.select("#title"));
	$(document).tooltip();

	$("#note").dialog();
	// check if dialog should be opened by reading the cookie
	if (readCookie("note") == 'form') {
		$("#note").dialog("close");
	}

	// .tabs() not used at the moment but could be usefull in future
	$("#tabsLeft").tabs().resizable();

	// form to store data
	form(d3.select("#form"), "data", "formID", "post", "../php/write.php");
	// make startselectlist: read files
	startselect(d3.select("#formID"));

});

/***************
 * startselect *
 ***************/
// create selectlist for existing formtypes
function startselect(location) {

	// read options from JSON-file
	$.get("../php/scanJSON.php", function(data) {

		// create an array
		var formOptions = data.split(";");

		// remove empty string at the end
		formOptions.pop();

		// trim .json
		for (var i = 0; i < formOptions.length; i++) {
			formOptions[i] = formOptions[i].substr(0, formOptions[i].lastIndexOf("."));
		}

		// create selectList
		selectList(location, "start", "startselect", "Formular auswählen", formOptions, "createForm('')", "");
		clear(location);

		// read previous chosen filename from session/cookie to create a form
		createForm(readCookie("filenameUser"));

	});

}

/***************
 * create form *
 ***************/
// function to create form by reading the formstructure (filename or from cookie)
function createForm(filename) {

	var startselect = document.getElementById("start");

	if (filename == "") {
		// read users choice of filename
		filename = startselect.options[startselect.selectedIndex].text;
	}
	// filename is set (call in program) -> set selectlist to the filename
	else {
		for (var count = 0; count < startselect.options.length; count++) {
			if (startselect[count].value == filename) {
				startselect[count].selected = true;
			}
		}
	}
	// store selected filename
	writeCookie("filenameUser", filename, 1);

	//  get JSON from file
	$.getJSON("../json/" + filename + ".json", function(json) {
		generateFormular(json);
		showExistingData();
	});

}

/*******************************
 * generate formular from json *
 *******************************/
// genereate a form form the given json object
function generateFormular(jsonObject) {
	// delete old form and add new form and title
	$("#formGeany").remove();
	var location = d3.select("#formID").append("div").attr("id", "formGeany");
	addTitle(location, jsonObject.title);

	// read formstructure from JSON: write fields and elements
	for ( i = 0; i < jsonObject.field.length; i++) {
		var name = jsonObject.field[i].name;
		var label = jsonObject.field[i].label;
		writeField(location, i, name, label);

		for ( j = 0; j < jsonObject.field[i].element.length; j++) {
			// write element for each element
			writeElement(d3.select("#field" + i), i, j, jsonObject);
		}
	}

	if (jsonObject.field.length == 1) {

		$("#accordionfield0").accordion("option", "active");
	}

	submitbutton(location, "Daten senden");
}

// title
function addTitle(location, title) {
	var buttonLoc = location.append("div").attr("class", "floatRight");

	// button to empty the form
	clickButton(buttonLoc, "emptyForm", "Formular leeren", "emptyForm()", "document");
	$("#emptyForm").button({
		disabled : true
	});
	// uncomment to disable the button
	//$("#emptyForm").attr("disabled", true).addClass("ui-state-disabled");

	location.append("div").html(title).attr("class", "t1");
}

// empty all input elements (input, textarea, selectlist)
function emptyForm() {

	// empty all visible imput elements
	$("input:input").attr("value", "");
	$("textarea").attr("value", "").html("");
	$("option:selected").prop("selected", false);
	$("input:checkbox").removeAttr("checked");
	$(".ui-spinner-input" ).spinner( "value", "" );
	
	// remove hidden values
	$("#defaultvalues").remove();

	// disable button
	$("#emptyForm").button({
		disabled : true
	});

	// remove tooltip
	$(".ui-tooltip-content").parents('div').remove();

	// read formtype from cookie and set selectlist
	$('#start').val(readCookie("filenameUser"));
}

/***************
 * write field *
 ***************/
function writeField(location, id, name, label) {

	field(location, name, label, "field" + id, 0);

}

/*****************
 * write element *
 *****************/
// create element with type, label, required, defaultvalue, explanation
function writeElement(location, i, j, jsonObject) {
	// read values from json
	var type = jsonObject.field[i].element[j].type;
	var name = jsonObject.field[i].element[j].name;
	var label = jsonObject.field[i].element[j].label;
	var required = jsonObject.field[i].element[j].required;
	var checked = jsonObject.field[i].element[j].checked;
	if ( typeof jsonObject.field[i].element[j].multiple != "undefined") {
		var multiple = jsonObject.field[i].element[j].multiple;
	} else {
		var multiple = false;
	}
	var defaultvalue = jsonObject.field[i].element[j].defaultvalue;
	var explanation = jsonObject.field[i].element[j].explanation;

	var source = jsonObject.source;

	var elementLocation = location.append("div").attr("id", "element" + i + j);
	var id = name + i + j;

	switch(type) {
		case "input":
			input(elementLocation, id, name, label, defaultvalue, explanation);
			break;
		case "date":
			date(elementLocation, id, name, label, defaultvalue, explanation);
			break;
		case "time":
			time(elementLocation, id, name, label, defaultvalue, explanation);
			break;
		case "number":
			number(elementLocation, id, name, label, defaultvalue, explanation);
			break;
		case "textarea":
			textarea(elementLocation, id, name, label, defaultvalue, explanation);
			break;
		case "file":
			file(elementLocation, id, name, label, "uploadFile()");
			break;
		case "checkbox":
			// location, id, name, label, selected
			makeCheckbox(elementLocation, id, name, label, false);
			break;
		case "selectlist":
			// TODO: read variable to makte list multiple
			// list of options as string -> to array with split
			var options = jsonObject.field[i].element[j].options.split(",");
			options.unshift("");
			selectList(elementLocation, id, name, label, options, "", explanation);
			break;
		case "sparqlselect":
			// TODO: read variable to makte list multiple
			// get sparql query from json
			var query = jsonObject.field[i].element[j].query;
			sparqlselect(elementLocation, id, name, label, query, source, "");
			d3.select("#" + id).attr("title", explanation);
			break;
		case "autocomplete":
			var query = jsonObject.field[i].element[j].query;
			autocomplete(elementLocation, id, name, label, query, source, defaultvalue);
			d3.select("#" + id).attr("title", explanation);
			break;
		/*    case "table":
		var xlabels = jsonObject.field[i].element[j].xlabels.split(",");
		var ylabels = jsonObject.field[i].element[j].ylabels.split(",");
		selectTable(elementLocation, name, label, xlabels, ylabels);
		break; */
		// TODO: add inputtype image
		case "image":
			image(elementLocation, id, name, label, defaultvalue, explanation);
			break;
		default:
			alert("The type \"" + type + "\" is not valid. Please change the JSON-File. Valid Types are: input, date, time, textarea, file, selectlist, sparqlselect, table.");
	}
	if (required) {
		d3.select("#" + id).attr("required", "");
	}
	if (multiple) {
		d3.select("#" + id).attr("multiple", "").attr("name", name + "[]");
	}

}

