
BEGIN TRANSACTION DataLoading WITH MARK N'Loading data';
-- =========================================================
-- Deleting data from previous run of this script
-- =========================================================

DELETE FROM rif40.rif40_tables 
WHERE 
   table_name='POP_SAHSULAND_POP';
GO


IF OBJECT_ID('rif_data.pop_sahsuland_pop', 'U') IS NOT NULL DROP TABLE rif_data.POP_SAHSULAND_POP;
GO


DELETE FROM rif40.rif40_table_outcomes 
WHERE 
   numer_tab='NUM_SAHSULAND_CANCER';
GO


DELETE FROM rif40.rif40_tables 
WHERE 
   table_name='NUM_SAHSULAND_CANCER';
GO


IF OBJECT_ID('rif_data.num_sahsuland_cancer', 'U') IS NOT NULL DROP TABLE rif_data.NUM_SAHSULAND_CANCER;
GO


DELETE FROM rif40.rif40_covariates 
WHERE 
   geolevel_name='SAHSU_GRD_LEVEL3' AND 
   covariate_name='SES';
GO


DELETE FROM rif40.rif40_covariates 
WHERE 
   geolevel_name='SAHSU_GRD_LEVEL3' AND 
   covariate_name='ETHNICITY';
GO


IF OBJECT_ID('rif_data.covar_sahsuland_covariates3', 'U') IS NOT NULL DROP TABLE rif_data.COVAR_SAHSULAND_COVARIATES3;
GO


DELETE FROM rif40.rif40_covariates 
WHERE 
   geolevel_name='SAHSU_GRD_LEVEL4' AND 
   covariate_name='SES';
GO


DELETE FROM rif40.rif40_covariates 
WHERE 
   geolevel_name='SAHSU_GRD_LEVEL4' AND 
   covariate_name='AREATRI1KM';
GO


DELETE FROM rif40.rif40_covariates 
WHERE 
   geolevel_name='SAHSU_GRD_LEVEL4' AND 
   covariate_name='NEAR_DIST';
GO


DELETE FROM rif40.rif40_covariates 
WHERE 
   geolevel_name='SAHSU_GRD_LEVEL4' AND 
   covariate_name='TRI_1KM';
GO


IF OBJECT_ID('rif_data.covar_sahsuland_covariates4', 'U') IS NOT NULL DROP TABLE rif_data.COVAR_SAHSULAND_COVARIATES4;
GO


DELETE FROM rif40.rif40_health_study_themes 
WHERE 
   theme='cancers';
GO


-- =========================================================
-- Adding Health Themes
-- =========================================================

INSERT INTO rif40.rif40_health_study_themes( 
   theme,
   description) 
VALUES ('cancers','cancer things');
GO


-- =========================================================
-- Adding Denominators
-- =========================================================

-- Adding sahsuland_pop-1.0
CREATE TABLE rif_data.pop_sahsuland_pop ( 
   year INTEGER NOT NULL,
   age_sex_group INTEGER NOT NULL,
   sahsu_grd_level1 VARCHAR(20) NOT NULL,
   sahsu_grd_level2 VARCHAR(20) NOT NULL,
   sahsu_grd_level3 VARCHAR(20) NOT NULL,
   sahsu_grd_level4 VARCHAR(20) NOT NULL,
   total INTEGER NOT NULL);
GO


BULK INSERT rif_data.pop_sahsuland_pop FROM '$(pwd)/pop_sahsuland_pop.csv'
WITH 
(
   FORMATFILE = '$(pwd)/pop_sahsuland_pop.fmt',
   TABLOCK,
   FIRSTROW=2
);
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'population health file',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='pop_sahsuland_pop';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'year field',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='pop_sahsuland_pop',
   @level2type = N'Column', @level2name='year';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'An integer field which represents a combination of codes for sex and age.',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='pop_sahsuland_pop',
   @level2type = N'Column', @level2name='age_sex_group';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = '',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='pop_sahsuland_pop',
   @level2type = N'Column', @level2name='sahsu_grd_level1';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = '',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='pop_sahsuland_pop',
   @level2type = N'Column', @level2name='sahsu_grd_level2';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'level 3 resolution field',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='pop_sahsuland_pop',
   @level2type = N'Column', @level2name='sahsu_grd_level3';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'level 4 resolution',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='pop_sahsuland_pop',
   @level2type = N'Column', @level2name='sahsu_grd_level4';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'total field',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='pop_sahsuland_pop',
   @level2type = N'Column', @level2name='total';
GO

