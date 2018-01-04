import { FileTreeGenerator } from './file-tree';
import { FileTreeGeneratorConfig } from 'file-tree-api';
import * as upath from 'upath';

describe('File Tree - Ensure Path Format', () => {
    it('Test Invalid Origin String', () => {
        let fs: SampleFileSystem = new SampleFileSystem();
        let fileTree: FileTreeGenerator = new FileTreeGenerator({}, fs);
        var rslt = fileTree.ensurePathFormat('/test/folder/path');
        expect(rslt).toBe('/test/folder/path/');
    });

    it('Test Valid Origin String', () => {
        let fs: SampleFileSystem = new SampleFileSystem();
        let fileTree: FileTreeGenerator = new FileTreeGenerator({}, fs);
        var rslt = fileTree.ensurePathFormat('/test/folder/path/');
        expect(rslt).toBe('/test/folder/path/');
    });
});

describe('File Tree - Directory Retrieval', () => {
    it('Test Exception Handling', (done: any) => {
        let fs: SampleFileSystemWithErrors = new SampleFileSystemWithErrors();
        let fileTree: FileTreeGenerator = new FileTreeGenerator({}, fs);
        fileTree.getAllDirectories('').then((rslt: any) => {
            done('Promise should not be resolved')
        }).catch((ex: any) => {
            done();
        });
    });

    it('Test Valid Retrieval', (done: any) => {
        let fs: SampleFileSystem = new SampleFileSystem();
        let fileTree: FileTreeGenerator = new FileTreeGenerator({}, fs);
        fileTree.getAllDirectories('').then((rslt: any) => {
            expect(rslt).not.toBe(null);
            done();
        });
    });

    it('Test Valid Retrieval On Windows Machine', (done: any) => {
        let fs: SampleWindowsFileSystem = new SampleWindowsFileSystem();
        let config: FileTreeGeneratorConfig = {
            normalize: upath.normalize,
            windows: true
        }
        let fileTree: FileTreeGenerator = new FileTreeGenerator(config, fs);
        fileTree.getAllDirectories('').then((rslt: any) => {
            expect(rslt).not.toBe(null);
            expect(rslt[0]).toBe('/test/folder/path');
            done();
        });
    });
});

describe('File Tree - File Retrieval', () => {
    it('Test Exception Handling', (done: any) => {
        let fs: SampleFileSystemWithErrors = new SampleFileSystemWithErrors();
        let fileTree: FileTreeGenerator = new FileTreeGenerator({}, fs);
        fileTree.getAllFiles('').then((rslt: any) => {
            done('Promise should not be resolved')
        }).catch((ex: any) => {
            done();
        });
    });

    it('Test Valid Retrieval', (done: any) => {
        let fs: SampleFileSystem = new SampleFileSystem();
        let fileTree: FileTreeGenerator = new FileTreeGenerator({}, fs);
        fileTree.getAllFiles('').then((rslt: any) => {
            expect(rslt).not.toBe(null);
            done();
        });
    });

    it('Test Valid Retrieval On Windows Machine', (done: any) => {
        let fs: SampleWindowsFileSystem = new SampleWindowsFileSystem();
        let config: FileTreeGeneratorConfig = {
            normalize: upath.normalize,
            windows: true
        }
        let fileTree: FileTreeGenerator = new FileTreeGenerator(config, fs);
        fileTree.getAllFiles('').then((rslt: any) => {
            expect(rslt).not.toBe(null);
            expect(rslt[0]).toBe('/test/file/path/sample1.txt');
            done();
        });
    });
});

describe('File Tree - Reduce Path Method', () => {
    it('Test Path Reduction', () => {
        let fs: SampleFileSystem = new SampleFileSystem();
        let fileTree: FileTreeGenerator = new FileTreeGenerator({}, fs);
        var test = fileTree.reduce_path('test', 'path');
        expect(test).toBe('test/path');
    })
});

