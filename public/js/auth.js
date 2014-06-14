window.nginxManager
.controller('AuthController', ['$scope', '$http', '$window', function (s, $http, $window) {
	s.status = "";
	s.auth = {};

	s.login = function () {
		$http.post('/auth/password', s.auth).success(function () {
			$window.location = '/';
		}).error(function (data) {
			s.status = data.message;
		});
	}
}]);