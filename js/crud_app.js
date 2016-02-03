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
		vm.allUsers = {};
		vm.bgcolor='white';
		//get shallow data for all users
		$http.get('http://localhost/BackEndProj_V3/controller/readPersonsController.php').
	    success(function(data) {
	    	console.log("data");
	    	console.log(data);
	    	vm.allUsers = data;
	    	console.log("***READ ALL USERS:***");
			console.log(vm.allUsers);
			//console.log("vm.userData[0].phoneDTO:");
			//console.log(vm.userData[0].phoneDTO);
	    	});
		vm.bgColor = function() {
	    	if (vm.bgcolor=='white'){vm.bgcolor='#ACD4FC';}
	    	else {vm.bgcolor='white';}
		};
		
		/*
		vm.expand = function(person_id) {
			//get additional data for one user
			vm.selectedID = person_id
	    	console.log("expand method in ReadController, person_id is & bgcolor are:");
	    	console.log(person_id);
	    	console.log(vm.bgcolor);
	    	vm.person_id_obj = {"person_id" : person_id};
			var myData = JSON.stringify(vm.person_id_obj);
			console.log('myData: ');
			console.log(myData);
			$http({
	            url: 'http://localhost/BackEndProj_V3/controller/personDetailsController.php',
	            method: "POST",
	            data: myData,
	            headers: {'Content-Type': 'application/json'}
	    	}).success(function(personObj) {
	    	    console.log('***response.result from updatePersonController.php***');
	    	    console.log(personObj);
	    	    console.log(personObj.phoneDTO);
	    	    console.log(personObj.addrDTO);
	    	    vm.oneUser = personObj;
			}).error(function(response) {
				console.log(response);
				console.log('There was a problem');
			});
		};
		vm.checkExpCond = function(person_id){
			var cond;
			if (person_id == vm.selectedID){
				cond = true;
			}
			if (person_id != vm.selectedID){
				cond = false;
			}
			console.log("*********************CHECKING EXPAND CONDITIONS********************************");
			console.log(cond);
			return cond;
		};
		*/
	};
	

	angular
    .module('app')
    .factory('stateService', stateService);
	
	function stateService($resource) {
	
		return { 
			getStates: function () {
				var States = $resource('http://localhost/BackEndProj_V3/controller/getStates.php');
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
				var PhoneTypes = $resource('http://localhost/BackEndProj_V3/controller/getPhoneTypes.php');
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
	            url: 'http://localhost/BackEndProj_V3/controller/createPersonController.php',
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
		    	person.l_name = "";
		    	person.f_name = "";
		    	person.email_addr = "";
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
		$http.get('http://localhost/BackEndProj_V3/controller/readPersonsController.php').
	    success(function(data) {
	    	vm.allUsers = data;
	    	console.log("***DELETE ALL USERS:***");
			console.log(vm.allUsers);
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
				
				var myURL = 'http://localhost/BackEndProj_V3/controller/deletePersonController.php?deleteId=';
					
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
		    	    console.log('response message: ');
		    	    console.log(response);
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
		$http.get('http://localhost/BackEndProj_V3/controller/readPersonsController.php').
	    success(function(data) {
	    	vm.allUsers = data;
	    	console.log("***UPDATE ALL USERS:***");
			console.log(vm.allUsers);
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
            url: 'http://localhost/BackEndProj_V3/controller/updatePersonController.php',
            method: "POST",
            data: myData,
            headers: {'Content-Type': 'application/json'}
    	}).success(function(response) {
    		console.log("************inside update user controller call*************");
    	    console.log("response");
    	    console.log(response);
    		vm.oneUser = response;
    	    console.log("****************end update user controller call**********");
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
	            url: 'http://localhost/BackEndProj_V3/controller/updatePersonRecordController.php',
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
