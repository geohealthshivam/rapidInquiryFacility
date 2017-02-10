// ************************************************************************
//
// GIT Header
//
// $Format:Git ID: (%h) %ci$
// $Id: 7ccec3471201c4da4d181af6faef06a362b29526 $
// Version hash: $Format:%H$
//
// Description:
//
// Rapid Enquiry Facility (RIF) - Tile viewer code
//
// Copyright:
//
// The Rapid Inquiry Facility (RIF) is an automated tool devised by SAHSU 
// that rapidly addresses epidemiological and public health questions using 
// routinely collected health and population data and generates standardised 
// rates and relative risks for any given health outcome, for specified age 
// and year ranges, for any given geographical area.
//
// Copyright 2014 Imperial College London, developed by the Small Area
// Health Statistics Unit. The work of the Small Area Health Statistics Unit 
// is funded by the Public Health England as part of the MRC-PHE Centre for 
// Environment and Health. Funding for this project has also been received 
// from the Centers for Disease Control and Prevention.  
//
// This file is part of the Rapid Inquiry Facility (RIF) project.
// RIF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RIF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with RIF. If not, see <http://www.gnu.org/licenses/>; or write 
// to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, 
// Boston, MA 02110-1301 USA
//
// Author:
//
// Peter Hambly, SAHSU

var lstart=new Date().getTime(); 	// GLOBAL: Start time for console log/error messages
var map;
var topojsonTileLayer;
var baseLayer;
var legend;

/*
 * Function: 	scopeChecker()
 * Parameters:	file, line called from, named array object to scope checked mandatory, 
 * 				optional array (used to check optional callbacks)
 * Description: Scope checker function. Throws error if not in scope
 *				Tests: serverError2(), serverError(), serverLog2(), serverLog() are functions; serverLog module is in scope
 *				Checks if callback is a function if in scope
 *				Raise a test exception if the calling function matches the exception field value
 * 				For this to work the function name must be defined, i.e.:
 *
 *					scopeChecker = function scopeChecker(fFile, sLine, array, optionalArray) { ... 
 *				Not:
 *					scopeChecker = function(fFile, sLine, array, optionalArray) { ... 
 *				Add the ofields (formdata fields) array must be included
 */
scopeChecker = function scopeChecker(array, optionalArray) {
	var errors=0;
	var undefinedKeys;
	var msg="";
	var calling_function = scopeChecker.name || '(anonymous)';
	
	for (var key in array) {
		if (typeof array[key] == "undefined") {
			if (undefinedKeys == undefined) {
				undefinedKeys=key;
			}
			else {
				undefinedKeys+=", " + key;
			}
			errors++;
		}
	}
	if (errors > 0) {
		msg+=errors + " variable(s) not in scope: " + undefinedKeys;
	}
	
	// Check callback
	if (array && array["callback"]) { // Check callback is a function if in scope
		if (typeof array["callback"] != "function") {
			msg+="\nMandatory callback (" + typeof(callback) + "): " + (callback.name || "anonymous") + " is in use but is not a function: " + 
				typeof callback;
			errors++;
		}
	}	
	// Check optional callback
	if (optionalArray && optionalArray["callback"]) { // Check callback is a function if in scope
		if (typeof optionalArray["callback"] != "function") {
			msg+="\noptional callback (" + typeof(callback) + "): " + (callback.name || "anonymous") + " is in use but is not a function: " + 
				typeof callback;
			errors++;
		}
	}
	
	// Raise exception if errors
	if (errors > 0) {
		consoleError("scopeChecker(): " + msg);
		throw new Error(msg);
	}	
} // End of scopeChecker()
		
/*
 * Function: 	consoleLog()
 * Parameters:  Message
 * Returns: 	Nothing
 * Description:	Extend Leaflet to use topoJSON 
 * 				Copyright (c) 2013 Ryan Clark
 */
