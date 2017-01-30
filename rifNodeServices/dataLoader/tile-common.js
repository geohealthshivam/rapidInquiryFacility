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
		consoleLog("Create Leaflet map; h x w: " + document.getElementById('map').style.height + "x" + document.getElementById('map').style.width);	
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
 * Returns: 	Nothing
 * Description:	Adyerd tile la map,; remove oold layer if required
 */
function addTileLayer(methodFields) {
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
		topojsonURL+='&' + key + '=' + methodFields[key];
	}

	consoleLog("topojsonURL: " + topojsonURL);
	
	if (topojsonTileLayer) {
		map.removeLayer(topojsonTileLayer);
	}
    topojsonTileLayer = new L.TileLayer.GeoJSON(topojsonURL, {
            clipTiles: true,
			attribution: '&copy; <a href="http://www.sahsu.org/copyright">SAHSU</a>',
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