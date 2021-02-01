	var app = angular.module('artland', ['ngRoute','ngCookies']);
	app.config(function($routeProvider) {
        $routeProvider
        .when("/", {
	        templateUrl : 'views/homeView.html',
			controller : 'homeCtrl'
		})
		.when("/login", {
			templateUrl : 'views/loginView.html',
			controller : 'homeCtrl'
		})
		.when("/register", {
			templateUrl : 'views/registerView.html',
			controller : 'homeCtrl'
		}).when("/product/:id", {
			
			templateUrl : 'views/productView.html',
			controller : 'productCtrl'
		})
		.otherwise({
			redirectTo: '/'
		})
	})
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