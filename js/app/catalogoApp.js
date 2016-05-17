'use strict';

$(function(){
  jQuery("#navigation").css("background-color","#16a7d0");
  jQuery("#navigation").addClass("animated-nav");
});

angular
  .module('catalogoApp', [])
  .config(function () {

  })
  .controller('MainCtrl', ['$scope', 'productsFactory', function ($scope, productsFactory) {

    $scope.categories = [{name: 'Accesorios', subcategories : []}, {name:'Náutica', subcategories : []}, {name:'Trailers', subcategories : []} ];
    /*
    $scope.showError = false;
    $scope.inProgress = false;
    $scope.showOlapicModal = false;
    */
    var onInit = function () {
      $scope.loadProducts();
    };
    /*
    $scope.toggleShowOlapicModal = function (media) {
      $scope.mediaModal = media;
      $scope.showOlapicModal = true;
    };

    $scope.toggleHideOlapicModal = function () {
      $scope.showOlapicModal = false;
    };
    */

    // GET data from Olapic API
    $scope.loadProducts = function() {
      if(!$scope.inProgress){
        $scope.inProgress = true;

        productsFactory.getProducts().then(function(result) {
          $scope.products = result.data;
          console.log(result);
          $scope.inProgress = false;
        }, function(error){
          console.log('error');
          $scope.showError = true;
        });
      }
    };

    onInit();

  }])
  .factory('productsFactory', ['$http', function ($http) {
    //var url = 'http://outworktime.com/catalogo.csv';
    var url = 'http://outworktime.com/updateproducts.php';

    return {
      getProducts: function () {
        return $http.get(url);
      }
    };

  }]);
