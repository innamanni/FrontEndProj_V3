(function() {
	'use strict';
	
	angular
		.module('app', ['ngRoute', 'ngResource']);
	
	angular
		.module('app')
		.config(['$routeProvider', function($routeProvider){
		$routeProvider
			.when('/Create', {
				controller: 'CreateController',
				templateUrl: 'template/create.html'
			})
			.when('/Read', {
				controller: 'ReadController',
				templateUrl: 'template/read.html'
			})
			.when('/Update', {
				controller: 'UpdateListController',
				templateUrl: 'template/update_list.html'
			})
			.when('/Update_record', {
				controller: 'UpdateRecordController',
				templateUrl: 'template/update_record.html'
			})
			.when('/Delete', {
				controller: 'DeleteController',
				templateUrl: 'template/delete.html'
			})
			.otherwise({redirectTo: '/Read'});
	}]);
	
	
	angular
	.module('app')
	.controller('ReadController', ReadController);
	
	function ReadController($http){
		var vm = this;
		$http.get('http://localhost/BackEndProj_V3/readAddrController.php').
	    success(function(data) {
	    	vm.userData = data.result;
	    	console.log("vm.userData:");
			console.log(vm.userData);
	    	});
	};
	

	angular
    .module('app')
    .factory('stateService', stateService);
	
	function stateService($resource) {
	
		return { 
			getStates: function () {
				var States = $resource('http://localhost/BackEndProj_V3/getState.php');
				return States.query(function(states){
					return states;
				});
			}
		};
	}

	
	angular
	.module('app')
	.controller('StateController', StateController);
	
	function StateController(stateService) {
		var vm = this;
		vm.stateList = stateService.getStates();
		console.log('****STATE LIST****:');
		console.log(vm.stateList);
		
		/*
	   	vm.stateCtrlVal = function($val){
    		if ($val == '10') return true;
    		else return false;
    	};
    	*/
	};
	
	angular
	.module('app')
	.controller('CreateController', CreateController);
	
	function CreateController($http){
		var vm = this;
		console.log("I am in CreateController Y'all!!!!");
		vm.address = {};
		vm.update = function(address) {
	    	console.log("update method in CreateController");
	    	if (address.street2 == undefined) {
	    		address.street2 = " ";
	    	}
	    	if (address.state == undefined) {
	    		address.state = "10";
	    	}
	    	
	    	var myData = JSON.stringify(address);
	    	console.log('address.state: ' + address.state);
	    	console.log('myData: ' + myData);
	    	
	    	$http({
	            url: 'http://localhost/BackEndProj_V3/createAddrController.php',
	            method: "POST",
	            data: myData,
	            headers: {'Content-Type': 'application/json'}
	    	}).success(function(response) {
	    	    console.log('Success!');
	    	    console.log('response as is from backend: ' + response);
	    	    vm.createResponse = response.message;
	    		console.log('response in scope: ' + vm.createResponse);
			}).error(function(response) {
				console.log(response);
				console.log('There was a problem');
			});
	    };
	
	    vm.reset = function(address) {
	    	if (address != undefined){
		    	//console.log(address);
		    	address.street1 = "";
		    	address.street2 = "";
		    	address.city = "";
		    	address.state = "";
		    	address.zip = "";
	    	}
	    };
	};
	
	angular
	.module('app')
	.controller('DeleteController', DeleteController);
	
	function DeleteController($http){
		var vm = this;
		vm.idList = [];
		
		//display all addresses in the db
		//SHOULD CHECK IF THE DATA IS ALREADY IN SCOPE!
		$http.get('http://localhost/BackEndProj_V3/readAddrController.php').
	    success(function(data) {
	    	console.log(data);
	    	vm.userData = data.result;
	    });
		
		//create an array of address_ids to delete
		vm.checkDelete = function (address_id){
			vm.checkExists = function(address_id){
				vm.inList = false;
				for (var i = 0; i < vm.idList.length; i++){
					if (address_id == vm.idList[i]){
						vm.inList = true;
						vm.idList.splice(i, 1);
						break;
					}
				}
				if (vm.inList == false){
					vm.idList[vm.idList.length] = address_id;
				}
			};
			
			vm.checkExists(address_id);
			//for (var i = 0; i < $scope.idList.length; i++){
			//	console.log('idList[' + i + ']: ' + $scope.idList[i]);
			//}
		};
		
		//delete selected addresses from the db
		vm.deleteItems = function(){
			if (vm.idList.length > 0){
				vm.toObject = function () {
					var objIdList = {};
					for (var i = 0; i < vm.idList.length; ++i)
						if (vm.idList[i] !== undefined){
							objIdList[i] = vm.idList[i];
						}
					return objIdList;
				};
				
				var myURL = 'http://localhost/BackEndProj_V3/deleteAddrController.php?deleteId=';
					
				for (var i=0; i < vm.idList.length; i++){
					myURL += vm.idList[i];
					if (vm.idList.length - i > 1) {myURL += ',';}
				}
	
				console.log(myURL);
				
				$http({
		            url: myURL,
		            method: "GET"
		    	}).success(function(response) {
		    	    console.log('Success!');
		    	    console.log('response message: ' + response);
		    	    //PAGE SHOULD RELOAD HERE!!!!
		    	    vm.deleteResponse = "DELETED SUCCESSFULLY";
				}).error(function(response) {
					console.log(response);
					console.log('There was a problem');
				});
			}
		};
	};
	
	angular
	.module('app')
	.controller('UpdateListController', UpdateListController);
	
	function UpdateListController($http, $location){
		var vm = this;
		//get all addresses from the db
		$http.get('http://localhost/BackEndProj_V3/readAddrController.php').
	    success(function(data) {
	    	console.log(data);
	    	vm.userData = data.result;
	    });
		
		//set update id
		vm.setUpdateId = function(address_id){ vm.updateId = address_id; };
		
		//load updateRecord template
		vm.loadNewTemplate = function(){
			$location.path('/Update_record').search('updateId',  vm.updateId);
		};
	};
	
	angular
	.module('app')
	.controller('UpdateRecordController', UpdateRecordController);
	
	function UpdateRecordController($http, $location){
		var vm = this;
		vm.updateObj = $location.search();
		vm.address_id = {"address_id" : vm.updateObj.updateId};
		console.log('vm.address_id is: ');
		console.log(vm.address_id);
		
		//get one record for one id
		var myData = JSON.stringify(vm.address_id);
    	console.log('myData: ');
    	console.log(myData);
    	
    	$http({
            url: 'http://localhost/BackEndProj_V3/updateAddrController.php',
            method: "POST",
            data: myData,
            headers: {'Content-Type': 'application/json'}
    	}).success(function(response) {
    	    console.log('Success!');
    	    vm.userData = response.result;
    	    console.log('after restful call, response is: ');
    	    console.log(response.result);
		}).error(function(response) {
			console.log(response);
			console.log('There was a problem');
		});
    	
    	//if Cancel load updateList template
		vm.loadNewTemplate = function(){
			$location.path('/Update');
		};
		
		vm.update = function(userData) {
			
			console.log('hi from update function, userData is: ');
			console.log(userData);
			
	    	if (vm.userData.street2 == undefined) {
	    		vm.userData.street2 = " ";
	    	}
	    	if (vm.userData.state == undefined) {
	    		vm.userData.state = "10";
	    	}
	    	
	    	var myData = JSON.stringify(userData);
	    	console.log('FROM UPDATE METHOD IN UPDATE RECORD CNTRL, myData: ');
	    	console.log(myData); 
	    	
	    	$http({
	            url: 'http://localhost/BackEndProj_V3/updateAddrRecordController.php',
	            method: "POST",
	            data: myData,
	            headers: {'Content-Type': 'application/json'}
	    	}).success(function(response) {
	    	    console.log('Success!');
	    	    console.log('response as is from backend: ');
	    	    console.log(response);
	    	    vm.updateResponse = "RECORD UPDATED";
	    		console.log('response in scope: ');
	    		console.log(vm.createResponse);
			}).error(function(response) {
				console.log(response);
				console.log('There was a problem');
			});
	    };
	};
})();
