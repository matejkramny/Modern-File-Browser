window.nginxManager
.controller('EditorController', ['$scope', '$http', function (s, $http) {
	s.files = [];
	s.selectedFile = {};

	s.selectFile = function (file) {
		s.selectedFile.active = false;

		s.selectedFile = file;
		s.selectedFile.active = true;
		s.selectedFile.dirty = false;

		$http.get(file.url).success(function (data) {
			s.editor.setValue(data.contents);
			s.editor.gotoLine(0);
			s.selectedFile.dirty = false;
		}).error(function (data) {
			s.status = data.message;
		});
	}

	s.saveFile = function (file) {
		if (!file.dirty) return;

		$http.put(file.url, {
			content: s.editor.getValue()
		}).success(function (data) {
			s.status = "File Saved.";
		}).error(function (data) {
			s.status = data.message;
		})
	}

	s.loadFiles = function () {
		$http.get('/files').success(function (data) {
			s.files = data.files;
			if (s.files.length > 0) {
				s.selectFile(s.files[0]);
			}
		}).error(function (data) {
			s.status = data.message;
		})
	}

	s.loadFiles();
}])
.directive('aceEditor', function () {
	return {
		scope: '@',
		restrict: 'E',
		link: function (scope, element, attrs) {
			scope.editor = ace.edit(attrs.id);
			scope.editor.setTheme('ace/theme/monokai');
			scope.editor.getSession().setMode("ace/mode/nix");

			scope.editor.on('change', function () {
				scope.selectedFile.dirty = true;
				if (!scope.$$phase) scope.$apply();
			});

			scope.editor.commands.addCommand({
				name: 'saveFile',
				bindKey: {
					win: 'Ctrl-S',
					mac: 'Command-S'
				},
				exec: function(editor) {
					scope.saveFile(scope.selectedFile);
				}
			});
		}
	}
})