/* searchGeany: searches for triples in the TS and displays the results
 * *******************************************************************
 * @author Svantje Lilienthal
 * @version 2014-06
 * @uses functions.js
 */

$(document).ready(function() {

	// title of section
	var searchHead = d3.select("#search").append('div');


	// TODO: read url from file!!!
		
	//  $.getJSON("../json/" + readCookie("filename") + ".json", function(json) {
	//     var url = json.add;
	var url = "http://141.20.167.185:8180/openrdf-workbench/repositories/007/add";

	d3.select("#search").append("form").attr("class", "floatRight").attr("action", url).append("button").attr("id", "gotToTS").attr("title", "Tripel im TripleStore einfügen");
	$("#gotToTS").button({
		icons : {
			primary : "ui-icon-arrowthickstop-1-e"
		},
		text : false
	});

	// });

	// textarea to get search phrase
	textarea(d3.select("#search"), "query", "query", "SPARQL");
	d3.select("#query").html("SELECT ?subject ?predicate ?object WHERE {?subject ?predicate ?object}");

	// read formtypes from folder
	$.get("../php/scanJSON.php", function(data) {
		var formtypes = data.split(";");
		// remove .json and empty string at the end
		//  formtypes.shift();
		formtypes.pop();
		for (var i = 0; i < formtypes.length; i++) {
			formtypes[i] = formtypes[i].substr(0, formtypes[i].lastIndexOf("."));
		}
		selectList(d3.select("#search"), "formtypes", "formtypes", "vordefinierte Abfragen", formtypes, "showSPARQL()", "");
		makeButton(d3.select("#search"), "search", "search", "", "Suchen", "readTriples()");
	});

	// uncomment to display table as default
//	 readTriples();

});

// show sparql query in query field
function showSPARQL() {

	// read selected type from selectlist
	var loc = document.getElementById("formtypes");
	formtype = loc.options[loc.selectedIndex].text;

	if (formtype == "alle") {
		// add query to form
		d3.select("#query").attr("value", "SELECT ?s ?p ?o  WHERE {?s ?p ?o}").html("SELECT ?s ?p ?o  WHERE {?s ?p ?o}");
	}

	// read matchin query from json
	$.getJSON("../json/" + formtype + ".json", function(json) {
		var subjecttype = json.subjecttype;

		// TODO: read predicates from JSON and put them in the query
		// add query to form
		d3.select("#query").attr("value", "SELECT ?s  WHERE {?s rdf:type " + subjecttype + "}").html("SELECT ?s  WHERE {?s rdf:type " + subjecttype + " }");
	});
}

// read triples from TS via php and put them to the table
function readTriples() {
	$("#tripleTable").remove();

	var loc = document.getElementById("formtypes");
	formtype = loc.options[loc.selectedIndex].text;

	$.getJSON("../json/" + formtype + ".json", function(json) {
		var source = json.source;

		// get query
		var query = $("#query").val();
		if (query == "") {
			query = "SELECT ?subject ?predicate ?object WHERE { ?subject ?predicate ?object }";
		}

		// get prefixes
		var prefixShort = new Array();
		var prefixLong = new Array();
		$.getJSON("../ontologies/" + source + ".json", function(data) {

			for (var i = 0; i < data.prefix.length; i++) {
				prefixShort.push(data.prefix[i]['short']);
				prefixLong.push(data.prefix[i]['long']);
			}
		});

		// read from TS & create table
		$.post("../php/read.php", {
			'query' : query,
			'source' : source,
		}, function(data) {

			var searchLoc = d3.select('#search');
			var answerTable = searchLoc.append("table").attr("id", "tripleTable").attr("class", "tripleTable");
			var headTr = answerTable.append("thead");

			headTr.append("th").attr("class", "n").html("Nr.");

			// number of variables used in the query
			var size = data.head.vars.length;

			for (var i = 0; i < size; i++) {
				headTr.append("th").attr("class", "triple").html(data.head.vars[i]);
			}

			var answerTbody = answerTable.append("tbody");

			var i = 0;
			while (data.results.bindings[i]) {

				var answerTr = answerTbody.append("tr").attr("class", "tripleLine");
				answerTr.append("td").attr("class", "n").html(i + 1);

				// read subject, predicate and object and replace prefixes
				for (var j = 0; j < size; j++) {
					
					// get variable name from answer (head.vars)
					var variable = data.head.vars[j];
					var value = data.results.bindings[i][variable].value;
					
					// replace prefixes
					value = replaceArray(value, prefixLong, prefixShort);
				
					// append data to table
					answerTr.append("td").attr("class", "triple").html(value);
				}

				i++;
			}

		}, "json");

	});

}

