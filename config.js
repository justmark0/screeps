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
        'resourceMiner': 1,
    },
    "E57S5": {
        "miner": 2,
        "worker": 2,
        "updater":  5,
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
    roomNames : ["E56S7", "E57S5"],
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
        "E57S4": {
            "storageLinkID": "",
            "5bbcb07d9099fc012e63c427": "",
        }
    },
    minerRaiderData: {
        "mine1": {"sourceID": "5bbcb0599099fc012e63c021", "sourceRoom": new RoomPosition(25,25,'E55S7'), "returnRoomPos": new RoomPosition(25,25,'E56S7')},
        "mine2": {"sourceID": "5bbcb06c9099fc012e63c25b", "sourceRoom": new RoomPosition(25,25,'E56S8'), "returnRoomPos": new RoomPosition(25,25,'E56S7')},
        "mine3": {"sourceID": "5bbcb08f9099fc012e63c5b3", "sourceRoom": new RoomPosition(25,25,'E57S5'), "returnRoomPos": new RoomPosition(25,25,'E57S5')},
    },
    resourceMinerData: {
        "E56S7": "5bbcb712d867df5e54207cf4",
        "E56S7_type": "L"
    },
    courierData: {// roomName: linkID carry from to storage
        // 'E56S7': {fromID: "658400ee40e9513aac9d6f06", toID: "6583e59886ac8f4e61c82460"},
        'E57S5': {fromPos: new RoomPosition(22,35,'E57S5'), toID: "658f84a71f6566719e95997e"},
        'courier1': {fromPos: new RoomPosition(22,35,'E57S5'), toID: "658f84a71f6566719e95997e"},
        'courier2': {fromPos: new RoomPosition(11,30,'E57S5'), toID: "658f84a71f6566719e95997e"},
    },
    spawns: {
        "E56S7": {"norm": ["Spawn1", ""], "power": ""},
        "E57S5": {"norm": ["Spawn2", ""], "power": ""},
        "E57S4": {"norm": ["Spawn3", ""], "power": ""},
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