'use strict';

$(function(){
  jQuery("#navigation").css("background-color","#16a7d0");
  jQuery("#navigation").addClass("animated-nav");

  $('.panel-heading a').click(function() {
    $('.panel-heading').removeClass('actives');
    $(this).parents('.panel-heading').addClass('actives');

    $('.panel-title').removeClass('actives'); //just to make a visual sense
    $(this).parent().addClass('actives'); //just to make a visual sense

    alert($(this).parents('.panel-heading').attr('class'));
  });

});

angular
.module('catalogoApp', ['angularUtils.directives.dirPagination'])
.config(function () {})
.controller('MainCtrl', ['$scope','$filter', 'productsFactory', function ($scope, $filter, productsFactory) {

  $scope.categories = [
    {id: 1, name: 'accesorios' , subcategories : [] },
    {id: 2, name: 'nautica'    , subcategories : [] },
    {id: 3, name: 'trailers'   , subcategories : [] }
  ];

  /**
   *  Angular scope variable for filtering by category.
   */
  $scope.categoryFilter = '';


  /**
   * anonymous function - run then init the controller
   *
   * @return {type}  nothing ...
   */
  var onInit = function () {
    $scope.loadProducts();
  };


  function getCategoryByName(name) {
    return $filter('filter')($scope.categories, function(d) {return d.name === name;});
  }

  $scope.changeCategory = function (name) {
    $scope.categoryFilter = name;
    //$scope.products = $filter('filter')($scope.products, function(d) {return d.categoria === name;});
  }

  /*
  $scope.subcategories = function () {
    for(var i = 0; i < $scope.products; i++) {
    }
  }

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
        //console.log(result);
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
  var url = 'http://outworktime.com/updateproducts.php';

  return {
    getProducts: function () {
      return $http.get(url);
    }
  };

}])
.directive('checkImage', function($http) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      attrs.$observe('ngSrc', function(ngSrc) {
        $http.get(ngSrc).success(function(){
        }).error(function(){
          element.attr('src', 'img/catalogo/noimage.jpg'); // set default image
        });
      });
    }
  };
});
