# Projet base de données 
Ceci est le github associé à notre projet de base de données 

# Plan

* Présentation du sujet
* Instructions
  * Outils
  * Datasets utilisés


# Présentation du sujet 

Nous avons choisi d'étudier la qualité de l'air dans la région des Pays de la Loire.
L'idée à court terme était de pouvoir obtenir quelques informations concernant le niveau moyen de qualité de l'air, voir quelles villes sont plus ou moins bien placées etc.
Nos données sont réparties par région, code postal, qualité de l'air ainsi que d'autres facteurs de qualité, etc.
A terme l'idée est de faire nos aggrégats avec différentes données en les passants dans Talend et ainsi en augmentant la taille de nos données en recoupants plusieurs données différentes.
Il faudra donc refaire nos aggrégats proprement.

# Instructions 

1. Outils

Le choix de notre base de donnée s'est orientée vers une base NoSQL.
 * Pourquoi le NoSQL ? <br/>
Le premier facteur qui nous a influencé est celui de l'ignorance, pour avoir déjà fait du Oracle l'année passée et avoir eu quelques informations sur le NoSQL en début d'année nous voulions savoir pourquoi.
 Deuxièmement, il faut savoir que nous avons eu quelques explications sur les 4 différents types de base de données NoSQL (*Key-Value*, *Document*, *Colonnes*)
 Partant de ce principe, il faut savoir quel type de données nous avons à traiter. Dans le cadre de la qualité de l'air nous traitons du json, format totalement adapté à ce genre de base de données. Notre document est structuré de la manière suivante : 
  
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
  Nous avons donc décidé de partir sur une base en mongodb.
  
  
2. Datasets utilisés

Les datasets que nous avons utilisés sont divers.
Avant toute chose, en l'état actuel des choses nous n'avons travaillé que sur un seul dataset, mais, tout l'intéret du NoSQL consiste à regrouper différents datasets afin de garder les informations pertinentes et de faire des requêtes volumineuses et intéressantes, assez rapidement.
