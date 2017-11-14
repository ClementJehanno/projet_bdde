//Requête 8 : par commune de référence, les résèrves naturelles et quelles communes ont l'indice de pollution le plus bas
printjson(db.final.aggregate([
					{$group:{
						_id:"$COMMUNE_REF", 
						nom:{$push:"$Nom_res_nat"}, 
						somme_surface:{$sum:"$Surface_m2"}, 
						indice_qualite_air:{$avg:"$Ind_qual_air"}
							}
					}, 
					{$sort:{"somme_surface":-1}}
				])
	)