import { FileTree } from './file-tree';

describe('File Tree - Initialize Nodes', () => {
    it('Test Initialize Nodes - node object provided', () => {
        let tree = new FileTree(['/path/to/file.txt'], ['/path/to/'], {});
        expect(tree).not.toBe(null);
        expect(tree.files.length).toBe(1);
        expect(tree.folders.length).toBe(1);
        expect(tree.nodes).not.toBe(null);
        expect(tree.nodes["path"]).toBe(undefined);
    });
    it('Test Initialize Nodes - file in root directory', () => {
        let tree = new FileTree(['/path/to/file.txt'], ['/path/to/']);
        expect(tree).not.toBe(null);
        expect(tree.files.length).toBe(1);
        expect(tree.folders.length).toBe(1);
        expect(tree.nodes["path"]).not.toBe(null);
    });
    it('Test Initialize Nodes - relative file paths', () => {
        let tree = new FileTree(['path/to/file.txt'], ['path/to/']);
        expect(tree).not.toBe(null);
        expect(tree.files.length).toBe(1);
        expect(tree.folders.length).toBe(1);
        expect(tree.nodes["to"]).not.toBe(null);
    });
});

describe('File Tree - Add Files', () => {
    it('Add New File', () => {
        let tree = new FileTree(['/path/to/file.txt'], ['/path/to/']);
        tree.addFiles(['/path/to/newfile.txt']);
        expect(tree).not.toBe(null);
        expect(tree.files.length).toBe(2);
        expect(tree.folders.length).toBe(1);
        expect(tree.nodes["path"]).not.toBe(null);
        expect(tree.nodes["path"]["to"]).not.toBe(null);
        var files = tree.nodes["path"]["to"]["_files_"];
        expect(files.indexOf("file.txt")).not.toBe(-1);
        expect(files.indexOf("newfile.txt")).not.toBe(-1);
    });
    it('Add Existing File', () => {
        let tree = new FileTree(['/path/to/file.txt'], ['/path/to/']);
        tree.addFiles(['/path/to/file.txt']);
        expect(tree).not.toBe(null);
        expect(tree.files.length).toBe(1);
        expect(tree.folders.length).toBe(1);
        expect(tree.nodes["path"]).not.toBe(null);
    });
});

describe('File Tree - Get Directory from Path', () => {
    it('Get Directory From File Path', () => {
        var files = ['/path/to/file.txt', '/path/to/inner/file1.txt', '/path/to/inner/file2.txt'];
        var folders = ['/path/to/', '/path/to/inner'];
        let tree = new FileTree(files, folders);
        var test = tree.getDirectoryFromPath('/path/to/inner/file1.txt', true);
        expect(test).not.toBe(null);
        expect(test["_files_"]).not.toBe(null);
        expect(test["_files_"].length).toBe(2);
    });
    it('Get Directory From Folder Path - Trailing Slash', () => {
        var files = ['/path/to/file.txt', '/path/to/inner/file1.txt', '/path/to/inner/file2.txt'];
        var folders = ['/path/to/', '/path/to/inner'];
        let tree = new FileTree(files, folders);
        var test = tree.getDirectoryFromPath('/path/to/inner/');
        expect(test).not.toBe(null);
        expect(test["_files_"]).not.toBe(null);
        expect(test["_files_"].length).toBe(2);
    });
    it('Get Directory From Folder Path - No Trailing Slash', () => {
        var files = ['/path/to/file.txt', '/path/to/inner/file1.txt', '/path/to/inner/file2.txt'];
        var folders = ['/path/to/', '/path/to/inner'];
        let tree = new FileTree(files, folders);
        var test = tree.getDirectoryFromPath('/path/to/inner');
        expect(test).not.toBe(null);
        expect(test["_files_"]).not.toBe(null);
        expect(test["_files_"].length).toBe(2);
    });
    it('Get Directory From Folder Path - No Trailing Slash', () => {
        var files = ['/file1.txt', '/path/to/file.txt'];
        var folders = ['/path/to/'];
        let tree = new FileTree(files, folders);
        var test = tree.getDirectoryFromPath('/');
        expect(test).not.toBe(null);
        expect(test["_files_"]).not.toBe(null);
        expect(test["_files_"].length).toBe(1);
    });
});

describe('File Tree - Delete Files', () => {
    it('Delete File', () => {
        var files = ['/path/to/file.txt', '/path/to/inner/file1.txt', '/path/to/inner/file2.txt'];
        var folders = ['/path/to/', '/path/to/inner'];
        let tree = new FileTree(files, folders);
        tree.deleteFiles('/path/to/inner', ['/path/to/inner/file1.txt']);
        var test = tree.getDirectoryFromPath('/path/to/inner');
        expect(test).not.toBe(null);
        expect(test["_files_"]).not.toBe(null);
        expect(test["_files_"].length).toBe(1);
    });
    it('Delete File - File Not Found', () => {
        var files = ['/path/to/file.txt', '/path/to/inner/file1.txt', '/path/to/inner/file2.txt'];
        var folders = ['/path/to/', '/path/to/inner'];
        let tree = new FileTree(files, folders);
        tree.deleteFiles('/path/to/inner', ['/path/to/inner/file3.txt']);
        var test = tree.getDirectoryFromPath('/path/to/inner');
        expect(test).not.toBe(null);
        expect(test["_files_"]).not.toBe(null);
        expect(test["_files_"].length).toBe(2);
    });
});

