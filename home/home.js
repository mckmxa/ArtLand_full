angular.module('artland').controller('homeCtrl', homeCtrl).controller('logoutCtrl', logoutCtrl).controller('productCtrl', productCtrl).controller('alertCtrl', alertCtrl)
  
  
    homeCtrl.$inject = ['$scope', '$http' ,'$location', 'Session'];
    logoutCtrl.$inject = ['$rootScope', '$scope', 'AuthService' ,'$location', '$route'];
  
    function homeCtrl($scope, $http, $location, Session) {
      $scope.user={}
      $scope.newuser={}
  
      $scope.loginForm = function() {
        //var pass=$scope.user.password;
        //var enc_pass= window.btoa(pass);
        //$scope.user.password=enc_pass;
        $http({
            method  : 'POST',
            url     : 'http://localhost:3000/api/auth/login',
            data    : $scope.user, //forms user object
         }).then(function(results) {
          
            
            Session.put('token', results.data.token)
            Session.put('username', results.data.username)
            Session.put('role', results.data.role)
            console.log(results.data.role)
  
            console.log("logged in successfully")
            
            $location.path('/home')
          },function errorCallback(response) {
            console.log("failed to login - succes status: " + response.data.success)
            $scope.error = "Błąd logowania"

          });
  
      }
  
      $scope.registerForm = function() {
         // var pass = $scope.newuser.password;
         //var enc_pass = window.btoa(pass);
        // $scope.newuser.password = enc_pass;
         $http({
              method  : 'POST',
              url     : 'http://localhost:3000/api/auth/register',
              data    : $scope.newuser, //forms user object
           })
              .then(function(response) {
               console.log("registered successfully")
               console.log(response);
               $location.path('/login')
              },function errorCallback(response) {
                console.log(response)
                // ALERT ON WRONG REGISTER DATA
                // ERROR ARRAY OK IN RESPONSE
                // TODO
    
              });
      }

        $http({
             method  : 'GET',
             url     : 'http://localhost:3000/api/products',
             //data    : $scope.products
          })
          .then(function(response) {
              $scope.products = response.data.products;
            }
            ,function errorCallback(response) {
               console.log(response)
             });

}

function logoutCtrl($rootScope, $scope, AuthService, $location, $route) {
  console.log("logout ctrl startuje")
  console.log(AuthService.isLoggedIn())
  var user = AuthService.getUser();

  $rootScope.login_status = "Logged in as ";
  if(user.username)
  $rootScope.login_status = $rootScope.login_status + user.username;
  else
  $rootScope.login_status = "Not logged in"

$scope.anyFunction = function () {
  AuthService.logout();
  $location.path('/home')
  $route.reload();
  console.log("clicked reload")
}

$scope.isLogged = function () {
  return AuthService.isLoggedIn();
}

}

function productCtrl($http,$routeParams,$scope) {
  $http({
    method  : 'GET',
    url     : 'http://localhost:3000/api/products' + '/' + $routeParams.id,
    //data    : $scope.products
 })
 .then(function(response) {
     $scope.products = response.data.product;
   }
   ,function errorCallback(response) {
      console.log(response)
    });
  console.log("REACHED HERE");
  $scope.productID= $routeParams.id;
  console.log($scope.productID);
}

function alertCtrl($scope, $window)  {


            $scope.invalidLogin = "Wrong password or username";
            $scope.clickMe = angularAlert => {    
                $window.alert(angularAlert);   
            };   
        }    




/*
var app = angular.module('artland', ['$scope', 'AuthService' ,'$location'])

app.controller('signoutCtrl', function($scope, $location, AuthService) {
console.log("signoutctrl start")
    var ctrl = this;
    $scope.logout = function () {
        AuthService.logout()
        $location.path('/')
    }
})
*/