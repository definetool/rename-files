const colors = require('colors');
const $Array = require('@definejs/array');
const Directory = require('@definejs/directory');
const Path = require('@definejs/path');
const Timer = require('./Timer');


module.exports = exports = {

    scan({ console, dir, }) {
        dir = Path.normalizeDir(dir);

        let dirs = [];
        let files = [];
        let timer = new Timer(console);

        timer.start(`${'开始扫描目录'.bold} ${dir.blue} >>`.bold);


        Directory.each(dir, function (folder, list) {
            console.log(`  找到 ${colors.cyan(list.length)} 个文件: ${folder.gray}`);

            dirs.push(folder);
            files.push(...list);
        });

        timer.stop(`<< 共找到 ${colors.cyan(dirs.length)} 个子目录、${colors.cyan(files.length)} 个文件，耗时{text}。`.bold);



        return { dirs, files, };
    },


    parse({ console, dir, rename, }) {
        let { dirs, files, } = exports.scan({ console, dir, });
        
        let dest$files = {};
        
        if (rename) {
        
            files.forEach((file) => {
                let dest = rename(file);
                
                $Array.add(dest$files, dest, file);
                
            });
        }
       

        let isEmpty = dirs.length + files.length == 0;
        

        return { dir, dirs, files, dest$files, isEmpty, };
    },



};