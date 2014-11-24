/* showGeany: shows existing data matching the selected formtype
* *************************************************************
* @author Svantje Lilienthal
* @version 2014-06
* @uses functions.js
* @todo add clear button
*/

// show exisisting data by reading the json file and ask the TS
function showExistingData() {
	$("#head").remove();
	var searchLoc = d3.select("#search").attr('class', 'search');
	var searchHead = searchLoc.append('div').attr('class', 'head').attr("id", "head");
	clear(d3.select("#head"));
	var list = document.getElementById("start");
	var chosenFormtype = list.options[list.selectedIndex].text;

	// get JSON
	$.getJSON("../json/" + chosenFormtype + ".json", function(json) {
		var subjecttype = json.subjecttype;
		var query = "SELECT ?s WHERE { ?s rdf:type " + subjecttype + " }";
		var source = json.source;
		var prefixShort = new Array();
		var prefixLong = new Array();

		// get prefixes
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

				var ul = d3.select("#head").append("ul");
				var subject = "";
				var j = 0;
				while (json.results.bindings[j]) {

					// replace the prefixes of the value with the short notation
					subject = replaceArray(json.results.bindings[j]["s"]['value'], prefixLong, prefixShort);

					// append subject to list
					var subjectDisplay = ul.append("li").attr("class", "divbutton").html(subject);

					// buttons to change and remove the subject and its predicates

					subjectDisplay.append("button").attr("type", "button").attr("id", "change" + j).attr("title", "bearbeiten").attr("onclick", "loadTriples('" + chosenFormtype + "', '" + subject + "')");

					subjectDisplay.append("button").attr("type", "button").attr("id", "remove" + j).attr("title", "löschen").attr("onclick", "deleteSubject('" + chosenFormtype + "', '" + subject + "')");

					$("#change" + j).button({
						icons : {
							primary : "ui-icon-pencil"
						},
						text : false
					}).hide();

					$("#remove" + j).button({
						icons : {
							primary : "ui-icon-trash"
						},
						text : false
					}).hide();

					$(document).on('mouseenter', '.divbutton', function() {
						$(this).find(":button").show();
					});
					$(document).on('mouseleave', '.divbutton', function() {
						$(this).find(":button").hide();
					});

					j++;

				}
			}, "json");
		});

	});

}

function deleteSubject(formtype, subject) {

	var check = confirm("Diesen Datensatz wirklich löschen?");
	// delete subject
	if (check) {

		// read  and source from formtype
		$.getJSON("../json/" + formtype + ".json", function(json) {

			var source = json.source;
			var subjecttype = json.subjecttype;

			// delete subject and all existing objects
			$.post("../php/deleteTriple.php", {
				'triple' : subject + " ?predicate ?object } WHERE { " + subject + " ?predicate ?object; rdf:type " + subjecttype + " ",
				'ontologyFile' : source
			}, function() {
				// reload page
				location.reload();
			});
		});
	}
}

// read predicates from json - is called when user selects a subject from the list
function loadTriples(formtype, subject) {

	$("#emptyForm").button({
		disabled : false
	});

	// remove old triples from the form and append div for new ones
	$("#defaultvalues").remove();
	d3.select("#formID").append("div").attr("id", "defaultvalues");

	// read json file of the formtype to get type, name and predicate of each element
	$.getJSON("../json/" + formtype + ".json", function(json) {

		var source = json.source;

		// get prefixes from the according json file and store them in array
		var prefixShort = new Array();
		var prefixLong = new Array();

		$.getJSON("../ontologies/" + source + ".json", function(data) {

			for (var k = 0; k < data.prefix.length; k++) {
				prefixShort.push(data.prefix[k]['short']);
				prefixLong.push(data.prefix[k]['long']);
			}

			// go trough each field and each element: read type, name and predicate to formulate query
			for (var i = 0; typeof json.field[i] != "undefined"; i++) {

				for (var j = 0; typeof json.field[i].element[j] != "undefined"; j++) {

					var type = json.field[i].element[j].type;
					var name = json.field[i].element[j].name;
					var predicate = json.field[i].element[j].predicate;
					var object = "";
					if ( typeof json.field[i].element[j].object != "undefined") {
						object = json.field[i].element[j].object;
					}

					// ask the TS if there is an matching object to the given subject and predicate
					var query = "SELECT ?s WHERE { " + subject + " " + predicate + " ?s }";

					askTripleStore(query, type, object, name, name + i + j, source, prefixShort, prefixLong);
				}
			}
		});
	});
}

// read data from ts and append to form
function askTripleStore(query, type, jsonObject, name, id, source, prefixShort, prefixLong) {
	$(document).ready(function() {

		$.post("../php/read.php", {
			'query' : query,
			'source' : source
		}, function(json) {

			// if there is no value
			if ( typeof json.results.bindings[0] == "undefined" || json.results.bindings.length == 0) {
				switch(type) {
					case "sparqlselect":
					case "selectlist":
						$('select[id^="' + id + '"] option:selected').prop("selected", false);
						break;
					case "textarea":
						$("#" + id).html("");
						break;
					default:
						$("#" + id).attr("value", "");
						break;
				}

			} else {

				// store the object - read (multiple) values
				var object = "";
				var count = 0;
				while ( typeof json.results.bindings[count] != 'undefined') {
					object += replaceArray(json.results.bindings[count].s.value, prefixLong, prefixShort);
					count++;
					if ( typeof json.results.bindings[count] != 'undefined') {
						object += ";";
					}
				}

				// append value to form (important to change triples in TS later)
				d3.select("#defaultvalues").append("input").attr("id", "value" + id).attr("name", "value" + name).attr("value", object).attr("style", "display:none");

				switch(type) {
					case "sparqlselect":
					case "selectlist":
						// handle multiple
						var objects = object.split(";");
						var t = 0;
						while ( typeof objects[t] != "undefined") {
							$('select[id^="' + id + '"] option[value="' + objects[t] + '"]').prop("selected", true);
							t++;
						}
						break;
					case "textarea":
						$("#" + id).html(object);
						break;
					case "number":
						$("#" + id).spinner("value", object);
						break;
					case "checkbox":
						object = object.replace(/;/, "");
						jsonObject = jsonObject.replace(/;/, "");
					//	alert(object + " " + jsonObject);
						if (object == jsonObject) {
							$("#checkbox" + id).removeAttr("value");
							$("#checkbox" + id).attr("checked", true);
						}
						break;
					default:
						$("#" + id).attr("value", object);
						break;
				}
			}
		}, "json");
	});
}