function leafletEnabletopoJson() {
	L.topoJson = L.GeoJSON.extend({  
	  addData: function(jsonData) {    
		if (jsonData.type === "Topology") {
		  for (key in jsonData.objects) {
			geojson = topojson.feature(jsonData, jsonData.objects[key]);
			L.GeoJSON.prototype.addData.call(this, geojson);
		  }
		}    
		else {
		  L.GeoJSON.prototype.addData.call(this, jsonData);
		}
	  }  
	});
	
	/* OR: https://gist.github.com/brendanvinson/0e3c3c86d96863f1c33f55454705bca7

L.TopoJSON = L.GeoJSON.extend({
    addData: function (data) {
        var geojson, key;
        if (data.type === "Topology") {
            for (key in data.objects) {
                if (data.objects.hasOwnProperty(key)) {
                    geojson = topojson.feature(data, data.objects[key]);
                    L.GeoJSON.prototype.addData.call(this, geojson);
                }
            }

            return this;
        }

        L.GeoJSON.prototype.addData.call(this, data);

        return this;
    }
});

L.topoJson = function (data, options) {
    return new L.TopoJSON(data, options);
};

	 */
}
 
/*
 * Function: 	consoleLog()
 * Parameters:  Message
 * Returns: 	Nothing
 * Description:	IE safe console log 
 */
function consoleLog(msg) {
	var end=new Date().getTime();
	var elapsed=(Math.round((end - lstart)/100))/10; // in S	
	if (window.console && console && console.log && typeof console.log == "function") {
		if (isIE()) {
			if (window.__IE_DEVTOOLBAR_CONSOLE_COMMAND_LINE) {
				console.log("+" + elapsed + ": " + msg);
			}
		}
		else {
			console.log("+" + elapsed + ": " + msg);
		}
	}  
}

/*
 * Function: 	consoleError()
 * Parameters:  Message
 * Returns: 	Nothing
 * Description:	IE safe console error 
 */
function consoleError(msg) {
	var end=new Date().getTime();
	var elapsed=(Math.round((end - lstart)/100))/10; // in S
	try {
		if (window.console && console && console.error && typeof console.error == "function") {
			if (isIE()) {
				if (window.__IE_DEVTOOLBAR_CONSOLE_COMMAND_LINE) {	
					console.log("+" + elapsed + " ERROR: " + msg);
				}
			}
			else {
				console.error("+" + elapsed + " ERROR: " + msg);
			}
		}
	}
	catch (err) {
		console.log("consoleError: ERROR: " + err.message + "\n" + msg);
	}
}

/*
 * Function: 	errorPopup()
 * Parameters: 	Message, extended message
 * Returns: 	Nothing
 * Description:	Error message popup
 */
function errorPopup(msg, extendedMessage) {
	if (document.getElementById("error")) { // JQuery-UI version
		document.getElementById("error").innerHTML = "<h3>" + msg + "</h3>";
		var errorWidth=document.getElementById('tileviewerbody').offsetWidth-300;
		var dialogObject={
			modal: true,
			width: errorWidth,
			closeText: "",
			dialogClass: "no-close",
			buttons: [ {
				text: "OK",
				click: function() {
					$( this ).dialog( "close" );
				}
			}]
		};
		
		if (extendedMessage) {
			consoleLog("extended message: " + extendedMessage);
			dialogObject.buttons.push({
				text: "Extended Info",
				click: function() {
					$( this ).dialog( "close" );
					errorPopup(extendedMessage);
				}
			});
		}
		
		$( "#error" ).dialog(dialogObject);
	}	

	consoleError(msg);
}

/*
 * Function: 	isIE()
 * Parameters: 	None
 * Returns: 	Nothing
 * Description:	Test for IE nightmare 
 */
