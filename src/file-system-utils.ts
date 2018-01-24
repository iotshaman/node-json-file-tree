export class FileSystemUtils {

    constructor(private normalize: (path: string) => string = null) {
        if (this.normalize == null) {
            this.normalize = this.defaultNormalization;
        }
    }

    addTrailingSlash(path: string) {
        var chr = path.substring(path.length - 1);
        if (chr != '/') { path += '/'; }
        return path;
    }

    normalizePaths(paths: Array<string>) {
        return paths.map((path: string) => {
            return this.normalize(path);
        });
    }

    convertWindowsPaths(paths: Array<string>) {
        return paths.map(this.convertSingleWindowsPath);
    }

    convertSingleWindowsPath(path: string) {
        return path.substring(2);
    }

    getFileNameFromPath(path: string) {
        var parts = this.getFileParts(path);
        return parts[parts.length - 1];
    }

    //create directory structure
    generateDirectory(array: Array<string>) {
        var dir = {}, current, tmp;
        for (var i = 0; i < array.length; i++) {
            current = dir;
            tmp = array[i].split('/').slice(1).filter((val: string) => { return val != "" });
            for (var j = 0; j < tmp.length; j++) {
                if (current[tmp[j]] == null) {
                    current[tmp[j]] = {'_files_': []};
                }
                current = current[tmp[j]];
            }
        }
        return dir;
    }

    //removes predicate string from each item in list
    mapRelativeNames(list: Array<string>, predicate: string, folder: boolean = false) {
        var tmp = this.getFileParts(predicate).pop();
        return list.map((item) => {
            if (folder) item = this.addTrailingSlash(item);
            return tmp + '/' + item.replace(predicate, '');
        });
    }

    //returns an array representing a files path
    getFileParts(file) {
        return file.split('/').filter((val) => { return val != ""; })
    }

    //generate tree view
    generateNodeTree(list: Array<string>, dir: any) {
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
    }

    //recursive algorithm to buld folder structures
    createTreeNode(path: string, current_dir: any) {
        var parts = this.getFileParts(path);
        if (parts.length == 1) {
			if (!current_dir['_files_']) { current_dir['_files_'] = []; }
            current_dir['_files_'].push(parts[0]);
        } else {
            var next = parts[0];
            parts.shift();
            if (current_dir[next] == null) { 
                throw new Error(`Directory not found: ...${next}`)
            }
            this.createTreeNode(this.buildPath(parts), current_dir[next]);
        }
    }

    buildPath(parts: Array<string>) {
        return parts.reduce(this.reducePath, '');
    }

    //turns an array of folder parts into path
    reducePath(a, b) {return a + '/' + b;};

    defaultNormalization = (path: string) => {        
        if (path && path.length > 0 && path.charAt(1) == ':') { 
            path = this.convertSingleWindowsPath(path);
        }
        path = path.replace(/\\/g, '/');
        return path;
    }
}