let manualRoles = {
    "miner": 2,
    "spawnHelper": 0,
    "updater":  3,
    "towerWorker": 0,
    "builder": 0,
    "helper": 0,
    "worker": 1,
}
let enableManualRoles = true;

module.exports = {
    roomNames : ["sim",],
    minerData: {
        "sim": {// sourceID = linkID
            "storageLinkID": "648a0397012a5b09da85271a",
            "35ecdf157fc124ba2fe57e55": "1e00603534a2540b01befd14",
            "5f2fbc22c2b81b1d1f77100e": "f23cabb6735bb23f285ca269",
        },
    },
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