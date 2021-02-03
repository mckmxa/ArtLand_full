
	var app = angular.module('artland', ['ngRoute','ngCookies']);
	
	
	app.config(['$routeProvider', '$locationProvider', function($routeProvider,$locationProvider) {
		/* logged  user only restriction */
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
		/* admin only restriction */
		var onlyAdm = function($location, $q, AuthService) {
			var deferred = $q.defer();
			if(AuthService.getToken()){
				AuthService.isAdmin().then(function (response) {
					if (response.data) {
						deferred.resolve();
					} else{
						deferred.reject();
						$location.url('/');
					}
				}) 
			  } else {
				deferred.reject();
				$location.url('/');
			  }

			  return deferred.promise;
		};




        $routeProvider
        .when("/", {
	        templateUrl : 'views/homeView.html',
			controller : 'homeCtrl'
			

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
			controller : 'homeCtrl',
			
		}).when("/cart", {
			
			templateUrl : 'views/cartView.html',
			controller : 'homeCtrl',
			resolve:{onlyLogin:onlyLoggedIn}
			
		}).when("/users", {
			
			templateUrl : 'views/usersView.html',
			controller : 'usersCtrl',
			resolve:{admin:onlyAdm}
			
			
		})
		.otherwise({
			redirectTo: '/',
		})
		
	}])
