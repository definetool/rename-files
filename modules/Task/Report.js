const colors = require('colors');


module.exports = {

   

    stat({ console, stat, }) {

        let {
            succs,
            fails,
            jumps,
        } = stat;
        

        console.log(`重命名文件数=${colors.cyan(succs.length)} | 跳过文件数=${colors.cyan(jumps.length)}`);


        if (fails.length == 0) {
            return false;
        }



        console.log(`无法重命名的文件， 共 ${fails.length} 个:`.bgRed);
        fails.forEach((file) => {
            console.log(`  ${file.red}`);
        });


        return true;

        


    },
};