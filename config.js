let print = console.log;
let manualRoles = {
    "miner": 0,
    "spawnHelper": 3,
    "updater":  4,
    "towerWorker": 0,
    "builder": 0,
    "helper": 0,
}
let enableManualRoles = false;

module.exports = {
    roomNames : ["E56S7",],
    minProfessions:  {
        "miner": 1,
        "spawnHelper": 1,
        "updater":  1,
        "towerWorker": 0,
        "builder": 0,
        "helper": 0,
    },
    maxProfessions: {
        "miner": 3,
        "spawnHelper": 3,
        "updater":  4,
        "towerWorker": 1,
        "builder": 3,
        "helper": 3,
    },
    manualRoles: manualRoles,
    enableManualRoles: enableManualRoles,
};