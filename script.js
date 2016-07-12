var app = angular.module('app', ['ngRoute', 'ngCookies']);

var order = {
  options: {},
  address: {}
};

var totalPrice;

app.config(function($routeProvider) {
  $routeProvider
  .when('/home', {
    templateUrl: 'home.html',
    controller: 'MainController'
  })

  .when('/options', {
    templateUrl: 'options.html',
    controller: 'OptionsController'
  })

  .when('/delivery', {
    templateUrl: 'delivery.html',
    controller: 'OptionsController'
  })

  .when('/payment', {
    templateUrl: 'payment.html',
    controller: 'OptionsController'
  })

  .when('/thanks', {
    templateUrl: 'thanks.html',
    controller: 'OptionsController'
  })

  .when('/login', {
    templateUrl: 'login.html',
    controller: 'LoginController'
  })

  .when('/register', {
    templateUrl: 'register.html',
    controller: 'RegisterController'
  })

  .otherwise({
    redirectTo: '/home'
  });
});

app.controller('MainController', function($scope, $cookies, $location) {
  $scope.logout = function() {
    $cookies.remove("token");
    $location.path('/home');
  };
  $scope.checkIfLoggedIn = checkIfLoggedIn;
  function checkIfLoggedIn() {
      if($cookies.get('token')) {
        return true;
      } else {
        return false;
      }
  }
});

//options delivery and payment controller
app.controller('OptionsController', function($scope, grindOps, $location, postOrder, $cookies, $http) {
  checkIfLoggedIn();
  $scope.order = order;
  // $scope.token = $cookies.get('token');
  $scope.makeOrder = function(qty, total) {
    totalPrice = total * 20 * 100;
    console.log(totalPrice);
    order.options = {
      qty: qty,
      grindType: $scope.grindType,
      grindType2: $scope.grindType2
    };
    $location.path('/delivery');
  };
  grindOps.getGrindOptions(function(data) {
    $scope.grinds = data;
  });
  $scope.deliverySubmit = function() {
    order.address = {
      name: $scope.fullName,
      address1: $scope.address1,
      address2: $scope.address2,
      city: $scope.city,
      state: $scope.state,
      zipCode: $scope.zipCode,
      deliveryDate: $scope.deliveryDate
    };
    $location.path('/payment');
  };
  // $scope.payOrder = function() {
  //   postOrder.submit();
  //   console.log('payment made');
  //   $location.path('/thanks');
  // };
  $scope.checkIfLoggedIn = checkIfLoggedIn;
  function checkIfLoggedIn() {
    if($cookies.get('token')) {
        return true;
    } else {
      $location.path("/login");
    }
  } //checkIfLoggedIn end

  // $scope.logout = function() {
  //   $cookies.remove("token");
  //   console.log('you clicked logout');
  //   $location.path('/home');
  // };
  $scope.pay = function() {
    // Creates a CC handler which could be reused.
    var amount = totalPrice;
    console.log(amount);
    var handler = StripeCheckout.configure({
      // my testing public publishable key
      key: 'pk_test_0NjfAqyuhKFGHUb79RkAog3P',
      locale: 'auto',
      // once the credit card is validated, this function will be called
      token: function(token) {
        // Make the request to the backend to actually make a charge
        // This is the token representing the validated credit card
        var tokenId = token.id;
        $http({
          url: 'http://localhost:8080/charge',
          method: 'POST',
          data: {
            amount: amount,
            token: tokenId
          }
        }).success(function(data) {
          console.log('Charge:', data);
          console.log(tokenId);
          function payOrder(tokenId) {
            postOrder.submit(tokenId);
            console.log('payment made');
            $location.path('/thanks');
          }
          payOrder(tokenId);
          alert('You were charged $' + (data.charge.amount / 100));
        });
      }
    });
    // open the handler - this will open a dialog
    // with a form with it to prompt for credit card
    // information from the user
    handler.open({
      name: 'Debugschool',
      description: '2 widgets',
      amount: amount
    });
  };
}); //end of options controller

//register user
app.controller('RegisterController', function($scope, postUser, $location) {
    $scope.submitUser = function() {
      var user = {
        username: $scope.username,
        password: $scope.password
      };
      postUser.saveUserInfo(user);
      $location.path("/home");
    };
});

// login user
app.controller('LoginController', function($scope, postLogin, $location, $cookies) {
  $scope.login = function() {
    var user = {
      username: $scope.loginName,
      password: $scope.loginPassword
    };
    postLogin.loginUser(user)
      .success(function(data, status) {
      $cookies.put('token', data.token);
      if(data.status === "ok") {
        $location.path('/home');
      } else {
        alert("invaild username or password");
      }
      console.log(data, status);
    });
  };
});

// get grind options
app.factory('grindOps', function($http) {
  return {
    getGrindOptions: function(callback) {
      $http({
        url: "http://localhost:8080/options"
      }).success(function(data) {
        callback(data);
      });
    }
  };
});

// post order to database
app.factory('postOrder', function($http, $cookies) {
  return {
    submit: function(tokenId) {
      var data = {
        token: $cookies.get('token'),
        order: order,
        stripeToken: tokenId
      };
      console.log('data from post order factory', data);
      $http.post('http://localhost:8080/orders', data)
        .success(function(data, status) {
          console.log('data: ', data);
          console.log('status code: ', status);
      });
    }
  };
});

// user signup
app.factory('postUser', function($http) {
  return {
    saveUserInfo: function(user) {
      $http.post('http://localhost:8080/signup', user)
      .success(function(data, status) {
        console.log('data', data);
        console.log('status code: ', status);
      });
    }
  };
});

app.factory('postLogin', function($http, $cookies) {
  return {
    loginUser: function(user) {
      return $http.post('http://localhost:8080/login', user);
      // .success(function(data, status) {
      //   $cookies.put('token', data.token);
      //   console.log(data, status);
      //
      // });
    }
  };
});
