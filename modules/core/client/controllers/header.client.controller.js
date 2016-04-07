'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', '$mdSidenav',
  function ($scope, $state, Authentication, Menus, $mdSidenav) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    var isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
            if (isCollapsed) {
                    $mdSidenav('menu').close();
            } else {
                    $mdSidenav('menu').open();
            }
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);