function isIE() {
	var myNav = navigator.userAgent.toLowerCase();
	return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

/*
 * Function: 	xhrGetMethod()
 * Parameters: 	method name, method description, method callback, method fields object
 * Returns: 	Nothing
 * Description:	Generic XHR GET method
 */
function xhrGetMethod(methodName, methodDescription, methodCallback, methodFields) {
	scopeChecker({
		methodName: methodName, 
		methodDescription: methodDescription, 
		callback: methodCallback, 
		methodFields: methodFields
	});
	
	var jqXHR=$.get(methodName, methodFields, methodCallback, // callback function
		"json");	

	consoleLog("Wait for server response for: " + methodDescription);
	jqXHR.fail(
		function jqXHRError(x, e) {
			var msg="";
			var response;
			try {
				if (x.responseText) {
					response=JSON.parse(x.responseText);
				}
			}
			catch (err) {
				msg+="Error parsing response: " + err.message;
			}
			
			if (x.status == 0) {
				msg+="Unable to " + methodDescription + "; network error";
			} 
			else if (x.status == 404) {
				msg+="Unable to " + methodDescription + "; URL not found: getGeographies";
			} 
			else if (x.status == 500) {
				msg+="Unable to " + methodDescription + "; internal server error";
				if (response && response.message) {
					msg+="<p>" + response.message + "</p>";
				}	
				else if (response) {
					msg+="<br><pre>Response: " + JSON.stringify(response, null, 4) + "</pre>";
				}
				else if (x.responseText) {
					msg+="<br><pre>Response Text: " + x.responseText + "</pre>";
				}
				else  {
					msg+="<br><pre>No reponse text</pre>";
				}
			}  
			else if (response && response.message) {
				msg+="Unable to " + methodDescription + "; unknown error: " + x.status + "<p>" + response.message + "</p>";
			}	
			else if (response) {
				msg+="Unable to " + methodDescription + "; unknown error: " + x.status + "<br><pre>Response: " + JSON.stringify(response, null, 4) + "</pre>";
			}
			else if (x.responseText) {
				msg+="Unable to " + methodDescription + "; unknown error: " + x.status + "<br><pre>Response Text: " + x.responseText + "</pre>";
			}
			else {
				msg+="Unable to " + methodDescription + "; unknown error: " + x.status + "<br><pre>No reponse text</pre>";
			}
			
			if (e && e.message) {
				errorPopup(msg + "<br><pre>" + e.message + "</pre>");
			}
			else {
				errorPopup(msg);
			}
		} // End of jqXHRError()
	);		
} // End of xhrGetMethod()

/*
 * Function: 	addSelector()
 * Parameters: 	selectorId, selectorChangeCallback, newHTML, defaultValue
 * Returns: 	map
 * Description:	Add JQuery selector
 */	
function addSelector(selectorId, selectorChangeCallback, newHTML, defaultValue) {
	scopeChecker({
		selectorId: selectorId,
		newHTML: newHTML,
		callback: selectorChangeCallback}
	);
		
	var buttonObject=$( selectorId ).button( "instance" );
	if (buttonObject) {
		$( selectorId ).html(newHTML);		
		var checkedValue=$( selectorId + " option:checked" ).val();
		
		$( selectorId ).button( "refresh" );
		$( selectorId ).selectmenu( "refresh" );
			
		if (defaultValue) {
			$( selectorId ).val(defaultValue);			
			consoleLog("addSelector(): refresh with defaultValue: " + selectorId + 
				"; val: " + $( selectorId ).val() + " ; checkedValue: " + checkedValue + 
				"; HTML>\n" + newHTML);
		}
		else {
			$( selectorId ).val(checkedValue);
			consoleLog("addSelector(): refresh with checkedValue: " + selectorId + 
				"; val: " + $( selectorId ).val() + " ; checkedValue: " + checkedValue + 
				"; HTML>\n" + newHTML);
		}			
	}
	else {
		$( selectorId ).html(newHTML);		
		var checkedValue=$( selectorId + " option:checked" ).val();

		consoleLog("addSelector(): pre-create: " + selectorId + 
			"; val: " + $( selectorId ).val()   + " ; checkedValue: " + checkedValue + 
			" ; HTML>\n" + newHTML);
			
		$( selectorId )									// Create selector
			.selectmenu({
				change: function( event, ui ) {			// DB Change function
					selectorChangeCallback( event, ui );
				}
			})
			.selectmenu( "menuWidget" ).addClass( "overflow" );
		$( selectorId ).button();

		if (defaultValue) {
			$( selectorId ).val(defaultValue);
			consoleLog("addSelector(): create with defaultValue: " + selectorId + 
				"; val: " + $( selectorId ).val() + " ; checkedValue: " + checkedValue + 
				"; HTML>\n" + newHTML);
		}
		else {
			$( selectorId ).val(checkedValue);
			consoleLog("addSelector(): create with checkedValue: " + selectorId + 
				"; val: " + $( selectorId ).val() + " ; checkedValue: " + checkedValue + 
				"; HTML>\n" + newHTML);
		}		
	}
		
	$( selectorId ).tooltip(									// Enable tooltips
		{
			position: { 					
				my: "right bottom+50"
			},
			tooltipClass: "entry-tooltip-positioner"
		}
	);	
	
	selectorChangeCallback();	// Defaults
} // End of addSelector()

/*
 * Function: 	setHeight()
 * Parameters: 	id, height
 * Returns: 	map
 * Description:	Set object height
 */
function setHeight(id, lheight) {
	document.getElementById(id).setAttribute("style","display:block;cursor:pointer;cursor:hand;");
	document.getElementById(id).setAttribute("draggable", "true");
	document.getElementById(id).style.display = "block"	;
	document.getElementById(id).style.cursor = "hand";			
	document.getElementById(id).style.height=lheight + "px";						
	
	consoleLog(id + " h x w: " + document.getElementById(id).offsetHeight + "x" + document.getElementById(id).offsetWidth);	
} // End of setHeight()
		
/*
 * Function: 	createMap()
 * Parameters: 	Bounding box, max Zoomlevel
 * Returns: 	map
 * Description:	Create map, add Openstreetmap basemap and scale
 */	
function createMap(boundingBox, maxZoomlevel) {
		
	if (map == undefined) {
		consoleLog("Create Leaflet map; h x w: " + document.getElementById('map').style.height + "x" + 
			document.getElementById('map').style.width + "; version: " + L.version);	
		map = new L.map('map' , {
				zoom: maxZoomlevel||11,
				// Tell the map to use a fullsreen control
				fullscreenControl: true
			} 
		);
		
		try {
			var loadingControl = L.Control.loading({
				separate: true
			});
			map.addControl(loadingControl);
		}
		catch (e) {
			try {
				map.remove();
			}
			catch (e2) {
				consoleLog("WARNING! Unable to remove map during error recovery");
			}
			throw new Error("Unable to add loading control to map: " + e.message);
		}		
	}	
	else {
		consoleLog("Leaflet map already created; h x w: " + document.getElementById('map').style.height + "x" + document.getElementById('map').style.width);	
	}
	
	if (boundingBox) {
		try {
			consoleLog("Fit bounding box: " + JSON.stringify(boundingBox));	
			map.fitBounds([
				[boundingBox.ymin, boundingBox.xmin],
				[boundingBox.ymax, boundingBox.xmax]], {maxZoom: maxZoomlevel||11}
			);
		}
		catch (e) {
			try {
				map.remove();
			}
			catch (e2) {
				consoleLog("WARNING! Unable to remove map during error recovery");
			}
			throw new Error("Unable to create map: " + e.message);
		}
	}	
		
	try {	
		if (baseLayer) {
			consoleLog("Redrawing basemap...");	
			map.invalidateSize();
			baseLayer.redraw();
		}
		else {
			consoleLog("Creating basemap...");															
			baseLayer=L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
				maxZoom: maxZoomlevel||11,
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
					'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
					'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
				id: 'mapbox.light',
				noWrap: true
			});
			baseLayer.addTo(map);	
			L.control.scale().addTo(map); // Add scale	
			consoleLog("Added baseLayer and scale to map");	
			
			
			if (L.version >= "1.0.0") { // Leaflet 0.7 code
//				addGridLayer(); 	// Add grid layer Leaflet 1.0+
			}
/*			
			(function mapResetButton() {
				var control = new L.Control({position:'topright'});
				control.onAdd = function mapResetButtonControl(map) {
						var azoom = L.DomUtil.create('a','resetzoom');
						azoom.innerHTML = "[Reset Zoom]";
						L.DomEvent
							.disableClickPropagation(azoom)
							.addListener(azoom, 'click', function mapResetButtonListener() {
								consoleLog("Map reset");	
								map.setView(map.options.center, map.options.zoom);
							},azoom);
						return azoom;
					};
				return control;
			}())
			.addTo(map); */
		}
		
		return map;
	}
	catch (e) {
		try {
			map.remove();
		}
		catch (e2) {
			consoleLog("WARNING! Unable to remove map during error recovery");
		}		
		throw new Error("Unable to add tile layer to map: " + e.message);
	}
} // End of createMap()