CREATE INDEX POP_SAHSULAND_POP_YEAR ON rif_data.POP_SAHSULAND_POP(YEAR);
GO
;

CREATE INDEX POP_SAHSULAND_POP_AGE_SEX_GROUP ON rif_data.POP_SAHSULAND_POP(AGE_SEX_GROUP);
GO
;

CREATE INDEX POP_SAHSULAND_POP_SAHSU_GRD_LEVEL1 ON rif_data.POP_SAHSULAND_POP(SAHSU_GRD_LEVEL1);
GO
;

CREATE INDEX POP_SAHSULAND_POP_SAHSU_GRD_LEVEL2 ON rif_data.POP_SAHSULAND_POP(SAHSU_GRD_LEVEL2);
GO
;

CREATE INDEX POP_SAHSULAND_POP_SAHSU_GRD_LEVEL3 ON rif_data.POP_SAHSULAND_POP(SAHSU_GRD_LEVEL3);
GO
;

CREATE INDEX POP_SAHSULAND_POP_SAHSU_GRD_LEVEL4 ON rif_data.POP_SAHSULAND_POP(SAHSU_GRD_LEVEL4);
GO
;

CREATE INDEX POP_SAHSULAND_POP_TOTAL ON rif_data.POP_SAHSULAND_POP(TOTAL);
GO
;

INSERT INTO rif40.rif40_tables (
   theme,
   table_name,
   description,
   year_start,
   year_stop,
   total_field,
   isindirectdenominator,
   isdirectdenominator,
   isnumerator,
   automatic,
   sex_field_name,
   age_group_field_name,
   age_sex_group_field_name,
   age_group_id) 
SELECT 
   'cancers',
   'POP_SAHSULAND_POP',
   'population health file',
   MIN(YEAR),
   MAX(YEAR),
   null,
   1,
   0,
   0,
   1,
   null,
   null,
   'AGE_SEX_GROUP',
   1
FROM
   rif_data.POP_SAHSULAND_POP;
GO



-- =========================================================
-- Adding Numerators
-- =========================================================

-- Adding sahsuland_cancer-1.0


CREATE TABLE rif_data.num_sahsuland_cancer ( 
   year INTEGER NOT NULL,
   age_sex_group INTEGER NOT NULL,
   sahsu_grd_level1 NVARCHAR(20) NOT NULL,
   sahsu_grd_level2 NVARCHAR(20) NOT NULL,
   sahsu_grd_level3 NVARCHAR(20) NOT NULL,
   sahsu_grd_level4 NVARCHAR(20) NOT NULL,
   icd NVARCHAR(20) NOT NULL,
   total INTEGER NOT NULL);
GO


BULK INSERT rif_data.num_sahsuland_cancer FROM '$(pwd)/num_sahsuland_cancer.csv'
WITH 
(
   FORMATFILE = '$(pwd)/num_sahsuland_cancer.fmt',
   TABLOCK,
   FIRSTROW=2
);
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'sahsuland cancer cases',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='num_sahsuland_cancer';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = '',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='num_sahsuland_cancer',
   @level2type = N'Column', @level2name='year';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'An integer field which represents a combination of codes for sex and age.',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='num_sahsuland_cancer',
   @level2type = N'Column', @level2name='age_sex_group';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'level one field resolution',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='num_sahsuland_cancer',
   @level2type = N'Column', @level2name='sahsu_grd_level1';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'level 2 field resolution',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='num_sahsuland_cancer',
   @level2type = N'Column', @level2name='sahsu_grd_level2';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'level 3 resolution field',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='num_sahsuland_cancer',
   @level2type = N'Column', @level2name='sahsu_grd_level3';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'level four resolution level',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='num_sahsuland_cancer',
   @level2type = N'Column', @level2name='sahsu_grd_level4';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'icd code',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='num_sahsuland_cancer',
   @level2type = N'Column', @level2name='icd';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'total field',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='num_sahsuland_cancer',
   @level2type = N'Column', @level2name='total';
GO

CREATE INDEX NUM_SAHSULAND_CANCER_YEAR ON rif_data.NUM_SAHSULAND_CANCER(YEAR);
GO
;

CREATE INDEX NUM_SAHSULAND_CANCER_AGE_SEX_GROUP ON rif_data.NUM_SAHSULAND_CANCER(AGE_SEX_GROUP);
GO
;

CREATE INDEX NUM_SAHSULAND_CANCER_SAHSU_GRD_LEVEL1 ON rif_data.NUM_SAHSULAND_CANCER(SAHSU_GRD_LEVEL1);
GO
;

