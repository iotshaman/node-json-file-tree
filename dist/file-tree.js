"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_system_utils_1 = require("./file-system-utils");
var FileTree = /** @class */ (function () {
    function FileTree(files, folders, nodes, normalize) {
        if (nodes === void 0) { nodes = null; }
        if (normalize === void 0) { normalize = null; }
        var _this = this;
        this.initializeNodes = function () {
            var dir = _this.utils.generateDirectory(_this.folders);
            _this.nodes = _this.utils.generateNodeTree(_this.files, dir);
        };
        this.addFiles = function (files) {
            for (var i = files.length - 1; i >= 0; i--) {
                if (_this.files.indexOf(files[i]) != -1) {
                    //file already exists
                    files.pop();
                }
            }
            _this.files = _this.files.concat(files);
            _this.nodes = _this.utils.generateNodeTree(files, _this.nodes);
        };
        this.addFolder = function (path, folderName, seed) {
            if (seed === void 0) { seed = null; }
            var dir = _this.getDirectoryFromPath(path);
            if (dir[folderName]) {
                throw new Error('Folder already exists');
            }
            if (!seed) {
                dir[folderName] = { '_files_': [] };
            }
            else {
                dir[folderName] = seed;
            }
        };
        this.renameFile = function (path, oldName, newName) {
            var dir = _this.getDirectoryFromPath(path);
            var index = dir['_files_'].indexOf(oldName);
            if (index == -1) {
                throw new Error('File does not exist');
            }
            dir['_files_'][index] = newName;
        };
        this.renameFolder = function (path, oldName, newName) {
            var dir = _this.getDirectoryFromPath(path);
            if (!dir[oldName]) {
                throw new Error('Folder does not exists');
            }
            var clone = _this.cloneNode(dir[oldName]);
            delete dir[oldName];
            dir[newName] = clone;
        };
        this.copyFolder = function (fromPath, toPath, folderName) {
            var fromDir = _this.getDirectoryFromPath(fromPath);
            var toDir = _this.getDirectoryFromPath(toPath);
            if (!fromDir[folderName]) {
                throw new Error('Folder does not exists');
            }
            var clone = _this.cloneNode(fromDir[folderName]);
            toDir[folderName] = clone;
        };
        this.deleteFiles = function (folder, files) {
            for (var i = files.length - 1; i >= 0; i--) {
                var fi = _this.files.indexOf(files[i]);
                if (fi == -1) {
                    //file doesn't exists
                    files.pop();
                }
                else {
                    _this.files.splice(fi, 1);
                }
            }
            var dir = _this.getDirectoryFromPath(folder);
            var sys_files = dir['_files_'];
            for (var i = 0; i < files.length; i++) {
                var fname = _this.utils.getFileNameFromPath(files[i]);
                var index = sys_files.indexOf(fname);
                sys_files.splice(index, 1);
            }
        };
        this.deleteFolder = function (folder) {
            _this.findAndDeleteFolder(folder);
        };
        this.findAndDeleteFolder = function (path, prev) {
            if (prev === void 0) { prev = null; }
            if (prev == null) {
                prev = _this.nodes;
            }
            var parts = _this.utils.getFileParts(path);
            if (parts.length == 1) {
                delete prev[parts[0]];
            }
            else {
                var next_dir = parts[0];
                if (prev[next_dir] == null) {
                    throw new Error("Directory not found: ..." + next_dir);
                }
                parts.shift();
                var next_path = _this.utils.buildPath(parts);
                _this.findAndDeleteFolder(next_path, prev[next_dir]);
            }
        };
        this.getDirectoryFromPath = function (path, isFilePath, prev) {
            if (isFilePath === void 0) { isFilePath = false; }
            if (prev === void 0) { prev = null; }
            if (path == '/') {
                return _this.nodes;
            }
            if (prev == null) {
                prev = _this.nodes;
            }
            var parts = _this.utils.getFileParts(path);
            if (parts.length == 1) {
                if (isFilePath) {
                    return prev;
                }
                else if (prev[parts[0]] == null) {
                    throw new Error("Directory not found: ..." + parts[0]);
                }
                else {
                    return prev[parts[0]];
                }
            }
            else {
                var next_dir = parts[0];
                if (prev[next_dir] == null) {
                    throw new Error("Directory not found: ..." + next_dir);
                }
                parts.shift();
                var next_path = _this.utils.buildPath(parts);
                return _this.getDirectoryFromPath(next_path, isFilePath, prev[next_dir]);
            }
        };
        this.cloneNodeByPath = function (path) {
            var node = _this.getDirectoryFromPath(path);
            return _this.cloneNode(node);
        };
        this.cloneNode = function (node) {
            return JSON.parse(JSON.stringify(node));
        };
        this.files = files;
        this.folders = folders;
        this.utils = new file_system_utils_1.FileSystemUtils(normalize);
        if (nodes != null) {
            this.nodes = nodes;
        }
        else {
            this.initializeNodes();
        }
    }
    return FileTree;
}());
exports.FileTree = FileTree;
//# sourceMappingURL=file-tree.js.map