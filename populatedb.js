

console.log(
  "ce script remplit la BDD avec des machines, utilisateurs, etc"
);
const bcrypt = require("bcrypt");
const { sequelize, Facture, LigneFacturation, Machine, Utilisateur, Utilisation } = require("./models/sequelize");
const saltRounds = 10;

var machines = [];
var utilisateurs = [];
var utilisations = [];
var factures = [];
var lignefacturations = [];


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

async function utilisateurCreate(prenom, nom, email, mdp) {

    utilisateurdetail =
     { prenom: prenom, nom: nom, email: email};
     utilisateurdetail.passwordHash = await bcrypt.hash(mdp, saltRounds);
    
    var utilisateur = await Utilisateur.create(utilisateurdetail);

    console.log("nouvel utilisateur: " + utilisateur.id);
    utilisateurs.push(utilisateur);
    return utilisateur;

}

async function utilisationCreate(duree, date) {
  utilisationdetail = { duree: duree };
  if (date != false) utilisationdetail.dateUtilisation = date;

  var utilisation = await Utilisation.create(utilisationdetail);

  console.log("nouvelle utilisation: " + utilisation.id);
  utilisations.push(utilisation);
  return utilisation;
}

async function factureCreate(numeroFacture, montant, dFacture) {
  facturedetail = { numeroFacture: numeroFacture, montant: montant };
  if (dFacture != false) facturedetail.dateFacture = dFacture;

  var facture = await Facture.create(facturedetail);

  console.log("nouvelle facture: " + facture.id);
  factures.push(facture);
  return facture;
}

async function ligneFacturationCreate(nomMachine, prix, duree, sousTotal) {

  lignefacturationdetail = {
    nomMachine: nomMachine, prix: prix, duree:
      duree, sousTotal: sousTotal};

  var lignefacturation = await LigneFacturation.create(lignefacturationdetail);

  console.log("nouvelle ligne de facturation: " + lignefacturation.id);
  lignefacturations.push(lignefacturation);
  return lignefacturation;
}


async function createUtilisation() {
  return Promise.all([
    utilisationCreate("20min", "2020-12-25"),
    utilisationCreate("30min", "2020-12-25"),
    utilisationCreate("10min", "2020-12-25"),
  ]);
}

async function createLigneFacturation() {
  return Promise.all([
    ligneFacturationCreate("decoupeuse laser", "0,5€/min", "20min", "10€"),
    ligneFacturationCreate("ultimaker imprimante 3d", "0,3€/min", "30min", "9€"),
    ligneFacturationCreate("ultimaker pro imprimante 3d", "0,55€/min", "10min", "5,50€"),
  ]);
}

async function createFacture() {
  return Promise.all([
    factureCreate("202012001", "10€", "2020-12-25"),
    factureCreate("202012002", "9€", "2020-12-25"),
    factureCreate("202012003", "5€", "2020-12-25"),
  ]);
}

async function createUtilisateur() {
  return Promise.all([
    utilisateurCreate("Premier", "Premier", "Premier", "Premier"),
    utilisateurCreate("Deux", "Deux", "Deux", "Deux"),
    utilisateurCreate("Trois", "Trois", "Trois", "Trois"),
  ]);
}

async function createMachine() {
  return Promise.all([
    machineCreate("decoupeuse laser", "0,5€/min"),
    machineCreate("ultimaker imprimante 3d", "0,3€/min"),
    machineCreate("ultimaker pro imprimante 3d", "0,55€/min"),
    machineCreate("prusa i3 imprimante 3d", "0,3€/min"),
    machineCreate("formlabs3 imprimante 3d", "0,3€/min"),
    machineCreate("artec eva scanner 3D", "0,4€/min"),
    machineCreate("ein scan sp scanner 3D", "0,35€/min"),
  ]);
}

(async () => {
  try {
    await sequelize.sync({ force: true });
    const machines = await createMachine();
    const utilisateurs = await createUtilisateur();
    const factures = await createFacture();
    const lignefacturations = await createLigneFacturation();
    const utilisations = await createUtilisation();

    sequelize.close();
  } catch (err) {
    console.error("Erreur remplissage BDD: ", err);
  }
})();

