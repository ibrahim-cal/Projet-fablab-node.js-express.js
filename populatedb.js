console.log(
  "ce script (cal) remplit la BDD avec des machines, utilisateurs, etc"
);
const bcrypt = require("bcrypt");
//const { removeAllListeners } = require("nodemon");

const { sequelize, Facture, Utilisation, Machine, Utilisateur, Role, Permission } = require("./models/sequelize");
const saltRounds = 10;

var utilisations = [];
var machines = [];
var utilisateurs = [];
var roles = [];
var permissions = [];
var factures = [];
//var lignefacturations = [];

async function utilisateurCreate(prenom, nom, email, mdp, role) {
   
   const hash =  bcrypt.hashSync(mdp, saltRounds)
    utilisateurdetail =
    { prenom: prenom, nom: nom, email: email};
    utilisateurdetail.passwordHash = hash;
  
    var utilisateur = await Utilisateur.create(utilisateurdetail);
    await utilisateur.addRoles(role);
    console.log("nouvel utilisateur: " + utilisateur.id);
    utilisateurs.push(utilisateur);
    return utilisateur;
}

async function machineCreate(nom, tarif) {
  try {
    machinedetail = { nom: nom, tarif: tarif };

    var machine = await Machine.create(machinedetail);

    console.log("nouvelle machine :" + machine.id);
    machines.push(machine);
    return machine;
  } catch (err) {
    console.log(err);
  }
}

async function factureCreate(numeroFacture, montant, dFacture, utilisateur) {
  facturedetail = { numeroFacture: numeroFacture, montant: montant };
  if (dFacture != false) facturedetail.dateFacture = dFacture;

  const facture = await Facture.create(facturedetail);
  await facture.setUtilisateur(utilisateur);

  console.log("nouvelle facture: " + facture.id);
  factures.push(facture);
  return facture;
}
/*
async function ligneFacturationCreate(nomMachine, prix, duree, sousTotal, facture, utilisation) {
  lignefacturationdetail = {
    nomMachine: nomMachine, prix: prix, duree:
      duree, sousTotal: sousTotal};

  const lignefacturation = await LigneFacturation.create(lignefacturationdetail);
  await lignefacturation.setFacture(facture);
  await lignefacturation.setUtilisation(utilisation);


  console.log("nouvelle ligne de facturation: " + lignefacturation.id);
  lignefacturations.push(lignefacturation);
  return lignefacturation;
}
*/

async function utilisationCreate(duree, date, machine, utilisateur) {
  utilisationdetail = { duree: duree };
  if (date != false) utilisationdetail.dateUtilisation = date;
 
  const utilisation = await Utilisation.create(utilisationdetail);
  await utilisation.setMachine(machine);
  await utilisation.setUtilisateur(utilisateur);

  console.log("nouvelle utilisation: " + utilisation.id);
  utilisations.push(utilisation);
  return utilisation;
}

async function roleCreate(nom){
  
  roledetail = { nom : nom };

  const role = await Role.create(roledetail);
  
  console.log("nouveau role: " + role.id);
  roles.push(role);
  return role;
}


async function permCreate(nom, role){
  permdetail = {nom : nom};
  const permission = await Permission.create(permdetail);
  await permission.addRoles(role);

  console.log("nouvelle permission: " + permission.id);
  permissions.push(permission);
  return permission;
}

async function createPerm(){
  return await Promise.all([
    permCreate("lireMachine",[roles[0], roles[1]]),
    permCreate("modifierMachine", roles[1]),
    permCreate("supprimerMachine", roles[1]),
    permCreate("creerMachine", roles[1]),
    permCreate("lireToutesUtilisations", [roles[1], roles[2]]),
    permCreate("lireUtilisationsMembre", roles[0]),
    permCreate("creerUtilisation", [roles[1], roles[0]]),
    permCreate("creerUtilisationModeManager", roles[1]),
    permCreate("supprimerUtilisation", roles[1]),
    permCreate("lireToutesFactures", [roles[1], roles[2]]),
    permCreate("lireFacturesMembre", roles[0]),
    permCreate("creerFacture", roles[1]),
    permCreate("supprimerFacture", roles[2]),
    permCreate("lireTousUtilisateurs", [roles[1], roles[2]]),
    permCreate("lireMem", roles[0]),
    permCreate("modifierInfosTousUtilisateurs", roles[1]),
    permCreate("modifierInfosMembre", roles[0]),
    permCreate("lireFactureDetail", [roles[1],roles[2]]),

  ])
}

async function createMachine() {
  return await Promise.all([
    machineCreate("decoupeuse laser", "1"),
    machineCreate("ultimaker imprimante 3d", "0.3"),
    machineCreate("ultimaker pro imprimante 3d", "0.55"),
    machineCreate("prusa i3 imprimante 3d", "0.3"),
    machineCreate("formlabs3 imprimante 3d", "0.3"),
    machineCreate("artec eva scanner 3D", "0.4"),
    machineCreate("ein scan sp scanner 3D", "0.35"),
  ]);
}

async function createRole(){
  return await Promise.all([
    roleCreate("membre"),
    roleCreate("manager"),
    roleCreate("comptable"),
  ])
}

async function createUtilisation() {
  return await Promise.all([
  /*  utilisationCreate("20", "2020-12-25", machines[0], utilisateurs[0]),/*
    utilisationCreate("30", "2020-12-25", machines[0], utilisateurs[1]),
*/
  ]);
}

async function createFacture() {
  return await Promise.all([

  ]);
}

async function createUtilisateur() {
  return await Promise.all([
    utilisateurCreate("comptable", "comptable", "comptable", "comptable", roles[2]),
    utilisateurCreate("manager", "manager", "mmm", "mmm", roles[1]),
    utilisateurCreate("membre", "membre", "bbb", "bbb", roles[0]),
    utilisateurCreate("membre", "membre", "cal", "cal", roles[0]),
  ]);
}

(async () => {
  try {
    await sequelize.sync({ force: true });
    //createUtilisateur().then(()=>{
      // console.log( "creation ok");
    // });
    
    await createRole();
    await createPerm();
    await createUtilisateur();
    await createMachine();
    await createFacture();
    await createUtilisation();

    sequelize.close();
  } catch (err) {
    console.error("Erreur remplissage BDD: ", err);
  }
})();

