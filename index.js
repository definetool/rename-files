
require('colors');

const $Date = require('@definejs/date');
const ProgressBar = require('./lib/ProgressBar');
const Task = require('./modules/Task');

function create(config) { 
    let { defaults, } = exports;
    let dt = $Date.format(defaults.datetime);

    let task = new Task({
        'home': config.home || `./output/${dt}/`,
        'source': config.source,
        'rename': config.rename,
        'console': config.console || defaults.console,
    });

    return task;
}

module.exports = exports = {
    ProgressBar,
    Task,

    defaults: {
        datetime: 'yyyy-MM-dd@HH.mm.ss',
        console: 'console.log',
    },

    parse(config) { 
        if (typeof config == 'string') {
            config = { 'source': config, };
        }

        let task = create(config);

        task.parse();
    },

    rename(config) { 
        let task = create(config);

        task.parse();
        task.rename();
    },


};


