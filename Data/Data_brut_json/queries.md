queries : 

Freq_lignes_autocars.json : 

Récupérer les moyennes par années et communes des fréquentations des lignes

EN MONGODB :

db.freq_autocar.group({
    "key": {
        "aut_Nom_ligne": true,
        "aut_Annee": true
    },
    "initial": {
        "sumforaverageaverageaut_Nb_voyages_ligne_reg": 0,
        "countforaverageaverageaut_Nb_voyages_ligne_reg": 0
    },
    "reduce": function(obj, prev) {
        prev.sumforaverageaverageaut_Nb_voyages_ligne_reg += obj.aut_Nb_voyages_ligne_reg;
        prev.countforaverageaverageaut_Nb_voyages_ligne_reg++;
    },
    "finalize": function(prev) {
        prev.averageaut_Nb_voyages_ligne_reg = prev.sumforaverageaverageaut_Nb_voyages_ligne_reg / prev.countforaverageaverageaut_Nb_voyages_ligne_reg;
        delete prev.sumforaverageaverageaut_Nb_voyages_ligne_reg;
        delete prev.countforaverageaverageaut_Nb_voyages_ligne_reg;
    }
});

EN SQL : 

SELECT aut_Nom_ligne, aut_Annee, AVG(aut_Nb_voyages_ligne_reg)
FROM freq_autocar
GROUP BY aut_Nom_ligne, aut_Annee

qualite_air.json : 

Récuperer les moyennes sous indice, etc et code couleur par années et villes de la qualité de l'air

EN MONGODB :

EN SQL :

SELECT qu_Ville,qu_Annee, qu_CodeInsee, qu_Longitude, qu_Latitude, AVG(qu_Ind_qual_air), AVG(qu_Sous_ind_ozone), AVG(qu_Sous_ind_particules_fines), AVG(qu_Sous_ind_part_azote), AVG(qu_Sous_ind_part_souffre)
FROM qual_air
GROUP BY qu_Ville,qu_Annee, qu_CodeInsee, qu_Longitude, qu_Latitude
