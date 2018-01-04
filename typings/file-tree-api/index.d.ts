declare module 'file-tree-api' {
    export interface FileTreeGeneratorConfig {
        windows?: boolean;
        normalize?: (path: string) => string;
    }
}