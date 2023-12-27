// Configure max and min amount of sceeps to spawn by role in config. For all rooms same config
// Or configure manualRoles and enable it by enableManualRoles.
// But the rest creeps should manage itself.
let print = console.log;

// Allows to easy create creeps for out of Room things. You have time to disable it before it will be spawned.
let createNotRoomCreeps = {
    run: function() {
        // createOutCreep("E56S7", "raiderMiner", {mineFlag: 'mine1'}, 'pervinah')
    },
};

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
        memory: memory
    }
}

module.exports = createNotRoomCreeps;