CREATE INDEX NUM_SAHSULAND_CANCER_SAHSU_GRD_LEVEL2 ON rif_data.NUM_SAHSULAND_CANCER(SAHSU_GRD_LEVEL2);
GO
;

CREATE INDEX NUM_SAHSULAND_CANCER_SAHSU_GRD_LEVEL3 ON rif_data.NUM_SAHSULAND_CANCER(SAHSU_GRD_LEVEL3);
GO
;

CREATE INDEX NUM_SAHSULAND_CANCER_SAHSU_GRD_LEVEL4 ON rif_data.NUM_SAHSULAND_CANCER(SAHSU_GRD_LEVEL4);
GO
;

CREATE INDEX NUM_SAHSULAND_CANCER_ICD ON rif_data.NUM_SAHSULAND_CANCER(ICD);
GO
;

CREATE INDEX NUM_SAHSULAND_CANCER_TOTAL ON rif_data.NUM_SAHSULAND_CANCER(TOTAL);
GO
;


INSERT INTO rif40.rif40_tables (
   theme,
   table_name,
   description,
   year_start,
   year_stop,
   total_field,
   isindirectdenominator,
   isdirectdenominator,
   isnumerator,
   automatic,
   sex_field_name,
   age_group_field_name,
   age_sex_group_field_name,
   age_group_id) 
SELECT 
   'cancers',
   'NUM_SAHSULAND_CANCER',
   'sahsuland cancer cases',
   MIN(year),
   MAX(year),
   null,
   0,
   0,
   1,
   1,
   null,
   null,
   'AGE_SEX_GROUP',
   1
FROM
   rif_data.num_sahsuland_cancer;
GO



INSERT INTO rif40.rif40_outcome_groups(
   outcome_type, outcome_group_name, outcome_group_description, field_name, multiple_field_count)
SELECT
   'ICD' AS outcome_type,
   'SAHSULAND_ICD' AS outcome_group_name,
   'SAHSULAND ICD' AS outcome_group_description,
   'ICD' AS field_name,
   0 AS multiple_field_count
WHERE NOT EXISTS (SELECT outcome_group_name FROM  rif40.rif40_outcome_groups WHERE outcome_group_name = 'SAHSULAND_ICD');
GO



INSERT INTO rif40.rif40_table_outcomes (
   outcome_group_name,
   numer_tab,
   current_version_start_year) 
SELECT 
   'SAHSULAND_ICD',
   'NUM_SAHSULAND_CANCER',
   MIN(year) 
FROM 
   rif_data.NUM_SAHSULAND_CANCER;
GO




-- =========================================================
-- Adding Covariates
-- =========================================================

-- Adding sahsuland_covariates3-1.0


CREATE TABLE rif_data.covar_sahsuland_covariates3 ( 
   year INTEGER NOT NULL,
   sahsu_grd_level3 NVARCHAR(20) NOT NULL,
   ses INTEGER,
   ethnicity INTEGER);
GO


BULK INSERT rif_data.covar_sahsuland_covariates3 FROM '$(pwd)/covar_sahsuland_covariates3.csv'
WITH 
(
   FORMATFILE = '$(pwd)/covar_sahsuland_covariates3.fmt',
   TABLOCK,
   FIRSTROW=2
);
GO

CREATE UNIQUE INDEX COVAR_SAHSULAND_COVARIATES3_pk ON rif_data.covar_sahsuland_covariates3(YEAR,SAHSU_GRD_LEVEL3);
GO


EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'covariates level 3',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='covar_sahsuland_covariates3';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'year field value',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='covar_sahsuland_covariates3',
   @level2type = N'Column', @level2name='year';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'geographical resolution field level 3',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='covar_sahsuland_covariates3',
   @level2type = N'Column', @level2name='sahsu_grd_level3';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'socio economic status',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='covar_sahsuland_covariates3',
   @level2type = N'Column', @level2name='ses';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'ethnicity',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='covar_sahsuland_covariates3',
   @level2type = N'Column', @level2name='ethnicity';
GO

UPDATE t_rif40_geolevels 
SET covariate_table = 'COVAR_SAHSULAND_COVARIATES3' WHERE geography='SAHSULAND' AND geolevel_name='SAHSU_GRD_LEVEL3';
   GO




INSERT INTO rif40.rif40_covariates (
   geography,
   geolevel_name,
   covariate_name,
   min,
   max,
   type) 