/*
 * Function: 	addTileLayer()
 * Parameters: 	methodFields object
 * Returns: 	tile layer
 * Description:	Adyerd tile la map,; remove oold layer if required
 */
function addTileLayer(methodFields) {
	if (map == undefined) {
		return undefined;
	}
	
    var style = {
        "clickable": true,
        "color": "#00D",
        "fillColor": "#00D",
        "weight": 1.0,
        "opacity": 0.3,
        "fillOpacity": 0.2
    };
    var hoverStyle = {
        "fillOpacity": 0.5
    };
/*
 * Example URL:
 *
 * 127.0.0.1:3000/getMapTile/?zoomlevel=1&x=0&y=0&databaseType=PostGres&table_catalog=sahsuland_dev&table_schema=peter&table_name=geography_sahsuland&geography=SAHSULAND&geolevel_id=2&tiletable=tiles_sahsuland
 */
    var topojsonURL = 'http://127.0.0.1:3000/getMapTile/?zoomlevel={z}&x={x}&y={y}';
	for (var key in methodFields) { // append methodFields
		if (key != 'geolevel') {
			topojsonURL+='&' + key + '=' + methodFields[key];
		}
	}
	var geolevel=methodFields.geolevel[(methodFields.geolevel_id-1)];
	geolevel.databaseType=methodFields.databaseType;
	geolevel.databaseName=methodFields.table_catalog;
	geolevel.tableName=methodFields.table_schema + '.' + methodFields.table_name;
	geolevel.geography=methodFields.geography;
	geolevel.maxzoomlevel=methodFields.maxzoomlevel;
	geolevel.output="GeoJSON";
	
	map.options.maxZoom = methodFields.maxzoomlevel;
	
//	consoleLog("geolevel data: " + JSON.stringify(geolevel, null, 0));
	consoleLog("topojsonURL: " + topojsonURL);
	
	if (topojsonTileLayer) {
		map.removeLayer(topojsonTileLayer);
	}
	
	if (L.version < "1.0.0") { // Leaflet 0.7 code
		topojsonTileLayer = new L.TileLayer.GeoJSON(topojsonURL, {
				clipTiles: true,
				attribution: 'Tiles &copy; <a href="http://www.sahsu.org/content/rapid-inquiry-facility">Imperial College London</a>',
				unique: function (feature) {
					return feature.id; 
				}
			}, {
				style: style /*,
				onEachFeature: function (feature, layer) {
					if (feature.properties) {
						var popupString = '<div class="popup">';
						for (var k in feature.properties) {
							var v = feature.properties[k];
							popupString += k + ': ' + v + '<br />';
						}
						popupString += '</div>';
						layer.bindPopup(popupString);
					}
					if (!(layer instanceof L.Point)) {
						layer.on('mouseover', function () {
							layer.setStyle(hoverStyle);
						});
						layer.on('mouseout', function () {
							layer.setStyle(style);
						});
					}
				} */
			}
		);
		topojsonTileLayer.on('tileerror', function(error, tile) {
			consoleLog("Error: " + error + " loading tile: " + tile);
		});
		map.addLayer(topojsonTileLayer);	
	} // End of Leaflet 0.7 code
	else { // Leadflet 1.0 code - uses topoJSON
		geolevel.output="TopoJSON";
		topojsonURL+='&output=topojson';
		topojsonTileLayer = new L.topoJsonGridLayer(topojsonURL, {
				attribution: 'Tiles &copy; <a href="http://www.sahsu.org/content/rapid-inquiry-facility">Imperial College London</a>',
                layers: {
                    'geolevel': {
						style: style 
					}
                }
			}/*, {			
				style: style 
			} */
		);
//		topojsonTileLayer.setOpacity(0.3);
		topojsonTileLayer.on('tileerror', function(error, tile) {
			consoleLog("Error: " + error + " loading tile: " + tile);
		});
		topojsonTileLayer.on('load', function() {
			consoleLog("Tile layer loaded; geolevel_id: " + methodFields.geolevel_id);
			getAllMarkers();
		});
		map.addLayer(topojsonTileLayer);
	}
	
	if (legend) {
		map.removeControl(legend);
	}
	legend = L.control({position: 'bottomright'});
			
	var keyTable = {	// Translate tags
		geolevel_id: 	"GEOLEVEL_ID",
		geolevel_name: 	"Name",
		description: 	"Description",
		areaid_count: 	"AreaID Count",
		databaseType:	"Database Type",
		databaseName:	"Database Name",
		tableName:		"Table",
		geography:		"Geography",
		maxzoomlevel:	"Max zoomlevel",
		output:			"Tile format"
	}
	legend.onAdd = function onAddLegend(map) {
		var div = L.DomUtil.create('div', 'info legend');
		var labels=[];

		for (var key in geolevel) {
			labels.push("<tr><td>" + (keyTable[key]||key) + ": </td><td>" + geolevel[key] + "</td></tr>");			
		}

		var html = '<table id="legend">' + labels.join("") + '</table>';
//		consoleLog("Add legend: " + html);
		div.innerHTML = html;
		return div;
	};

	legend.addTo(map);
	
	return topojsonTileLayer;
} // End of addTileLayer()

