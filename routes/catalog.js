var express = require("express");
var router = express.Router();

// Require controller modules.
var facture_controller = require("../controllers/factureController");
var machine_controller = require("../controllers/machineController");
var utilisation_controller = require("../controllers/utilisationController");
var utilisateur_controller = require("../controllers/utilisateurController");

var { checkPermission } = require('../middlewares/roles');

router.get("/", machine_controller.index);

router.get("/utilisateur/login", utilisateur_controller.login_get);
router.post("/utilisateur/login", utilisateur_controller.login_post);
router.get("/utilisateur/logout", utilisateur_controller.logout_get);


// GET request for creating a facture. NOTE This must come before routes that display facture (uses id).
router.get("/facture/create",//checkPermission('creerFacture', 'manager'), 
facture_controller.facture_create_get);
// POST request for creating facture.
router.post("/facture/create", facture_controller.facture_create_post);
// GET request to delete facture.
router.get("/facture/:id/delete",//-- checkPermission('supprimerFacture', 'comptable'),
 facture_controller.facture_delete_get);
// POST request to delete facture.
router.post("/facture/:id/delete", //checkPermission('supprimerFacture', 'comptable'),
 facture_controller.facture_delete_post);
// GET request for one facture.
router.get("/facture/:id", facture_controller.facture_detail);
// GET request for list of all facture items.
router.get("/factures", facture_controller.facture_list);
router.get("/facturesMembre", facture_controller.facture_listMembre);

// GET request for creating a machine. NOTE This must come before routes that display machine (uses id).
router.get("/machine/create", 
//checkPermission('creerMachine', 'manager'),
 machine_controller.machine_create_get);
// POST request for creating machine.
router.post("/machine/create", //
//checkPermission('creerMachine', 'manager'), 
machine_controller.machine_create_post);
// GET request to delete machine.
router.get("/machine/:id/delete",
//checkPermission('supprimerMachine', 'manager'),
 machine_controller.machine_delete_get);
// POST request to delete machine.
router.post("/machine/:id/delete", //checkPermission('supprimerMachine', 'manager'),
machine_controller.machine_delete_post);
// GET request to update machine.
router.get("/machine/:id/update",
//checkPermission('modifierMachine', 'manager'),
 machine_controller.machine_update_get);
// POST request to update machine.
router.post("/machine/:id/update",// checkPermission('modifierMachine', 'manager'),
 machine_controller.machine_update_post);
// GET request for one machine.
router.get("/machine/:id", machine_controller.machine_detail);
// GET request for list of all machine items.
router.get("/machines", machine_controller.machine_list);


// GET request for creating a utilisateur. NOTE This must come before routes that display utilisateur (uses id).
router.get("/utilisateur/create", utilisateur_controller.utilisateur_create_get);
// POST request for creating utilisateur.
router.post("/utilisateur/create", utilisateur_controller.utilisateur_create_post);
// GET request to update utilisateur.
router.get("/utilisateur/:id/update", utilisateur_controller.utilisateur_update_get);
router.get("/utilisateur/:id/updateMembre", utilisateur_controller.utilisateur_updateMembre_get);
// POST request to update utilisateur.
router.post("/utilisateur/:id/updateMembre",// checkPermission('modifierUtilisateur', 'manager'),
 utilisateur_controller.utilisateur_updateMembre_post);
router.post("/utilisateur/:id/update",// checkPermission('modifierUtilisateur', 'manager'),
 utilisateur_controller.utilisateur_update_post);
// GET request for one utilisateur.
router.get("/utilisateur/:id", utilisateur_controller.utilisateur_detail);
// GET request for list of all utilisateur items.
router.get("/utilisateurs", utilisateur_controller.utilisateur_list);


// GET request for creating a utilisation. NOTE This must come before routes that display utilisation (uses id).
router.get("/utilisation/create", utilisation_controller.utilisation_create_get);
// POST request for creating utilisation.
router.post("/utilisation/create", utilisation_controller.utilisation_create_post);
// GET request to delete utilisation.
router.get("/utilisation/:id/delete", utilisation_controller.utilisation_delete_get);
// POST request to delete utilisation.
router.post("/utilisation/:id/delete", utilisation_controller.utilisation_delete_post);
// GET request for one utilisation.
router.get("/utilisation/:id", utilisation_controller.utilisation_detail);
// GET request for list of all utilisation items.
router.get("/utilisations",// checkPermission('lireMesUtilisations', 'membre'), 
utilisation_controller.utilisation_list);
router.get("/utilisationsMembre", utilisation_controller.utilisation_listMembre);

module.exports = router;