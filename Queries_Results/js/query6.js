//Requête 6 : pour l'année 2009, la somme des moyennes des véhicules et des poids lourds qui ont circulé.
printjson(db.final.aggregate([
				{$match:{
					Annee:{$eq:2009}}
				}, 
				{$group:{
					_id:"$COMMUNE_REF", 
					somme_voiture:{$sum:"$Moy_jour_ann_tous_vehi"}, 
					somme_poids_lourd:{$sum:"$Moy_jour_ann_poidsL"},
					moy_qual:{$avg:"$Ind_qual_air"}
					}
				}
			])
	)