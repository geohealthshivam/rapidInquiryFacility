# CDC RIF 4.0 Progress Report Start October 2016

IN PROGRESS - NOT COMPLETE YET!

## Highlight

Results Viewer now operational; needs a lot of testing.

Kevin was off sick for effectively three weeks in August. To balance the workload work on SQL Server study 
creation and data extraction has now been moved to Peter towards the end of October. 

## Setpmber Summary

| Week | Week Starting     | PH                                                                   | KG                                                                                                | DM                                                                                             | BP                                                                  | MD                                             | Milestone                                                 | Notes |
|------|-------------------|----------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|------------------------------------------------|-----------------------------------------------------------|-------|
| 36   | 05 September 2016 |                                                                      | Not allocated (for overrun - 10 days); now: Data viewer get methods                               | Allocated to JG                                                                                | 8.1 US Test dataset, 8.2 Test Plan, 8.3 Manual calculation of tests | 6.1 Schema comparison (3 days)                 |                                                           |       |
| 37   | 12 September 2016 | 6.2 SQL server schema completion (5 days)                            |                                                                                                   | 6.3 Middleware services - other (10 days) [Potentially Kevin as well]: data viewer get methods |                                                                     | 6.2 SQL server schema completion (as required) |                                                           |       |
| 38   | 19 September 2016 |                                                                      | ALSPAC [Non RIF work]                                                                             |                                                                                                |                                                                     |                                                | Results Viewer                                            |       |
| 39   | 26 September 2016 | Shapefile services: 3.3 Get Methods II (6 Days)                      | 

## Planned work for October and November

| Week | Week Starting     | PH                                                                   | KG                                                                                                | DM                                                                                             | BP                                                                  | MD                                             | Milestone                                                 | Notes |
|------|-------------------|----------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|------------------------------------------------|-----------------------------------------------------------|-------|
| 40   | 03 October 2016   |                                                                      |                                                                                                   | Allocated to JG                                                                                |                                                                     |                                                |                                                           |       |
| 41   | 10 October 2016   | Not allocated (for overrun - 9 days); now: Map tile generation       | 7. Data Loader (35 days) - start liable for 2/3 weeks delays caused by more work on GET methods   | 6.3 Middleware services - SQL Server porting (10 days): data viewer get methods                |                                                                     | 6.3 SQL Server porting (10 days)               |                                                           |       |
| 42   | 17 October 2016   |                                                                      |                                                                                                   |                                                                                                |                                                                     |                                                |                                                           |       |
| 43   | 24 October 2016   |                                                                      |                                                                                                   |                                                                                                |                                                                     |                                                |                                                           |       |
| 44   | 31 October 2016   | SQL Server study submission and data extraction                      |                                                                                                   | Allocated to JG                                                                                | Documentation, manual                                               |                                                |                                                           |       |
 
## Data Loader - Kevin

No work (as planned)

## Front end (webPlatform)

### Disease Mapping, Data viewer - David

- All d3 charts added and are linked/interactive
- All data comes from database - no hardtyping
- Improved dialogue for disease parameters
- UI is end-to-end study run ready

## Middleware

### Web services (rifServices) - Kevin/David

TO BE ADDED

### Run study batch - Kevin

- TO BE ADDED

#### R - Brandon

- Change to the way the comparison area is used. Previously several comparison areas were identified based on the first part 
  of the study area ids. Now only one comparison is area is used..

### Ontology support - Kevin
 
- No progress required.

### Node geospatial services (tile-maker) - Peter

* Prototyped tile manufacture using PostGIS:
  * New efficient tile intersect algorithm saving up to 94% of tiles:
  
| zoomlevel | xmin | ymin | xmax | ymax | possible tiles | tiles | % saving |
|-----------|------|------|------|------|----------------|-------|----------|
|         0 |    0 |    0 |    0 |    0 |              1 |     1 |     0.00 |
|         1 |    0 |    0 |    1 |    1 |              4 |     3 |    25.00 |
|         2 |    0 |    0 |    3 |    2 |             12 |     5 |    58.33 |
|         3 |    0 |    1 |    7 |    4 |             32 |    10 |    68.75 |
|         4 |    0 |    3 |   15 |    8 |             96 |    22 |    77.08 |
|         5 |    0 |    6 |   31 |   17 |            384 |    46 |    88.02 |
|         6 |    0 |   13 |   63 |   29 |           1088 |   112 |    89.71 |
|         7 |    0 |   27 |  127 |   59 |           4224 |   338 |    92.00 |
|         8 |    0 |   54 |  255 |  118 |          16640 |  1139 |    93.16 |
|         9 |    1 |  108 |  511 |  237 |          66430 |  4093 |    93.84 |
|        10 |    2 |  217 | 1023 |  474 |         263676 | 15308 |    94.19 |
|        11 |    4 |  435 | 2046 |  948 |        1050102 | 58968 |    94.38 |
		
  * Re-wrote functions to be simpler (for SQL Server porting) and provide running updates;
  * Tile intersection (i.e. adding data, cropping to tile boundary) is time expensive but acceptable to US county level takes 80 minutes in PostGIS!
  
| Zoomlevel | PostGIS  | SQL Server |
| ----------| ---------|------------|
|         7 | 75 secs  | 393 secs   |
|         8 | 166 secs | 27 mins    |
|         9 | 8 mins   |            |
|        10 | 24 mins  |            |  
|        11 | 80 mins  |            |

  * SQL Server is 10x slower at intersection and requires more tuning;
  * Architecture will be as in the prototype: a SQL script and a Node.js tile creation script which will:
    * Convert geoJSON/(Well known text for SQL Server) to topoJSON;
    * PNG tile dump to files (Postgres only - no raster support in SQL Server);	
  * Image of US county tiles at zoomlevel 11 in Florida: 
    ![alt text](https://github.com/smallAreaHealthStatisticsUnit/rapidInquiryFacility/blob/master/Progress%20Reports/Screenshots/Florida4.png "US county tiles at zoomlevel 11 in Florida")
	This clearly exhibits all the alogorithmic optimisations:
	* No tiles where the entire tile contains no part of the US landmass;
	* No tiles where the area boundary is outside of the tile
* Add max zoomlevel to UI to speed up demos and testing;  
* SQL Server tile maker:
  * Ported tiles table and view, geometry table, tile limits table:
  * Partition geometry tables (Postgres only)
* SQL Server tile maker: tile intersects complete. Still unhappy about the performance; also second part of insert 
  (Insert tile area id intersections missing where not in the previous layer; 
  this is usually due to it being simplified out of existance) is not working.

#### November:

* SQL Server tile intersection tuning
* Map tile generator; RIF integration preparation

## Databases

### Postgres, integration - Peter

* Added intersections and tiles to Postgres scripts, major tune. Will replace the pre-existing 
  functionality in November after SQL Server.

### Microsoft SQL server - Margaret/Peter

* Tested the tile maker generated database script to create geolevel geometry, intersection and tiles tables.



 

 