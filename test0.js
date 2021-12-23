

const { parse, rename, } = require('./index');

// parse('/Volumes/3/摄像头监控');
// return;

rename({
    source: '/Volumes/3/摄像头监控',

    rename: {
        '\\': '',
        '/': '_',
        ':': '_',
        '*': '_',
        '?': '_',
        '<': '_',
        '>': '_',
        '|': '_',
    },

});

