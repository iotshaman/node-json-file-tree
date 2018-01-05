"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_system_utils_1 = require("./file-system-utils");
var Promise = require("promise");
var FileTreeFactory = /** @class */ (function () {
    function FileTreeFactory(config, fs) {
        var _this = this;
        this.config = config;
        this.fs = fs;
        this.normalizePaths = function (array) {
            return Promise.resolve(array)
                .then(function (rslt) {
                if (!_this.config.normalize)
                    return rslt;
                return _this.utils.normalizePaths(rslt, _this.config.normalize);
            }).then(function (rslt) {
                if (!_this.config.windows)
                    return rslt;
                return _this.utils.convertWindowsPaths(rslt);
            });
        };
        this.utils = new file_system_utils_1.FileSystemUtils(config.windows, config.normalize);
    }
    FileTreeFactory.prototype.getFileTree = function (start) {
        var _this = this;
        var folders;
        var files;
        var promises = [];
        var path_predicate = this.utils.ensurePathFormat(start);
        var start_path = this.utils.ensurePathFormat(start);
        if (this.config.windows) {
            path_predicate = this.config.normalize(path_predicate.substring(2));
        }
        promises.push(this.getAllDirectories(start_path)
            .then(function (rslt) { return _this.utils.mapRelativeNames(rslt, path_predicate, true); })
            .then(function (rslt) { folders = rslt; return; })
            .catch(function (err) { return Promise.reject(err); }));
        promises.push(this.getAllFiles(start_path)
            .then(function (rslt) { return _this.utils.mapRelativeNames(rslt, path_predicate); })
            .then(function (rslt) { files = rslt; return; })
            .catch(function (err) { return Promise.reject(err); }));
        return Promise.all(promises).then(function () {
            var dir = _this.utils.generateDirectory(folders);
            return _this.utils.buildFolderStructure(files, dir);
        });
    };
    FileTreeFactory.prototype.getAllDirectories = function (start) {
        var _this = this;
        return new Promise(function (res, error) {
            _this.fs.subdirs(start, function (err, subdirs) {
                if (err)
                    return error(err);
                _this.normalizePaths(subdirs).then(res);
            });
        });
    };
    FileTreeFactory.prototype.getAllFiles = function (start) {
        var _this = this;
        return new Promise(function (res, error) {
            _this.fs.files(start, function (err, files) {
                if (err)
                    error(err);
                _this.normalizePaths(files).then(res);
            });
        });
    };
    return FileTreeFactory;
}());
exports.FileTreeFactory = FileTreeFactory;
//# sourceMappingURL=file-tree.js.map