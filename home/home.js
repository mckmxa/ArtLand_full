angular.module('artland').controller('homeCtrl', homeCtrl)/*.controller('logoutCtrl', logoutCtrl)*/.controller('productCtrl', productCtrl)/*.controller('cartCtrl', cartCtrl)*/
  .controller('usersCtrl', usersCtrl)


homeCtrl.$inject = ['$rootScope', '$scope', '$http', '$location', 'Session', 'AuthService', '$route', '$cookies']
//logoutCtrl.$inject = ['$rootScope', '$scope', 'AuthService' ,'$location', '$route'];
//cartCtrl.$inject = ['$http','$scope','$cookies'];



/* main ctrl for homeview (login, register, logout, all products loading, cart) */
function homeCtrl($rootScope, $scope, $http, $location, Session, AuthService, $route, $cookies) {
  $scope.user = {}
  $scope.newuser = {}
  $scope.neworder = []
  $scope.canBuy = ""

  /*HELPERS */

  /* helper functions to check if user is logged in or is an admin */
  $scope.isLogged = function () {
    return AuthService.isLoggedIn()
  }

  $scope.admin = $scope.isLogged()


  $scope.isAdministrator = function () {
    return $scope.admin;
  }

  /* helper function to get total items*/
  $scope.checkTotalItems = function () {
    if ($scope.totalItems > 0) {
      return true
    } else {
      return false
    }
  }



  function refreshStatus() {

    var user = AuthService.getUser();

    if (user.username)
      $scope.login_status = "Witaj " + user.username + "!"
    else
      $scope.login_status = ""

    if (AuthService.getToken()) {
      AuthService.isAdmin().then(function (response) {
        $scope.admin = response.data
      })
    } else {
      $scope.admin = false;
    }
  }

  /* MAIN FUNCTIONS */
  /* login form - sending http request to backend login endpoint with payload as form data and storing res in session */
  $scope.loginForm = function () {

    $http({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/login',
      data: $scope.user, //forms user object
    }).then(function (results) {


      Session.put('token', results.data.token)
      Session.put('username', results.data.username)
      Session.put('role', results.data.role)
      Session.put('id', results.data.id)

      console.log("logged in successfully, your id : " + results.data.id)

      $scope.canBuy = ""
      $scope.error = ""

      if (AuthService.getToken()) {
        AuthService.isAdmin().then(function (response) {
          $scope.admin = response.data
        })
      } else {
        $scope.admin = false;
      }

      refreshStatus()

      document.getElementById("loginModal").style.display = "none";
    }, function errorCallback(response) {
      console.log(response)
      console.log("failed to login - succes status: " + response.data.success)
      $scope.error = response.data.error;

    });

  }

  /* register form - sending http post request to backend register endpoint with payload as form data */
  $scope.registerForm = function () {
    // var pass = $scope.newuser.password;
    //var enc_pass = window.btoa(pass);
    // $scope.newuser.password = enc_pass;
    $http({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/register',
      data: $scope.newuser, //forms user object
    })
      .then(function (response) {
        console.log("registered successfully")
        console.log(response);

        document.getElementById("registerModal").style.display = "none";
      }, function errorCallback(response) {
        //$scope.invalidPassword = "Hasło musi mieć co najmniej 6 znaków!"
        //$scope.invalidEmail = "Dany email/nazwa użytkownika już istnieje lub email jest niepoprawny!"
        console.log(response)
        console.log(response.data.errors[0].param)


        let errors = [];
        errors = response.data.errors
        console.log(errors);

        for (var i = 0; i < errors.length; i++) {
          if (errors[i].param == "email") {
            $scope.error = "Dany email/nazwa użytkownika już istnieje lub email jest niepoprawny!"

          }
          if (errors[i].param == "password") {
            $scope.error = errors[i].msg
          }
        }
      });
  }

  $http({
    method: 'GET',
    url: 'http://localhost:3000/api/products',
  })
    .then(function (response) {
      $scope.products = response.data.products;
    }
      , function errorCallback(response) {
        console.log(response)
      });


  refreshStatus()


  /*
  $scope.anyFunction = function () {
    AuthService.logout();
    $location.path('/')
    $route.reload();
    console.log("clicked reload")
  }
  */

  /* logout -  clearing session data and updating scopes */

  $scope.logout = function () {
    AuthService.logout();
    console.log("logged out successfully")
    $scope.admin = false;
    $scope.login_status = ""
    $scope.total = 0;
    $scope.totalItems = 0;
  }


  /* cart implementation using ngCookies */

  $scope.cart = [];
  $scope.total = 0;
  $scope.totalItems = 0;


  if (!angular.isUndefined($cookies.get('total'))) {
    $scope.total = parseFloat($cookies.get('total'));
  }

  if (!angular.isUndefined($cookies.get('cart'))) {
    $scope.cart = $cookies.getObject('cart');
  }
  if (!angular.isUndefined($cookies.get('totalItems'))) {
    $scope.totalItems = $cookies.getObject('totalItems');
  }


  $scope.addItemToCart = function (product) {
    if (AuthService.isLoggedIn()) {
      console.log($scope.cart)

      console.log("dodaje produkt o id " + product.id + " " + product.name)
      console.log(product)

      if ($scope.cart.length === 0) {
        product.count = 1;
        $scope.cart.push({ id: product.id, name: product.name, price: product.price, count: product.count });



      } else {
        var repeat = false;
        for (var i = 0; i < $scope.cart.length; i++) { // przeszukaj koszyk w poszukiwaniu juz istniejacego produktu
          if ($scope.cart[i].id === product.id) {
            repeat = true;
            $scope.cart[i].count += 1;
          }
        }
        if (!repeat) {
          product.count = 1;
          $scope.cart.push({ id: product.id, name: product.name, price: product.price, count: product.count });

        }
      }

      var expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 1);


      $cookies.putObject('cart', $scope.cart, { 'expires': expireDate });
      $scope.cart = $cookies.getObject('cart');

      $scope.total += parseFloat(product.price);
      $cookies.put('total', $scope.total, { 'expires': expireDate });

      $scope.totalItems += 1;
      $cookies.put('totalItems', $scope.totalItems, { 'expires': expireDate });

    } else {
      $scope.canBuy = "Log in to buy items"
    }
  };

  $scope.removeItemCart = function (product) {

    if (product.count > 1) {
      product.count -= 1;
      var expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 1);
      $cookies.putObject('cart', $scope.cart, { 'expires': expireDate });
      $scope.cart = $cookies.getObject('cart');
      $scope.totalItems -= 1;
    }
    else if (product.count === 1) {

      var index = $scope.cart.indexOf(product);
      $scope.cart.splice(index, 1);
      expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 1);
      $cookies.putObject('cart', $scope.cart, { 'expires': expireDate });
      $scope.cart = $cookies.getObject('cart');
      $scope.totalItems -= 1;

    }

    $scope.total -= parseFloat(product.price);
    $cookies.put('total', $scope.total, { 'expires': expireDate });
    $cookies.put('totalItems', $scope.totalItems, { 'expires': expireDate });


  };


  $scope.placeOrder = function () {
    $scope.itemsArray = []
    for (var i = 0; i < $scope.cart.length; i++) { // przeszukaj koszyk 
      $scope.itemsArray.push({ id: $scope.cart[i].id, incart: $scope.cart[i].count })
    }
    $scope.neworder.push({ userId: Session.get('id'), products: $scope.itemsArray })
    $http({
      method: 'POST',
      url: 'http://localhost:3000/api/orders/new',
      data: $scope.neworder[0]

    }).then(function (response) {
      console.log($scope.neworder[0])
      $cookies.remove('cart')
      $cookies.remove('total')
      $cookies.remove('totalItems')
      $scope.totalItems = 0;
      $scope.total = 0;
      $scope.cart = []
      window.alert("Successfully placed order")
    })
  }



}

