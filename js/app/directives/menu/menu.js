'use strict';

/**
* @ngdoc function
* @name efantAngularJsappApp.directive:imageModal
* @description
* # imageModal
* Directive for rendering the popup modal for each photo.
*/

angular.module('catalogoApp')
.directive('menuAccordion', function() {
  return {
    restrict: 'E',
    templateUrl: 'js/app/directives/menu/menu.html'
  };
});
