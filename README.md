# Projet base de données 
Projet M1 base de données évoluées

# Plan

* Présentation du sujet
* Instructions
  * Outils
  * Datasets utilisés


# Présentation du sujet 

Nous avons choisi d'étudier la qualité de l'air dans la région des Pays de la Loire.
L'idée à court terme était de pouvoir obtenir quelques informations concernant le niveau moyen de qualité de l'air, voir quelles villes sont plus ou moins bien placées etc.
Nos données sont réparties par région, code postal, qualité de l'air ainsi que d'autres facteurs de qualité (**A compléter**)

# Instructions 

1. Outils

Le choix de notre base de donnée s'est orientée vers une base NoSQL.
 * Pourquoi le NoSQL ?
Le premier facteur qui nous a influencé est celui de l'ignorance, pour avoir déjà fait du Oracle l'année passée et avoir eu quelques informations sur le NoSQL en début d'année nous voulions savoir pourquoi.
 Deuxièmement, il faut savoir que nous avons eu quelques explications sur les 4 différents types de base de données NoSQL (*Key-Value*, *Document*, *Colonnes*, *Graphes* **A verifier suivant le diapo de la prof**)
 Partant de ce principe, il faut savoir quel type de données nous avons à traiter. Dans le cadre de la qualité de l'air nous traitons du json, format totalement adapté à ce genre de base de données. Notre document est structuré de la manière suivante : 
  
>   *{
>    "VILLE": "ANGERS",
>    "CODE_INSEE": 49007,
>    "LONGITUDE": -0.556177,
>    "LATITUDE": 47.472707,
>    "DATE": "01/01/2005",
>    "INDICE_QUALITE_AIR": 3,
>    "SOUS_INDICE_OZONE": 3,
>    "SOUS_INDICE_PARTICULES_FINES": 1,
>    "SOUS_INDICE_DIOXYDE_D'AZOTE": 1,
>    "SOUS_INDICE_DIOXYDE_DE_SOUFRE": 1,
>    "CODE_COULEUR": "VERT"
>    }*
  
 Pour chaque ville nous avons certaines informations quand à sa position et surtout, les informations quand à la pollution.
 Ainsi le choix d'une base de données NoSQL orientée document semble légitime.
  Nous avons donc décidé de partir sur une base en mongodb.
  
  
2. Datasets utilisés

Les datasets que nous avons utilisés sont divers.
Avant toute chose, en l'état actuel des choses nous n'avons travaillé que sur un seul dataset, mais, tout l'intéret du NoSQL consiste à regrouper différents datasets afin de garder les informations pertinentes et de faire des requêtes volumineuses et intéressantes, assez rapidement.
