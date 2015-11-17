'use strict';

/**
 * @ngdoc function
 * @name chatAngulatorApp.controller:JoinCtrl
 * @description
 * # JoinCtrl
 * Controller od chatAngulatorApp
 */
angular.module('chatAngulatorApp')
  .controller('JoinCtrl',['$scope','$rootScope', '$location', 'PubNub', function ($scope, $rootScope, $location, PubNub) {
    $scope.data = {
      username: 'Korisnik_' +Math.floor(Math.random()*1000)
    };

    $scope.join = function(){
      // poruka u konzoli, cisto radi provjere
      console.log('Pokretanje chata...');

      var _ref,_ref1;

      $rootScope.data || ($rootScope.data = {});
      $rootScope.data.username = (_ref = $scope.data) != null ? _ref.username : void 0;
      $rootScope.data.city = (_ref1 = $scope.data) != null ? _ref1.city : void 0;
      $rootScope.data.uuid = Math.floor(Math.random() * 1000000) + '__' + $scope.data.username;

      console.log($rootScope);

      // Ovo su moji privatni kljucevi sa pubnub.com
      // DEMO App moze raditi i sa 'demo' 'demo' kljucevima
      PubNub.init({
        subscribe_key: 'sub-c-be046fa0-8ab1-11e5-a2e7-0619f8945a4f',
        publish_key: 'pub-c-7ec92c36-3b8f-43c3-9057-ba6f076ee403',
        uuid: $rootScope.data.uuid
      });
      return $location.path('/main');
    }
  }]);
