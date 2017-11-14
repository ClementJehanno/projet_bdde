//Requête 3 : surface totale de réserve naturelle par commune de référence.
printjson(db.final.aggregate([
			{$group:{
				_id:"$COMMUNE_REF", 
				somme_surface:{$sum:"$Surface_m2"}
				}
			}

		  ])
	)