// Configure max and min amount of sceeps to spawn by role in config. For all rooms same config
// Or configure manualRoles and enable it by enableManualRoles.
// But the rest creeps should manage itself.
let print = console.log;

// Allows to easy create creeps for out of Room things. You have time to disable it before it will be spawned.
function createNotRoomCreepsLocal() {
    // deleteAllOutCreeps();

    createMiner1Creeps();
    createReserver("E56S7", 'reserv_ochka', 'E55S7');
    createMiner2Creeps();
    createReserver("E56S7", 'reserv_ochka1', 'E56S8');
    createMiner3Creeps();
    createReserver('E57S5', 'reserv_ochka3', 'E58S5');
    // createReserver('E57S5', 'reserv_ochka4', 'E59S5');
    createMiner4Creeps();
    createReserver('E57S5', 'reserv_ochka4', 'E58S6');


    createBuildCreepInMainRoom("E56S7", 'stroilka', 'build2');
    createBuildCreepInMainRoom("E56S7", 'stroilka0', 'build2');
    // createBuildCreepInMainRoom("E56S7", 'stroilka1', 'build2');
    // createBuildCreepInMainRoom("E56S7", 'stroilka2', 'build2');
    // createBuildCreepInMainRoom("E56S7", 'stroilka3', 'build2');
    // createBuildCreepInMainRoom("E56S7", 'stroilka4', 'build2');
    // createBuildCreepInMainRoom("E57S5", 'stroilka5', 'build3');


    // createCourier("E57S5", 'courier1');
        createCourier("E57S5", 'courier2');
    // createCourier("E56S7", 'courier3');
    // createBuildCreepInMainRoom("E57S5", 'stroilka5', 'build2');

    // createReserverKillerLocal('E55S7');

    // createExplorer('E57S5');

    createCannonFodder('balast1');

    // createClaimer();

    createAttackSquad1();

    // createAttackGroup1();

    createRaiderCourier('E56S7', 'raiderCourier1');
    createRaiderCourier('E56S7', 'raiderCourier2');
    createRaiderCourier('E56S7', 'raiderCourier3');
    // createRaiderCourier('E56S7', 'raiderCourier4');


    // if (!gameHasCreep('ubivalka0047')){
    //     createOutCreep(
    //         "E56S7",
    //         "attacker",
    //         {attackFlag: 'attack',  role: 'attacker'},
    //         'ubivalka0047'
    //     )
    // }
    // if (!gameHasCreep('ubivalka048')){
    //     createOutCreep(
    //         "E56S7",
    //         "attacker",
    //         {attackFlag: 'attack',  role: 'attacker'},
    //         'ubivalka048'
    //     )
    // }
    // if (!gameHasCreep('ubivalka01')){
    //     createOutCreep(
    //         "E56S7",
    //         "attacker",
    //         {attackFlag: 'attack',  role: 'attacker'},
    //         'ubivalka01'
    //     )
    // }
    // if (!gameHasCreep('ubivalka02')){
    //     createOutCreep(
    //         "E56S7",
    //         "attacker",
    //         {attackFlag: 'attack',  role: 'attacker'},
    //         'ubivalka02'
    //     )
    // }
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
    if (!gameHasCreep('nasilnik2.2')){
        let role = 'raiderCarrier'
        createOutCreep("E56S7", role,
            {mineFlag: 'mine2',  role: role}, 'nasilnik2.2')
    }
}

function createMiner3Creeps(){
    if (!gameHasCreep('kapalka3')){
        createOutCreep(
            "E57S5",
            "raiderMiner",
            {mineFlag: 'mine3',  role: 'raiderMiner'},
            'kapalka3'
        )
    }

    if (!gameHasCreep('nasilnik3')){
        let role = 'raiderCarrier'
        createOutCreep("E57S5", role,
            {mineFlag: 'mine3',  role: role}, 'nasilnik3')
    }
    if (!gameHasCreep('nasilnik3.1')){
        let role = 'raiderCarrier'
        createOutCreep("E57S5", role,
            {mineFlag: 'mine3',  role: role}, 'nasilnik3.1')
    }
}

function createMiner4Creeps(){
    if (!gameHasCreep('kapalka4')){
        createOutCreep(
            "E57S5",
            "raiderMiner",
            {mineFlag: 'mine4',  role: 'raiderMiner'},
            'kapalka4'
        )
    }

    if (!gameHasCreep('nasilnik4')){
        let role = 'raiderCarrier'
        createOutCreep("E57S5", role,
            {mineFlag: 'mine4',  role: role}, 'nasilnik4')
    }
    if (!gameHasCreep('nasilnik4.1')){
        let role = 'raiderCarrier'
        createOutCreep("E57S5", role,
            {mineFlag: 'mine4',  role: role}, 'nasilnik4.1')
    }
    if (!gameHasCreep('nasilnik4.2')){
        let role = 'raiderCarrier'
        createOutCreep("E57S5", role,
            {mineFlag: 'mine4',  role: role}, 'nasilnik4.2')
    }
}

function createBuildCreepInMainRoom(fromRoom, name, flag){
    if (!gameHasCreep(name)){
        createOutCreep(
            fromRoom,
            "raiderBuilder",
            {buildFlag: flag,  role: 'raiderBuilder'},
            name
        )
    }
}

function createReserver(fromRoomName, name, roomName){
    if (!gameHasCreep(name)){
        createOutCreep(
            fromRoomName,
            "reserver",
            {role: 'reserver', roomName: roomName},
            name
        )
    }
}

function createCourier(fromRoomName, name){
    if (!gameHasCreep(name)){
        createOutCreep(
            fromRoomName,
            "courier",
            {role: 'courier'},
            name
        )
    }
}

function createRaiderCourier(fromRoomName, name){
    if (!gameHasCreep(name)){
        createOutCreep(
            fromRoomName,
            "raiderCourier",
            {role: 'raiderCourier', roomCreation: fromRoomName},
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

function createExplorer(fromRoom){
    if (!gameHasCreep('hodilka')){
        createOutCreep(
            fromRoom,
            "explorer",
            {role: 'explorer'},
            'hodilka'
        )
    }
}

function createCannonFodder(name){
    if (!gameHasCreep(name)){
        createOutCreep(
            "E56S7",
            "cannonFodder",
            {role: 'cannonFodder'},
            name
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

function createSmallInvaderKillerLocal(fromRoomName, attackRoom){
    if (!gameHasCreep('umri_100kshnik')){
        createOutCreep(
            fromRoomName,
            "smallInvaderKiller",
            {role: 'smallInvaderKiller', attackRoom: attackRoom},
            'umri_100kshnik'
        )
    }
}

function createAttackGroup1(){
    if (!gameHasCreep('ubivalka047')){
        createOutCreep(
            "E57S5",
            "attacker",
            {attackFlag: 'defend',  role: 'attacker'},
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
    // if (!gameHasCreep('s1a')){
    //     createOutCreep(
    //         "E56S7",
    //         "squad1Attacker_attacker",
    //         {role: 'squad1Attacker_attacker'},
    //         's1a'
    //     )
    // }
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




