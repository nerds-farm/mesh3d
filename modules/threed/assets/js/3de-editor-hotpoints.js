jQuery(window).on('load', function () {
    
    elementor.hooks.addAction( 'panel/open_editor/widget/e-3d-mesh', function( panel, model, view ) {
        var $element = view.$el.find( '.elementor-selector' );
        

        //console.log(view.$el);
        //console.log(panel);

        if ( $element.length ) {
            $element.click( function() {
              alert( 'Some Message' );
            } );
        }
     } );
    
});
