//Requête 1 : regrouper les communes de référence et leur pollution moyenne sur toutes les années.
printjson( db.final.aggregate([
			{$group:{_id:"$COMMUNE_REF",
					 indice_qualite_air:{$avg:"$Ind_qual_air"}}
			}])
		)