let manualRoles = {
    "E56S7": {
        "miner": 2,
        "worker": 3,
        "updater":  1,
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
        "updater":  2,
        "towerWorker": 0,
        "builder": 0,
        "helper": 0,
        "claimer": 0,
        "spawnHelper": 0,
        "attacker": 0,
        "healer": 0,
    },
    "E57S4": {
        "miner": 2,
        "worker": 1,
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
        "worker": 1,
        "updater":  1,
        "towerWorker": 1,
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
    roomNames : ["E56S7", "E57S5", "E57S4", "E59S5"],
    minerData: {
        "E56S7": { // sourceID = linkID
            "storageLinkID": "6597057410cf664cce05ca9f",
            "5bbcb06c9099fc012e63c259": "6583e59886ac8f4e61c82460",
            "5bbcb06c9099fc012e63c257": "658c47a74ec40218c32e6fd7",
        },
        "E57S5": { // sourceID = linkID
            "storageLinkID": "6592f6ce6eeff62e519bd839",
            "5bbcb07d9099fc012e63c42d": "659338a0a131d16394286080",
            "5bbcb07d9099fc012e63c42c": "",
        },
        "E57S4": { // sourceID = linkID
            "storageLinkID": "6594857548b17277356e35f5",
            "5bbcb07d9099fc012e63c427": "659474e101750573b252ba79",
        },
        "E59S5": { // sourceID = linkID
            "storageLinkID": "",
            "5bbcb0a09099fc012e63c73a": "",
        },
    },
    minerRaiderData: {
        "mine1": {"sourceID": "5bbcb0599099fc012e63c021", "sourceRoom": new RoomPosition(25,25,'E55S7'), "returnRoomPos": new RoomPosition(25,25,'E56S7')},
        "mine2": {"sourceID": "5bbcb06c9099fc012e63c25b", "sourceRoom": new RoomPosition(25,25,'E56S8'), "returnRoomPos": new RoomPosition(25,25,'E56S7')},
        "mine3": {"sourceID": "5bbcb08f9099fc012e63c5b3", "sourceRoom": new RoomPosition(25,25,'E58S5'), "returnRoomPos": new RoomPosition(25,25,'E57S5')},
        'mine4': {"sourceID": '5bbcb08f9099fc012e63c5b6', 'sourceRoom': new RoomPosition(25,25,'E58S6'), 'returnRoomPos': new RoomPosition(25,25,'E57S5')},
    },
    resourceMinerData: {
        "E56S7": "5bbcb712d867df5e54207cf4",
        "E56S7_type": "L"
    },
    courierData: {// roomName: linkID carry from to storage
        'courier1': {fromPos: new RoomPosition(22,35,'E57S5'), toID: "658f84a71f6566719e95997e"},
        'courier2': {fromPos: new RoomPosition(11,30,'E57S5'), toID: "658f84a71f6566719e95997e"},
        'courier3': {fromPos: new RoomPosition(26,30,'E57S8'), toPos: new RoomPosition(11,30,'E56S7'), toID: "658f84a71f6566719e95997e"},
    },
    spawns: {
        "E56S7": {"norm": ["Spawn1", ""], "power": ""},
        "E57S5": {"norm": ["Spawn2", ""], "power": ""},
        "E57S4": {"norm": ["Spawn3", ""], "power": ""},
        "E59S5": {"norm": ["Spawn4", ""], "power": ""},
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