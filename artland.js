
	var app = angular.module('artland', ['ngRoute','ngCookies']);

	// $$route undefined after login - FIX
	/* logged  user only restriction */
	/*
	app.run(['$rootScope', '$location', 'AuthService', function($rootScope, $location, AuthService) {
        $rootScope.$on('$routeChangeStart', function(event, current) {
			$rootScope.pageTitle = current.$$route.title;
			console.log("is logged in? : " + AuthService.isLoggedIn())
			console.log("is admin? : " + AuthService.isAdmin())
            if (!AuthService.isLoggedIn() && current.$$route.withLogin || AuthService.isLoggedIn() && current.$$route.withoutLogin) {
                event.preventDefault();
                $location.path('/');
            }
        });
	}]);
	*/
	/*

	app.run(['$rootScope', '$location', 'AuthService', function($rootScope, $location, AuthService) {
        $rootScope.$on('$routeChangeStart', function(event, current) {
			$rootScope.pageTitle = current.$$route.title;
			
			console.log("is logged in? : " + AuthService.isLoggedIn())
			console.log("is admin? : " + AuthService.isAdmin())
            if (!AuthService.isAdmin() && current.$$route.withAdmin || AuthService.isAdmin() && current.$$route.withoutAdmin) {
                event.preventDefault();
                $location.path('/');
            }
        });
	}]);
*/
	

	app.config(['$routeProvider', function($routeProvider) {


        $routeProvider
        .when("/", {
	        templateUrl : 'views/homeView.html',
			controller : 'homeCtrl',
			//withoutLogin: true
			

		})
		.when("/login", {
			templateUrl : 'views/loginView.html',
			controller : 'homeCtrl',
			//withoutLogin: true
			
		})
		.when("/register", {
			templateUrl : 'views/registerView.html',
			controller : 'homeCtrl',
			//withoutLogin: true
			
		}).when("/product/:id", {
			
			templateUrl : 'views/productView.html',
			controller : 'productCtrl',
			//withoutLogin: true
			
		}).when("/cart", {
			
			templateUrl : 'views/cartView.html',
			controller : 'cartCtrl',
			//withoutLogin: true
			
		}).when("/users", {
			
			templateUrl : 'views/usersView.html',
			controller : 'usersCtrl',
			//withAdmin : true
			//withLogin: true
			
		})
		.otherwise({
			redirectTo: '/',
		})
		
	}])

	
	
	app.controller('homeCtrl', function($scope) {
		console.log("homectrl start")
		var ctrl = this;
	})



/*
var app = angular.module('artland', ['ui.router','ngCookies']);

app.config(function($stateProvider) {
    $stateProvider
    .state("", {
        url:'/',
        templateUrl : 'views/home.html',
		controller : 'homeCtrl'
      })
    .state("home", {
        url:'/home',
		templateUrl : 'views/homeView.html',
		controller : 'homeCtrl'
	  })
	  .state("login", {
        url:'/login',
		templateUrl : 'views/loginView.html',
		controller : 'homeCtrl'
	  })
	  .state("register", {
        url:'register',
		templateUrl : 'views/registerView.html',
		controller : 'homeCtrl'
	  })
	  .state("product", {
        url: '/product/:id',
		templateUrl : 'views/productView.html',
		controller : 'productCtrl'
	  })
	  
	  
  }
  
);
app.controller('homeCtrl', function($scope) {
	console.log("homectrl start")
	var ctrl = this;
})
*/