

const { Task, ProgressBar, } = require('./index');
const $Date = require('@definejs/date');


//设置进度条的样式。
Object.assign(ProgressBar.defaults, {
    //进度条的长度。
    width: 100,

    //已完成的部分的背景色。
    complete: ' '.bgCyan,

    //标题颜色。
    titleColor: {
        backgroud: 'bgCyan',    //背景色
        text: 'black',          //文本色。
    },
});


let dt = $Date.format(`yyyy-MM-dd@HH.mm.ss`);

let task = new Task({
    home: `./output/${dt}/`,
    console: 'console.log',
 
    source: '/Volumes/3/摄像头监控',

    rename: function ({ dir, ext, filename, name, file, index, }) {
        if (filename == 'Thumbs.db') {
            return `/Volumes/3/test/${file.split('/').join('_')}`;
        }

        name = name.split(`\\`).join('_');
        name = name.split(`/`).join('_');
        name = name.split(`:`).join('_');
        name = name.split(`*`).join('_');
        name = name.split(`?`).join('_');
        name = name.split(`<`).join('_');
        name = name.split(`>`).join('_');
        name = name.split(`|`).join('_');

        return `${dir}${name}${ext}`;
    },

    
});

task.parse();
task.rename();

