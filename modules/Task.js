const fs = require('fs');
const colors = require('colors');
const $Object = require('@definejs/object');
const Directory = require('@definejs/directory');

const FileSystem = require('../lib/FileSystem');
const ProgressBar = require('../lib/ProgressBar');
const Timer = require('../lib/Timer');

const Console = require('./Task/Console');
const Home = require('./Task/Home');
const Meta = require('./Task/Meta');
const Report = require('./Task/Report');




let mapper = new Map();

class Task {
    /**
    * 构造器。
    * @param {*} config 配置对象。
    *   config = {
    *       home: '',       //会话过程中产生的日志等临时文件的存放目录。 建议每次都使用一个不同的目录，以方便多次运行后进行查找。
    *       console: '',    //会话过程中产生的日志的文件名称。 如果指定，则写入此文件；否则仅在控制台输出。
    *       cache: '',      //解析 source 目录和 target 目录中的文件 MD5 时要保存的元数据信息的目录名，建议指定为 `.sync-files/`。
    *       source: '',     //要同步的源目录。
    *       target: '',     //要同步的目标目录。
    *   };
    */
    constructor(config) {
        let console = Console.create(config);
        let timer = new Timer(console);

        let meta = Meta.create(config, {
            console,
            timer,
        });
      
        mapper.set(this, meta);
    }

    /**
    * 解析。
    * 提取文件的 MD5 信息，保存到 cache 目录中。
    */
    parse() {
        let meta = mapper.get(this);
        let { console, timer, source, rename, conflict, } = meta;

        timer.start();


        if (!source) {
            console.log('必须指定 source 目录'.bgRed);
            return;
        }

        //返回: { dir, dirs, files, dest$files, isEmpty, }
        source = FileSystem.parse({ console, ...source, rename, });
        Home.write(meta, 'source.json', source);

        if (source.isEmpty) {
            console.log('source 目录不能为空目录。'.bgRed);
            return;
        }


        $Object.each(source.dest$files, function (dest, files) {
            let maxIndex = files.length - 1;

            if (maxIndex < 1) {
                return;
            }

            conflict = conflict || {};
            conflict[dest] = files;

            console.log(`冲突`.bgRed, `${dest}`.bold.red);

            files.forEach((file, index) => {
                let linker = index == maxIndex ? '└──' : '├──';
                console.log(`  ${linker.gray}${file.magenta}`);
            });
        });


        meta.source = source;
        meta.conflict = conflict;

        if (conflict) {
            Home.write(meta, 'conflict.json', conflict);
        }


    }

    /**
    * 同步。
    */
    rename() {
        let meta = mapper.get(this);
        let { source, conflict, console, } = meta;

        if (conflict) {
            console.log(`重命名后的文件名有冲突，已取消执行。`.bgRed);
            return;
        }


        let { files, } = source;

        if (!files) {
            console.log(`请先进行分析。`.bgRed);
            return;
        }

        let bar = new ProgressBar(files, console);
        let timer = new Timer(console);
        let stat = {
            succs: [],
            fails: [],
            jumps: [],
        };


        timer.start(`开始重命名文件，共 ${colors.cyan(files.length)} 个 >>`.bold);

        files.forEach((file, index) => {
            let dest = meta.rename(file, index);

            if (dest == file) {
                stat.jumps.push(file);
                return;
            }

            try {
                bar.log(`  重命名文件`.yellow, file.yellow);
                bar.log(`         -->`, dest.underline.green);
                Directory.create(dest);     //先创建必要的目录，保证 fs.rename 不会出错。
                fs.renameSync(file, dest);
                stat.succs.push(file);
            }
            catch (ex) {
                bar.log(ex.message.bgRed);
                stat.fails.push(file);
            }

        });

        timer.stop(`<< 文件重命名完成，耗时{text}`.bold);
        Home.write(meta, 'stat.json', stat);

        meta.timer.stop(`总耗时: {text}`);



        let hasError = Report.stat({ console, stat, });

        if (hasError) {
            console.log(`重命名完成，但存在失败。`.red);
        }
        else {
            console.log(`======================== 重命名完成 ========================`.green);
        }



    }



}



module.exports = Task;