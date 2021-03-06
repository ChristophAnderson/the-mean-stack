angular.module('search.controller', [])

// create directive and call it 'showPreview'
.directive('showPreview', function() {
	return {
		// E: element, A: attribute
		restrict: 'EA',
		// element: <show-preview show="shows.main"/>
		// attribute: <div show-preview shows="shows.main"></div>
		
		scope: {
			// you can call 'show' anything
			show: '='
		},
		// where the template is located
		templateUrl: '../views/show.preview.html'
	};
})
// parameters in function used to inject dependencies
.controller('SearchController', function ($scope, SearchService, $location) {
	// $scope.hello = 'Hello World';
	$scope.search = function() {
		
		// we use .query because we are expecting an array back (.get only gets an object)
		SearchService.query({name: $scope.name}, function(response) {
			
			$scope.shows = response;
			
		});
	};
	
	$scope.getShow = function(showId) {
		console.log("Called getShow()");
		// redirect
		$location.path('show/' + showId);
		
	};
	
});