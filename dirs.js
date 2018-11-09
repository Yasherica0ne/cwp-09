const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));
let a = [];

const directory = [
    'dir-1/dir-1-1',
    'dir-1/dir-1-2',
    'dir-1/dir-1-2/dir-1-2-1',
    'dir-2/dir-2-1/dir-2-1-1',
    'dir-2/dir-2-2/dir-2-2-1',
    'dir-2/dir-2-1/dir-2-2-2/dir-2-2-2-1',
    'dir-3/dir-3-1',
    'dir-3',
    'dir-3/dir-3-2/dir-3-2-1',
    'dir-3/dir-3-3/dir-3-3-1'
];

for (let i = 0; i < directory.length; i++) {
    a.push(Create(directory[i]));
}


function Create(dir) {
    return function () {
        return new Promise(function (resolve) {
            let dirs = dir.split('/');
            for (let i = 1; i <= dirs.length; i++) {
                let p = dirs.slice(0, i).join('/');
                fs.mkdir(p, err => {});
            }
            resolve(dir);
        });
    };
}
Promise.all(a)
    .mapSeries(function (asyncMethodPassed) {
        return asyncMethodPassed();
    }).then(function (results) {
});