/*
 * Function:	getBbox()
 * Parameters:	databaseType, databaseName, databaseSchema, geography, table_name, tileTable, getBboxCallback
 * Returns:		Nothing
 * Description: Get boundoiing box from root tile
 */	
function getBbox(databaseType, databaseName, databaseSchema, geography, table_name, tileTable, getBboxCallback) {
	scopeChecker({
		callback: getBboxCallback,
		databaseType: databaseType,
		databaseName: databaseName,			
		databaseSchema: databaseSchema,
		table_name: table_name,
		geography: geography,
		tileTable: tileTable
	});
	//http://127.0.0.1:3000/getMapTile/?zoomlevel=1&x=0&y=0&databaseType=PostGres&table_catalog=sahsuland_dev
	// &table_schema=peter&table_name=geography_sahsuland&geography=SAHSULAND
	// &geolevel_id=2&tiletable=tiles_sahsuland&output=topojson
	var getMapTileParams={ 
			zoomlevel: 0, 
			x: 0,
			y: 0,
			geolevel_id: 1,
			databaseType: databaseType,	
			table_catalog: databaseName,
			table_schema: databaseSchema,
			table_name: table_name,
			geography: geography,
			tiletable: tileTable,
			output: "topojson"
		};
	consoleLog("getBbox() getMapTileParams: " + JSON.stringify(getMapTileParams, null, 0));
	
	var jqXHRgetBboxStatus=$.get("getMapTile", getMapTileParams,
		function getBboxStatus(data, status, xhr) {
			consoleLog("getBboxStatus() data: " + JSON.stringify(data, null, 0).substring(1, 100));
			// "type":"Topology","objects":{"collection":{"type":"GeometryCollection","bbox":[-7.58829480400111,52
			var bbox;
			if (data && data.objects && data.objects.collection) {
				bbox={
					xmin: data.objects.collection.bbox[0],
					ymin: data.objects.collection.bbox[1],
					xmax: data.objects.collection.bbox[2],
					ymax: data.objects.collection.bbox[3]
				};
			}
			else {
				bbox={xmin: -180.0000, ymin: -90.0000, xmax: 180.0000, ymax: 90.0000}; /* whole world bounding box */			
			}
			getBboxCallback(bbox);
		}, // End of getBboxStatus() 
		"json");
	jqXHRgetBboxStatus.fail(function getBboxError(x, e) {
		try {
			if (x.responseText) {
				response=JSON.parse(x.responseText);
			}
			errorPopup(response.message, 
				"<pre>" + response.diagnostic + "</pre><pre>Fields: " + 
				JSON.stringify(response.fields, null, 2) + "</pre>");
		}
		catch (e) {
			errorPopup("getBbox(): Error parsing response: " + e.message);
		}
	} // End of getBboxError()
	);
} // End of getBbox()

