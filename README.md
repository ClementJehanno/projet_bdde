# Projet base de données
Ceci est le github associé à notre projet de base de données

# Plan

* Présentation du sujet
* Instructions
  * Outils
  * Datasets utilisés
  * Agrégats 
  * Création des agrégats
* Requêtes


# Présentation du sujet

Nous avons choisi d'étudier la qualité de l'air dans la région des Pays de la Loire.
L'idée à court terme était de pouvoir obtenir quelques informations concernant le niveau moyen de qualité de l'air, voir quelles villes sont plus ou moins bien placées etc.
Nos données sont réparties par région, code postal, qualité de l'air ainsi que d'autres facteurs de qualité, etc.
A terme l'idée est de faire nos aggrégats en regroupant des données différentes et ainsi augmenter la taille de nos données.

# Instructions

## 1. Outils

Le choix de notre base de donnée s'est orientée vers une base NoSQL.
 * Pourquoi le NoSQL ? <br/>
Le premier facteur qui nous a influencé est celui de l'ignorance, pour avoir déjà fait du Oracle l'année passée et avoir eu quelques informations sur le NoSQL en début d'année nous voulions savoir comment était le langage et quelles étaient ses possibilités.
 Deuxièmement, comme nous avons eu des explications sur les 4 différents types de base de données NoSQL (*Key-Value*, *Document*, *Colonnes*) il faut savoir quel type de données nous avons à traiter. 
 Dans le cadre de la qualité de l'air nous traitons du json, format totalement adapté à ce genre de base de données. Le document qualité de l'air est structuré de la manière suivante :

>   *{  <br/>
>    "VILLE": "ANGERS",  <br/>
>    "CODE_INSEE": 49007,  <br/>
>    "LONGITUDE": -0.556177,  <br/>
>    "LATITUDE": 47.472707, <br/>
>    "DATE": "01/01/2005", <br/>
>    "INDICE_QUALITE_AIR": 3, <br/>
>    "SOUS_INDICE_OZONE": 3, <br/>
>    "SOUS_INDICE_PARTICULES_FINES": 1, <br/>
>    "SOUS_INDICE_DIOXYDE_D'AZOTE": 1, <br/>
>    "SOUS_INDICE_DIOXYDE_DE_SOUFRE": 1, <br/>
>    "CODE_COULEUR": "VERT" <br/>
>    }* <br/>

 Pour chaque ville nous avons certaines informations quand à sa position et surtout, les informations quand à la pollution.
 Ainsi le choix d'une base de données NoSQL orientée document semble légitime.
 
 Cependant, nous verrons par la suite que ce n'est pas le seul document que nous traitons. Il sera donc nécessaire de travailler nos données pour refaire nos aggrégats.

   * MongoDB <br/>
   Nous nous sommes donc orientés vers une base de donnée mongoDB pour les raisons plus haut.
   Quelques notions d'utilisation de mongoDB :
   Installation par le biais de la documentation officielle : <a href="https://docs.mongodb.com/getting-started/shell/tutorial/install-mongodb-on-ubuntu/" > https://docs.mongodb.com/getting-started/shell/tutorial/install-mongodb-on-ubuntu/ </a>
   Pour l'import nous avons utilisé la commande suivante :
   >mongoimport --jsonArray --db projetBDE --collection qualite_air --file /CHEMIN/qualite_air_bon_format.json <br/>

   * Le format JSON <br/>
  Le format par mongoDB est en JSON ce qui justifie ce choix pour nos données qui sont aussi disponibles en CSV, etc.

## 2. Datasets utilisés

Les datasets que nous avons utilisés sont divers.
Avant toute chose, en l'état actuel des choses nous n'avons travaillé que sur un seul dataset, mais, tout l'intéret du NoSQL consiste à regrouper différents datasets afin de garder les informations pertinentes et de faire des requêtes volumineuses et intéressantes, assez rapidement sur un seul gros json qui contient **toutes** les informations.

## 3. Agrégats

Comme dit précedemment il est nécessaire que nos données soient corrélées, et qu'on puisse en obtenir quelque chose de censé.
Nous avons donc commencé par regrouper nos agrégats des différents fichiers, ainsi mettre les données de pollution dans la même collection que les données de trafic routier.
Nous avons aussi profité de cette étape pour augmenter la consistance de nos données et ainsi avoir une richesse des données importantes.
Au final nous avons regroupé 9 fichiers dans notre table.
Ensuite il est venu la question de donner du sens à nos données. Nos données ont en commun des dates et des données gps. <br/>
Le format de date nous pose un souci car dans certaines données nos dates sont au format JJ/MM/AAAA et dans d'autres au format MM/AAAA ou directement AAAA. Nous avons donc traité les données de sorte à ce que tout soit disponible à l'année. Nous avons donc séparé les champs.
Nous allons chercher à donner du sens à nos données, difficile de les interpréter, peut-être que le facteur de baisse de pollution n'est pas exclusivement lié au fait que les gens prennent plus le train, mais il peut y avoir une corrélation.
Les données gps cependant nous sont pratiques. L'idée est la suivante : <br/>
Toutes nos données ont des latitudes et des longitudes, qu'il s'agisse d'une borne routière, d'une station de gare ou bien même d'une ville.
Pour donner du sens à nos requêtes il faut regrouper toutes ces données et traiter un périmètre, ainsi on pourra dire "aux alentours de Nantes il y a eu plus de personnes qui ont pris le train en 2016 que en 2015 et on constate aussi que la pollution aux alentours de Nantes a diminué entre 2016 et 2015."
C'est cette transformation que nous allons expliquer :


