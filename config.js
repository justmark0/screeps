let manualRoles = {
    "E56S7": {
        "miner": 2,
        "worker": 2,
        "updater":  2,
        "towerWorker": 0,
        "builder": 0,
        "helper": 0,
        "claimer": 0,
        "spawnHelper": 0,
        "attacker": 0,
        "healer": 0,
        "raiderMiner": 0,
        "raiderCarrier": 0,
    },
    "E57S5": {
        "miner": 1,
        "worker": 1,
        "updater":  0,
        "towerWorker": 0,
        "builder": 0,
        "helper": 0,
        "claimer": 0,
        "spawnHelper": 0,
        "attacker": 0,
        "healer": 0,
    },
}
let enableManualRoles = true;
let maxAmountOfRaiderCarriersOnOne = 2;

module.exports = {
    roomNames : ["E56S7",],
    minerData: {
        "E56S7": {// sourceID = linkID
            "storageLinkID": "658400ee40e9513aac9d6f06",
            "5bbcb06c9099fc012e63c259": "6583e59886ac8f4e61c82460",
            "5bbcb06c9099fc012e63c257": "658c47a74ec40218c32e6fd7",
        },
        "E57S5": {// sourceID = linkID
            "storageLinkID": "",
            "5bbcb07d9099fc012e63c42d": "",
            "5bbcb07d9099fc012e63c42c": "",
        },
    },
    minerRaiderData: {
        "mine1": {"sourceID": "5bbcb0599099fc012e63c021", "sourceRoom": new RoomPosition(25,25,'E55S7'), "returnRoomPos": new RoomPosition(25,25,'E56S7')},
    },
    spawns: {
        "E56S7": {"norm": ["Spawn1", ""], "power": ""},
        "E57S5": {"norm": ["Spawn2", ""], "power": ""},
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