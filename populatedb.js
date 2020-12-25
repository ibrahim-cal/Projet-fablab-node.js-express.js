console.log(
  "This script populates some equipement, user to your database."
);

const { sequelize, User, Equipement } = require("./models/sequelize");


var equipements = [];
/* en construction -------------------***********************


 async function machineCreate(nom, prix) {
 try{ equipementdetail = {nom : nom, prix : prix};

  const equipement = await Machine.create( equipementdetail );
  
  console.log("nouvel equipement :" + equipement.id);
  equipements.push(equipement);
  return equipement;
    } catch(err) { console.log(err);}
 }

 async function equipementCreate(){
   return Promise.all([
     equipementCreate("decoupeuse laser", "0,5€/min"),
     equipementCreate("ultimaker imprimante 3d", "0,3€/min"),
     equipementCreate("ultimaker pro imprimante 3d", "0,55€/min"),
     equipementCreate("prusa i3 imprimante 3d", "0,3€/min"),
     equipementCreate("formlabs3 imprimante 3d", "0,3€/min"),
     equipementCreate("artec eva scanner 3D", "0,4€/min"),
     equipementCreate("ein scan sp scanner 3D", "0,35€/min"),
   ])
 };


  (async () => {
    try {
      await sequelize.sync({ force: true });
      const equipements = await createEquipements();
    
      sequelize.close();
    } catch (err) {
      console.error("Error while populating DB: ", err);
    }
  })();

  */