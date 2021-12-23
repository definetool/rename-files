# @definetool/rename-files

批量的文件重命名工具，支持自定义规则。


### 示例

#### 使用默认设置
``` js

const { parse, rename, } = require('@definetool/rename-files');

//仅对指定目录进行解析，检查是否存在重命名后的冲突情况。
parse('/Volumes/3/摄像头监控');

//进行完整的重命名流程，包括解析、重命名。
rename({
    
    //要进行扫描和重命名的目录。
    //注意：
    //此目录里的文件可能会被重命名。
    source: '/Volumes/3/摄像头监控',

    //重命名规则，仅对文件名部分(不包括后缀名)进行字符替换。
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

```

#### 自定义方式
``` js
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

    rename0: function ({ dir, ext, filename, name, file, }) {
        
        if (filename == 'Thumbs.db') {
            return `/Users/micty/Pictures/test/db/${filename}`;
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



```







