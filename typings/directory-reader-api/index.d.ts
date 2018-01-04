declare module 'directory-reader-api' {
    export interface DirectoryReaderApi {
        files(start_path: string, callback: (err: any, files: any) => void): void;
        subdirs(start_path: string, callback: (err: any, folders: any) => void): void;
    }
}