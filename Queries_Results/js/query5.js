//Requête 5 : par année, l'évolution des montées/descentes en gares et du trafic routier.
printjson(db.final.aggregate([
				{$group:{
					_id:"$Annee", 
					somme_montee_descentes:{$sum:"$Mont_desc_gares"}, 
					somme_trafic_routier:{$sum:"$Moy_jour_ann_tous_vehi"}}
				}, 
				{$sort:{"_id":1}}

			])
	)