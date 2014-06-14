window.nginxManager
.controller('UsersController', ['$scope', '$http', function (s, $http) {
	s.status = "";
	s.user = {};
	s.users = [];

	s.selectUser = function (user) {
		s.user = user;
	}

	s.getUsers = function () {
		$http.get('/admin/users').success(function (data) {
			s.users = data.users;
		}).error(function (data) {
			s.status = data.message;
		});
	}

	s.createUser = function () {
		s.user = {};
	}

	s.saveUser = function (user) {
		var promise;

		if (user._id) {
			promise = $http.put('/admin/users/'+s.user._id, s.user);
		} else {
			promise = $http.post('/admin/users', s.user);
		}

		promise.success(function (data) {
			s.status = "User Saved";
		}).error(function (data) {
			s.status = data.message;
		})
	}

	s.getUsers();
}]);