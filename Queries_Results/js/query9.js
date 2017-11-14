//Requête 9 : Par année, par région, la moyenne de qualité de l'air, ainsi que la moyenne des sous-indices de l'air et du traffic.
printjson(db.final.aggregate([
				{$group:{
					_id:{
						Annee:"$Annee", 
						Region:"$COMMUNE_REF"
						}, 
					moyenne_qualite_air:{$avg:"$Ind_qual_air"}, 
					moyenne_sous_indice_ozone:{$avg:"$Sous_ind_ozone"}, 
					moyenne_sous_indice_particules_fine:{$avg:"$Sous_ind_particules_fines"}, 
					moyenne_sous_indice_azote:{$avg:"$Sous_ind_part_azote"}, 
					moyenne_sous_indice_particules_souffre:{$avg:"$Sous_ind_part_souffre"}, 
					somme_voiture:{$sum:"$Moy_jour_ann_tous_vehi"}, 
					somme_poids_lourd:{$sum:"$Moy_jour_ann_poidsL"},
					somme_montee_descente:{$sum:"$Mont_desc_gares"} 
					}
				}, 
				{$sort:{"_id":-1}} 
			])

	)