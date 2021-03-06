

-- Assumes we have created a database called rif_dl

-- =====================================================================
-- Create system tables needed by the Data Loader Tool
-- =====================================================================

DROP TABLE IF EXISTS data_set_configurations CASCADE;
CREATE TABLE data_set_configurations (
	core_data_set_name VARCHAR(50) NOT NULL,
	version VARCHAR(30) NOT NULL,
	creation_date DATE NOT NULL DEFAULT CURRENT_DATE,
	current_workflow_state VARCHAR(20) NOT NULL DEFAULT 'start');

DROP SEQUENCE IF EXISTS data_set_sequence;
CREATE SEQUENCE data_set_sequence;
ALTER TABLE data_set_configurations ADD COLUMN id INTEGER NOT NULL DEFAULT nextval('data_set_sequence');
	
DROP TABLE IF EXISTS rif_change_log;
CREATE TABLE rif_change_log (
	data_set_id INT NOT NULL,
	row_number INT NOT NULL,
	field_name VARCHAR(30) NOT NULL,
	old_value VARCHAR(30) NOT NULL,
	new_value VARCHAR(30) NOT NULL,
	time_stamp DATE NOT NULL DEFAULT CURRENT_DATE);

DROP TABLE IF EXISTS rif_failed_val_log;
CREATE TABLE rif_failed_val_log (
	data_set_id INT NOT NULL,
	row_number INT NOT NULL,
	field_name VARCHAR(30) NOT NULL,
	invalid_value VARCHAR(30) NOT NULL,
	time_stamp DATE NOT NULL DEFAULT CURRENT_DATE);

--DROP TABLE IF EXISTS rif40_covariates;
--CREATE TABLE rif40_covariates (
--	geography_name VARCHAR(50),
--	geolevel_name VARCHAR(30),
--	covariate_name VARCHAR(30),
--	min DOUBLE PRECISION,
--	max DOUBLE PRECISION,
--	type DOUBLE PRECISION);
	


-- =====================================================================
-- Default Data Cleaning Functions
-- =====================================================================

CREATE OR REPLACE FUNCTION clean_date(
	date_value VARCHAR(30),
	date_format VARCHAR(30))
	RETURNS VARCHAR(30) AS 
$$
DECLARE
	result VARCHAR(30);
BEGIN
   SELECT TO_CHAR(TO_DATE(date_value,date_format),date_format)
   INTO result;
   RETURN result;
END;
$$   LANGUAGE plpgsql;
--SELECT date_matches_format('05/20/1995', 'MM/DD/YYYY');

CREATE OR REPLACE FUNCTION clean_year(
	year_value VARCHAR(30))
	RETURNS VARCHAR(30) AS 
$$
DECLARE
	result VARCHAR(30);
BEGIN

	IF length(year_value) = 2 THEN 
   		SELECT to_char(to_date(year_value, 'YY'), 'YYYY') INTO result;
   	ELSE
   		result := year_value;
   	END IF;

    RETURN result;
END;
$$   LANGUAGE plpgsql;
--SELECT date_matches_format('05/20/1995', 'MM/DD/YYYY');

CREATE OR REPLACE FUNCTION clean_age(
	original_age VARCHAR(30))
	RETURNS VARCHAR(30) AS 
$$
DECLARE
	cleaned_age VARCHAR(30);
BEGIN
	--This is just a stub function to demonstrate functionality.

	cleaned_age := original_age;
	RETURN cleaned_age;
END;
$$   LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION clean_icd_code(
	original_icd_code VARCHAR(30))
	RETURNS VARCHAR(30) AS 
$$
DECLARE
	cleaned_icd_code VARCHAR(30);
BEGIN
	cleaned_icd_code := REPLACE(original_icd_code, '.', '');
	RETURN cleaned_icd_code;
END;
$$   LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION clean_uk_postal_code(
	original_uk_postal_code VARCHAR(30))
	RETURNS VARCHAR(30) AS 
$$
DECLARE
	cleaned_uk_postal_code VARCHAR(30);
