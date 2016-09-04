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

  $(".fancybox").fancybox({
    padding: 0,

    openEffect : 'elastic',
    openSpeed  : 650,

    closeEffect : 'elastic',
    closeSpeed  : 550,
  });
});

angular
.module('catalogoApp', ['angularUtils.directives.dirPagination','jkuri.gallery'])
.config(function () {})
.controller('MainCtrl', ['$scope','$filter', 'productsFactory', function ($scope, $filter, productsFactory) {
  var self = this;

  $scope.categories = [
    {id: 1, name: 'minicampers' , subcategories : [] },
    {id: 2, name: 'accesorios' , subcategories : [] },
    {id: 3, name: 'nautica'    , subcategories : [] },
    {id: 4, name: 'trailers'   , subcategories : [] },
    {id: 5, name: 'casillas de tiro' , subcategories : [] }
  ];

  $scope.subCategories = [];

  /**
  *  Angular scope variable for filtering by category and subcategories.
  */
  $scope.categoryFilter = 'minicampers';
  $scope.subcategoryFilter = 'TODOS';

  function loadParameters() {
    // parameter for filtering mcchico, mediano o grande
    if(getParameterByName('mc')) {
      console.log('mc');
      switch (getParameterByName('mc')) {
        case 'mchico':
        $scope.changeSubCategory('minicampers','minicamper chico');
        break;
        case 'mmediano':
        $scope.changeSubCategory('minicampers','minicamper mediano');
        break;
        case 'mgrande':
        $scope.changeSubCategory('minicampers','minicamper grande');
        break;
        default:
      }
    }
    else {
      console.log('cat');

      if (getParameterByName('cat') && getParameterByName('cat') === 'casillas' ) {
        $scope.changeCategory('casillas de tiro');
      }
      else {
        $scope.changeCategory(getParameterByName('cat'));
      }
    }
  }

  function getCategoryByName(name) {
    return $filter('filter')($scope.categories, function(d) {return d.name === name;});
  }

  function formatSpecs(specs) {
    var a = specs.split(/@/);

    for(var i = 0; i < a.length; i++) {
      a[i].replace(/@/,'');
    }
    a.splice(0,1);
    return a;
  }

  function formatImages(product) {
    var images = [];

    if(product.imagen1) {
      images.push({
        thumb: 'img/catalogo/'+ product.imagen1 +'.jpg', img: 'img/catalogo/'+ product.imagen1 +'.jpg', description: ''
      });
    } else {
      images.push({
        thumb: 'img/catalogo/noimage.jpg', img: 'img/catalogo/noimage.jpg', description: ''
      });
    }
    if(product.imagen2) {
      images.push({
        thumb: 'img/catalogo/'+ product.imagen2 +'.jpg', img: 'img/catalogo/'+ product.imagen2 +'.jpg', description: ''
      });
    }
    if(product.imagen3) {
      images.push({
        thumb: 'img/catalogo/'+ product.imagen3 +'.jpg', img: 'img/catalogo/'+ product.imagen3 +'.jpg', description: ''
      });
    }
    if(product.imagen4) {
      images.push({
        thumb: 'img/catalogo/'+ product.imagen4 +'.jpg', img: 'img/catalogo/'+ product.imagen4 +'.jpg', description: ''
      });
    }
    if(product.imagen5) {
      images.push({
        thumb: 'img/catalogo/'+ product.imagen5 +'.jpg', img: 'img/catalogo/'+ product.imagen5 +'.jpg', description: ''
      });
    }
    if(product.imagen6) {
      images.push({
        thumb: 'img/catalogo/'+ product.imagen6 +'.jpg', img: 'img/catalogo/'+ product.imagen6+'.jpg', description: ''
      });
    }
    if(product.imagen7) {
      images.push({
        thumb: 'img/catalogo/'+ product.imagen7 +'.jpg', img: 'img/catalogo/'+ product.imagen7 +'.jpg', description: ''
      });
    }
    if(product.imagen8) {
      images.push({
        thumb: 'img/catalogo/'+ product.imagen8 +'.jpg', img: 'img/catalogo/'+ product.imagen8 +'.jpg', description: ''
      });
    }

    return images;
  }

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  /**
  * anonymous function - run then init the controller
  *
  * @return {type}  nothing ...
  */
  var onInit = function () {
    $scope.loadProducts();
    loadParameters();
  };

  $scope.getSubCategories = function () {

    function pushSubCategory(category, subcategory) {
      if(category.subcategories.indexOf(subcategory) === -1) {
        category.subcategories.push(subcategory);
      }
    }

    for(var i = 0; i < $scope.products.length; i++) {
      // console.log($scope.products[i].categoria);
      if(typeof $scope.products[i] === 'object' ) {
        switch($scope.products[i].categoria) {
          case 'minicampers':
          pushSubCategory($scope.categories[0], $scope.products[i].subcategoria);
          break;
          case 'accesorios':
          pushSubCategory($scope.categories[1], $scope.products[i].subcategoria);
          break;
          case 'nautica':
          pushSubCategory($scope.categories[2], $scope.products[i].subcategoria);
          break;
          case 'trailers':
          pushSubCategory($scope.categories[3], $scope.products[i].subcategoria);
          break;
          case 'casillas de tiro':
          pushSubCategory($scope.categories[4], $scope.products[i].subcategoria);
          break;
          default:
          console.log('ERROR: ' + $scope.products[i].categoria);
        }
        /* Convert categoria in array with the corresponding cagegoria plus 'todos' */
        $scope.products[i].subcategoria = ['TODOS', $scope.products[i].subcategoria];
      } else {
        console.log('Error loading product: ' + (i + 1));
      }
    }
  };

  $scope.changeCategory = function (category) {
    $scope.categoryFilter = category;
    $scope.subcategoryFilter = 'TODOS';
  };

  $scope.changeSubCategory = function (category, subcategory) {
    $scope.categoryFilter = category;
    console.log(subcategory);
    $scope.subcategoryFilter = subcategory;
  };

  $scope.showGalleryModal = function (product) {
    if(typeof product.tecnica !== 'object') {
      product.tecnica = formatSpecs(product.tecnica);
    }
    product.images = formatImages(product);
    $scope.productModal = product;
    $scope.galleryModalShow = true;
  };

  $scope.hideGalleryModal = function () {
    $scope.galleryModalShow = false;
  };

  $scope.showContactModal = function () {
    $scope.galleryModalShow = false;
    $scope.contactModalShow = true;
  };

  $scope.hideContactModal = function () {
    $scope.galleryModalShow = true;
    $scope.contactModalShow = false;
  };

  // GET data from CSV file
  $scope.loadProducts = function() {
    if(!$scope.inProgress){
      $scope.inProgress = true;

      productsFactory.getProducts().then(function(result) {
        $scope.products = result.data;
        $scope.inProgress = false;
        $scope.getSubCategories();
      }, function(error){
        console.log('error retrieving data ' + error);
        $scope.showError = true;
      });
    }
  };

  $scope.sendMail = function() {
    var data = {
      name_surname: $('#name_surname').val(),
      email: $('#email').val(),
      subject: 'Compra',
      message: 'DATOS DEL CLIENTE:  ' +
      'Nombre y apellido: ' +  $('#name_surname').val() + ' | ' +
      'Ciudad: ' +  $('#city').val() + ' | ' +
      'Motivo: ' +  $('#message').val()
    };

    if (data.name_surname && data.email && data.message && $('#city').val() && $('#message').val()) {
      $.ajax({
        type: "POST",
        url: "email.php",
        data: data,
        success: function(msg){
          $('.contact-success').fadeIn().delay(3000).fadeOut();
          $('#form-contact')[0].reset();
          $('.contact-success').focus();
        }
      });
    }
  }

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
})
.directive('loading',  ['$http' ,function ($http) {
  return {
    restrict: 'A',
    link: function (scope, elm, attrs)
    {
      scope.isLoading = function () {
        return $http.pendingRequests.length > 0;
      };

      scope.$watch(scope.isLoading, function (v)
      {
        if(v){
          elm.show();
        }else{
          elm.hide();
        }
      });
    }
  };

}])
.directive('imageModal', function() {
  return {
    restrict: 'E',
    scope : {
      product: '=',
      action: '&'
    },
    templateUrl: 'js/app/directives/gallerymodal/gallery-modal.html'
  };
})
.directive('contactModal', function() {
  return {
    restrict: 'E',
    scope : {
      mail: '&'
    },
    templateUrl: 'js/app/directives/contactmodal/contact-modal.html'
  };
});
