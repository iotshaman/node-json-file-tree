"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_system_utils_1 = require("./file-system-utils");
var Promise = require("promise");
var FileTree = /** @class */ (function () {
    function FileTree(files, folders, nodes) {
        this.files = files;
        this.folders = folders;
        this.nodes = nodes;
    }
    return FileTree;
}());
exports.FileTree = FileTree;
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
                return _this.utils.normalizePaths(rslt, _this.config.normalize);
            }).then(function (rslt) {
                if (!_this.config.windows)
                    return rslt;
                return _this.utils.convertWindowsPaths(rslt);
            });
        };
        this.utils = new file_system_utils_1.FileSystemUtils(config.windows, config.normalize);
    }
    FileTreeSeed.prototype.getFileTree = function (start) {
        var _this = this;
        var folders;
        var files;
        var promises = [];
        var path_predicate = this.utils.ensurePathFormat(start);
        var start_path = this.utils.ensurePathFormat(start);
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
            var dir = _this.utils.generateDirectory(folders);
            var obj = _this.utils.buildFolderStructure(files, dir);
            return new FileTree(files, folders, obj);
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
//# sourceMappingURL=file-tree.js.map