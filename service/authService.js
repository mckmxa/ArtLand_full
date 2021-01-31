angular.module('artland').factory('AuthService', AuthService);
  
    AuthService.$inject = ['$http', '$q', 'Session'];
  
    function AuthService($http,  $q, Session) {
  
      var factory = {     
        isLoggedIn: isLoggedIn,
        logout: logout,
        getToken: getToken,
        getUser: getUser,
        setUser: setUser
      };
  
      return factory;
  
      function isLoggedIn(){
        
        if(Session.get('token')){
         return true
       }
       else{
        return false
      }
    }
  
     function logout(){
      
          Session.delete('token')
          Session.delete('username')
          Session.delete('role')
          console.log("clicked logout")
      }  
  
      function getToken(){
        return Session.get('token')
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
          'username': Session.get('username')
        }
      }
  
    }