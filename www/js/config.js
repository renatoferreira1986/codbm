angular.module('starter.config', [])
.constant('DB_CONFIG', {
    name: 'cod_bm',
    tables: [
		{
         name: 'type',
            columns: [
                {name: 'id', type: 'integer primary key'},
                {name: 'name', type: 'text'},
                {name: 'code', type: 'text'}
            ]
      },
		{
            name: 'local',
            columns: [
                {name: 'id', type: 'integer primary key'},
                {name: 'name', type: 'text'},
                {name: 'type_id', type: 'integer'},
                {name: 'code', type: 'text'}
            ]
      },
		{
      name: '_group',
      columns: [
                {name: 'id', type: 'integer primary key'},
                {name: 'name', type: 'text'},
                {name: 'code', type: 'text'}
            ]
      },        
		{
            name: 'subgroup',
            columns: [
                {name: 'id', type: 'integer primary key'},
                {name: 'name', type: 'text'},
                {name: 'group_id', type: 'integer'},
                {name: 'code', type: 'text'}
            ]
        },        
		{
			name: 'natureza',
			columns: [
				{name: 'id', type: 'integer primary key'},
				{name: 'name', type: 'text'},
				{name: 'subgroup_id', type: 'integer'},
				{name: 'code', type: 'text'}
			]		
		}		
    ],
   inserts: [
		{value: "INSERT INTO type(id, name, code) VALUES(1453722786317,'LOGRADOURO PÚBLICO','1');"},
         {value: "INSERT INTO type(id, name, code) VALUES(1453722809795,'MEIO AQUÁTICO','2');"},
         {value: "INSERT INTO type(id, name, code) VALUES(1453722821518,'VEGETAÇÃO','3');"},
         {value: "INSERT INTO type(id, name, code) VALUES(1453722833917,'EDIFICAÇÃO','4');"},
         {value: "INSERT INTO type(id, name, code) VALUES(1453723022203,'MEIOS DE TRANSPORTE','5');"},
         
         {value: "INSERT INTO local(id, name, type_id, code) VALUES(,'','','');"},
         
         {value: "INSERT INTO _group(id, name, code) VALUES(,'','');"},
         
         {value: "INSERT INTO subgroup(id, name, group_id, code) VALUES(,'','','');"},
         
         {value: "INSERT INTO natureza(id, name, subgroup_id, code) VALUES(,'','','');"}
         
   ]      
});