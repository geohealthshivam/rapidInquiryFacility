USE [RIF40]
GO
/****** Object:  Table [dbo].[SAHSULAND_LEVEL1]    Script Date: 19/09/2014 12:07:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[SAHSULAND_LEVEL1](
	[LEVEL1] [varchar](20) NOT NULL,
	[NAME] [varchar](200) NOT NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
EXEC sys.sp_addextendedproperty @name=N'MS_SSMA_SOURCE', @value=N'RIF40.SAHSULAND_LEVEL1.LEVEL1' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'SAHSULAND_LEVEL1', @level2type=N'COLUMN',@level2name=N'LEVEL1'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_SSMA_SOURCE', @value=N'RIF40.SAHSULAND_LEVEL1."NAME"' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'SAHSULAND_LEVEL1', @level2type=N'COLUMN',@level2name=N'NAME'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_SSMA_SOURCE', @value=N'RIF40.SAHSULAND_LEVEL1' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'SAHSULAND_LEVEL1'
GO
