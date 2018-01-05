import { FileSystemUtils } from './file-system-utils';

describe('File System Utils - Ensure Path Format', () => {
    it('Test Invalid Origin String', () => {
        let fs: FileSystemUtils = new FileSystemUtils();
        var rslt =  fs.ensurePathFormat('/test/folder/path');
        expect(rslt).toBe('/test/folder/path/');
    });

    it('Test Valid Origin String', () => {
        let fs: FileSystemUtils = new FileSystemUtils();
        var rslt =  fs.ensurePathFormat('/test/folder/path/');
        expect(rslt).toBe('/test/folder/path/');
    });
});

describe('File System Utils - Generate Directory', () => {
    it('Test Directory Generation', () => {
        let fs: FileSystemUtils = new FileSystemUtils();
        var rslt =  fs.generateDirectory(['/test/path', '/another/test']);
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

describe('File System Utils - Map Relative Names', () => {
    it('Test mapRelativeNames Method', () => {
        let fs: FileSystemUtils = new FileSystemUtils();
        var arr = ['/test/file/or/folder/path/sample.txt'];
        var rslt = fs.mapRelativeNames(arr, '/test/file/or/folder/path/');
        expect(rslt).not.toBe(null);
        expect(rslt[0]).toBe('path/sample.txt');
    })
});

describe('File System Utils - Reduce Path Method', () => {
    it('Test Path Reduction', () => {
        let fs: FileSystemUtils = new FileSystemUtils();
        var test = fs.reduce_path('test', 'path');
        expect(test).toBe('test/path');
    })
});