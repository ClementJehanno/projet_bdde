//Requête 4 : par commune de référence,la moyenne sur les années des montées et descentes en gares ainsi que l'indice de qualité d'air moyen.
printjson(db.final.aggregate([
			{$group:{
					  _id:"$COMMUNE_REF", 
	     			  moy_montee_descente:{$avg:"$Mont_desc_gares"},  
	     	          pollution_moyenne:{$avg:"$Ind_qual_air"}
	     	        }
	    	}
	      ])
	)