SELECT 
   'SAHSULAND',
   'SAHSU_GRD_LEVEL3',
   'SES',
   MIN(SES),
   MAX(SES),
   1
FROM 
   rif_data.COVAR_SAHSULAND_COVARIATES3;
GO


INSERT INTO rif40.rif40_covariates (
   geography,
   geolevel_name,
   covariate_name,
   min,
   max,
   type) 
SELECT 
   'SAHSULAND',
   'SAHSU_GRD_LEVEL3',
   'ETHNICITY',
   MIN(ETHNICITY),
   MAX(ETHNICITY),
   1
FROM 
   rif_data.COVAR_SAHSULAND_COVARIATES3;
GO



-- Adding sahsuland_covariates4-1.0


CREATE TABLE rif_data.covar_sahsuland_covariates4 ( 
   year INTEGER NOT NULL,
   sahsu_grd_level4 NVARCHAR(20) NOT NULL,
   ses INTEGER,
   areatri1km INTEGER,
   near_dist DOUBLE PRECISION,
   tri_1km DOUBLE PRECISION);
GO


BULK INSERT rif_data.covar_sahsuland_covariates4 FROM '$(pwd)/covar_sahsuland_covariates4.csv'
WITH 
(
   FORMATFILE = '$(pwd)/covar_sahsuland_covariates4.fmt',
   TABLOCK,
   FIRSTROW=2
);
GO

CREATE UNIQUE INDEX COVAR_SAHSULAND_COVARIATES4_pk ON rif_data.covar_sahsuland_covariates4(YEAR,SAHSU_GRD_LEVEL4);
GO


EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'level four covariates',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='covar_sahsuland_covariates4';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'year field value',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='covar_sahsuland_covariates4',
   @level2type = N'Column', @level2name='year';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'level four covariate',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='covar_sahsuland_covariates4',
   @level2type = N'Column', @level2name='sahsu_grd_level4';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'socio economic status',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='covar_sahsuland_covariates4',
   @level2type = N'Column', @level2name='ses';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'area tri 1 km',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='covar_sahsuland_covariates4',
   @level2type = N'Column', @level2name='areatri1km';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'near distance',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='covar_sahsuland_covariates4',
   @level2type = N'Column', @level2name='near_dist';
GO

EXECUTE sp_addextendedproperty
   @name = 'MS Description',
   @value = 'tri 1 km',
   @level0type = N'Schema', @level0name='rif_data',
   @level1type = N'Table', @level1name='covar_sahsuland_covariates4',
   @level2type = N'Column', @level2name='tri_1km';
GO

UPDATE t_rif40_geolevels 
SET covariate_table = 'COVAR_SAHSULAND_COVARIATES4' WHERE geography='SAHSULAND' AND geolevel_name='SAHSU_GRD_LEVEL4';
   GO




INSERT INTO rif40.rif40_covariates (
   geography,
   geolevel_name,
   covariate_name,
   min,
   max,
   type) 
SELECT 
   'SAHSULAND',
   'SAHSU_GRD_LEVEL4',
   'SES',
   MIN(SES),
   MAX(SES),
   1
FROM 
   rif_data.COVAR_SAHSULAND_COVARIATES4;
GO


INSERT INTO rif40.rif40_covariates (
   geography,
   geolevel_name,
   covariate_name,
   min,
   max,
   type) 
SELECT 
   'SAHSULAND',
   'SAHSU_GRD_LEVEL4',
   'AREATRI1KM',
   MIN(AREATRI1KM),
   MAX(AREATRI1KM),
   1
FROM 
   rif_data.COVAR_SAHSULAND_COVARIATES4;
GO


INSERT INTO rif40.rif40_covariates (
   geography,
   geolevel_name,
   covariate_name,
   min,
   max,
   type) 
SELECT 
   'SAHSULAND',
   'SAHSU_GRD_LEVEL4',
   'NEAR_DIST',
   MIN(NEAR_DIST),
   MAX(NEAR_DIST),
   2
FROM 
   rif_data.COVAR_SAHSULAND_COVARIATES4;
GO


INSERT INTO rif40.rif40_covariates (
   geography,
   geolevel_name,
   covariate_name,
   min,
   max,
   type) 
SELECT 
   'SAHSULAND',
   'SAHSU_GRD_LEVEL4',
   'TRI_1KM',
   MIN(TRI_1KM),
   MAX(TRI_1KM),
   2
FROM 
   rif_data.COVAR_SAHSULAND_COVARIATES4;
GO




COMMIT TRANSACTION DataLoading;
GO