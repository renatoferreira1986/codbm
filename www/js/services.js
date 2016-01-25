angular.module('starter.services', ['starter.config'])

	.factory('APP', function($q, $ionicPopup, $filter){
		var self = this;
		self.name= "CODBM";
		
		
		self.calculatePace= function(speed, returnMili) {
			
		};

      self.showAlert = function(message) {
			 var alertPopup = $ionicPopup.alert({
			   title: self.name,
			   template: message
			 });
			 alertPopup.then(function(res) {
			   //console.log('Thank you for not eating my delicious ice cream cone');
			 });
	   };
				
		return self;
	})

	
	.factory('DB', function($q, DB_CONFIG, APP, TmpService) {
		var self = this;
		self.db = null;
		self.production = false;
		
		self.init = function() {
			// Use 
         if( self.production)
				self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name}); //in production
			else
				self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1);
	 
			angular.forEach(DB_CONFIG.tables, function(table) {
				var columns = [];
	 
				angular.forEach(table.columns, function(column) {
					columns.push(column.name + ' ' + column.type);
				});
	 
				var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
				self.query(query);
				//console.log('Table ' + table.name + ' initialized');
			});
			
         self.populate();
         
         //TMP
         TmpService.generateHash(5);
		};
	 
      self.populate = function(){
         var query = "SELECT COUNT(*) AS quant FROM type ";
         
         self.query(query).then(function(result){
            var quant = self.fetch(result).quant;
            if( quant < 1){
               angular.forEach(DB_CONFIG.inserts, function(item) {
                    // self.query(item.value);
                     //console.log("TESTE - "+JSON.stringify(item));
                     //console.log(item.value);
                  });            
            }
         });
      };
      
		self.query = function(query, bindings) {
			bindings = typeof bindings !== 'undefined' ? bindings : [];
			var deferred = $q.defer();
	 
			self.db.transaction(function(transaction) {
				transaction.executeSql(query, bindings, function(transaction, result) {
					deferred.resolve(result);
				}, function(transaction, error) {
					APP.showAlert(error.message+" "+query);
					deferred.reject(error);
				});
			});
	 
			return deferred.promise;
		};

	 
		self.fetchAll = function(result) {
			var output = [];
	 
			for (var i = 0; i < result.rows.length; i++) {
				output.push(result.rows.item(i));
			}
			
			return output;
		};
	 
		self.fetch = function(result) {
			return result.rows.item(0);
		};
	 
		self.getNumberRows= function(result){
			return result.rows.length;
		}
		
		return self;
	})


	.factory('LocalService', function($http, DB, APP){
		var self = this;
		

		
		self.all = function() {
			var sql = "SELECT id, name, strftime('%d/%m/%Y',datetime(ex_date_time/1000, 'unixepoch')) AS ex_date_time, "+
					  "strftime('%H:%M:%S',datetime(duration/1000,'unixepoch')) AS duration, "+
					  "strftime('%M:%S', datetime(pace/1000,'unixepoch')) AS pace, "+
					  "elevation_gain, round(distance, 2) AS distance, round(speed * 3.6, 2) AS speed, "+
					  "calories, round(score) AS score, cadence, ex_date_time AS ordered "+
			          "FROM exercises "+
					  "WHERE person_id = ? "+
					  "ORDER BY ordered DESC";	
			return DB.query(sql,[APP.user_id])
			.then(function(result){
				return DB.fetchAll(result);
			});
		};
		
		self.getById = function(id, all_fields) {
			bindings = typeof bindings !== 'undefined' ? bindings : [];
			all_fields = typeof all_fields !== 'undefined' ? all_fields : false;
			
			//console.log("id: "+id+"  --- user_id: "+APP.user_id);
			
			var sql = "";
			if( all_fields)
				sql = "SELECT * ";
			else 
				sql = "SELECT id, name, strftime('%d/%m/%Y',datetime(ex_date_time/1000, 'unixepoch')) AS ex_date_time, "+
					  "strftime('%H:%M:%S', datetime(ex_date_time/1000, 'unixepoch')) AS init_time, strftime('%H:%M:%S', datetime(duration/1000,'unixepoch')) AS duration, "+
					  "strftime('%M:%S', datetime(pace/1000,'unixepoch')) AS pace, "+
					  "elevation_gain, round(distance, 2) AS distance, round(speed * 3.6, 2) AS speed, "+
					  "calories, round(score) AS score, cadence, img_route, avg_hr, max_hr ";
					  
			sql+= "FROM exercises "+
				  "WHERE id = ? AND person_id = ?";
			return DB.query(sql, [id, APP.user_id])
			.then(function(result){
				return DB.fetch(result);
			});
		};

		
		self.render = function() {			
			//$("#spinner").show();
			var config = JSON.parse(localStorage.getItem("config"));
			if( config !== null){
				//console.log(JSON.stringify(config));
				
				//is_indoor = config.isIndoor;
			}
		};
		
		
		onError = function(error) {
			if( error.code == 1)
				APP.showAlert('permission_denied');
			else if( error.code == 2)
				APP.showAlert('network_error');
			else
				APP.showAlert('code: ' + error.code + '\n' + 'message: '+ error.message + '\n');
		};
		
		return self;
	})
   
   .factory('TmpService', function(){
      var self = this;
      
      self.generateHash = function(quant){
         var hash;
         var i;
         for( i=0; i < quant; i++){
            hash  = new Date().getTime();
            console.log(hash);        
         }
         
      }
      
      return self;
   });