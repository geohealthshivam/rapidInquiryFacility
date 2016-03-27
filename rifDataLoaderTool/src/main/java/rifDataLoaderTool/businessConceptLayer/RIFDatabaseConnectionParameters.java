package rifDataLoaderTool.businessConceptLayer;

import rifGenericLibrary.dataStorageLayer.DatabaseType;

/**
 *
 *
 * <hr>
 * Copyright 2016 Imperial College London, developed by the Small Area
 * Health Statistics Unit. 
 *
 * <pre> 
 * This file is part of the Rapid Inquiry Facility (RIF) project.
 * RIF is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * RIF is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with RIF.  If not, see <http://www.gnu.org/licenses/>.
 * </pre>
 *
 * <hr>
 * Kevin Garwood
 * @author kgarwood
 */

/*
 * Code Road Map:
 * --------------
 * Code is organised into the following sections.  Wherever possible, 
 * methods are classified based on an order of precedence described in 
 * parentheses (..).  For example, if you're trying to find a method 
 * 'getName(...)' that is both an interface method and an accessor 
 * method, the order tells you it should appear under interface.
 * 
 * Order of 
 * Precedence     Section
 * ==========     ======
 * (1)            Section Constants
 * (2)            Section Properties
 * (3)            Section Construction
 * (7)            Section Accessors and Mutators
 * (6)            Section Errors and Validation
 * (5)            Section Interfaces
 * (4)            Section Override
 *
 */

public class RIFDatabaseConnectionParameters {

	// ==========================================
	// Section Constants
	// ==========================================

	// ==========================================
	// Section Properties
	// ==========================================
	private DatabaseType databaseType;
	private String databaseDriverPrefix;
	private String databaseName;
	private String hostName;
	private String portName;
	
	
	// ==========================================
	// Section Construction
	// ==========================================

	private RIFDatabaseConnectionParameters() {
		databaseType = DatabaseType.POSTGRESQL;
		
		databaseDriverPrefix = "jdbc:postgresql";
		databaseName = "tmp_sahsu_db";
		portName = "5432";
		hostName = "localhost";
	}

	public static RIFDatabaseConnectionParameters newInstance() {
		RIFDatabaseConnectionParameters rifDatabaseConnectionParameters
			= new RIFDatabaseConnectionParameters();
		return rifDatabaseConnectionParameters;
	}
	
	
	// ==========================================
	// Section Accessors and Mutators
	// ==========================================
	public DatabaseType getDatabaseType() {
		return databaseType;
	}
	
	public void setDatabaseType(DatabaseType databaseType) {
		this.databaseType = databaseType;
	}

	public String getDatabaseDriverPrefix() {
		return databaseDriverPrefix;
	}
	
	public void setDatabaseDriverPrefix(String databseDriverPrefix) {
		this.databaseDriverPrefix = databseDriverPrefix;
	}

	public String getDatabaseName() {
		return databaseName;
	}

	public void setDatabaseName(String databaseName) {
		this.databaseName = databaseName;
	}

	public String getHostName() {
		return hostName;
	}

	public void setHostName(String hostName) {
		this.hostName = hostName;
	}

	public String getPortName() {
		return portName;
	}

	public void setPortName(String portName) {
		this.portName = portName;
	}

	// ==========================================
	// Section Errors and Validation
	// ==========================================

	// ==========================================
	// Section Interfaces
	// ==========================================

	// ==========================================
	// Section Override
	// ==========================================

}

