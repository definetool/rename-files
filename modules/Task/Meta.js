const path = require('path');

const Path = require('@definejs/path');
const $Object = require('@definejs/object');


module.exports = {
    create(config, more) { 
        let { home, source, rename, } = config;
        let { console, } = more;

        if (home) {
            home = Path.normalizeDir(home);
        }

        if (source) {
            source = Path.resolve(source);
            source = Path.normalizeDir(source);
        }

        //如果指定为一个 {}，则把对应的字符进行替换。
        //提供一个简单的实现。
        if (typeof rename == 'object') {
            let key$value = rename;

            rename = function ({ dir, ext, filename, name, }) { 
                let dest = name;

                $Object.each(key$value, function (key, value) {
                    dest = dest.split(key).join(value);
                });

                return `${dir}${dest}${ext}`;
            };
        }

       
        let meta = {
            'home': home,
            'console': console,
            'timer': more.timer,
            'source': source ? { 'dir': source, } : null,
            'confict': null,

            'rename': function (file, index) { 
                if (!rename) {
                    return file;
                }

                let dir = Path.dirname(file);
                let ext = path.extname(file);
                let name = path.basename(file, ext);            
                let filename = path.basename(file);

                let dest = rename({
                    dir,        //目录名，以 `/` 结束。
                    ext,        //后缀名，以 `.` 开头。
                    name,       //基本文件名，不包括后缀。      
                    filename,   //文件名，包括后缀名。
                    file,       //原始完整文件名。
                    index,      //当前文件在文件列表中的索引值。

                    'home': meta.home,
                    'source': meta.source,
                });

                return dest || file;
            },

         
        };

        return meta;
    },
};