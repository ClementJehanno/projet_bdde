//Requête 10 : par région, le nombre de stations de mesure.
printjson(db.final.group({
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
}))