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
                            break
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
                    console.log('error retrieving data');
                    $scope.showError = true;
                });
            }
        };

        $scope.sendMail = function() {
            var data = {
                name_surname: $('#name_surname').val(),
                email: $('#email').val(),
                subject: 'Compra',
                message: 'DATOS DEL CLIENTE: /n' +
                    'Nombre y apellido: ' +  $('#name_surname').val() + '/n' +
                    'Teléfono: ' +  $('#phone').val() + '/n' +
                    'Ciudad: ' +  $('#city').val() + '/n' +
                    'Motivo: ' +  $('#message').val()
            };

            if (data.name_surname && data.email && data.message &&
                $('#phone').val() && $('#city').val() && $('#message').val()) {
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