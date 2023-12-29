// Configure max and min amount of sceeps to spawn by role in config. For all rooms same config
// Or configure manualRoles and enable it by enableManualRoles.
// But the rest creeps should manage itself.
let print = console.log;

// Allows to easy create creeps for out of Room things. You have time to disable it before it will be spawned.
function createNotRoomCreepsLocal() {
        // deleteAllOutCreeps();

        createMiner1Creeps();
        createReserver('reserv_ochka', 'E55S7');
        createMiner2Creeps();
        createReserver('reserv_ochka1', 'E56S8');

        createBuildCreepInMainRoom('stroilka', 'build1');
        createBuildCreepInMainRoom('stroilka0', 'build1');
        createBuildCreepInMainRoom('stroilka1', 'build1');
        createBuildCreepInMainRoom('stroilka2', 'build1');
        createBuildCreepInMainRoom('stroilka3', 'build1');
        // createBuildCreepInMainRoom('stroilka4', 'build1');

        // createReserverKillerLocal('E55S7');

        // createAttackGroup1();

        // createExplorer();

        // createClaimer();

        // createAttackSquad1();
}

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

module.exports = {
    createReserverKiller: createReserverKillerLocal,
    createNotRoomCreeps: createNotRoomCreepsLocal,
    createSmallInvaderKiller: createSmallInvaderKillerLocal,
};


function createMiner1Creeps(){
    if (!gameHasCreep('kapalka')){
        createOutCreep(
            "E56S7",
            "raiderMiner",
            {mineFlag: 'mine1',  role: 'raiderMiner'},
            'kapalka'
        )
    }

    if (!gameHasCreep('nasilnik')){
        let role = 'raiderCarrier'
        createOutCreep("E56S7", role,
            {mineFlag: 'mine1',  role: role}, 'nasilnik')
    }
    if (!gameHasCreep('nasilnik1.1')){
        let role = 'raiderCarrier'
        createOutCreep("E56S7", role,
            {mineFlag: 'mine1',  role: role}, 'nasilnik1.1')
    }
}

function createMiner2Creeps(){
    if (!gameHasCreep('kapalka2')){
        createOutCreep(
            "E56S7",
            "raiderMiner",
            {mineFlag: 'mine2',  role: 'raiderMiner'},
            'kapalk2'
        )
    }

    if (!gameHasCreep('nasilnik2')){
        let role = 'raiderCarrier'
        createOutCreep("E56S7", role,
            {mineFlag: 'mine2',  role: role}, 'nasilnik2')
    }
    if (!gameHasCreep('nasilnik2.1')){
        let role = 'raiderCarrier'
        createOutCreep("E56S7", role,
            {mineFlag: 'mine2',  role: role}, 'nasilnik2.1')
    }
}

function createBuildCreepInMainRoom(name, flag){
    if (!gameHasCreep(name)){
        createOutCreep(
            "E56S7",
            "raiderBuilder",
            {buildFlag: flag,  role: 'raiderBuilder'},
            name
        )
    }
}

function createReserver(name, roomName){
    if (!gameHasCreep(name)){
        createOutCreep(
            "E56S7",
            "reserver",
            {role: 'reserver', roomName: roomName},
            name
        )
    }
}

function createClaimer(){
    if (!gameHasCreep('zahvat_pizdi')){
        createOutCreep(
            "E56S7",
            "claimer",
            {role: 'claimer'},
            'zahvat_pizdi'
        )
    }
}

function createExplorer(){
    if (!gameHasCreep('hodilka')){
        createOutCreep(
            "E56S7",
            "explorer",
            {role: 'explorer'},
            'hodilka'
        )
    }
}
function createReserverKillerLocal(attackRoom){
    if (!gameHasCreep('ne_budet_tut_invader-ov')){
        createOutCreep(
            "E56S7",
            "reserverKiller",
            {role: 'reserverKiller', attackRoom: attackRoom},
            'ne_budet_tut_invader-ov'
        )
    }
}

function createSmallInvaderKillerLocal(attackRoom){
    if (!gameHasCreep('umri_100kshnik')){
        createOutCreep(
            "E56S7",
            "smallInvaderKiller",
            {role: 'smallInvaderKiller', attackRoom: attackRoom},
            'umri_100kshnik'
        )
    }
}

function createAttackGroup1(){
    if (!gameHasCreep('ubivalka047')){
        createOutCreep(
            "E56S7",
            "attacker",
            {attackFlag: 'attack',  role: 'attacker'},
            'ubivalka047'
        )
    }

    // if (!gameHasCreep('lechilka047')) {
        // createOutCreep(
        //     "E56S7",
        //     "raiderMiner",
        //     {mineFlag: 'mine1',  role: 'raiderCarrier'},
        //     'lechilka047'
        // )
    // }
}


function createAttackSquad1(){
    if (!gameHasCreep('s1a')){
        createOutCreep(
            "E56S7",
            "squad1Attacker_attacker",
            {role: 'squad1Attacker_attacker'},
            's1a'
        )
    }
    if (!gameHasCreep('s1h1')){
        createOutCreep(
            "E56S7",
            "squad1Attacker_healer",
            {role: 'squad1Attacker_healer'},
            's1h1'
        )
    }
    if (!gameHasCreep('s1h2')){
        createOutCreep(
            "E56S7",
            "squad1Attacker_healer",
            {role: 'squad1Attacker_healer'},
            's1h2'
        )
    }
    if (!gameHasCreep('s1h3')){
        createOutCreep(
            "E56S7",
            "squad1Attacker_healer",
            {role: 'squad1Attacker_healer'},
            's1h3'
        )
    }
}