/*
 * Function:	addGridLayer()
 * Parameters:	None
 * Returns:		Nothing
 * Description: Leaflet GridLayer example with Canvas
 *				By Maik Riechert: https://gist.github.com/letmaik/e71eae5b3ae9e09f8aeb288c3b95230b
 *
 *				Needs Leaflet 1.0+
 *
 * 				See also: https://github.com/ebrelsford/leaflet-geojson-gridlayer/tree/master/src
 */	
function addGridLayer() {
	
	var tiles = new L.GridLayer();
	tiles.createTile = function(coords) {
	  var tile = L.DomUtil.create('canvas', 'leaflet-tile');
	  var ctx = tile.getContext('2d');
	  var size = this.getTileSize()
	  tile.width = size.x
	  tile.height = size.y
	  
	  // calculate projection coordinates of top left tile pixel
	  var nwPoint = coords.scaleBy(size)
	  
	  // calculate geographic coordinates of top left tile pixel
	  var nw = map.unproject(nwPoint, coords.z)
	  
	  ctx.fillStyle = 'white';
	  ctx.fillRect(0, 0, size.x, 50);
	  ctx.fillStyle = 'black';
	  ctx.fillText('x: ' + coords.x + ', y: ' + coords.y + ', zoom: ' + coords.z, 20, 20);
	  ctx.fillText('lat: ' + nw.lat + ', lon: ' + nw.lng, 20, 40);
	  ctx.strokeStyle = 'red';
	  ctx.beginPath();
	  ctx.moveTo(0, 0);
	  ctx.lineTo(size.x-1, 0);
	  ctx.lineTo(size.x-1, size.y-1);
	  ctx.lineTo(0, size.y-1);
	  ctx.closePath();
	  ctx.stroke();
	  return tile;
	}
	
	tiles.addTo(map);
} // End of addGridLayer()

