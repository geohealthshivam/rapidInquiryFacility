RIF.menu[ 'facade-diseaseSubmission' ] = ( function( _p ) {

  /*
   * Facades can only communicate to main component.
   * Cannot call directly component sub units
   */

  var facade = {

    /* Subscribers */
    updateHealthThemeAvailables: function() {},
    updateNumeratorAvailables: function() {},
    updateDenominatorAvailables: function() {},

    /* Firers  */

    studyNameChanged: function( arg ) {
      this.fire( 'studyNameChanged', arg );
    },
    healthThemeChanged: function( arg ) {
      this.fire( 'healthThemeChanged', arg );
    },
    numeratorChanged: function( arg ) {
      this.fire( 'numeratorChanged', arg );
    },
    denominatorChanged: function( arg ) {
      this.fire( 'denominatorChanged', arg );
    },
    selectAtChanged: function( arg ) {
      this.fire( 'selectAtChanged', arg );
    },
    resolutionChanged: function( arg ) {
      this.fire( 'resolutionChanged', arg );
    },
    taxonomyChanged: function( arg ) {
      this.fire( 'taxonomyChanged', arg );
    },
    icdSelectionChanged: function( arg ) {
      this.fire( 'icdSelectionChanged', arg );
    },
    startYearChanged: function( arg ) {
      this.fire( 'startYearChanged', arg );
    },
    endYearChanged: function( arg ) {
      this.fire( 'endYearChanged', arg );
    },
    genderChanged: function( arg ) {
      this.fire( 'genderChanged', arg );
    },

    /* Study Related */


  };

  return facade;


} );