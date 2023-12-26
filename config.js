let print = console.log;
let manualRoles = {
    "miner": 2,
    "spawnHelper": 0,
    "updater":  4,
    "towerWorker": 0,
    "builder": 2,
    "helper": 0,
    "worker": 0,
}
let enableManualRoles = true;

module.exports = {
    roomNames : ["W1N7",],
    playersNotAttack: ['StiveMan'],
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