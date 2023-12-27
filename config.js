let manualRoles = {
    "miner": 2,
    "spawnHelper": 0,
    "updater":  3,
    "towerWorker": 0,
    "builder": 0,
    "helper": 0,
    "claimer": 0,
    "worker": 1,
}
let enableManualRoles = true;

module.exports = {
    roomNames : ["E56S7",],
    minerData: {
        "E56S7": {// sourceID = linkID
            "storageLinkID": "658400ee40e9513aac9d6f06",
            "5bbcb06c9099fc012e63c259": "6583e59886ac8f4e61c82460",
            "5bbcb06c9099fc012e63c257": "",
        },
    },
    spawns: {
        "E56S7": {"norm": ["Spawn1", ""], "power": ""},
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