/*
 * Function:	getAllMarkers()
 * Parameters:	None
 * Returns:		Nothing
 * Description: Get all the markers at once; find the point geospatial types
 */
function getAllMarkers() {

    var allMarkersObjArray = []; // for marker objects
    var allMarkersGeoJsonArray = []; // for readable geoJson markers
	
    consoleLog("getAllMarkers() start");
    $.each(map._layers, function (ml) {

        if (map._layers[ml].feature) {

			allMarkersObjArray.push(this);
			var geojson=this.toGeoJSON();
			var popop=[];
			for (var key in geojson.properties) {
				popop.push("<tr><td>" + (key) + ": </td><td>" + geojson.properties[key] + "</td></tr>");			
			}
			var html = '<table id="popups">' + popop.join("") + '</table>';
			this.bindPopup(html);
//            allMarkersGeoJsonArray.push(geojson);
        }
    })
	
    consoleLog("getAllMarkers() added: " + allMarkersGeoJsonArray.length + " popups");
	return;

	for (var i=0; i<allMarkersGeoJsonArray.length; i++) {
		
		var geoTypes={};	
		
//		if (i == 0) {
//			consoleLog("getAllMarkers() allMarkersGeoJsonArray[0]: " + 
//				JSON.stringify(allMarkersGeoJsonArray[i]).substring(1, 400));
//		}

/*
+11: getAllMarkers() gid: 7; x: 0; y: 1; points: 0; dimensions: 2;
JSON: "type":"Feature","id":7,
"properties":{"gid":7,"area_id":"01779789","name":"Michigan","x":0,"y":1,"block":1,"CB_2014_US_STATE_500K":"01779789"},
"geometry":{"geometries":[
{"type":"Point","coordinates":[-83.19802550495056,42.03458311057784]},
{"type":"Polygon","coordinates":[[[-83.23392183248332,45.056254727129456],[-83.19802550495056,45.05100876946183],[-83.19802550495056,45.045762811794205],[-83.19 */	

		if (allMarkersGeoJsonArray[i].geometry.geometries) {
			for (var j=0; j<allMarkersGeoJsonArray[i].geometry.geometries.length; j++) {
				if (geoTypes[allMarkersGeoJsonArray[i].geometry.geometries[j].type] == undefined) {
					geoTypes[allMarkersGeoJsonArray[i].geometry.geometries[j].type]=1;			
				}
				else {
					geoTypes[allMarkersGeoJsonArray[i].geometry.geometries[j].type]++;
				}
			}
		}
		else if (allMarkersGeoJsonArray[i].geometry && allMarkersGeoJsonArray[i].geometry.type) {
			if (geoTypes[allMarkersGeoJsonArray[i].geometry.type] == undefined) {
				geoTypes[allMarkersGeoJsonArray[i].geometry.type]=1;			
			}
			else {
				geoTypes[allMarkersGeoJsonArray[i].geometry.type]++;
			}
		}
		if (geoTypes == undefined) {		
			consoleLog("getAllMarkers() gid: " + allMarkersGeoJsonArray[i].properties.gid + 
				"; x: " + allMarkersGeoJsonArray[i].properties.x + 
				"; y: " + allMarkersGeoJsonArray[i].properties.y +
				";\nJSON: " + JSON.stringify(allMarkersGeoJsonArray[i]).substring(1, 200));
		}
		consoleLog("getAllMarkers() gid: " + allMarkersGeoJsonArray[i].properties.gid + 
			"; x: " + allMarkersGeoJsonArray[i].properties.x + 
			"; y: " + allMarkersGeoJsonArray[i].properties.y +
			"; geoTypes: " + JSON.stringify(geoTypes));			
	}
}