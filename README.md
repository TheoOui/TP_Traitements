# Infrastructure distribuée pour un système de gestion de réservation de billets

## Groupe

- Guiton Clément
- Azouz Théo
- Chemin Bastien

### Description des composants

- **ETCD** &rarr; Systeme m'étant à disposition un mutex qui sera lock le temps qu'un utilisateur fasse ça réservation et empêchera qu'un autre lui prenne son billet.  
  Paramétré ici en cluster, trois instances ce partage les tâches

* **Nginx** &rarr; Serveur web répartissant le traffic entre les trois instances etcd

* **MySql** &rarr; Base de données relationnel, pour le stockage des données

* **App.js** &rarr; Application en Node, qui fait le lien entre tous les composants.

* **Docker** &rarr; permet de conteneuriser l'ensemble.

* **Swagger** &rarr; Permet de documenter l'API et de la tester.

* **Redis** &rarr; Système de caching de l'app.

### <u>[Lien vers le Swagger](http://localhost:5001/api-docs/#/)</u>

### Service

Il existe un unique service, à travers '/reserve', qui permet de placer une réservation à l'aide d'un id de user et d'un event_id représentant la demande de réservation.

### Gestion des locks

Un lock est demandé sur le mutex reservation_lock.
Temps qu'il n'est pas obtenu, l'app est mise en attente.
Lorsque celui-ci est réalisé, il permet de réserver un ticket, le stock de tickets est décrémenté.
