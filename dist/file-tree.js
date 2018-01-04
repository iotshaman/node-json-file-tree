"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("promise");
var FileTreeGenerator = /** @class */ (function () {
    function FileTreeGenerator(config, fs) {
        this.config = config;
        this.fs = fs;
    }
    FileTreeGenerator.prototype.getTreeData = function (start) {
        var _this = this;
        var folders;
        var files;
        var promises = [];
        var path_predicate = this.ensurePathFormat(start);
        var start_path = this.ensurePathFormat(start);
        if (this.config.windows) {
            path_predicate = this.config.normalize(path_predicate.substring(2));
        }
        promises.push(this.getAllDirectories(start_path)
            .then(function (rslt) { return _this.mapRelativeNames(rslt, path_predicate, true); })
            .then(function (rslt) { folders = rslt; return; })
            .catch(function (err) { return Promise.reject(err); }));
        promises.push(this.getAllFiles(start_path)
            .then(function (rslt) { return _this.mapRelativeNames(rslt, path_predicate); })
            .then(function (rslt) { files = rslt; return; })
            .catch(function (err) { return Promise.reject(err); }));
        return Promise.all(promises).then(function () {
            var dir = _this.generateDirectory(folders);
            return _this.buildFolderStructure(files, dir);
        });
    };
    FileTreeGenerator.prototype.ensurePathFormat = function (path) {
        var chr = path.substring(path.length - 1);
        if (chr != '/') {
            path += '/';
        }
        return path;
    };
    FileTreeGenerator.prototype.getAllDirectories = function (start) {
        var _this = this;
        return new Promise(function (res, error) {
            _this.fs.subdirs(start, function (err, subdirs) {
                if (err)
                    return error(err);
                Promise.resolve(subdirs)
                    .then(function (rslt) {
                    if (!_this.config.normalize)
                        return rslt;
                    return _this.normalizePaths(rslt, _this.config.normalize);
                }).then(function (rslt) {
                    if (!_this.config.windows)
                        return rslt;
                    return _this.convertWindowsPaths(rslt);
                }).then(function (rslt) {
                    return res(rslt);
                });
            });
        });
    };
    FileTreeGenerator.prototype.getAllFiles = function (start) {
        var _this = this;
        return new Promise(function (res, error) {
            _this.fs.files(start, function (err, files) {
                if (err)
                    error(err);
                Promise.resolve(files)
                    .then(function (rslt) {
                    if (!_this.config.normalize)
                        return rslt;
                    return _this.normalizePaths(rslt, _this.config.normalize);
                }).then(function (rslt) {
                    if (!_this.config.windows)
                        return rslt;
                    return _this.convertWindowsPaths(rslt);
                }).then(function (rslt) {
                    return res(rslt);
                });
            });
        });
    };
    FileTreeGenerator.prototype.normalizePaths = function (paths, normalize) {
        return paths.map(function (path) {
            return normalize(path);
        });
    };
    FileTreeGenerator.prototype.convertWindowsPaths = function (paths) {
        return paths.map(function (path) {
            return path.substring(2);
        });
    };
    //create directory structure
    FileTreeGenerator.prototype.generateDirectory = function (array) {
        var dir = {}, current, tmp;
        for (var i = 0; i < array.length; i++) {
            current = dir;
            tmp = array[i].split('/').slice(1).filter(function (val) { return val != ""; });
            for (var j = 0; j < tmp.length; j++) {
                if (current[tmp[j]] == null) {
                    current[tmp[j]] = { '_files_': [] };
                }
                current = current[tmp[j]];
            }
        }
        return dir;
    };
    //removes predicate string from each item in list
    FileTreeGenerator.prototype.mapRelativeNames = function (list, predicate, folder) {
        var _this = this;
        if (folder === void 0) { folder = false; }
        var tmp = this.getFileParts(predicate).pop();
        return list.map(function (item) {
            if (folder)
                item = _this.ensurePathFormat(item);
            return tmp + '/' + item.replace(predicate, '');
        });
    };
    //returns an array representing a files path
    FileTreeGenerator.prototype.getFileParts = function (file) {
        return file.split('/').filter(function (val) { return val != ""; });
    };
    //generate tree view
    FileTreeGenerator.prototype.buildFolderStructure = function (list, dir) {
        for (var i = 0; i < list.length; i++) {
            //remove first part of path (this is the current_dir)
            var parts = this.getFileParts(list[i]);
            parts.shift();
            //call recursive algorthm to add path object to tree
            this.create_path(parts.reduce(this.reduce_path, ''), dir);
        }
        return dir;
    };
    //recursive algorithm to buld folder structures
    FileTreeGenerator.prototype.create_path = function (path, current_dir) {
        var parts = this.getFileParts(path);
        if (parts.length == 1) {
            if (current_dir['_files_'] == null) {
                current_dir['_files_'] = [];
            }
            current_dir['_files_'].push(parts[0]);
        }
        else {
            var next = parts[0];
            parts.shift();
            var new_path = parts.reduce(this.reduce_path, '');
            this.create_path(new_path, current_dir[next]);
        }
    };
    //turns an array of folder parts into path
    FileTreeGenerator.prototype.reduce_path = function (a, b) { return a + '/' + b; };
    ;
    return FileTreeGenerator;
}());
exports.FileTreeGenerator = FileTreeGenerator;
//# sourceMappingURL=file-tree.js.map