BEGIN

	cleaned_uk_postal_code := UPPER(REPLACE(original_uk_postal_code, ' ', ''));
	RETURN cleaned_uk_postal_code;
END;
$$   LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION clean_icd(
	original_icd_code VARCHAR(30))
	RETURNS VARCHAR(30) AS 
$$
DECLARE
	cleaned_icd_code VARCHAR(30);
BEGIN
	cleaned_icd_code := REPLACE(original_icd_code, '.', '');
	RETURN cleaned_icd_code;
END;
$$   LANGUAGE plpgsql;


-- =====================================================================
-- Default Validating Functions
-- =====================================================================


CREATE OR REPLACE FUNCTION date_matches_format(
	date_value VARCHAR(30),
	date_format VARCHAR(30))
	RETURNS INT AS 
$$
DECLARE
	result INT;
BEGIN
   IF date_value IS NULL OR date_format IS NULL THEN
      RETURN 0;
   END IF;

   SELECT 
      CASE
         WHEN TO_CHAR(TO_DATE(date_value,date_format),date_format) = date_value THEN
            1
         ELSE
            0
      END AS date_matches
   INTO result;
   RETURN result;
   

EXCEPTION 
	WHEN others THEN
	RETURN 0;	

END;
$$   LANGUAGE plpgsql;
--SELECT date_matches_format('05/20/1995', 'MM/DD/YYYY');



/*
 * Function: is_numeric
 * --------------------
 * Uses a regular expression to check whether a piece of text is numeric
 * or not.
 * Input: a text value
 * Returns: 
 *    true if the text value represents a number or
 *    false if the text value is not a number
 */
CREATE OR REPLACE FUNCTION is_numeric(text) 
	RETURNS INT AS '
	
	SELECT 
	   CASE
	      WHEN $1 ~ ''^[0-9]+$'' THEN 
	         1
	      ELSE
	         0
	   END AS provides_match
' LANGUAGE 'sql';


CREATE OR REPLACE FUNCTION is_valid_age(
	candidate_age VARCHAR(30))
	RETURNS INT AS 
$$
DECLARE
	age_value INT;

BEGIN
	
	age_value := candidate_age :: INT;
	IF (age_value < 0) OR (age_value > 120) THEN
		RETURN 0;
	ELSE
		RETURN 1;
	END IF;	

EXCEPTION 
	WHEN others THEN
	RETURN 0;
	
END;
$$   LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_valid_uk_postal_code(
	candidate_postal_code VARCHAR(30))
	RETURNS INT AS 
$$
DECLARE
	cleaned_postal_code VARCHAR(30);
BEGIN

	cleaned_postal_code := UPPER(REPLACE(candidate_postal_code, ' ', ''));
	RAISE NOTICE 'The cleaned postal code is %', cleaned_postal_code;
	IF cleaned_postal_code ~ '^[A-Z]{1,2}[0-9R][0-9A-Z]?[0-9][ABD-HJLNP-UW-Z]{2}$' THEN 
		RETURN 1;
	ELSE 
		RETURN 0;
	END IF;

END;
$$   LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION is_valid_double(
	candidate_double VARCHAR(20))
	RETURNS INT AS 
$$
DECLARE
	double_value DOUBLE PRECISION;
BEGIN

	SELECT cast(candidate_double as double precision)
	INTO double_value;
		
	RETURN 1;


EXCEPTION 
	WHEN others THEN
	RETURN 0;	

END;
$$   LANGUAGE plpgsql;

CREATE FUNCTION is_valid_integer(candidate_integer VARCHAR(30)) 
RETURNS INT AS '
SELECT 
   CASE
      WHEN candidate_integer ~ ''^[0-9]+$'' THEN 
         1
      ELSE
         0
   END provides_match
' LANGUAGE 'sql';

-- =====================================================================
-- Data Transformation Functions
-- =====================================================================

--Login to PostgreSQL
-- ensure that a database tmp_sahsu_db exists
--Copy and paste this entire file into PG Admin's query editor
--Press enter.  It should create all the tables and load all the functions 
--that should appear in the demo.

