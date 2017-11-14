//Requête 2 : compter le nombre de villes dont le code couleur est "Vert" (ce qui correspond à un niveau de pollution bas)
printjson(db.final.aggregate([
			{$match:{"Code_coul":{$eq:"VERT"}}},
			{$count :"nb_codes_vert"}
		  ])
	)

//Celles dont le code couleur est "Orange"
printjson(db.final.aggregate([
			{$match:{"Code_coul":{$eq:"ORANGE"}}},
			{$count :"nb_codes_orange"}
		  ])
	)

//Celles dont le code couleur est "Rouge"
printjson(db.final.aggregate([
			{$match:{"Code_coul":{$eq:"ROUGE"}}},
			{$count :"nb_codes_rouge"}
		  ])
	)