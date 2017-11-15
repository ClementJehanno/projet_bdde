# Projet base de données évoluées
Ceci est le dépot github associé à notre projet de base de données.

Jehanno Clément<br/>
Caillaud Pierre<br/>
Duclos Romain<br/>

M1-ALMA 2017-2018<br/>

# Plan

* [Présentation du sujet](#pres)
* [Instructions](#instrus)
  * [Outils](#outils)
  * [Datasets utilisés](#datasets)
  * [Agrégats](#agregats)
  * [Création des agrégats](#crea_agregats)
* [Requêtes](#requetes)
* [Conclusion](#ccl)

# <a name="pres"></a>Présentation du sujet

Nous avons choisi d'étudier la qualité de l'air dans la région des Pays de la Loire.
L'idée à court terme était de pouvoir obtenir quelques informations concernant le niveau moyen de qualité de l'air sur les régions/villes des Pays de la Loire.
Nos données sont réparties par région, code postal, qualité de l'air ainsi que d'autres facteurs de qualité, etc.
Nous avons augmenté nos données avec des datasets sur la fréquentation des routes, des gares, les réserves naturelles, etc.
Notre idée pour la suite était d'essayer de faire des liens entre la qualité de l'air et d'autres données.

# <a name="instrus"></a>Instructions

## 1. <a name="outils"></a>Outils

Le choix de notre base de donnée s'est orientée vers une base en NoSQL.
 * Pourquoi le NoSQL ? <br/>
Le premier facteur qui nous a influencé est celui de la découverte. Nous avions déjà fait du Oracle l'année passée et après avoir eu quelques informations sur le NoSQL en début d'année nous voulions savoir comment était le langage et quelles étaient ses possibilités.
Il y a 4 différents types de base de données NoSQL (*Key-Value*, *Document*, *Colonnes*), il faut savoir quel type de données nous avons à traiter.
 Dans le cadre de la qualité de l'air nous traitons du json, format totalement adapté au base de données NoSQL Le document qualité de l'air est structuré de la manière suivante :

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
   Nous nous sommes orientés vers l'outil mongoDB. C'est un outil qui dispose d'une bonne communauté et d'une documentation exhaustive. C'est un outil puissant et plutôt répendu qui est fait pour le NoSQL.
   Quelques notions d'utilisation de mongoDB :
   Installation par le biais de la [documentation officielle](https://docs.mongodb.com/getting-started/shell/tutorial/install-mongodb-on-ubuntu/)
   Pour l'import nous avons utilisé la commande suivante :
   >mongoimport --jsonArray --db projetBDE --collection qualite_air --file /CHEMIN/qualite_air_bon_format.json <br/>

   * Le format JSON <br/>
  Le format par défaut de mongoDB est le JSON ce qui justifie un peu plus le choix de cet outil.

## 2. <a name="datasets"></a>Datasets utilisés

Les datasets que nous avons utilisés sont divers.
En l'état actuel des choses nous n'avons pas travaillé que sur un seul dataset. Mais, tout l'intéret du NoSQL consiste à regrouper différents datasets afin de garder les informations pertinentes et de faire des requêtes volumineuses et intéressantes.

MongoDB permet d'utiliser plusieurs "collections", mais nous voulions lier nos données pour pouvoir tirer des résultats intéressants.

## 3. <a name="agregats"></a>Agrégats

Comme dit précedemment il etait nécessaire que nos données soient corrélées.
La première étape avant de regrouper les dataset était de normaliser certains de nos attributs. Nous avons normalisé les dates et les locations GPS pour pouvoir lier plus facilement nos données par la suite.
Pour faire cela nous avons tout simplement utilisé des expressions régulières directement les dataset concernés. Ce n'est pas la méthode la plus optimale car si nous avions un volume de données très important, de simples éditeurs de texte n'auraient pas supporté les modifications. A ce sujet nous avons essayé Talend mais cela nous a pris beaucoup de temps pour peu de résultat. Nos données n'étant pas trop volumineuses, nous sommes restés sur l'option la plus simple, les expressions régulières.

Par exemple :

Certaines données de location GPS étaient de la forme "l" : "[47.6664, -0.111147]". Nous les voulions ainsi : "LATITUDE" : 47.6664, "LONGITUDE" : -0.111147. Avec une regex comme celle-ci : "[[0-9]*.[0-9]*, -?[0-9]*.[0-9]*]", nous avons pu récupérer toutes les valeurs de longitude et latitude. Puis nous les avons mises dans un autre fichier, là nous avons séparé les données avec un Chercher/Remplacer et enfin nous les avons remises dans le dataset originel.

Nous avons fait les mêmes manipulations avec les dates, etc.

Ensuite il a fallu mettre l'ensemble des données dans un même dataset. Notre première idée était de regrouper des données ensemble, puis de les mettre dans des sous documents, pour avoir une structure facilement lisible pour des personnes.

Exemple :

    [

      "ville1":
        { "nom":"",
          "annee":"",
          "pollution":{...},
          "traffic_routier":{...},
          ...
        },
      "ville2": {...},

    ...
    ]

Bien que cela aurait été plus "lisible" en terme d'attribut et de regroupement de données, ca ne nous arrangeait pas vraiment plus pour les requêtes car il aurait fallu descendre à chaque fois dans des sous-documents, etc.

Nous avons décidé de faire plus simple. Chaque dataset a été copié de manière brute dans le JSON final. Ainsi, chaque attribut est disponible en accès direct (sans descendre dans un sous-documents). Cette facon de faire brut n'est cependant pas la meilleure façon de faire. Si nous avions énormément de données, copier des données de cette façon aurait été très compliqué. Toutefois, nous avions commencé à développer une idée pour lier nos documents/données entre-elles, nous avons donc gardé le dataset final fait ainsi.

Exemple :

    [
    	{}, |
    	{}, | données pollutions
    	... |

    	{}, |
    	{}, | données réserves naturelles
    	... |

    	{}, |
    	{}, | données traffic
    	... |
    ]

Dans la partie suivante, nous allons expliquer de quelle façon nous avons lié nos données dans le dataset final.

## 4. <a name="crea_agregats"></a>Création des agrégats

L'un des objectifs que l'on s'est fixé avec les datasets que l'on a choisi est d'établir des corrélations entre des données.

Or les seuls attributs qui peuvent nous permettre de faire des requêtes par zones sont les coordonnées GPS ("LATITUDE" et "LONGITUDE"). Mais deux points, même très proches, possèdent des latitudes et longitudes différentes. Nous avons alors fait le choix de fixer des points de référence qu'on associerait à chaque objet possédant une latitude et une longitude. Nous avons choisi d'utiliser quelques grandes déjà présentent dans d'autres objets comme points de référence ([communes\_min.json](https://github.com/ClementJehanno/projet_bdde/blob/master/communes_min.json)).

Il a donc fallu créer un script ([script\_commune.cpp](https://github.com/ClementJehanno/projet_bdde/blob/master/script_commune.cpp)) qui ajoute à chaque objet un attribut COMMUNE\_REF correspondant à la commune la plus proche de la coordonnée GPS de l'objet observé. Par exemple l'objet contenant les données de passage d'une borne près de saint-Nazaire:

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

Ce nouvel attribut nous permet de lier toutes nos données. Nous avons créé un index dessus pour gagner en performances étant donné que cet attribut "liant" est présent dans presque toutes nos requêtes.
Création de l'index :

     db.test_final.createIndex( {COMMUNE_REF:1} )


# <a name="requetes"></a>Requêtes

Une fois que nos aggrégats sont fait et regroupés dans la même base et avec un point de référence proche nous pouvons commencer à faire des requêtes dessus.
Nous vous invitons à consulter toutes nos requêtes qui sont disponibles dans le fichier [queries_rendu.txt](https://github.com/ClementJehanno/projet_bdde/blob/master/queries_rendu.txt) ou bien dans le dossier [/Queries_Results/js](https://github.com/ClementJehanno/projet_bdde/tree/master/Queries_Results/js)
Dans cette section nous allons revenir sur certaines d'entre elle afin de les expliquer.

## 1. Regrouper les villes et leur pollution moyenne

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


## 2. Corrélation entre la pollution des villes et le nombre de montées et descente des trains.

Comme nous l'avons dit plus haut nous allons essayer de corréler nos données.
Pour ça nous avons fait quelques représentations visuelles des résultats de nos requêtes.

Voici la requête numéro 4 :

    db.test_final.aggregate([{$group:{_id:"$COMMUNE_REF", moy_montee_descente:{$avg:"$Mont_desc_gares"},  pollution_moyenne:{$avg:"$Ind_qual_air"}}}])

Elle regroupe par ville, la moyenne de montées et descente en gare avec la moyenne de la pollution.

![Graphe résultat requête 4](https://github.com/ClementJehanno/projet_bdde/blob/master/Graphiques/graph_4.png "Graphe résultat requête 4")

Ce graphique nous montre qu'il est difficile de trouver une corrélation. En effet nos moyennes varient selon les villes mais globalement l'indice de pollution reste le même, il semble donc que les montées et descente de gares ne soient pas un facteur suffisant à lui seul pour exprimer une quelconque corrélation avec la pollution.

Nous allons essayer de trouver des données plus précises.

## 3. Corrélation entre la pollution des villes et le trafic routier

Cette requête est la requête numéro 6 :

On va utiliser nos données routières.
Le seul souci avec ces données c'est que nous n'avons que les années 2009 et 2010.
Ici nous allons prendre l'exemple de l'année 2009.

    db.test_final.aggregate([{$match:{Annee:{$eq:2009}}}, {$group:{_id:"$COMMUNE_REF",  pollution_moyenne:{$avg:"$Ind_qual_air"},  somme_voiture:{$sum:"$Moy_jour_ann_tous_vehi"}, somme_poids_lourd:{$sum:"$Moy_jour_ann_poidsL"}}}])

La requête "match" sur toutes les valeurs dont le champ année vaut 2009 puis nous groupons par commune et ajoutons les champs nécessaires à nos moyennes.

![Graphique résultat requête 6](https://github.com/ClementJehanno/projet_bdde/blob/master/Graphiques/graph_6.png "Graphe résultat requête 6")


## 4. Répartition des surfaces des réserves naturelles

Cette requête est la requête numéro 8 :

Par année, par commune, la moyenne de la qualité de l'air ainsi que la moyenne des sous indices.

    db.test_final.aggregate([{$group:{_id:"$COMMUNE_REF", nom:{$push:"$Nom_res_nat"}, somme_surface:{$sum:"$Surface_m2"}, indice_qualite_air:{$avg:"$Ind_qual_air"}}}, {$sort:{"somme_surface":-1}}])

Cette requête va regrouper en fonction des villes proches, les réserves naturelles qui y sont associées ainsi que leur surface.

Nous avons coupé la requête en deux graphiques.

Le premier exhibe pour les villes l'indice de qualité d'air moyen.

![Graphique résultat requête 8 partie 2](https://github.com/ClementJehanno/projet_bdde/blob/master/Graphiques/graph_8_2.png)

Le deuxième nous montre bien, par ville, l'espace de réserves naturelles qui sont à proximité

![Graphique résultat requête 8 partie 1](https://github.com/ClementJehanno/projet_bdde/blob/master/Graphiques/graph_8_1.png)


## 5. Evolution de la pollution au cours des années

Cette requête est la requête numéro 9 :

Elle regroupe par année et commune les indices de pollution par ville, elle nous permet de tracer des requêtes spécifiques sur chaque ville avec un détail à l'année contrairement aux précédentes qui étaient sur la totalité de la période.

    db.test_final.aggregate([{$group:{_id:{Annee:"$Annee", Region:"$COMMUNE_REF"}, moyenne_qualite_air:{$avg:"$Ind_qual_air"}, moyenne_sous_indice_ozone:{$avg:"$Sous_ind_ozone"}, moyenne_sous_indice_particules_fine:{$avg:"$Sous_ind_particules_fines"}, moyenne_sous_indice_azote:{$avg:"$Sous_ind_part_azote"}, moyenne_sous_indice_particules_souffre:{$avg:"$Sous_ind_part_souffre"}, somme_voiture:{$sum:"$Moy_jour_ann_tous_vehi"}, somme_poids_lourd:{$sum:"$Moy_jour_ann_poidsL"},somme_montee_descente:{$sum:"$Mont_desc_gares"} }}, {$sort:{"_id":-1}} ])

Elle regroupe donc par année et par ville proche les indices respectifs de pollution.
Nous avons tracé deux graphiques : l'un pour Nantes et l'autre pour le Mans de l'indice global :

![Graphique résultat requête 9 le Mans](https://github.com/ClementJehanno/projet_bdde/blob/master/Graphiques/graphe_9_Mans.png)

![Graphique résultat requête Nantes](https://github.com/ClementJehanno/projet_bdde/blob/master/Graphiques/graphe_9_Nantes.png)


## 6. Evolution de la pollution au cours des années

Cette requête est la requête numéro 10 :

Elle nous permet de compter l'évolution du nombre de stations par année.
Pour cette requête nous avons utilisés un map reduce, en effet il nous était impossible de grouper par année et de faire un count en même temps, nous avons eu le même souci sur la requête 7 (cf le fichier queries_FINAL.txt) que nous avons du séparer en quatre. <br/>
Nous avons compris trop tard l'intérêt du map reduce. Dans cette requête il est pourtant nécessaire d'en faire un. En effet, il nous permet à la fois de grouper par année en mettant l'année comme clé et de faire la réduction sur les stations tout en les comptant.


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


![Graphique résultat requête 10](https://github.com/ClementJehanno/projet_bdde/blob/master/Graphiques/graphe_10.png)

# <a name="ccl"></a>Conclusion

Nous sommes parvenus à regrouper un grand nombre de données sur des domaines variés tels que la qualité de l'air, la présence de réserves naturelles et les statistiques sur les transports dans la région des Pays de la Loire. On constate cependant que peu d'attributs permettent de lier les données brutes entre elles. Nous sommes tout de même parvenus à arranger les données de façon à pouvoir les interpréter un peu plus finement. Les données ainsi récupérées ne nous permettent pas d'établir de corrélations directes mais certaines, après analyse, nous révèlent quelques faits cohérents.

Pour observer de réelles  corrélations il aurait fallu que nos datasets aient un niveau de granularité plus élevé et qu'ils nous renseignent sur la même période temporelle et suffisamment étendue. Des données supplémentaires telles que des données sur les activités industrielles par zone, par exemple, nous auraient sans doute aussi permis d'affiner nos observations.

Globalement, même si les données ne sont, ni suffisamment précises, ni en quantité suffisante pour tirer de réelles conclusions, elles nous permettent de faire des observations intéressantes telles que celles illustrées sur les graphiques plus haut et qui sont tirées des résultats de quelques unes de nos requêtes.