/* controller to handle single product details */

function productCtrl($http, $routeParams, $scope, AuthService) {

  $http({
    method: 'GET',
    url: 'http://localhost:3000/api/products' + '/' + $routeParams.id,
  })
    .then(function (response) {
      $scope.products = response.data.product;
    }
      , function errorCallback(response) {
        console.log(response)
      });

  $scope.productID = $routeParams.id;
  console.log($scope.productID);


}

/* controller to handle users listing and management */
function usersCtrl($http, $scope, $timeout) {

  $scope.isOrder = true
  $scope.orderState =""

  $http({
    method: 'GET',
    url: 'http://localhost:3000/api/users',
  }).then(function (response) {
    $scope.users = response.data.users;
  }, function errorCallback(response) {
    console.log(response)
  })
  $scope.deleteUser = function (data, index) {
    console.log(index)

    $http({
      method: 'DELETE',
      url: 'http://localhost:3000/api/users' + '/' + data.id
    }).then(function (response) {
      var del_index = $scope.users.findIndex(function (d) { return d.id == data.id });
      console.log(del_index)
      if (del_index > 0) {//if index of the id to be removed found
        $scope.users.splice(del_index, 1)

      }


      //$scope.users.splice(del_index, 1)
      console.log("deleted " + data.id)
    }, function errorCallback(response) {
      console.log(response)
    });

  
  
  }
  $scope.getOrders = function (user) {
    $scope.orders = []

    $http({
      method: 'GET',
      url: 'http://localhost:3000/api/orders/user' + '/' + user.id,
    })
      .then(function (response) {
        
        $scope.orders = response.data;
        console.log(response.data)
        $scope.orderState= ""
        $scope.isOrder = true
        if(response.data.code === 1 )
        {
          $scope.orderState = "Brak zamówień"
          $scope.isOrder = false
        }
      }
        , function errorCallback(response) {
          console.log(response)
        });
  }

  $scope.isOrderCheck = function () {
    return $scope.isOrder
  }

  $scope.giveAdmin = function (user) {

    var searchIndex = $scope.users.findIndex(function (s) { return s.id == user.id });
    console.log(searchIndex)
    $http({
      method: 'PATCH',
      url: 'http://localhost:3000/api/users' + '/' + user.id,
      data: {role: "ROLE_ADMIN"}
    })
      .then(function (response) {
        $scope.msg = response.data;
        console.log($scope.msg +" "+ $scope.users[searchIndex].role)
        $scope.users[searchIndex].role = "ROLE_ADMIN"
      }
        , function errorCallback(response) {
          console.log(response)
        });
  }

  $scope.revokeAdmin = function (user) {
    var searchIndex = $scope.users.findIndex(function (s) { return s.id == user.id });
    console.log(searchIndex)
    $http({
      method: 'PATCH',
      url: 'http://localhost:3000/api/users' + '/' + user.id,
      data: {role: "ROLE_USER"}
    })
      .then(function (response) {
        $scope.msg = response.data;
        $scope.users[searchIndex].role = "ROLE_USER"
      }
        , function errorCallback(response) {
          console.log(response)
        });
  }
}