## 5. Création des agrégats

L'un des objectifs que l'on s'est fixé avec les datasets que l'on a choisi est d'établir des corrélations entre des données.

Or les seuls attributs qui peuvent nous permettre de faire des requêtes par zones sont les coordonnées GPS ("LATITUDE" et "LONGITUDE"). Mais deux points, même très proches, possèdent des latitudes et longitudes différentes. Nous avons alors fait le choix de fixer des points de référence qu'on associerait à chaque objet possédant une latitude et une longitude. Nous avons choisi d'utiliser quelques grandes déjà présentent dans d'autres objets comme points de référence (communes\_min.json).

Il nous à donc fallu créé un script (script.cpp) qui ajoute à chaque objet un attribut COMMUNE\_REF correspondant à la commune la plus proche de la coordonnée GPS de l'objet observé. Par exemple l'objet contenant les donnée de passage d'une borne près de saint-Nazaire:

    {
        "Code par défaut": 132,
        "Nom normalisée de la route départementale": "44 D0723",
        "Numéro de la borne routière": 5,
        ...
        "LATITUDE": 47.2614042058,
        "LONGITUDE": -1.97972158605
    }

devient:

    {
      "Code par défaut": 132,
      "Nom normalisée de la route départementale": "44 D0723",
      "Numéro de la borne routière": 5,
      ...
      "LATITUDE": 47.2614042058,
      "LONGITUDE": -1.97972158605,
      "COMMUNE_REF" : "Saint-Nazaire"
    }

Le calcul de la commune la plus proche ("COMMUNE\_REF") se fait en fonction de la distance euclidienne entre la coordonnée GPS de l'objet et la coordonnée GPS de la commune de référence. Les objets ainsi formés nous permettent de faire des requête plus intéressantes.


## 4. Requêtes

Une fois que nos aggrégats sont fait et regroupés dans la même base et avec un point de référence proche.
Nos vous invitons à consulter toutes nos requêtes qui sont disponibles dans le fichier queries_FINAL.txt. 
Dans cette section nous allons revenir sur certaines d'entre elle afin de les expliquer.

### 4.1 Regrouper les villes et leur pollution moyenne

Cette requête est la Query 1 dans le fichier queries_FINAL.txt.

    db.test_format.aggregate([{$group:{_id:"$VILLE",indice_qualite_air:{$avg:"$INDICE_QUALITE_AIR"}}}]) <br/>

La première partie

    db.test_format.aggregate([{$group:{_id:"$VILLE", ........... }}}}]) <br/>


regroupe par VILLE, il se base sur la clé VILLE pour faire son group by. Dans mongoDB cela se traduit par le champ _id: c'est lui donner la clé.<br/>
La deuxième partie

    db.test_format.aggregate([{$group:{......, indice_qualite_air:{$avg:"$INDICE_QUALITE_AIR"}}}]) <br/>