CREATE OR REPLACE FUNCTION convert_age_sex(
	age INT,
	sex INT)
	RETURNS INT AS 
$$
DECLARE
	age_sex_code INT;
BEGIN

	IF age IS NULL OR sex IS NULL THEN
	   RETURN -1;
	END IF;
	
	IF age BETWEEN 0 AND 4 THEN
		IF sex = 1 THEN 
			RETURN(100 + age);
		ELSIF sex = 2 THEN
			RETURN(200 + age);
		ELSE
			RETURN(300 + age);
		END IF;
	END IF; 
	
	IF age BETWEEN 5 AND 84 THEN
		IF sex = 1 THEN
			RETURN(100+TRUNC(age/5) + 4);
		ELSIF sex = 2 THEN
			RETURN(200+TRUNC(age/5) + 4);
		ELSE
			RETURN(300+TRUN(age/5) + 4);
		END IF;
	END IF;
	
	IF age BETWEEN 85 AND 150 THEN
		IF sex = 1 THEN
			RETURN 121;
		ELSIF sex = 2 THEN 
			RETURN 221;
		ELSE
			RETURN 321;
		END IF;
	END IF;
	
	RETURN 99;

END;
$$   LANGUAGE plpgsql;
	
	
/*
CREATE OR REPLACE FUNCTION old_convert_age_sex(
	age INT,
	sex INT)
	RETURNS INT AS 
$$
DECLARE
	age_sex_code INT;
BEGIN
	

	IF sex = 1 AND age BETWEEN 0 AND 4 THEN
			RETURN(100 + age);			
	ELSIF sex = 2 AND age BETWEEN 0 AND 4 THEN
		
	
	age_sex_code := (sex * 100) + age;
	RETURN age_sex_code;
END;
$$   LANGUAGE plpgsql;
*/

CREATE OR REPLACE FUNCTION map_age_to_rif_age_group(
	original_age VARCHAR(30))
	RETURNS VARCHAR(30) AS 
$$
DECLARE
	age INT;
	result INT;
BEGIN
	age := original_age::INT;
	IF age=0 THEN
		result := '0';
	ELSIF age=1 THEN
		result := '1';
	ELSIF age=2 THEN
		result := '2';
	ELSIF age=3 THEN
		result := '3';
	ELSIF age=4 THEN
		result := '4';
	ELSIF age BETWEEN 5 AND 9 THEN 
		result := '5';
	ELSIF age BETWEEN 10 AND 14 THEN 
		result := '6';
	ELSIF age BETWEEN 15 AND 19 THEN 
		result := '7';
	ELSIF age BETWEEN 20 AND 24 THEN 
		result := '8';
	ELSIF age BETWEEN 25 AND 29 THEN 
		result := '9';
	ELSIF age BETWEEN 30 AND 34 THEN 
		result := '10';
	ELSIF age BETWEEN 35 AND 39 THEN 
		result := '11';
	ELSIF age BETWEEN 40 AND 44 THEN 
		result := '12';		
	ELSIF age BETWEEN 45 AND 49 THEN 
		result := '13';
	ELSIF age BETWEEN 50 AND 54 THEN 
		result := '14';
	ELSIF age BETWEEN 55 AND 59 THEN 
		result := '15';
	ELSIF age BETWEEN 60 AND 64 THEN 
		result := '16';
	ELSIF age BETWEEN 65 AND 69 THEN 
		result := '17';
	ELSIF age BETWEEN 70 AND 74 THEN 
		result := '18';
	ELSIF age BETWEEN 75 AND 79 THEN 
		result := '19';
	ELSIF age BETWEEN 80 AND 84 THEN 
		result := '20';
	ELSIF age >= 85 THEN 
		result := '21';
	ELSE
		NULL;
	END IF;
		
	RETURN result;
END;
$$   LANGUAGE plpgsql;
--SELECT map_age_to_rif_age_group('23');





