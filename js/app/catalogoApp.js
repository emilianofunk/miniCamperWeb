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
            {id: 1, name: 'accesorios' , subcategories : ['TODOS'] },
            {id: 2, name: 'nautica'    , subcategories : ['TODOS'] },
            {id: 3, name: 'trailers'   , subcategories : ['TODOS'] }
        ];

        $scope.subCategories = [];

        /**
         *  Angular scope variable for filtering by category and subcategories.
         */
        $scope.categoryFilter = 'accesorios';
        $scope.subcategoryFilter = 'TODOS';

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

        function formatSpecs(specs) {
            var a = specs.split(/@/);
            console.log(a);

            for(var i = 0; i < a.length; i++) {
                a[i].replace(/@/,'');
            }
            return a;
        }

        $scope.getSubCategories = function () {

            function pushSubCategory(category, subcategory) {
                if(category.subcategories.indexOf(subcategory) === -1) {
                    category.subcategories.push(subcategory);
                }
            }

            for(var i = 0; i < $scope.products.length; i++) {
                switch($scope.products[i].categoria) {
                    case 'accesorios':
                        pushSubCategory($scope.categories[0], $scope.products[i].subcategoria);
                        break;
                    case 'nautica':
                        pushSubCategory($scope.categories[1], $scope.products[i].subcategoria);
                        break;
                    case 'trailers':
                        pushSubCategory($scope.categories[2], $scope.products[i].subcategoria);
                        break
                    default:
                        'ERROR'
                }
                /* Convert categoria in array with the corresponding cagegoria plus 'todos' */
                $scope.products[i].subcategoria = ['TODOS', $scope.products[i].subcategoria];
                console.log($scope.products[i]);
            }
        }

        $scope.changeCategory = function (category) {
            $scope.categoryFilter = category;
            $scope.subcategoryFilter = 'TODOS';
        }

        $scope.changeSubCategory = function (category, subcategory) {
            $scope.categoryFilter = category;
            $scope.subcategoryFilter = subcategory;
        }

        $scope.showGalleryModal = function (product) {
            if(typeof product.tecnica !== 'object') {
                product.tecnica = formatSpecs(product.tecnica);
            }
            $scope.productModal = product;
            $scope.galleryModalShow = true;
        };

        $scope.hideGalleryModal = function () {
            $scope.galleryModalShow = false;
        };

        // GET data from Olapic API
        $scope.loadProducts = function() {
            if(!$scope.inProgress){
                $scope.inProgress = true;

                productsFactory.getProducts().then(function(result) {
                    $scope.products = result.data;
                    //console.log(result);
                    $scope.inProgress = false;
                    $scope.getSubCategories();

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
    })
    .directive('loading',  ['$http' ,function ($http)
    {
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
                product: '='
            },
            templateUrl: 'js/app/directives/gallerymodal/gallery-modal.html'
        };
    });