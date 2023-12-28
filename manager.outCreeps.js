// Configure max and min amount of sceeps to spawn by role in config. For all rooms same config
// Or configure manualRoles and enable it by enableManualRoles.
// But the rest creeps should manage itself.
let print = console.log;

// Allows to easy create creeps for out of Room things. You have time to disable it before it will be spawned.
let createNotRoomCreeps = {
    run: function() {
        // deleteAllOutCreeps();
        createMiner1Creeps();
        // createE56S7AttackGroup();
    },
};


function gameHasCreep(nameCreep){
    let hasCreep = false;
    for(let name in Memory.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.name === nameCreep){
            hasCreep = true;
        }
    }
    return false
}

function deleteAllOutCreeps(){
    for(let roomName in Memory.outCreeps) {
        for(let name in Memory.outCreeps[roomName]) {
           Memory.outCreeps[roomName][name] = null;
        }
    }
}

// if (role === 'claimer'){
//     // memory['target'] = 'E57S5'
// }
// if (role === 'attacker'){
//     memory['attackFlag'] = 'attack'
// }
// if (role === 'healer'){
//     memory['followCreepName'] = 'attacker00000'
// }
// if (role === 'minerRaider'){
//     memory['mineFlag'] = 'mine1'
// }
// if (role === 'raiderCarrier'){
//     memory['mineFlag'] = 'mine1'
// }

function createOutCreep(roomName, role, memory, idempotency) { // TODO maybe add body
    if (Memory.outCreeps === undefined){
        Memory.outCreeps = {}
    }
    name = idempotency

    if (Memory.outCreeps[roomName] === undefined){
        Memory.outCreeps[roomName] = {}
    }

    Memory.outCreeps[roomName][name] = {
        role: role,
        memory: memory,
    }
}

module.exports = createNotRoomCreeps;


function createMiner1Creeps(){
    if (!gameHasCreep('kapalka')){
        createOutCreep(
            "E56S7",
            "raiderMiner",
            {mineFlag: 'mine1',  role: 'raiderMiner', alreadyAtSource: false},
            'kapalka'
        )
    }

    if (!gameHasCreep('nasilnik')){
        createOutCreep(
            "E56S7",
            "raiderMiner",
            {mineFlag: 'mine1',  role: 'raiderCarrier'},
            'nasilnik'
        )
    }
}

function createE56S7AttackGroup(){
    if (!gameHasCreep('ubivalka047')){
        // createOutCreep(
        //     "E56S7",
        //     "raiderMiner",
        //     {mineFlag: 'mine1',  role: 'raiderMiner', alreadyAtSource: false},
        //     'ubivalka047'
        // )
    }

    if (!gameHasCreep('lechilka047')) {
        // createOutCreep(
        //     "E56S7",
        //     "raiderMiner",
        //     {mineFlag: 'mine1',  role: 'raiderCarrier'},
        //     'lechilka047'
        // )
    }
}







