var admin
angular.module('artland').factory('AuthService', AuthService);

    AuthService.$inject = ['$http', '$q', 'Session'];
  
    function AuthService($http,  $q, Session) {
  
      var factory = {     
        isLoggedIn: isLoggedIn,
        isAdmin : isAdmin,
        logout: logout,
        getToken: getToken,
        getUser: getUser,
        setUser: setUser,
        getRole: getRole
      };
  
      return factory;
      
  
      function isLoggedIn(){

        if(Session.get('token')){
         return true
       }
       else {
        return false
      }
    }



    function isAdmin(){

      if(getToken()){

      var http = $http({
        method  : 'POST',
        url     : 'http://localhost:3000/api/auth/checkadmin' + '/' + Session.get('id'),
     })
    }
    return http
  }
  
     function logout(){
      
          Session.delete('token')
          Session.delete('username')
          Session.delete('role')
          Session.delete('id')
          console.log("clicked logout")
      }  
  
      function getToken(){
        return Session.get('token')
      } 

      function getRole(){
        

    }

  
      function setUser(data){
        console.log(data);
        Session.put('token', data.token)
        Session.put('username', data.user.username)
        Session.put('role', data.user.role)
  
      }

      function getUser(){
        return {
          'token': Session.get('token'),
          'username': Session.get('username'),
          'role' : Session.get('role')
        }
      }
  
    }