class e_threed_class_particles {
    constructor(threed, e) {
        this.threed = threed;
        
        // LIGHTs
        this.particles = null;
        this.particelle = {}; //luce è l'oggetto che viene consegnato all'istanza di scena

    }
    // ------------ DATA -------------
    //memorizzo i valori dei controls
    updateData3d_particles($id, $settings){
       
    }

    // ------------ ADD/REMOVE -------------
    //costuisco l'elemento
    add_particles($id, $settings){
        
        alert('Particles is under construction');
        
        //console.log(this.threed.luci);
        this.writeWidgetPanel($id);
     
    }
    //rimuovo l'elemento
    delete_particles($id){
       
    }

    // ------------ GENERATE -------------
    //creo le luci
    particlesConstructor(){
        


        //this.threed.scene.add( this.particles );
    }
    
    //------------ UPDATE ----------------
    //
    // ripulisco
    clean3DParticles(){
        if(this.particles){
            
           
        }
    }

    // aggiorno
    rigenerateParticles(){
        this.clean3DParticles();
        this.particlesConstructor();
    }
   

    
    // widget panel
    writeWidgetPanel($id){
        if(elementorFrontend.isEditMode() && this.particles){
            
        }
        
    }

    // CHANGES
    elementChange($id, propertyName, settings, isMultiple) {
        
    }
}