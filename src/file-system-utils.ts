export class FileSystemUtils {

    constructor(private windows: boolean = false, private normalize: (path: string) => string = null) {
        if (this.normalize == null) {
            this.normalize = this.defaultNormalization;
        }
    }

    ensurePathFormat(path: string) {
        var chr = path.substring(path.length - 1);
        if (chr != '/') { path += '/'; }
        return path;
    }

    normalizePaths(paths: Array<string>, normalize: (path: string) => void) {
        return paths.map((path: string) => {
            return normalize(path);
        });
    }

    convertWindowsPaths(paths: Array<string>) {
        return paths.map((path: string) => {
            return path.substring(2);
        });
    }

    //create directory structure
    generateDirectory(array) {
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
    mapRelativeNames(list, predicate, folder: boolean = false) {
        var tmp = this.getFileParts(predicate).pop();
        return list.map((item) => {
            if (folder) item = this.ensurePathFormat(item);
            return tmp + '/' + item.replace(predicate, '');
        });
    }

    //returns an array representing a files path
    getFileParts(file) {
        return file.split('/').filter((val) => { return val != ""; })
    }

    //generate tree view
    buildFolderStructure(list, dir) {
        for (var i = 0; i < list.length; i++) {
            //remove first part of path (this is the current_dir)
            var parts = this.getFileParts(list[i]);
            parts.shift();
            //call recursive algorthm to add path object to tree
            this.create_path(parts.reduce(this.reduce_path, ''), dir);
        }
        return dir;
    }

    //recursive algorithm to buld folder structures
    create_path(path, current_dir) {
        var parts = this.getFileParts(path);
        if (parts.length == 1) {
            current_dir['_files_'].push(parts[0]);
        } else {
            var next = parts[0];
            parts.shift();
            var new_path = parts.reduce(this.reduce_path, '');
            this.create_path(new_path, current_dir[next]);
        }
    }

    //turns an array of folder parts into path
    reduce_path(a, b) {return a + '/' + b;};

    defaultNormalization(path: string) {
        console.warn('No path normalization method provided, this may cause issues on certain platforms.');
        return path;
    }
}