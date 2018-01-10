"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileSystemUtils = /** @class */ (function () {
    function FileSystemUtils(windows, normalize) {
        if (windows === void 0) { windows = false; }
        if (normalize === void 0) { normalize = null; }
        this.windows = windows;
        this.normalize = normalize;
        if (this.normalize == null) {
            this.normalize = this.defaultNormalization;
        }
    }
    FileSystemUtils.prototype.ensurePathFormat = function (path) {
        var chr = path.substring(path.length - 1);
        if (chr != '/') {
            path += '/';
        }
        return path;
    };
    FileSystemUtils.prototype.normalizePaths = function (paths, normalize) {
        return paths.map(function (path) {
            return normalize(path);
        });
    };
    FileSystemUtils.prototype.convertWindowsPaths = function (paths) {
        return paths.map(function (path) {
            return path.substring(2);
        });
    };
    //create directory structure
    FileSystemUtils.prototype.generateDirectory = function (array) {
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
    FileSystemUtils.prototype.mapRelativeNames = function (list, predicate, folder) {
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
    FileSystemUtils.prototype.getFileParts = function (file) {
        return file.split('/').filter(function (val) { return val != ""; });
    };
    //generate tree view
    FileSystemUtils.prototype.buildFolderStructure = function (list, dir) {
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
    FileSystemUtils.prototype.create_path = function (path, current_dir) {
        var parts = this.getFileParts(path);
        if (parts.length == 1) {
            if (!current_dir['_files_']) {
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
    FileSystemUtils.prototype.reduce_path = function (a, b) { return a + '/' + b; };
    ;
    FileSystemUtils.prototype.defaultNormalization = function (path) {
        console.warn('No path normalization method provided, this may cause issues on certain platforms.');
        return path;
    };
    return FileSystemUtils;
}());
exports.FileSystemUtils = FileSystemUtils;
//# sourceMappingURL=file-system-utils.js.map