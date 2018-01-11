function createFileTreeSeed(windows) {
    var FileTreeSeed = require('../dist/file-tree').FileTreeSeed;
    var config = {
        windows: !!windows,
        normalize: require('upath').normalize
    }
    return new FileTreeSeed(config, require('node-dir'));
}

var fileTreeSeed;
module.exports.get = function(windows) {
    return new Promise(function(res, err) {
        if (!fileTreeSeed) {
            fileTreeSeed = createFileTreeSeed(windows);
            res(fileTreeSeed);
        } else {
            res(fileTreeSeed);
        }
    });
}