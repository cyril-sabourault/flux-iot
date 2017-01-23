var app = angular.module('app', ['firebase']);

app.controller('Ctrl', ["$scope", "$firebase", function ($scope, $firebase) {
  $scope.alpha;
  $scope.data;
  $scope.map;

  var ref = new Firebase("https://flux-iot.firebaseio.com/");

  var sync = $firebase(ref).$asObject();
  sync.$bindTo($scope, "data");

/************/
/* WATCHERS */
/************/
  $scope.$watch('data.lux', function(lux) {
    updateAlpha(lux);
  })

  $scope.$watch('data.position', function(e) {
    if (e)
      updateMaps();
  });

/***********/
/* HELPERS */
/***********/
  function updateAlpha(lux) {
    $scope.alpha = calculAlpha(lux);
  }
  function calculAlpha(lux) {
    return (1 - (lux / 85000));
  }

  function updateMaps() {
    if (!$scope.map) {
      initMap();
    } else {
      var latLng = new google.maps.LatLng($scope.data.position.lat, $scope.data.position.lng);
      $scope.map.setOptions({center: latLng});
      $scope.marker.setOptions({position: latLng});
    }
  }
  function initMap() {
    $scope.map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng($scope.data.position.lat, $scope.data.position.lng),
      zoom: 15,
      scrollwheel: false,
      draggable: false
    });
    $scope.marker = new google.maps.Marker({
      position: new google.maps.LatLng($scope.data.position.lat, $scope.data.position.lng),
      map: $scope.map
    });
  }

}]);
