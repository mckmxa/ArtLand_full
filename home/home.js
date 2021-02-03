
angular.module('artland').controller('homeCtrl', homeCtrl)/*.controller('logoutCtrl', logoutCtrl)*/.controller('productCtrl', productCtrl)/*.controller('cartCtrl', cartCtrl)*/
.controller('usersCtrl',usersCtrl)
  
  
    homeCtrl.$inject = ['$rootScope', '$scope', '$http' ,'$location', 'Session' ,'AuthService','$route', '$cookies'];
    //logoutCtrl.$inject = ['$rootScope', '$scope', 'AuthService' ,'$location', '$route'];
    //cartCtrl.$inject = ['$http','$scope','$cookies'];
  
    function homeCtrl($rootScope, $scope, $http, $location, Session, AuthService, $route, $cookies) {
      $scope.user={}
      $scope.newuser={}


      $scope.isLogged = function () {
        return AuthService.isLoggedIn();
      }
      
        
      
        $scope.isAdministrator = function () {
          return $scope.admin;
        }
  
      $scope.loginForm = function() {

        $http({
            method  : 'POST',
            url     : 'http://localhost:3000/api/auth/login',
            data    : $scope.user, //forms user object
         }).then(function(results) {
          
            
            Session.put('token', results.data.token)
            Session.put('username', results.data.username)
            Session.put('role', results.data.role)
            Session.put('id' , results.data.id)
  
            console.log("logged in successfully, your id : " + results.data.id)


            if(AuthService.getToken()){
              AuthService.isAdmin().then(function (response) {
                $scope.admin = response.data
              }) 
            } else{
              $scope.admin = false;
            }

            var user = AuthService.getUser();

            if(user.username)
            $scope.login_status = "Hello " + user.username + "!"
            else
            $scope.login_status = ""

            
            
            document.getElementById("loginModal").style.display = "none";
          },function errorCallback(response) {
            console.log(response)
            console.log("failed to login - succes status: " + response.data.success)
            $scope.error = response.data.error;

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
               
               document.getElementById("registerModal").style.display = "none";
              },function errorCallback(response) {
                //$scope.invalidPassword = "Hasło musi mieć co najmniej 6 znaków!"
                //$scope.invalidEmail = "Dany email/nazwa użytkownika już istnieje lub email jest niepoprawny!"
                console.log(response)
                console.log(response.data.errors[0].param)
                

                let errors = [];
                errors = response.data.errors
                console.log(errors);
                
                for (var i = 0; i < errors.length; i++) {
                  if(errors[i].param == "email")
                  {
                    $scope.error = "Dany email/nazwa użytkownika już istnieje lub email jest niepoprawny!"

                  }
                  if(errors[i].param == "password")
                  {
                    $scope.error = errors[i].msg
                  }
                }
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



  console.log(AuthService.isLoggedIn())
  var user = AuthService.getUser();

  if(user.username)
  $scope.login_status = "Hello " + user.username + "!"
  else
  $scope.login_status = ""

/*
$scope.anyFunction = function () {
  AuthService.logout();
  $location.path('/')
  $route.reload();
  console.log("clicked reload")
}
*/

$scope.logout = function () { 
  AuthService.logout();
  console.log("logged out successfully")
  $scope.admin = false;
  $scope.login_status = ""
}




  $scope.cart = [];
  $scope.total = 0;

  
  if(!angular.isUndefined($cookies.get('total'))){
    $scope.total = parseFloat($cookies.get('total'));
  }
  
  if (!angular.isUndefined($cookies.get('cart'))) {
       $scope.cart =  $cookies.getObject('cart');
  }
  
  
  $scope.addItemToCart = function(product){
    console.log($scope.cart)
    console.log("dodaje produkt o id " + product.id + " " + product.name)
    console.log(product)
    
     if ($scope.cart.length === 0){
       product.count = 1;
       $scope.cart.push(product);
     } else {
       var repeat = false;
       for(var i = 0; i< $scope.cart.length; i++){
         if($scope.cart[i].id === product.id){
           repeat = true;
           $scope.cart[i].count +=1;
         }
       }
       if (!repeat) {
         product.count = 1;
          $scope.cart.push(product);	
       }
     }
     var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);
     $cookies.putObject('cart', $scope.cart,  {'expires': expireDate});
     $scope.cart = $cookies.getObject('cart');
   
    $scope.total += parseFloat(product.price);
    $cookies.put('total', $scope.total,  {'expires': expireDate});
   };
  
   $scope.removeItemCart = function(product){
     
     if(product.count > 1){
       product.count -= 1;
       var expireDate = new Date();
       expireDate.setDate(expireDate.getDate() + 1);
       $cookies.putObject('cart', $scope.cart, {'expires': expireDate});
        $scope.cart = $cookies.getObject('cart');
     }
     else if(product.count === 1){
       var index = $scope.cart.indexOf(product);
      $scope.cart.splice(index, 1);
      expireDate = new Date();
     expireDate.setDate(expireDate.getDate() + 1);
      $cookies.putObject('cart', $scope.cart, {'expires': expireDate});
      $scope.cart = $cookies.getObject('cart');
       
     }
     
     $scope.total -= parseFloat(product.price);
     $cookies.put('total', $scope.total,  {'expires': expireDate});
     
   };



}

function productCtrl($http,$routeParams,$scope,AuthService) {
 /* console.log("is logged in? : " + AuthService.isLoggedIn())
  if(AuthService.getToken()){
  AuthService.isAdmin().then(function (response) {
    console.log("is admin? : " + response.data)
  }) 
  
}
 */ 

  $http({
    method  : 'GET',
    url     : 'http://localhost:3000/api/products' + '/' + $routeParams.id,
 })
 .then(function(response) {
     $scope.products = response.data.product;
   }
   ,function errorCallback(response) {
      console.log(response)
    });

  $scope.productID= $routeParams.id;
  console.log($scope.productID);


}


function usersCtrl ($http, $scope ,$timeout) {
  
  $http({
    method  : 'GET',
    url     : 'http://localhost:3000/api/users',
 }).then(function (response) {
    $scope.users = response.data.users;
 },function errorCallback(response) {
  console.log(response)
})
$scope.deleteUser = function(data, index) {
  console.log(index)
  
  $http({
    method  : 'DELETE',
    url     : 'http://localhost:3000/api/users' + '/' + data.id
 }).then(function (response) {
  var del_index = $scope.users.findIndex(function(d){return d.id == data.id});
  console.log(del_index)
  if(del_index>0){//if index of the id to be removed found
      $scope.users.splice(del_index, 1)

  }

  
  //$scope.users.splice(del_index, 1)
  console.log("deleted " + data.id)
 },function errorCallback(response) {
  console.log(response)
});

 
}

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