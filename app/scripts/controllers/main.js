'use strict';

/**
 * @ngdoc function
 * @name chatAngulatorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller od chatAngulatorApp
 */
angular.module('chatAngulatorApp')
  .controller('MainCtrl', ['$scope', '$rootScope', '$location',
    'PubNub',
    function($scope, $rootScope, $location, PubNub) {

      var _ref;
      if (!PubNub.initialized()) {
        $location.path('/join');
      }

      $scope.controlChannel = '__controlchannel';

      $scope.channels = [];

      $scope.publish = function() {
        if (!$scope.selectedChannel) {
          return;
        }
        PubNub.ngPublish({
          channel: $scope.selectedChannel,
          message: {
            text: $scope.newMessage,
            user: $scope.data.username
          }
        });
        return $scope.newMessage = "";
      }

      // Kreiranje chat kanala
      $scope.createChannel = function() {

        var channel;
        // Pratim rezultat kroz konzolu
        console.log("Chat kanal je uspjesno kreiran");
        channel = $scope.newChannel;

        $scope.newChannel = '';

        PubNub.ngGrant({
          channel: channel,
          read: true,
          write: true,
          callback: function() {
            return console.log(channel + 'All Set', arguments);
          }
        });

        PubNub.ngGrant({
          channel: channel + '-pnpres',
          read: true,
          write: false,
          callback: function() {
            return console.log(channel + 'Presence All Set', arguments);
          }
        });

        PubNub.ngPublish({
          channel: $scope.controlChannel,
          message: channel
        });

        return setTimeout(function() {
          $scope.subscribe(channel);
          return $scope.showCreate = false;
        }, 100);
      }

      $scope.subscribe = function(channel) {
        var _ref;
        console.log('Pokretanje f-je subscribe...');
        if (channel === $scope.selectedChannel) {
          return;
        }
        if ($scope.selectedChannel) {
          PubNub.ngUnsubscribe({
            channel: $scope.selectedChannel
          });
        }

        $scope.selectedChannel = channel;
        $scope.messages = ["Dobrodosli na " + channel];
        //
        PubNub.ngSubscribe({
          channel: $scope.selectedChannel,
          state: {
            "city": ((_ref = $rootScope.data) !== null ? _ref.city : void 0) || 'unknown'
          },
          error: function() {
            return console.log(arguments);
          }
        });

        $rootScope.$on(PubNub.ngPrsEv($scope.selectedChannel), function(ngEvent, payload) {
          return $scope.$apply(function() {
            var newData, userData;
            userData = PubNub.ngPresenceData($scope.selectedChannel);
            newData = {};
            $scope.users = PubNub.map(PubNub.ngListPresence($scope.selectedChannel), function(x) {
              var newX;
              newX = x;
              if (x.replace) {
                newX = x.replace(/\w+__/, "");
              }
              if (x.uuid) {
                newX = x.uuid.replace(/\w+__/, "");
              }
              newData[newX] = userData[x] || {};
              return newX;
            });
            return $scope.userData = newData;
          });
        });

        PubNub.ngHereNow({
          channel: $scope.selectedChanel
        });

        $rootScope.$on(PubNub.ngMsgEv($scope.selectedChannel), function(ngEvent, payload) {
          var msg;
          msg = payload.message.user ? "[" + payload.message.user + "] " + payload.message.text : 0;
          return $scope.$apply(function() {
            return $scope.messages.unshift(msg);
          });
        });
        //
        return PubNub.ngHistory({
          channel: $scope.selectedChannel,
          auth_key: $scope.authKey,
          count: 500
        });
      }

      PubNub.ngSubscribe({
        channel: $scope.controlChannel
      });

      $rootScope.$on(PubNub.ngMsgEv($scope.controlChannel), function(ngEvent, playload) {
        return $scope.$apply(function() {
          if ($scope.channels.indexOf(playload.message) < 0) {
            return $scope.channels.push(playload.message);
          }
        });
      });

      PubNub.ngHistory({
        channel: $scope.controlChannel,
        count: 500
      });

      $scope.newChannel = "ChatSobu";
      return $scope.createChannel();

    }
  ]);
