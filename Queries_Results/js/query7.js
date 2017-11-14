//Requête 7 : par commune de référence ayant des routes recensées, le min et le max de l'indice de qualité de l'air ainsi que le nombre de routes recensées.
//Les communes de rérérence qui ont des routes.
printjson(db.final.aggregate([
				{$match:{
						Nom_route:{$ne:null}
						}
				},
				{$group:{
						_id:"$COMMUNE_REF"
						}
				}
			])
	)
//Par commune de référence, les indices de qualité de l'air.
printjson(db.final.aggregate([
					{$group:{
							_id:"$COMMUNE_REF", 
							min:{$min:"$Ind_qual_air"}, 
							max:{$max:"$Ind_qual_air"} 
							}
					}
				])
	)
//Le nombre total de route recensées.
printjson(db.final.aggregate([
				{$match:{
						Nom_route:{$ne:null}
						}
				},
				{$group:{_id:"$Nom_route"}
				}, 
				{$count:"Nb_route_total"}
			])
	)

//Pour chacune des communes, le nombre de routes associées.
printjson(db.final.aggregate([
				{$match:{ $and: [ {Nom_route:{$ne:null}}, {COMMUNE_REF:{$eq:"Nantes"}} ] } },
				{$group:{_id:"$Nom_route"}}, 
				{$count:"Nb_route_Nantes"}
			])
	)

printjson(db.final.aggregate([
				{$match:{ $and: [ {Nom_route:{$ne:null}}, {COMMUNE_REF:{$eq:"Roche-sur-Yon"}} ] } },
				{$group:{_id:"$Nom_route"}}, 
				{$count:"Nb_route_RochesurYon"}
			])
	)

printjson(db.final.aggregate([
				{$match:{ $and: [ {Nom_route:{$ne:null}}, {COMMUNE_REF:{$eq:"Cholet"}} ] } },
				{$group:{_id:"$Nom_route"}}, 
				{$count:"Nb_route_Cholet"}
			])
	)

printjson(db.final.aggregate([
				{$match:{ $and: [ {Nom_route:{$ne:null}}, {COMMUNE_REF:{$eq:"Saint-Nazaire"}} ] } },
				{$group:{_id:"$Nom_route"}}, 
				{$count:"Nb_route_SaintNazaire"}
			])
	)

