window.nginxManager
.controller('EditorController', ['$scope', '$http', function (s, $http) {
	s.files = [];
	s.selectedFile = {};

	s.selectFile = function (file) {
		if (file.isFolder) {
			// Load directory
			var chars = s.pwd.split('');
			if (chars[chars.length-1] == '/') {
				return s.loadFiles(s.pwd + file.name);
			} else {
				return s.loadFiles(s.pwd + '/' + file.name);
			}
		}

		s.selectedFile.active = false;

		s.selectedFile = file;
		s.selectedFile.active = true;
		s.selectedFile.dirty = false;

		$http.get(file.url).success(function (data) {
			s.editor.setValue(data.contents);
			s.editor.gotoLine(0);
			
			var modelist = ace.require('ace/ext/modelist');
			var mode = modelist.getModeForPath(file.name).mode;
			
			s.editor.getSession().setMode(mode);
			s.selectedFile.dirty = false;

			s.status = "";
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
			file.dirty = false;
		}).error(function (data) {
			s.status = data.message;
		})
	}

	s.loadFiles = function (folder) {
		if (folder == '~') folder = "";

		$http.get('/files'+folder).success(function (data) {
			s.pwd = data.pwd;
			s.pwdOriginal = data.pwd;
			s.files = data.files;
			s.status = "";
		}).error(function (data) {
			s.status = data.message;
		})
	}

	s.loadFiles('');
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