describe('File Tree - Generate Directory', () => {
    it('Test Directory Generation', () => {
        let fs: SampleFileSystem = new SampleFileSystem();
        let fileTree: FileTreeGenerator = new FileTreeGenerator({}, fs);
        var rslt = fileTree.generateDirectory(['/test/path', '/another/test']);
        expect(rslt).not.toBe(null);

        expect(rslt['test']).not.toBe(null);
        expect(rslt['test']['_files_']).not.toBe(null);
        expect(rslt['test']['path']).not.toBe(null);
        expect(rslt['test']['path']['_files_']).not.toBe(null);
        
        expect(rslt['another']).not.toBe(null);
        expect(rslt['another']['_files_']).not.toBe(null);
        expect(rslt['another']['test']).not.toBe(null);
        expect(rslt['another']['test']['_files_']).not.toBe(null);
    })
});

describe('File Tree - Map Relative Names', () => {
    it('Test mapRelativeNames Method', () => {
        let fs: SampleFileSystem = new SampleFileSystem();
        let fileTree: FileTreeGenerator = new FileTreeGenerator({}, fs);
        var arr = ['/test/file/or/folder/path/sample.txt'];
        var rslt = fileTree.mapRelativeNames(arr, '/test/file/or/folder/path/');
        expect(rslt).not.toBe(null);
        expect(rslt[0]).toBe('path/sample.txt');
    })
});

describe('File Tree - Get Tree Object', () => {
    it('Test Valid Retrieval', (done: any) => {
        let fs: SampleFileSystem = new SampleFileSystem();
        let fileTree: FileTreeGenerator = new FileTreeGenerator({}, fs);
        fileTree.getTreeData('/test/file/or/folder/path/').then((rslt) => {
            done();
        }).catch(() => {
            done('Exception should not be raised.');
        })
    });

    it('Test Invalid Folder Retrieval', (done: any) => {
        let fs: SampleFileSystemWithFolderErrors = new SampleFileSystemWithFolderErrors();
        let fileTree: FileTreeGenerator = new FileTreeGenerator({}, fs);
        fileTree.getTreeData('/test/file/or/folder/path/').then((rslt) => {
            done('Exception should be raised.');
        }).catch(() => {
            done();
        })
    });

    it('Test Invalid File Retrieval', (done: any) => {
        let fs: SampleFileSystemWithFileErrors = new SampleFileSystemWithFileErrors();
        let fileTree: FileTreeGenerator = new FileTreeGenerator({}, fs);
        fileTree.getTreeData('/test/file/or/folder/path/').then((rslt) => {
            done('Exception should be raised.');
        }).catch(() => {
            done();
        })
    });
});

class SampleFileSystem {

    constructor() {}
    
    files = (start_path: string, callback: (err: any, files: Array<string>) => void) => {
        callback(null, [
            '/test/folder/path/sample1.txt', 
            '/test/folder/path/sample2.txt', 
            '/test/folder/path/extra/sample3.txt'
        ]);
    }

    subdirs = (start_path: string, callback: (err: any, folders: Array<string>) => void) => {
        callback(null, [
            '/test/folder/path',
            '/test/folder/path/extra'
        ]);
    }
}

class SampleWindowsFileSystem {

    constructor() {}
    
    files = (start_path: string, callback: (err: any, files: Array<string>) => void) => {
        callback(null, [
            'C:\\test\\file\\path\\sample1.txt', 
            'C:\\test\\file\\path\\sample2.txt', 
            'C:\\test\\file\\path\\extra\\sample3.txt', 
        ]);
    }

    subdirs = (start_path: string, callback: (err: any, folders: Array<string>) => void) => {
        callback(null, [
            'C:\\test\\folder\\path', 
            'C:\\test\\folder\\path\\extra', 
        ]);
    }
}

class SampleFileSystemWithErrors {

    constructor() {}
    
    files = (start_path: string, callback: (err: any, files: Array<string>) => void) => {
        callback('Sample error', []);
    }

    subdirs = (start_path: string, callback: (err: any, folders: Array<string>) => void) => {
        callback('Sample error', []);
    }
}

class SampleFileSystemWithFolderErrors {

    constructor() {}
    
    files = (start_path: string, callback: (err: any, files: Array<string>) => void) => {
        callback(null, []);
    }

    subdirs = (start_path: string, callback: (err: any, folders: Array<string>) => void) => {
        callback('Sample error', []);
    }
}

class SampleFileSystemWithFileErrors {

    constructor() {}
    
    files = (start_path: string, callback: (err: any, files: Array<string>) => void) => {
        callback('Sample error', []);
    }

    subdirs = (start_path: string, callback: (err: any, folders: Array<string>) => void) => {
        callback(null, []);
    }
}