Ici on fait la moyenne des indices de qualite de l'air. On pourrait rajouter d'autres champs (par exemple concernant le dioxyde d'azote ou encore le dioxyde de souffre)

résultat:
> { "_id" : "NANTES", "indice_qualite_air" : 3.8716401535929785 } <br/>
> { "_id" : "LAVAL", "indice_qualite_air" : 3.7373944786675795 } <br/>
> { "_id" : "ANGERS", "indice_qualite_air" : 3.9274469541409993 } <br/>
> { "_id" : "CHOLET", "indice_qualite_air" : 3.9016655258955053 } <br/>
> { "_id" : "LE MANS", "indice_qualite_air" : 3.841889117043121 } <br/>
> { "_id" : null, "indice_qualite_air" : null } <br/>
> { "_id" : "LA ROCHE-SUR-YON", "indice_qualite_air" : 3.891145595618439 } <br/>


### 4.2 Corrélation entre la pollution des villes et le nombre de montées et descente des trains.

Comme nous l'avons dit plus haut nous allons essayer de corréler nos données.
Pour ça nous avons fait quelques représentations visuelles des résultats de nos requêtes.

Voici la requête numéro 4 :

    db.test_final.aggregate([{$group:{_id:"$COMMUNE_REF", moy_montee_descente:{$avg:"$Mont_desc_gares"},  pollution_moyenne:{$avg:"$Ind_qual_air"}}}])

Elle regroupe par ville, la moyenne de montées et descente en gare avec la moyenne de la pollution.

![alt text](https://github.com/ClementJehanno/projet_bdde/blob/master/Graphes/graph_4.png "Graphe résultat requête 4")

Ce graphique nous montre qu'il est difficile de trouver une corrélation. En effet nos moyennes varient selon les villes mais globalement l'indice de pollution reste le même, il semble donc que les montées et descente de gares ne soient pas un facteur suffisant à lui seul pour exprimer une quelconque corrélation avec la pollution.

Nous allons essayer de trouver des données plus précises.

### 4.3 Corrélation entre la pollution des villes et le trafic routier

Cette requête est la requête numéro 6 :

On va utiliser nos données routières. 
Le seul souci avec ces données c'est que nous n'avons que les années 2009 et 2010. 
Ici nous allons prendre l'exemple de l'année 2009.

    db.test_final.aggregate([{$match:{Annee:{$eq:2009}}}, {$group:{_id:"$COMMUNE_REF",  pollution_moyenne:{$avg:"$Ind_qual_air"},  somme_voiture:{$sum:"$Moy_jour_ann_tous_vehi"}, somme_poids_lourd:{$sum:"$Moy_jour_ann_poidsL"}}}])

La requête "match" sur toutes les valeurs dont le champ année vaut 2009 puis nous groupons par commune et ajoutons les champs nécessaires à nos moyennes.

![alt text](https://github.com/ClementJehanno/projet_bdde/blob/master/Graphes/graph_6.png "Graphe résultat requête 6")


### 4.4 Répartition des surfaces des réserves naturelles

Cette requête est la requête numéro 8 :

Par année, par commune, la moyenne de la qualité de l'air ainsi que la moyenne des sous indices.

db.test_final.aggregate([{$group:{_id:"$COMMUNE_REF", nom:{$push:"$Nom_res_nat"}, somme_surface:{$sum:"$Surface_m2"}, indice_qualite_air:{$avg:"$Ind_qual_air"}}}, {$sort:{"somme_surface":-1}}])

Cette requête va regrouper en fonction des villes proches, les réserves naturelles qui y sont associées ainsi que leur surface.

Nous avons coupé la requête en deux graphiques.

Le premier exhibe pour les villes l'indice de qualité d'air moyen.

![alt text](https://github.com/ClementJehanno/projet_bdde/blob/master/Graphes/graph_8_2.png)

Le deuxième nous montre bien, par ville, l'espace de réserves naturelles qui sont à proximité

![alt text](https://github.com/ClementJehanno/projet_bdde/blob/master/Graphes/graph_8_1.png)


### 4.5 Evolution de la pollution au cours des années

Cette requête est la requête numéro 9 :

Elle regroupe par année et commune les indices de pollution par ville, elle nous permet de tracer des requêtes spécifiques sur chaque ville avec un détail à l'année contrairement aux précédentes qui étaient sur la totalité de la période.

    db.test_final.aggregate([{$group:{_id:{Annee:"$Annee", Region:"$COMMUNE_REF"}, moyenne_qualite_air:{$avg:"$Ind_qual_air"}, moyenne_sous_indice_ozone:{$avg:"$Sous_ind_ozone"}, moyenne_sous_indice_particules_fine:{$avg:"$Sous_ind_particules_fines"}, moyenne_sous_indice_azote:{$avg:"$Sous_ind_part_azote"}, moyenne_sous_indice_particules_souffre:{$avg:"$Sous_ind_part_souffre"}, somme_voiture:{$sum:"$Moy_jour_ann_tous_vehi"}, somme_poids_lourd:{$sum:"$Moy_jour_ann_poidsL"},somme_montee_descente:{$sum:"$Mont_desc_gares"} }}, {$sort:{"_id":-1}} ])

Elle regroupe donc par année et par ville proche les indices respectifs de pollution. 
Nous avons tracé deux graphiques : l'un pour Nantes et l'autre pour le Mans de l'indice global :

![alt text](https://github.com/ClementJehanno/projet_bdde/blob/master/Graphes/graphe_9_Mans.png)

![alt text](https://github.com/ClementJehanno/projet_bdde/blob/master/Graphes/graphe_9_Nantes.png)


### 4.6 Evolution de la pollution au cours des années

Cette requête est la requête numéro 10 :

Elle nous permet de compter l'évolution du nombre de stations par année.
Pour cette requête nous avons utilisés un map reduce, en effet il nous était impossible de grouper par année et de faire un count en même temps, nous avons eu le même souci sur la requête 7 (cf le fichier queries_FINAL.txt) que nous avons du séparer en quatre.
Nous avons compris trop tard l'intérêt du map réduce mais qui ici est primordial car il nous permet à la fois de grouper par année en mettant l'année comme clé, et de faire la réducttion sur les stations tout en les comptant.


    db.final.group({
    "key": {
       "Annee": true
     },
     "initial": {
       "countNom_station_mesure": 0
     },
     "reduce": function(obj, prev) {
        if (obj.Nom_station_mesure != null) if (obj.Nom_station_mesure instanceof Array) prev.countNom_station_mesure += obj.Nom_station_mesure.length;
        else prev.countNom_station_mesure++;
       }
     })


![alt text](https://github.com/ClementJehanno/projet_bdde/blob/master/Graphes/graphe_10.png)
