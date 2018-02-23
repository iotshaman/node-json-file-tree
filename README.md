## Json File Tree for Node JS - IoT Shaman

![npm badge](https://img.shields.io/npm/v/node-json-file-tree.svg) ![Build Status](https://travis-ci.org/iotshaman/node-json-file-tree.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/iotshaman/node-json-file-tree/badge.svg?branch=master)](https://coveralls.io/github/iotshaman/node-json-file-tree?branch=master)

Tree structure that representing the contents of a given system drive. Simply pass in a start folder, or a list of files / folders, and this module will return an object that you can use in a user interface to represent your files!

### Requirements

In order to use node-json-file-tree you will need the following resource(s):

- npm

### Installation

```js
npm install node-json-file-tree --save
```

### Quick Start

The file tree structure can be created in 1 of 2 ways, either by providing a list of files / folders to it's constructor, or using the "seed" factory and providing an address for the root directory. 

##### File Tree Seed (factory method)

Use this factory method to generate a file "seed". A seed will "grow" a file tree for you, first running a recursive directory scan, then converting the results into a file tree. This method is asynchornous and is provided as a Promise.

Methods
```ts
get(windows?: boolean = false): Promise<FileTreeSeed>;
```

Implementation
```js
let ftsf = require('node-json-file-tree').FileTreeSeedFactory
// generate file tree seed from factory
ftsf.get().then(seed => { 
    // "grow" file tree from seed
    let start = __dirname;
    seed.getFileTree(start).then(tree => {
        // ...
    });
});
```

##### Manaul (via constructor)

When you already have a list of files / folders, you can manually populate a new instance of FileTree.

```js
let FileTree = require('node-json-file-tree').FileTree;
let tree = new FileTree(['/path/to/file.txt', '/path/to/']);
// ...
```

##### File Tree Structure

The file tree object has the below definition (in Typescript):

```ts
interface FileTree {
    files: string[];
    folders: string[];
    nodes: FileTreeNode;
}
interface FileTreeNode {
    _files_: string[];
    [folder: string]: FileTreeNode;
}
```

Given the below list of files / folders, the file tree would look like:
- /small/path.txt
- /longer/folder/path2.txt

```js
{
    "small": {
        "_files_": [ "path.txt" ]
    },
    "longer": {
        "folder": {
            "_files_": [ "path2.txt" ]
        },
        "_files_": []
    },
    "_files_": []
}
```

### API Reference

```ts
interface FileTreeApi {
	getDirectoryFromPath(path: string, isFilePath?: boolean = false): FileTreeNode;
	addFolder(path: string, folderName: string, seed?: any = null): void;
	renameFolder(path: string, oldName: string, newName: string): void;
	renameFile(path: string, oldName: string, newName: string): void;
	copyFolder(fromPath: string, toPath: string, folderName: string): void;
	deleteFolder(folder: string): void;
	deleteFiles(folder: string, files: string[]): void;
	cloneNodeByPath(path: string): void;
}
```


--eof