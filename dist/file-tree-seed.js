"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_system_utils_1 = require("./file-system-utils");
var file_tree_1 = require("./file-tree");
var Promise = require("promise");
var FileTreeSeed = /** @class */ (function () {
    function FileTreeSeed(config, fs) {
        var _this = this;
        this.config = config;
        this.fs = fs;
        this.normalizePaths = function (array) {
            return Promise.resolve(array)
                .then(function (rslt) {
                if (!_this.config.normalize)
                    return rslt;
                return _this.utils.normalizePaths(rslt);
            }).then(function (rslt) {
                if (!_this.config.windows)
                    return rslt;
                return _this.utils.convertWindowsPaths(rslt);
            });
        };
        this.utils = new file_system_utils_1.FileSystemUtils(config.normalize);
    }
    FileTreeSeed.prototype.getFileTree = function (start) {
        var _this = this;
        var folders;
        var files;
        var promises = [];
        var path_predicate = this.utils.addTrailingSlash(start);
        var start_path = this.utils.addTrailingSlash(start);
        if (this.config.windows) {
            if (this.config.normalize) {
                path_predicate = this.config.normalize(path_predicate.substring(2));
            }
            else {
                path_predicate = this.utils.defaultNormalization(path_predicate.substring(2));
            }
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
            return new file_tree_1.FileTree(files, folders);
        });
    };
    FileTreeSeed.prototype.getAllDirectories = function (start) {
        var _this = this;
        return new Promise(function (res, error) {
            _this.fs.subdirs(start, function (err, subdirs) {
                if (err)
                    return error(err);
                _this.normalizePaths(subdirs).then(res);
            });
        });
    };
    FileTreeSeed.prototype.getAllFiles = function (start) {
        var _this = this;
        return new Promise(function (res, error) {
            _this.fs.files(start, function (err, files) {
                if (err)
                    error(err);
                _this.normalizePaths(files).then(res);
            });
        });
    };
    return FileTreeSeed;
}());
exports.FileTreeSeed = FileTreeSeed;
//# sourceMappingURL=file-tree-seed.js.map