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
		vm.bgcolor='white';
		$http.get('http://localhost/BackEndProj_V3/readPersonsController.php').
	    success(function(data) {
	    	vm.userData = data.personList;
	    	console.log("data:");
			console.log(data);
			//console.log("vm.userData[0].phoneDTO:");
			//console.log(vm.userData[0].phoneDTO);
	    	});
		vm.bgColor = function() {
	    	if (vm.bgcolor=='white'){vm.bgcolor='#ACD4FC';}
	    	else {vm.bgcolor='white';}
		};
		vm.expand = function(person_id) {
	    	console.log("expand method in ReadController, person_id is & bgcolor are:");
	    	console.log(person_id);
	    	console.log(vm.bgcolor);
		};
	};
	

	angular
    .module('app')
    .factory('stateService', stateService);
	
	function stateService($resource) {
	
		return { 
			getStates: function () {
				var States = $resource('http://localhost/BackEndProj_V3/getStates.php');
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
    .factory('phoneService', phoneService);
	
	function phoneService($resource) {
	
		return { 
			getPhoneTypes: function () {
				var PhoneTypes = $resource('http://localhost/BackEndProj_V3/getPhoneTypes.php');
				return PhoneTypes.query(function(phoneTypes){
					return phoneTypes;
				});
			}
		};
	}

	
	angular
	.module('app')
	.controller('PhoneController', PhoneController);
	
	function PhoneController(phoneService) {
		var vm = this;
		vm.phoneTypeList = phoneService.getPhoneTypes();
		console.log('****PHONE TYPE LIST****:');
		console.log(vm.phoneTypeList);
	};
	
	angular
	.module('app')
	.controller('CreateController', CreateController);
	
	function CreateController($http){
		var vm = this;
		console.log("I am in CreateController Y'all!!!!");
		vm.person = {};
		vm.create = function(person) {
	    	console.log("create method in CreateController");
	    	
	    	if (person.phone.phone_type_id == undefined){
	    		person.phone.phone_type_id = "1";
	    	}
	    	if (person.address.state_id == undefined){
	    		person.address.state_id = "10";
	    	}
	    	if (person.address.street2 == undefined){
	    		person.address.street2 = "";
	    	}
	    	
	    	console.log('person.phone.phone_number: ');
	    	console.log(person.phone.phone_number);
	    	console.log('person.phone.phone_type_id: ');
	    	console.log(person.phone.phone_type_id);
	    	console.log('person.address.state_id: ');
	    	console.log(person.address.state_id);
	    	
	    	var myData = JSON.stringify(person);
	    	
	    	console.log('myData: ');
	    	console.log(myData);
	    	
	    	$http({
	            url: 'http://localhost/BackEndProj_V3/createPersonController.php',
	            method: "POST",
	            data: myData,
	            headers: {'Content-Type': 'application/json'}
	    	}).success(function(response) {
	    	    console.log('Success!');
	    	    console.log('response as is from backend: ');
	    	    console.log(response);
	    	    vm.createResponse = response.message;
	    		console.log('response in scope: ' + vm.createResponse);
			}).error(function(response) {
				console.log(response);
				console.log('There was a problem');
			});
	    };
	
	    vm.reset = function(person) {
	    	if (person != undefined){
		    	//console.log(person);
		    	person.lname = "";
		    	person.fname = "";
		    	person.email = "";
		    	person.phone.phone_number = "";
		    	person.phone.phone_type_id = "1";
	    	}
	    };
	};
	
	angular
	.module('app')
	.controller('DeleteController', DeleteController);
	
	function DeleteController($http){
		var vm = this;
		vm.idList = [];
		
		//display all person in the db
		//SHOULD CHECK IF THE DATA IS ALREADY IN SCOPE!
		$http.get('http://localhost/BackEndProj_V3/readPersonController.php').
	    success(function(data) {
	    	console.log('readPersonController gets data:');
	    	console.log(data);
	    	vm.userData = data.result;
	    });
		
		//create an array of person_ids to delete
		vm.checkDelete = function (person_id){
			console.log('person_id from checkDelete');
			console.log(person_id);
			vm.checkExists = function(person_id){
				vm.inList = false;
				for (var i = 0; i < vm.idList.length; i++){
					if (person_id == vm.idList[i]){
						vm.inList = true;
						vm.idList.splice(i, 1);
						break;
					}
				}
				if (vm.inList == false){
					vm.idList[vm.idList.length] = person_id;
				}
			};
			
			vm.checkExists(person_id);
		};
		
		//delete selected persons from the db
		vm.deleteItems = function(){
			if (vm.idList.length > 0){
				vm.toObject = function () {
					var objIdList = {};
					for (var i = 0; i < vm.idList.length; ++i)
					{
						if (vm.idList[i] !== undefined){
							objIdList[i] = vm.idList[i];
						}
					}
					return objIdList;
				};
				
				var myURL = 'http://localhost/BackEndProj_V3/deletePersonController.php?deleteId=';
					
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
		//get all person from the db
		$http.get('http://localhost/BackEndProj_V3/readPersonController.php').
	    success(function(data) {
	    	console.log(data);
	    	vm.userData = data.result;
	    });
		
		//set update id
		vm.setUpdateId = function(person_id){
			console.log('person_id');
			console.log(person_id);
			vm.updateId = person_id; 
		};
		
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
		vm.person_id = {"person_id" : vm.updateObj.updateId};
		console.log('vm.person_id is: ');
		console.log(vm.person_id);
		
		//get one record for one id
		var myData = JSON.stringify(vm.person_id);
    	console.log('***Update Record***myData: ');
    	console.log(myData);
    	
    	$http({
            url: 'http://localhost/BackEndProj_V3/updatePersonController.php',
            method: "POST",
            data: myData,
            headers: {'Content-Type': 'application/json'}
    	}).success(function(response) {
    	    console.log('***response.result from updatePersonController.php***');
    	    console.log(response.result);
    	    console.log(response.result.phoneDTO);
    	    vm.userData = response.result;
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
			
	    	var myData = JSON.stringify(userData);
	    	console.log('FROM UPDATE METHOD IN UPDATE RECORD CNTRL, myData: ');
	    	console.log(myData); 
	    	
	    	$http({
	            url: 'http://localhost/BackEndProj_V3/updatePersonRecordController.php',
	            method: "POST",
	            data: myData,
	            headers: {'Content-Type': 'application/json'}
	    	}).success(function(response) {
	    	    console.log('Success!');
	    	    console.log('response as is from backend: ');
	    	    console.log(response);
	    	    vm.updateResponse = "RECORD UPDATED";
	    		console.log('response in scope: ');
	    		console.log(vm.updateResponse);
			}).error(function(response) {
				console.log(response);
				console.log('There was a problem');
			});
	    };
	};
})();
