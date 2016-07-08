var app = angular.module('app', ['ngRoute']);
var order = {
  options: {},
  address: {}
};


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
    templateUrl: 'thanks.html'
  })

  .when('/login', {
    templateUrl: 'login.html'
  })

  .when('/register', {
    templateUrl: 'register.html',
    controller: 'RegisterController'
  })

  .otherwise({
    redirectTo: '/home'
  });
});

app.controller('MainController', function($scope) {

});

//options delivery and payment controller
app.controller('OptionsController', function($scope, grindOps, $location, postOrder) {
  $scope.order = order;
  $scope.makeOrder = function(qty) {
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
      fullName: $scope.fullName,
      address1: $scope.address1,
      address2: $scope.address2,
      city: $scope.city,
      state: $scope.state,
      zipCode: $scope.zipCode,
      deliveryDate: $scope.deliveryDate
    };
    $location.path("/payment");
  };
  $scope.payOrder = function() {
    postOrder.submit(order);
    console.log('payment made');
    $location.path('/thanks');
  };
});

app.controller('RegisterController', function($scope, postUser) {
    $scope.submitUser = function() {
      var user = {
        username: $scope.username,
        password: $scope.password
      };
      postUser.saveUserInfo(user);
      // console.log($scope.user);
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
app.factory('postOrder', function($http) {
  return {
    submit: function(order) {
      $http.post('http://localhost:8080/orders', order)
        .success(function(data, status) {
          console.log('data: ', data);
          console.log('status code: ', status);
      });
    }
  };
});

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
