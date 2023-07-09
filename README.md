# projet-ibrahim-cal

Un fablab met des machines de fabrication numérique à disposition de ses membres. À chaque machine correspond un tarif. L’utilisation des machines est facturée en fonction de la durée. 

Un des objectifs du fablab est de rendre les membres autonomes. Ce sont donc les membres eux-mêmes qui encodent leurs durées 
d’utilisation. 

Application de gestion permettant aux membres d’encoder leur utilisation (de la location) des machines.
Elle permettra aussi aux fablab managers de gérer les équipements et d’éditer les factures.



Commandes pour lancer le projet sous windows : 

set DEBUG=projet-pid:* & npm start -- avec invite commande
$env:DEBUG="projet-pid:*"; npm run devstart -- avec powershell (version dev)
$env:DEBUG="projet-pid:*"; npm start -- powershell

Sous MacOS ou Linux
DEBUG=projet-pid:* npm start // via invite de commande

Comptes pour se logger dans l’application : 

manager - manager/
comptable - comptable/
