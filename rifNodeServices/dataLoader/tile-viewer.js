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

/*
 * Function: 	databaseSelectChange()
 * Parameters: 	None
 * Returns: 	Nothing
 * Description:	Gets valid RIF geographies from database 
 */
function databaseSelectChange(event, ui) {
	var db = (ui && ui.item && ui.item.value) || $( "#databaseSelect option:checked" ).val();
	
	xhrGetMethod("getGeographies", "get geography listing from database: " + db, getGeographies, {database: db});
		
} // End of databaseSelectChange()

/*
 * Function: 	geographySelectChange()
 * Parameters: 	None
 * Returns: 	Nothing
 * Description:	Sets up map for selected geography and database
 */
function geographySelectChange(event, ui) {
	var geographyText = (ui && ui.item && ui.item.value) || $( "#geographySelect option:checked" ).val();

	var methodFields = JSON.parse(geographyText)

	consoleLog("geographySelectChange: " +  JSON.stringify(methodFields, null, 2)); 
//	xhrGetMethod("getMapTile", "get gmap tile from " + methodFields.database_type + " database: " + methodFields.table_catalog, 
//		getMapTile, methodFields);
		
	createMap();
	
} // End of databaseSelectChange()

/*
 * Function: 	getGeographies()
 * Parameters: 	data, status,XHR object
 * Returns: 	Nothing
 * Description:	getGeographies XHR GET reponse callback
 */
function getGeographies(data, status, xhr) {
//	consoleLog("getGeographies() OK: " + JSON.stringify(data, null, 2));	
	
	var result=data.result;
	var html='<label id="geographyLabel"  title="Choose geography to display" for="geography">Geography:\n' +
		'<select required id="geographySelect" name="database" form="dbSelect">';
	
	if (result == undefined) {
		errorPopup("getGeographies() FAILED: no geographies found in database");
	}
	else {		
		for (var i=0; i<result.length; i++) {
		
			if (i == 0) {
				consoleLog("getGeographies() OK for " + result[i].database_type + " database: " + result[i].table_catalog);
			     html+="<option value='" + JSON.stringify(result[i]) + "' selected='selected'>" + 
					result[i].table_schema + "." + result[i].table_name + ": " + result[i].description + "</option>";
			}
			else {
			     html+="<option value='" + JSON.stringify(result[i]) + "'>" + 
					result[i].table_schema + "." +result[i].table_name + ": " + result[i].description + "</option>";
			}
		}
		html+='</select>\n' +		
			'</label>';		
//		consoleLog("Replace #geographySelect HTML: " + html);
		document.getElementById('geographySelect').innerHTML=html;
		
		var w = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName('body')[0],
			x = w.innerWidth || e.clientWidth || g.clientWidth,
			y = w.innerHeight|| e.clientHeight|| g.clientHeight;
		document.getElementById('geographySelect').style.width=(x-550) + "px";	
		
		$( "#geographySelect" )								// Geography selector
		.selectmenu({
			change: function( event, ui ) {					// DB Change function
				geographySelectChange( event, ui );
			}
		})
		.selectmenu( "menuWidget" ).addClass( "overflow" );
		$( "#geographySelect" ).button(); 
		
		geographySelectChange();
	}
			
} // End of getGeographies()
		
