jQuery(window).on('elementor/frontend/init', () => {

    
    class WidgetThreedMeshHandlerClass extends elementorModules.frontend.handlers.Base {
        getDefaultSettings() {
            return {
                selectors: {
                    threedcontainer: '.e-threed-container',
                    threedgeometry: '.threedgeometry-canvas',
                },
            };
        }

        getDefaultElements() {
            const selectors = this.getSettings('selectors');
            return {
                $threedcontainer: this.$element.find(selectors.threedcontainer),
                $threedgeometry: this.$element.find(selectors.threedgeometry),
                $scope: this.$element,
				$id_scope: this.getID(),
                $threed: null
            };
        }

        bindEvents() {

            // @p poi li rimuovo.....
            let id_scope = this.elements.$id_scope,
            threedgeometryElement = this.elements.$threedgeometry,
            container = this.elements.$threedcontainer;
            
            // THIS internal global items ... 
            this.scope = this.elements.$scope;
            this.elementSettings = this.getElementSettings(),
            this.canvas = threedgeometryElement[0];
            this.container = container[0];
            this.activeItem = -1;
            let THREED = null;

            ////////////////////////////////////////////////////////////////////
            //if(!this.scope.hasClass('e3d-initalized')){
                THREED = new e_threed_base(this.elements,this.elementSettings);
                //this.elements.$threed = THREED;
                
                THREED.init(id_scope);

                this.scope.data('THREED',THREED);
            
            // }
            this.scope.addClass('e3d-initalized');



            
        }
       
       
        onElementChange(propertyName) {
            this.scope.data('THREED').onElementChange(propertyName,this.getElementSettings());
        }
        
    }

    const ThreedMeshHandler = ($element) => {
        
        elementorFrontend.elementsHandler.addHandler(WidgetThreedMeshHandlerClass, {
            $element
        });

    };
    elementorFrontend.hooks.addAction('frontend/element_ready/e-3d-mesh.default', ThreedMeshHandler);
});