/*
<trigger_rif40_tables_checks_description>
<para>
Check TABLE_NAME exists. DO NOT RAISE AN ERROR IF IT DOES; otherwise check, column <TABLE_NAME>.TOTAL_FIELD exists. 
This allows the RIF40 schema owner to not have access to the tables. Access is checked in RIF40_NUM_DENOM. 
Automatic (Able to be used in automatic RIF40_NUM_DENOM (0/1, default 0). 
A user specific T_RIF40_NUM_DENOM is supplied for other combinations. 
Cannot be applied to direct standardisation denominator) is restricted to 1 denominator per geography.
Check table_name, total_field, sex_field_name, age_group_field_name, age_sex_group_field_name Oracle names.
</para>
</trigger_rif40_tables_checks_description>
*/

USE [sahsuland_dev]
GO

IF EXISTS (SELECT *  FROM sys.triggers tr
INNER JOIN sys.tables t ON tr.parent_id = t.object_id
WHERE t.schema_id = SCHEMA_ID(N'rif40') 
and tr.name=N'tr_rif40_tables_checks')
BEGIN
	DROP TRIGGER [rif40].[tr_rif40_tables_checks]
END
GO

------------------------------
-- create trigger code 
------------------------------
CREATE trigger [rif40].[tr_rif40_tables_checks]
on [rif40].[rif40_tables]
BEFORE insert , update 
as
BEGIN 
--------------------------------------
--to  Determine the type of transaction 
---------------------------------------
Declare  @XTYPE varchar(5);


	IF EXISTS (SELECT * FROM DELETED)
	BEGIN
		SET @XTYPE = 'D'
	END;
	
	IF EXISTS (SELECT * FROM INSERTED)
	BEGIN
		IF (@XTYPE = 'D')
			SET @XTYPE = 'U'
		ELSE 
			SET @XTYPE = 'I'
	END

--Check if column <TABLE_NAME>.TOTAL_FIELD exists
IF (@XTYPE = 'U' or @XTYPE = 'I') 
BEGIN

--WHEN (((((((((new.table_name IS NOT NULL) AND ((new.table_name)::text <> ''::text)) OR ((new.isdirectdenominator IS NOT NULL) AND ((new.isdirectdenominator)::text <> ''::text))) OR ((new.table_name IS NOT NULL) AND ((new.table_name)::text <> ''::text))) OR ((new.total_field IS NOT NULL) AND ((new.total_field)::text <> ''::text))) OR ((new.sex_field_name IS NOT NULL) AND ((new.sex_field_name)::text <> ''::text))) OR ((new.age_group_field_name IS NOT NULL) AND ((new.age_group_field_name)::text <> ''::text))) OR ((new.age_sex_group_field_name IS NOT NULL) AND ((new.age_sex_group_field_name)::text <> ''::text))))
 

	declare @total_col_check varchar(max) = (
	SELECT table_name, total_field
	FROM   inserted  b
	where 
		b.total_field is null or b.total_field = ''
		or not exists (
		select 1
		from INFORMATION_SCHEMA.COLUMNS a
		where a.table_name=b.table_name
		and a.column_name=b.total_field
		)
	 FOR XML PATH('') 
	);

	IF @total_field_check IS NOT NULL
	BEGIN TRY
		rollback;
		DECLARE @err_msg1 VARCHAR(MAX) = formatmessage(51037, @total_field_check);
		THROW 51037, @err_msg1, 1;
	END TRY
	BEGIN CATCH
		EXEC [rif40].[ErrorLog_proc] @Error_Location='[rif40].[rif40_tables]';
		THROW 51037, @err_msg1, 1;
	END CATCH;	
	ELSE
		EXEC [rif40].[rif40_log] 'DEBUG1', '[rif40].[rif40_tables]', 'RIF40_TABLES TOTAL_FIELD column found in table';
		
	
END;

END;