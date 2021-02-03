
	var app = angular.module('artland', ['ngRoute','ngCookies']);

	/* logged  user only restriction */
	/* admin only restriction - isAdmin still not fixed */
	app.config(['$routeProvider', '$locationProvider', function($routeProvider,$locationProvider) {
		var onlyLoggedIn = function($location, $q, AuthService) {
			var deferred = $q.defer();
			if (AuthService.isLoggedIn()) {
				deferred.resolve();
			} else {
				deferred.reject();
				$location.url('/');
			}
			return deferred.promise;
		};




        $routeProvider
        .when("/", {
	        templateUrl : 'views/homeView.html',
			controller : 'homeCtrl',
			

		})
		.when("/login", {
			templateUrl : 'views/loginView.html',
			controller : 'homeCtrl',
			
		})
		.when("/register", {
			templateUrl : 'views/registerView.html',
			controller : 'homeCtrl',
			
		}).when("/product/:id", {
			
			templateUrl : 'views/productView.html',
			controller : 'productCtrl',
			
		}).when("/cart", {
			
			templateUrl : 'views/cartView.html',
			controller : 'cartCtrl',
			
		}).when("/users", {
			
			templateUrl : 'views/usersView.html',
			controller : 'usersCtrl',
			resolve:{loggedIn:onlyLoggedIn}
			
			
		})
		.otherwise({
			redirectTo: '/',
		})
		
	}])

	
	
	app.controller('homeCtrl', function($scope) {
		console.log("homectrl start")
		var ctrl = this;
	})