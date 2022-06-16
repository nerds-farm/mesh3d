class e_threed_class_plane {
    constructor(threed, e) {
        this.threed = threed;
        
        // LIGHTs
        this.plane = null;
        this.particelle = {}; //luce è l'oggetto che viene consegnato all'istanza di scena

    }
    // ------------ DATA -------------
    //memorizzo i valori dei controls
    updateData3d_plane($id, $settings){
       
    }

    // ------------ ADD/REMOVE -------------
    //costuisco l'elemento
    add_plane($id, $settings){
        
        alert('Plane is under construction');
        
        //console.log(this.threed.luci);
        this.writeWidgetPanel($id);
     
    }
    //rimuovo l'elemento
    delete_plane($id){
       
    }

    // ------------ GENERATE -------------
    //creo le luci
    planeConstructor(){
        


        //this.threed.scene.add( this.plane );
    }
    
    //------------ UPDATE ----------------
    //
    // ripulisco
    clean3DPlane(){
        if(this.plane){
            
           
        }
    }

    // aggiorno
    rigeneratePlane(){
        this.clean3DPlane();
        this.planeConstructor();
    }
   

    
    // widget panel
    writeWidgetPanel($id){
        if(elementorFrontend.isEditMode() && this.plane){
            
        }
        
    }

    // CHANGES
    elementChange($id, propertyName, settings, isMultiple) {
        
    }
}