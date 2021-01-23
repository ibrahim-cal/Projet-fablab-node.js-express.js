const { Facture, Utilisateur,LigneFacturation, Utilisation, Role, Permission } = require("../models/sequelize");
const createError = require("http-errors");
const { body, validationResult } = require("express-validator");
const facture = require("../models/facture");
const passport = require("passport");
var session = require("express-session");
const { checkPermission } = require("../middlewares/roles")
const { Op } = require("sequelize");

exports.facture_list =  async function (req, res, next) {

  
  try {
    const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }

   // checkPermission(["lireFacture", "membre"], req, res, async () => {
     /*
      const facture_listMembre = await Facture.findAll({
          where: { utilisateurId : user.id},
          include: [LigneFacturation, Utilisateur],     //***********    Table LigneF************** 
        });
          res.render("facture_listMembreConnecte", { title: "Liste de mes  factures",
          facture_listMembre, user: req.user });
      })
          
         
                  //*************** Table ligne fact********************** */
    
    const facture_list = await Facture.findAll({ // on fait une requete en BDD dans la table facture, en incluant les tables 
      include: [Utilisation, Utilisateur], // LigneFacturation et utilisateur. On stocke le tout dans une variable facture_list
    });
    res.render("facture_list", { title: "Liste factures", facture_list , user: req.user});// on renvoie vers la page pug "facture_list"
  

  } catch (error) {
    next(error);
  }

}


  exports.facture_detail = async function (req, res, next) {
    try {
      const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
      const factureId = req.params.id; // on recupere l'id de la facture
      const facture = await Facture.findByPk(factureId, {// requete dans la BDD pour récuperer la facture dont 
        include: [Utilisation, Utilisateur],// l'id correspond à celui reçu juste avant
      });   //*************** Table ligne fact***************** */
      
      if (facture !== null) {
        res.render("facture_detail", { title: "Detail facture", facture, user: req.user });
      } else {
        next(createError(404, "Pas de details de facture"));
      }
    } catch (error) {
      next(error);
    }
  };

exports.facture_create_get =  async function (req, res, next) {
  
  try {
    const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }         //*************** Table ligne fact ****************/
    const [utilisateurs, factures, utilisations] = await Promise.all([
      Utilisateur.findAll(),    // on va récuperer les contenus des tables utilisateur, utilisation
      Utilisation.findAll(),
      
    ]);
    res.render("facture_form", { title: "Nouvelle facture",utilisateurs, factures,
     utilisations, user: req.user });
  } catch (error) {
    next(error);
  }

};
  
  exports.facture_create_post =
  [
    body("dateFacture", "Date invalide")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

    async function (req, res, next) {
      try {
        
        const sansFactures = await Utilisation.findAll({
          where : {
            [Op.and]: [
          { factureId : null},
          { utilisateurId : req.body.utilisateurid}
            ] },
          })
     
          total = 0;
          sansFactures.forEach(element => {
           
           res= element.duree*element.tarifMachine;
            total = res+ total;
          })
          console.log(total);
          console.log("++++" +req.body.dateFacture);
         
          const facture = await Facture.build({
            numeroFacture : 
           ( ""+  (req.body.dateFacture.getFullYear()) + (req.body.dateFacture.getMonth()+1)  ) ,
            montant : total,
            dateFacture : req.body.dateFacture,
          })
          
          }  catch (error) {
        next(error);
          }
        },
  

];


  exports.facture_delete_get = async function (req, res, next) {
 
    try {
      const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
      const facture = await Facture.findByPk(req.params.id, {
        include: [LigneFacturation],        //*************** Table ligne fact ***************/
      });
      if (facture === null) {
        res.redirect("/catalog/facture");
      } else {
        res.render("facture_delete", { title: "Suppression facture", facture , user: req.user});
      }
    } catch (error) {
      next(error);
    }
  };
  
  exports.facture_delete_post =  async function (req, res, next) {
    try {
      const user = req.user;
    if (!user) {
      return res.redirect("/catalog/utilisateur/login");
    }
      const facture = await Facture.findByPk(req.params.id, {
        include: [LigneFacturation],      //*************** Table ligne fact ***************/
      });
      if (facture === null) {
        next(createError(404, "pas de facture"));
      } 
       else {
        await facture.destroy();
        res.redirect("/catalog/factures");
      }
      
    } catch (error) {
      next(error);
    }
  };