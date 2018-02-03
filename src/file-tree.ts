import { FileSystemUtils } from './file-system-utils';
import * as Promise from 'promise';

export class FileTree {

    files: Array<string>;
    folders: Array<string>;
    nodes: any;
    private utils: FileSystemUtils;

    constructor(files: Array<string>, folders: Array<string>, 
        nodes: any = null, normalize: (path: string) => string = null) {
        this.files = files;
        this.folders = folders;
        this.utils = new FileSystemUtils(normalize);
        if (nodes != null) {
            this.nodes = nodes;
        } else {
            this.initializeNodes();
        }
    }
	
	private initializeNodes = () => {
		var dir = this.utils.generateDirectory(this.folders);
        this.nodes = this.utils.generateNodeTree(this.files, dir);
    }

    public addFiles = (files: Array<string>) => {
        for (var i = files.length - 1; i >= 0; i--) {
            if (this.files.indexOf(files[i]) != -1) {
                //file already exists
                files.pop();
            }
        }
        this.files = this.files.concat(files);
        this.nodes = this.utils.generateNodeTree(files, this.nodes);
    }

    public addFolder = (path: string, folderName: string) => {
        var dir = this.getDirectoryFromPath(path);
        if (dir[folderName]) {
            throw new Error('Folder already exists');
        }
        dir[folderName] = { '_files_': [] };
    }

    public renameFile = (path: string, oldName: string, newName: string) => {
        var dir = this.getDirectoryFromPath(path);
        var index = dir['_files_'].indexOf(oldName);
        if (index == -1) { throw new Error('File does not exist'); }
        dir['_files_'][index] = newName;
    }

    public renameFolder = (path: string, oldName: string, newName: string) => {
        var dir = this.getDirectoryFromPath(path);
        if (!dir[oldName]) {
            throw new Error('Folder does not exists');
        }
        var clone = this.cloneNode(dir[oldName]);
        delete dir[oldName];
        dir[newName] = clone;
    }

    public deleteFiles = (folder: string, files: Array<string>) => {
        for (var i = files.length - 1; i >= 0; i--) {
            var fi = this.files.indexOf(files[i]);
            if (fi == -1) {
                //file doesn't exists
                files.pop();
            } else {
                this.files.splice(fi, 1);
            }
        }
        var dir = this.getDirectoryFromPath(folder);
        var sys_files: Array<string> = dir['_files_'];
        for (var i = 0; i < files.length; i++) {
            var fname = this.utils.getFileNameFromPath(files[i]);
            var index = sys_files.indexOf(fname);
            sys_files.splice(index, 1);
        }
    }

    public deleteFolder = (folder: string) => {
        this.findAndDeleteFolder(folder);
    }

    private findAndDeleteFolder = (path: string, prev: any = null) => {
        if (prev == null) { prev = this.nodes; }
        var parts = this.utils.getFileParts(path);
        if (parts.length == 1) {
            delete prev[parts[0]];
        } else {
            var next_dir = parts[0];
            if (prev[next_dir] == null) {
                throw new Error(`Directory not found: ...${next_dir}`)
            }            
            parts.shift();
            var next_path = this.utils.buildPath(parts);
            this.findAndDeleteFolder(next_path, prev[next_dir]);
        }
    }

    public getDirectoryFromPath = (path: string, isFilePath: boolean = false, prev: any = null) => {
        if (path == '/') { return this.nodes; }
        if (prev == null) { prev = this.nodes; }
        var parts = this.utils.getFileParts(path);
        if (parts.length == 1) {
            if (isFilePath) {
                return prev;
            } else if (prev[parts[0]] == null) {
                throw new Error(`Directory not found: ...${parts[0]}`)
            } else {
                return prev[parts[0]];
            }
        } else {
            var next_dir = parts[0];
            if (prev[next_dir] == null) {
                throw new Error(`Directory not found: ...${next_dir}`)
            }            
            parts.shift();
            var next_path = this.utils.buildPath(parts);
            return this.getDirectoryFromPath(next_path, isFilePath, prev[next_dir]);
        }
    }

    private cloneNode = (node: any) => {
        return JSON.parse(JSON.stringify(node));
    }

}