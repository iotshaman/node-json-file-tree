import { FileTreeFactory } from './file-tree';
import { FileTreeGeneratorConfig } from 'file-tree-api';
import * as upath from 'upath';

describe('File Tree - Directory Retrieval', () => {
    it('Test Exception Handling', (done: any) => {
        let fs: SampleFileSystemWithErrors = new SampleFileSystemWithErrors();
        let fileTree: FileTreeFactory = new FileTreeFactory({}, fs);
        fileTree.getAllDirectories('').then((rslt: any) => {
            done('Promise should not be resolved')
        }).catch((ex: any) => {
            done();
        });
    });

    it('Test Valid Retrieval', (done: any) => {
        let fs: SampleFileSystem = new SampleFileSystem();
        let fileTree: FileTreeFactory = new FileTreeFactory({}, fs);
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
        let fileTree: FileTreeFactory = new FileTreeFactory(config, fs);
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
        let fileTree: FileTreeFactory = new FileTreeFactory({}, fs);
        fileTree.getAllFiles('').then((rslt: any) => {
            done('Promise should not be resolved')
        }).catch((ex: any) => {
            done();
        });
    });

    it('Test Valid Retrieval', (done: any) => {
        let fs: SampleFileSystem = new SampleFileSystem();
        let fileTree: FileTreeFactory = new FileTreeFactory({}, fs);
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
        let fileTree: FileTreeFactory = new FileTreeFactory(config, fs);
        fileTree.getAllFiles('').then((rslt: any) => {
            expect(rslt).not.toBe(null);
            expect(rslt[0]).toBe('/test/file/path/sample1.txt');
            done();
        });
    });
});

describe('File Tree - Get Tree Object', () => {
    it('Test Valid Retrieval', (done: any) => {
        let fs: SampleFileSystem = new SampleFileSystem();
        let fileTree: FileTreeFactory = new FileTreeFactory({}, fs);
        fileTree.getFileTree('/test/file/or/folder/path/').then((rslt) => {
            done();
        }).catch(() => {
            done('Exception should not be raised.');
        })
    });

    it('Test Valid Retrieval - Windows machine with default normalization', (done: any) => {
        let fs: SampleFileSystem = new SampleFileSystem();
        let fileTree: FileTreeFactory = new FileTreeFactory({ windows: true }, fs);
        fileTree.getFileTree('/test/file/or/folder/path/').then((rslt) => {
            done();
        }).catch(() => {
            done('Exception should not be raised.');
        })
    });

    it('Test Valid Retrieval - Windows machine with custom normalization', (done: any) => {
        let fs: SampleFileSystem = new SampleFileSystem();
        let config: any = { windows: true, normalize: (path: string) => { return path; } }
        let fileTree: FileTreeFactory = new FileTreeFactory(config, fs);
        fileTree.getFileTree('/test/file/or/folder/path/').then((rslt) => {
            done();
        }).catch(() => {
            done('Exception should not be raised.');
        })
    });

    it('Test Invalid Folder Retrieval', (done: any) => {
        let fs: SampleFileSystemWithFolderErrors = new SampleFileSystemWithFolderErrors();
        let fileTree: FileTreeFactory = new FileTreeFactory({}, fs);
        fileTree.getFileTree('/test/file/or/folder/path/').then((rslt) => {
            done('Exception should be raised.');
        }).catch(() => {
            done();
        })
    });

    it('Test Invalid File Retrieval', (done: any) => {
        let fs: SampleFileSystemWithFileErrors = new SampleFileSystemWithFileErrors();
        let fileTree: FileTreeFactory = new FileTreeFactory({}, fs);
        fileTree.getFileTree('/test/file/or/folder/path/').then((rslt) => {
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