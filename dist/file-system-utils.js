"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileSystemUtils = /** @class */ (function () {
    function FileSystemUtils(normalize) {
        if (normalize === void 0) { normalize = null; }
        var _this = this;
        this.normalize = normalize;
        this.defaultNormalization = function (path) {
            if (path && path.length > 0 && path.charAt(1) == ':') {
                path = _this.convertSingleWindowsPath(path);
            }
            path = path.replace(/\\/g, '/');
            return path;
        };
        if (this.normalize == null) {
            this.normalize = this.defaultNormalization;
        }
    }
    FileSystemUtils.prototype.addTrailingSlash = function (path) {
        var chr = path.substring(path.length - 1);
        if (chr != '/') {
            path += '/';
        }
        return path;
    };
    FileSystemUtils.prototype.normalizePaths = function (paths) {
        var _this = this;
        return paths.map(function (path) {
            return _this.normalize(path);
        });
    };
    FileSystemUtils.prototype.convertWindowsPaths = function (paths) {
        return paths.map(this.convertSingleWindowsPath);
    };
    FileSystemUtils.prototype.convertSingleWindowsPath = function (path) {
        return path.substring(2);
    };
    FileSystemUtils.prototype.getFileNameFromPath = function (path) {
        var parts = this.getFileParts(path);
        return parts[parts.length - 1];
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
                item = _this.addTrailingSlash(item);
            return tmp + '/' + item.replace(predicate, '');
        });
    };
    //returns an array representing a files path
    FileSystemUtils.prototype.getFileParts = function (file) {
        return file.split('/').filter(function (val) { return val != ""; });
    };
    //generate tree view
    FileSystemUtils.prototype.generateNodeTree = function (list, dir) {
        for (var i = 0; i < list.length; i++) {
            var parts = this.getFileParts(list[i]);
            //if first char is a slash then there is no current dir
            if (list[i].charAt(0) != '/') {
                //remove first part of path (this is the current_dir)
                parts.shift();
            }
            //call recursive algorthm to add path object to tree
            this.createTreeNode(this.buildPath(parts), dir);
        }
        return dir;
    };
    //recursive algorithm to buld folder structures
    FileSystemUtils.prototype.createTreeNode = function (path, current_dir) {
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
            if (current_dir[next] == null) {
                throw new Error("Directory not found: ..." + next);
            }
            this.createTreeNode(this.buildPath(parts), current_dir[next]);
        }
    };
    FileSystemUtils.prototype.buildPath = function (parts) {
        return parts.reduce(this.reducePath, '');
    };
    //turns an array of folder parts into path
    FileSystemUtils.prototype.reducePath = function (a, b) { return a + '/' + b; };
    ;
    return FileSystemUtils;
}());
exports.FileSystemUtils = FileSystemUtils;
//# sourceMappingURL=file-system-utils.js.map