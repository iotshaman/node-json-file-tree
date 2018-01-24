import { FileSystemUtils } from './file-system-utils';
import { DirectoryReaderApi } from 'directory-reader-api';
import { FileTreeGeneratorConfig } from 'file-tree-api';
import { FileTree } from './file-tree';
import * as Promise from 'promise';

export class FileTreeSeed {

    private utils: FileSystemUtils;

    constructor(private config: FileTreeGeneratorConfig, private fs: DirectoryReaderApi) {
        this.utils = new FileSystemUtils(config.normalize);
    }

    getFileTree(start: string): Promise<FileTree> {

        let folders: any;
        let files: any;
        let promises = [];
        let path_predicate: string = this.utils.addTrailingSlash(start);
        let start_path: string = this.utils.addTrailingSlash(start);

        if (this.config.windows) {
            if (this.config.normalize) {
                path_predicate = this.config.normalize(path_predicate.substring(2));
            } else {
                path_predicate = this.utils.defaultNormalization(path_predicate.substring(2));
            }
        }

        promises.push(this.getAllDirectories(start_path)
            .then((rslt: string[]) => { return this.utils.mapRelativeNames(rslt, path_predicate, true); })
            .then((rslt) => { folders = rslt; return; })
            .catch((err) => { return Promise.reject(err); })
        );
        promises.push(this.getAllFiles(start_path)
            .then((rslt: string[]) => { return this.utils.mapRelativeNames(rslt, path_predicate); })
            .then((rslt) => { files = rslt; return; })
            .catch((err) => { return Promise.reject(err); })
        );

        return Promise.all(promises).then(() => {
            return new FileTree(files, folders);
        });

    }

    getAllDirectories(start) {
        return new Promise((res, error) => {
            this.fs.subdirs(start, (err, subdirs) => {
                if (err) return error(err);
                this.normalizePaths(subdirs).then(res);
            });
        });
    }

    getAllFiles(start) {
        return new Promise((res, error) => {
            this.fs.files(start, (err, files) => {
                if (err) error(err);
                this.normalizePaths(files).then(res);
            });
        });
    }

    private normalizePaths = (array: Array<string>) => {
        return Promise.resolve(array)
            .then((rslt: Array<string>) => {
                if (!this.config.normalize) return rslt;
                return this.utils.normalizePaths(rslt);
            }).then((rslt: Array<any>) => {
                if (!this.config.windows) return rslt;
                return this.utils.convertWindowsPaths(rslt);
            });
    }
}