describe('File Tree - Delete Folders', () => {
    it('Delete Folder', (done: any) => {
        var files = ['/path/to/file.txt', '/path/to/inner/file1.txt', '/path/to/inner/file2.txt'];
        var folders = ['/path/to/', '/path/to/inner'];
        let tree = new FileTree(files, folders);
        tree.deleteFolder('/path/to/inner');
        try {
            var test = tree.getDirectoryFromPath('/path/to/inner');
        } catch (ex) {
            //should throw error because path doesnt exist anymore
            done();
        }
    });
    it('Delete Folder - Folder Not Found', () => {
        var files = ['/path/to/file.txt', '/path/to/inner/file1.txt', '/path/to/inner/file2.txt'];
        var folders = ['/path/to/', '/path/to/inner'];
        let tree = new FileTree(files, folders);
        tree.deleteFolder('/path/to/other');
        var test = tree.getDirectoryFromPath('/path/to/inner');
        expect(test).not.toBe(null);
    });
});

describe('File Tree - Add Folder', () => {
    it('Add Folder', () => {
        var files = ['/path/to/file.txt'];
        var folders = ['/path/to/'];
        let tree = new FileTree(files, folders);
        tree.addFolder('/path/to/', 'NewFolder');
        var test = tree.getDirectoryFromPath('/path/to/');
        expect(test).not.toBe(null);
        expect(test['NewFolder']).not.toBe(null);
        expect(test['NewFolder']['_files_']).not.toBe(null);
        expect(test['NewFolder']['_files_'].length).toBe(0);
    });
    it('Add Folder - Path Already Exists', (done: any) => {
        var files = ['/path/to/file.txt'];
        var folders = ['/path/to/'];
        let tree = new FileTree(files, folders);
        try {
            tree.addFolder('/path/', 'to');
        } catch(ex) {
            done();
        }
    });
});

describe('File Tree - Rename Files', () => {
    it('Rename File', () => {
        var files = ['/path/to/file.txt'];
        var folders = ['/path/to/'];
        let tree = new FileTree(files, folders);
        tree.renameFile('/path/to/', 'file.txt', 'file2.txt');
        var test = tree.getDirectoryFromPath('/path/to/');
        expect(test).not.toBe(null);
        expect(test['_files_'].indexOf('file.txt')).toBe(-1);
        expect(test['_files_'].indexOf('file2.txt')).not.toBe(-1);
    });
    it('Rename File - File Does Not Exist', (done: any) => {
        var files = ['/path/to/file.txt'];
        var folders = ['/path/to/'];
        let tree = new FileTree(files, folders);
        try {
            tree.renameFile('/path/to/', 'file3.txt', 'file2.txt');
        } catch(ex) {
            done();
        }
    });
});

describe('File Tree - Rename Folder', () => {
    it('Rename Folder', () => {
        var files = ['/path/to/file.txt'];
        var folders = ['/path/to/'];
        let tree = new FileTree(files, folders);
        tree.renameFolder('/path/', 'to', 'from');
        var test = tree.getDirectoryFromPath('/path/');
        expect(test).not.toBe(null);
        expect(test['from']).not.toBe(null);
        expect(test['from']['_files_']).not.toBe(null);
        expect(test['from']['_files_'].length).toBe(1);
    });
    it('Rename Folder - Folder Does Not Exist', (done: any) => {
        var files = ['/path/to/file.txt'];
        var folders = ['/path/to/'];
        let tree = new FileTree(files, folders);
        try {
            tree.renameFolder('/path/', 'from', 'to');
        } catch(ex) {
            done();
        }
    });
});

describe('File Tree - Copy Folder', () => {
    it('Copy Folder', () => {
        var files = ['/path/to/file.txt', '/path/to/inner/file1.txt', '/path/to/inner/file2.txt'];
        var folders = ['/path/to/', '/path/to/inner'];
        let tree = new FileTree(files, folders);
        tree.copyFolder('/path/to/', '/path/', 'inner');
        var test = tree.getDirectoryFromPath('/path/inner/');
        expect(test).not.toBe(null);
        expect(test['_files_']).not.toBe(null);
        expect(test['_files_'].length).toBe(2);
        var test2 = tree.getDirectoryFromPath('/path/to/inner/');
        expect(test2).not.toBe(null);
        expect(test2['_files_']).not.toBe(null);
        expect(test2['_files_'].length).toBe(2);
    });
    it('Copy Folder - Folder Does Not Exist', (done: any) => {
        try {
            var files = ['/path/to/file.txt', '/path/to/inner/file1.txt', '/path/to/inner/file2.txt'];
            var folders = ['/path/to/', '/path/to/inner'];
            let tree = new FileTree(files, folders);
            tree.copyFolder('/path/to/', '/path/', 'test');
        } catch(ex) {
            done();
        }
    });
});