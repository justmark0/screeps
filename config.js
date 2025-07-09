// ==================================== Main account config ====================================
let manualRoles = {
    "E56S7": {
        "miner": 2,
        "worker": 1,
        "updater":  4,
        "towerWorker": 0,
        "builder": 0,
        "helper": 0,
        "claimer": 0,
        "spawnHelper": 0,
        'resourceMiner': 0,
    },
    "E57S5": {
        "miner": 2,
        "worker": 2,
        "updater":  1,
        "towerWorker": 0,
        "builder": 0,
        "helper": 0,
        "claimer": 0,
        "spawnHelper": 0,
        "attacker": 0,
        "healer": 0,
        'resourceMiner': 0,
    },
    "E57S4": {
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
    },
    "E59S5": {
        "miner": 1,
        "worker": 2,
        "updater":  2,
        "towerWorker": 0,
        "builder": 0,
        "helper": 0,
        "claimer": 0,
        "spawnHelper": 0,
        "attacker": 0,
        "healer": 0,
    },
}
let roomNames =["E56S7", "E57S5", "E57S4", "E59S5"]
let spawns = {
    "E56S7": {"norm": ["Spawn1", "Spawn5", "Spawn7"], "power": ""},
    "E57S5": {"norm": ["Spawn2", "Spawn6"], "power": ""},
    "E57S4": {"norm": ["Spawn3", "Spawn9"], "power": ""},
    "E59S5": {"norm": ["Spawn4", "Spawn8"], "power": ""},
}
let minerData =  {
    // sourceID = linkID
    "E56S7": {"storageLinkID": "6597057410cf664cce05ca9f", "5bbcb06c9099fc012e63c259": "6583e59886ac8f4e61c82460", "5bbcb06c9099fc012e63c257": "658c47a74ec40218c32e6fd7", "controllerLindID": "65b5763dcdbed231821a9308"},
    "E57S5": {"storageLinkID": "6592f6ce6eeff62e519bd839", "5bbcb07d9099fc012e63c42d": "659338a0a131d16394286080", "5bbcb07d9099fc012e63c42c": "659a6887f98c8a2ccd9622c2", "controllerLindID": ""},
    "E57S4": {"storageLinkID": "6594857548b17277356e35f5", "5bbcb07d9099fc012e63c427": "659474e101750573b252ba79", "controllerLindID": ""},
    "E59S5": {"storageLinkID": "65a41af2b80dc0c090c1f62a", "5bbcb0a09099fc012e63c73a": "65a2751558c1a2fb06791bd8", "controllerLindID": ""},
}
let minerRaiderData = {
    "mine1": {"sourceID": "5bbcb0599099fc012e63c021", "sourceRoom": new RoomPosition(25,25,'E55S7'), "returnRoomPos": new RoomPosition(25,25,'E56S7')},
    "mine2": {"sourceID": "5bbcb06c9099fc012e63c25b", "sourceRoom": new RoomPosition(25,25,'E56S8'), "returnRoomPos": new RoomPosition(25,25,'E56S7')},
    "mine3": {"sourceID": "5bbcb08f9099fc012e63c5b3", "sourceRoom": new RoomPosition(25,25,'E58S5'), "returnRoomPos": new RoomPosition(25,25,'E57S5')},
    'mine4': {"sourceID": '5bbcb08f9099fc012e63c5b6', 'sourceRoom': new RoomPosition(25,25,'E58S6'), 'returnRoomPos': new RoomPosition(25,25,'E57S5')},
    'mine5': {"sourceID": '5bbcb0a09099fc012e63c73c', 'sourceRoom': new RoomPosition(25,25,'E59S6'), 'returnRoomPos': new RoomPosition(25,25,'E59S5')},
}
let resourceMinerData =  {
    "E56S7": "5bbcb712d867df5e54207cf4", "E56S7_type": "L",
    "E57S5": "5bbcb71fd867df5e54207d4f", "E57S5_type": "U",
}
let courierData = {// roomName: linkID carry from to storage
    'courier1': {fromPos: new RoomPosition(22,35,'E57S5'), toID: "658f84a71f6566719e95997e"},
    'courier2': {fromPos: new RoomPosition(11,30,'E57S5'), toID: "658f84a71f6566719e95997e"},
    'courier3': {fromPos: new RoomPosition(26,30,'E57S8'), toPos: new RoomPosition(11,30,'E56S7'), toID: "658f84a71f6566719e95997e"},
}

// // ==================================== Second account config ====================================
// let manualRoles = {
//     "E53S1": {
//         "miner": 2,
//         "worker": 2,
//         "updater":  5,
//         "towerWorker": 0,
//         "builder":  0,
//         "helper": 0,
//         "claimer": 0,
//         "spawnHelper": 0,
//         'resourceMiner': 0,
//     },
// }
// let roomNames = ["E53S1",]
// let spawns = {
//     "E53S1": {"norm": ["Spawn1", ""], "power": ""},
// }
// let minerData =  {
//     "E53S1": { // sourceID = linkID
//         "storageLinkID": "",
//         "5bbcb0379099fc012e63bbdf": "",
//         "5bbcb0379099fc012e63bbe0": "",
//     },
// }
// let minerRaiderData = {
//         "mine1": {"sourceID": "", "sourceRoom": new RoomPosition(25,25,'E52S1'), "returnRoomPos": new RoomPosition(25,25,'E53S1')},
// }
// let resourceMinerData = {}
// let courierData = {// roomName: linkID carry from to storage
// }
// // ===================================================

let enableManualRoles = true;
module.exports = {
    playersNotAttack: ['StiveMan1'],
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
    roomNames: roomNames,
    spawns: spawns,
    minerData: minerData,
    minerRaiderData: minerRaiderData,
    resourceMinerData: resourceMinerData,
    courierData: courierData,
};