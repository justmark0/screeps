// Configure max and min amount of sceeps to spawn by role in config. For all rooms same config
// Or configure manualRoles and enable it by enableManualRoles.
// But the rest creeps should manage itself.
let print = console.log;
const {
    roomNames,
    minRolesConfig,
    maxRolesConfig,
    manualRoles,
    enableManualRoles,
    spawns,
} = require('config');
let cooldown = 1
let freezeCreationOfOutCreeps = false;
// let rolesToChange = ['miner', 'raider', 'helper', 'updater', 'claimer', 'attacker', 'healer']
let recommendedRolesCost = {
    "miner": 800,
    "updater": 700,
    "claimer": 800,
    "attacker": 2000,
    "builder": 850,
    "healer": 1500,
    "worker": 500,
    "raiderCarrier": 1000,
    "raiderMiner": 900,
    "raiderBuilder": 1000,
    "reserverKiller": 1900,
    "reserver": 1300,
    'courier': 850,
    'resourceMiner': 850,
    'smallInvaderKiller': 700,
    'squad1Attacker_attacker': 2250,
    'squad1Attacker_healer': 2300,
    'cannonFodder': 1250,
    'raiderCourier':1900,
}

// One of primary ideas is to fully consume and distubute energy with minimal amount of creeps.
function creepManager() {
    //runSelectedCreepsOnly();return;
    try {
        testFunc()
    } catch (error) {
        print('testFunc: ' + error.message);
    }
    deleteDeadCreeps()
    require('manager.outCreeps').createNotRoomCreeps();
    // setClaimerRoomTarget("", "E56S7")
    for (let roomName of roomNames) {
        print('-------------roomName:', roomName)
        buildDefendersIfNeeded(roomName)
        let roomCreeps = []
        for (let creepName in Game.creeps) {
            let creep = Game.creeps[creepName];
            // print('creep', JSON.stringify(creep))
            if (creep.room.name === roomName){
                roomCreeps.push(creep)
            }
        }
        creepInfo(roomCreeps, roomName)
        if (Game.time - Memory.lastSpawn[roomName] < cooldown) {
            print('Spawn cooldown', cooldown - (Game.time - Memory.lastSpawn[roomName]))
            continue;
        }

        let roles = calculateNeededRoles(roomName)

        // let rolesNeededLog = ""
        // for (let role in roles){
        //     if (roles[role] > 0){
        //         rolesNeededLog += role + ":" + roles[role] + ", "
        //     }
        // }
        // print('roles needed:', rolesNeededLog)

        // let rolesToCreate = distributeEnergySupplyRoles(roomCreeps, roles)
        let rolesToCreate = getRolesToCreate(roomCreeps, roles)
        let roomRoles = getRoomRoles(roomCreeps)
        let nextRole = roleToCreateNext(rolesToCreate, roomRoles)

        let rolesToCreateLog = ""
        for (let role in rolesToCreate){
            if (roles[role] > 0){
                rolesToCreateLog += role + ":" + rolesToCreate[role] + ", "
            }
        }
        if (rolesToCreateLog !== ""){
            print('roles to create:', rolesToCreateLog, '. Next role:', nextRole)
        }
        if (nextRole === null){
            // try to create out creeps
            let outCreepName = getOutCreepsForRoom(roomName)
            if (outCreepName === null){
                continue;
            }
            print('Next outCreep to create:', outCreepName)
            if (freezeCreationOfOutCreeps){
                continue;
            }
            let outCreep = Memory.outCreeps[roomName][outCreepName]
            let res = createCreepIfEnoughEnergy(roomName, outCreep['role'], roomRoles, outCreepName, outCreep['memory'])
            if (res !== OK){
                print('could not create outCreep', outCreepName, res)
                continue;
            }
            if (Memory.outCreeps[roomName][outCreepName] === undefined) {
                Memory.outCreeps[roomName][outCreepName] = null;
            } else{
                Memory.outCreeps[roomName][outCreepName]['createdAt'] = Game.time;
            }
            continue;
        }
        print('nextRole is', nextRole)
        createCreepIfEnoughEnergy(roomName, nextRole, roomRoles, getCreepName(nextRole), null)
    }
    print('-------------creeps:')
    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName]
        // try {
        runCreepProgram(creep.memory.role, creep);
        // } catch (error) {
        //     print('❌ runCreepProgram: ' + error.message);
        // }
    }
    // require('manager.squad').oneAttackerSquad1();
}

function runSelectedCreepsOnly(){
    for (let creepName in Game.creeps) {
        if (['s1h1', 's1h2', 's1h3', 's1h4', 's1h5', 'ubivalka048', 'ubivalka01', 'ubivalka02'].includes(creepName) ){  //|| creepName.includes('worker')) {
            let creep = Game.creeps[creepName]
            runCreepProgram(creep.memory.role, creep);
        }
    }
    return;
}
// notRoomCreeps: {
//     "E56S7": {"attacker_1283": {"role": "attacker", "memory": {""}}},
// },


// function to test some theories or check code.
function testFunc() {
    Game.cpu.generatePixel()

    // if (Game.time == 55203000){
    // Game.rooms['E57S5'].terminal.send(RESOURCE_ENERGY, 200000, 'E53S1')
    // Game.rooms['E57S5'].terminal.send(RESOURCE_ENERGY, 100000, 'E53S1')

    // }
    //

    // Memory.outCreeps["E57S5"]['ubivalka0047'] = null;

    // print(JSON.stringify(Game))
    // let res = getMaxParams( [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL], 10000)
    // for (let creepName in Game.creeps) {
    //     let creep = Game.creeps[creepName]
    //     // creep.memory.role = 'worker'
    //     if (creep.memory.role === 'healer'){
    //         creep.memory.followCreepName = 'attacker54187845'
    //     }
    // }
    // Memory.creeps['pervinah'].alreadyAtSource = false;

//     Memory.outCreeps["E56S7"]['zashitit_vseh1'] = null;
//         Memory.outCreeps["E56S7"]['zashitit_vseh2'] = null;
// Memory.outCreeps["E57S5"]['zashitit_vseh1'] = null;
//         Memory.outCreeps["E57S5"]['zashitit_vseh2'] = null;

    // delete Memory.outCreeps["E56S7"]['pervinah']
    //  Memory.outCreeps["E56S7"]['raiderCourier1'] = null;
    //  Memory.outCreeps["E56S7"]['raiderCourier2'] = null;Memory.outCreeps["E56S7"]['raiderCourier3'] = null;Memory.outCreeps["E56S7"]['raiderCourier4'] = null;
    //Memory.outCreeps["E56S7"]['sh1'] = null;
    //  Memory.outCreeps["E56S7"]['nasilnik'] = null;

    //Game.creeps['raiderCourier1'].memory.isRightRoom = true;

    // Memory.outCreeps["E56S7"]['s1h1-ov'] = null;

    // Game.creeps['ne_budet_tut_invader-ov'].memory.attackRoom = 'E55S7';

    // Game.creeps['reserv_ochka4'].memory.roomName = 'E58S6';


    // Game.creeps['54277646'].drop("L");


    // Game.creeps['54269902'].memory.mine = true;
    // Memory.outCreeps['E56S7']['pervinahCarry']['busy'] = true;
    // let pos = RoomPosition(25,25,'E56S7');
    // Memory.lastSpawn = {"E56S7": Game.time}
    // print(JSON.stringify(Game));
}

function buildDefendersIfNeeded(roomName){
    if (Game.rooms[roomName] === undefined) {
        return;
    }
    let invaderCore =  Game.rooms[roomName].find(FIND_HOSTILE_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_INVADER_CORE
    });
    if (invaderCore !== undefined && invaderCore.length === 0){
        return;
    }
    require('manager.outCreeps').createReserverKiller(roomName);
    print("FOUND INVADER CORE IN ROOM. spawning defence...", roomName)
}

function deleteDeadCreeps(){
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]){
            delete Memory.creeps[name];
        }
    }
    for (let roomName in Memory.outCreeps){
        for(let name in Memory.outCreeps[roomName]) {
            if (Memory.outCreeps[roomName][name] === null){
                continue
            }
            if (Game.creeps[name] !== undefined){
                Memory.outCreeps[roomName][name]['createdAt'] = Game.time;
                continue
            }
            if (Memory.outCreeps[roomName][name]['createdAt'] !== undefined){
                print('outCreep', name, 'died')
                Memory.outCreeps[roomName][name] = null;
            }
        }

    }
}

function getOutCreepsForRoom(roomName){
    if (Memory.outCreeps[roomName] === undefined){
        Memory.outCreeps[roomName] = {}
    }
    let priority = ['umri_100kshnik', 'ne_budet_tut_invader-ov', 'balast1', 'ubivalka0047', 's1h1', 's1h2', 's1h3', 'ubivalka02', 'explorer', 'kapalka', 'kapalka2', 'kapalka3', 'balast1'] // 's1a', 's1h1', 's1h2', 's1h3',
    for (let outCreepName of priority){
        try{
            if (Memory.outCreeps[roomName][outCreepName] !== undefined && Memory.outCreeps[roomName][outCreepName]['createdAt'] === undefined && Game.creeps[outCreepName] === undefined){
                return outCreepName
            }
        } catch (error) {
            // print('getOutCreepsForRoom: ' + error.message);
        }
    }
    for (let outCreepName in Memory.outCreeps[roomName]){
        if (Memory.outCreeps[roomName][outCreepName] === null || Memory.outCreeps[roomName][outCreepName] === undefined){
            continue
        }
        if (Game.creeps[outCreepName] !== undefined){
            continue
        }
        if (Memory.outCreeps[roomName][outCreepName]['createdAt'] !== undefined){
            continue
        }
        return outCreepName
    }
    return null
}


// This function returns calculated roles needed in a room or returned manualRoles
function calculateNeededRoles(roomName) {
    if (enableManualRoles){
        return { ...manualRoles[roomName] }
    }
    print("calculateNeededRoles NOT IMPLEMENTED YET")
}

function isNeedToCreateCreep(rolesToCreate) {
    return rolesToCreate.length !== 0;
}

function getRoomRoles(roomCreeps) {
    let roomRoles = new Set();
    for (let creepName in roomCreeps){
        let creep = roomCreeps[creepName]
        roomRoles.add(creep.memory.role)
    }
    return roomRoles
}

function creepInfo(roomCreeps, roomName){
    roomCreeps.sort((a,b) => a.ticksToLive < b.ticksToLive ? -1 : 1);
    if (roomCreeps.length === 0){
        Game.notify('No creeps in room' + roomName)
    }
    if (roomCreeps.length > 2){
        print('creep', roomCreeps[0].memory.role, 'will die in', roomCreeps[0].ticksToLive, '|', roomCreeps[1].memory.role, 'in', roomCreeps[1].ticksToLive, '|', roomCreeps[2].memory.role, 'in', roomCreeps[2].ticksToLive)
    }
}

function setClaimerRoomTarget(creepName, roomName){

}

function getRolesToCreate(roomCreeps, roles) {
    for(let creepName in roomCreeps) {
        let creep = roomCreeps[creepName]
        roles[creep.memory.role] -= 1
    }
    let rolesToCreate = [] // todo maybe change to set
    for (let role in roles){
        if (roles[role] > 0 && roles[role] !== null){
            rolesToCreate.push(role)
        }
    }
    return rolesToCreate;
}

// This function returns roles to
function distributeEnergySupplyRoles(roomCreeps, roles) {
    let [creepsCanChangeRole, rolesNeeded] = getCreepsCanChangeRoleAndRolesRemaining(roomCreeps, roles)
    // print('creepsCanChangeRole', JSON.stringify(creepsCanChangeRole))
    for (let role in rolesNeeded){
        if (creepsCanChangeRole.length === 0){
            break;
        }
        if (rolesNotToChange.includes(role) || rolesNeeded[role] === 0){
            continue;
        }
        let changedRoles = 0
        for (let i = 0; i < rolesNeeded[role]; i++){
            if (creepsCanChangeRole.length === 0){
                break;
            }
            let creep = creepsCanChangeRole.pop()
            print('change role of creep', creep.name, 'from', creep.memory.role, 'to', role)
            creep.memory.role = role
            changedRoles += 1
        }
        rolesNeeded[role] -= changedRoles
    }

    let rolesToCreate = []
    for (let role in rolesNeeded){
        if (rolesNeeded[role] > 0){
            rolesToCreate.push(role)
        }
    }
    return rolesToCreate
}

// Returns creeps with roles that is currently more than needed now and roles needed to be created
function getCreepsCanChangeRoleAndRolesRemaining(roomCreeps, roles){
    if (roomCreeps.length === 0 || roomCreeps.length === undefined) {
        return [[], roles]
    }
    let creepsCanChangeRole = []
    for(let creepName in roomCreeps) {
        let creep = roomCreeps[creepName]
        if(roles[creep.memory.role] > 0){
            roles[creep.memory.role] -= 1
        }
        else{
            if (rolesNotToChange.includes(creep.memory.role)){
                continue;
            }
            creepsCanChangeRole.push(creep)
        }
    }
    return [creepsCanChangeRole, roles];
}

function roleToCreateNext(rolesToCreate, roomRoles) {
    let isRoomHasMiner = roomRoles.has('miner')
    let rolesPosition = []
    if (isRoomHasMiner){
        rolesPosition = ['worker', 'miner']
    } else {
        rolesPosition = ['miner', 'worker']
    }
    rolesPosition = rolesPosition.concat([
            'updater',
            'towerWorker',
            'helper',
            'claimer',
            'attacker',
            'healer',
            'builder',
            'resourceMiner',
        ]
    )
    for (let roleInt in rolesPosition) {
        if (rolesToCreate.includes(rolesPosition[roleInt])){
            return rolesPosition[roleInt]
        }
    }
    return null
}

function createCreepIfEnoughEnergy(roomName, role, roomRoles, creepName, memory) {
    let spawn = Game.spawns[spawns[roomName]['norm'][0]]  // TODO filter right spawn
    if (spawn === undefined){
        print('NO SPAWN IN CONFIG')
    }
    let body = getBodyByRole(role, spawn.room.energyAvailable, roomRoles)
    if (body.length === 0){
        return -100
    }
    // let structuresOrder = findClosestByRange()
    if (memory === null){
        memory = {role: role}
    }

    let result = spawn.spawnCreep(body, creepName, {memory: memory})
    if (result === OK){
        Memory.lastSpawn[roomName] = Game.time
        return OK
    }
    if (result !== ERR_BUSY){
        print('creep manager: can not create creep', creepName, 'with role', role, 'and body', body, 'because', result)
    }
    // Primary spawn busy creating creep, using secondary.
    if (spawns[roomName]['norm'][1] !== ""){
        spawn = Game.spawns[spawns[roomName]['norm'][1]]  // TODO filter right spawn
        if (spawn === undefined){
            Game.notify("Spawn " + spawns[roomName]['norm'][1] + " is undefined in room" + roomName, 360)
            return -100
        }
        result = spawn.spawnCreep(body, creepName, {memory: memory})
        if (result === OK){
            Memory.lastSpawn[roomName] = Game.time
            delete Memory.outCreeps[roomName][creepName]
            return OK
        }
        print('creep manager: can not create creep', creepName, 'with role', role, 'and body', body, 'because', result)
    }
    return -100
}

function getBodyByRole(role, availableEnergy, roomRoles) {
    let minEnergy = 300
    let roomIsStable = roomRoles.has('miner') && roomRoles.has('worker')
    if (roomIsStable){
        if (recommendedRolesCost[role] !== undefined){
            minEnergy = recommendedRolesCost[role]
            print('since room has miner and worker, minEnergy for', role, 'is ', minEnergy)
        }
    }
    print('availableEnergy', availableEnergy, 'minEnergy', minEnergy)
    if (availableEnergy < minEnergy){
        return []
    }
    if (role === 'miner'){
        let maxBody = [MOVE, CARRY, WORK, WORK, MOVE, WORK, WORK, WORK, WORK, CARRY]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'helper'){
        let maxBody = [MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, CARRY]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'updater'){
        let maxBody = [MOVE, CARRY, WORK, MOVE, CARRY, WORK, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, WORK, MOVE, WORK, MOVE, CARRY, MOVE, CARRY]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'builder'){
        let maxBody = [MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK,  MOVE, CARRY, WORK, MOVE, WORK, WORK]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'claimer'){
        let maxBody = [MOVE, MOVE, MOVE, MOVE, CLAIM]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'worker'){
        return getMaxParams([MOVE, CARRY, CARRY, MOVE, CARRY, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY], availableEnergy)
    }
    if (role === 'towerWorker'){
        let maxBody = [MOVE, CARRY, WORK, MOVE, CARRY]
        return getMaxParams(maxBody, availableEnergy)
    }

    if (!roomIsStable){
        return []
    }

    if (role === 'towerWorker'){
        // let maxBody =  [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        let maxBody = [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'attacker'){
        let maxBody =  [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, MOVE]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'reserverKiller'){
        let maxBody =  [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'smallInvaderKiller'){
        let maxBody =  [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'healer'){
        let maxBody =  [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'raiderMiner'){
        let maxBody =  [MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, CARRY]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'raiderCarrier'){
        let maxBody =  [MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'reserver'){
        let maxBody =  [MOVE, MOVE, CLAIM, CLAIM]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'raiderBuilder'){
        let maxBody =  [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'explorer'){
        // let maxBody =  [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        let maxBody = [MOVE, CARRY]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'squad1Attacker_attacker'){
        let maxBody =  [ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'squad1Attacker_healer'){
        let maxBody = [MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'resourceMiner'){
        let maxBody = [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'courier'){
        let maxBody = [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'cannonFodder'){
        // let maxBody =  [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        let maxBody = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'raiderCourier'){
        // let maxBody =  [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        let maxBody = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
        return getMaxParams(maxBody, availableEnergy)
    }

    return getMaxParams([MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, WORK], availableEnergy)
}

function getMaxParams(params, availableEnergy){
    let featureCost = {
        "move": 50,
        "work": 100,
        "attack": 80,
        "carry": 50,
        "heal": 250,
        "ranged_attack": 150,
        "tough": 10,
        "claim": 600
    };
    let resultParams = [];
    for (let i = 0; i < params.length; i++){
        if (availableEnergy - featureCost[params[i]] >= 0){
            resultParams.push(params[i])
            availableEnergy -= featureCost[params[i]]
        }
    }
    // print('getMaxParams cost', 10000-availableEnergy)
    return resultParams
}
function getCreepName(role) {
    return role + Game.time
}

function runCreepProgram(creepProfession, creep){
    switch(creepProfession){
        case "builder":
            return require('role.builder').run(creep);
        case "miner":
            return require('role.miner').run(creep);
        case "towerWorker":
            return require('role.towerWorker').run(creep);
        case "updater":
            return require('role.updater').run(creep);
        case "worker":
            return require('role.worker').run(creep);
        case "reserverKiller":
            return require('role.reserverKiller').run(creep);
        case "helper":
            return require('role.helper').run(creep);
        case "raider":
            return require('role.raider').run(creep);
        case "claimer":
            return require('role.claimer').run(creep);
        case "attacker":
            return require('role.attacker').run(creep);
        case "healer":
            return require('role.healer').run(creep);
        case "raiderMiner":
            return require('role.raiderMiner').run(creep);
        case "raiderCarrier":
            return require('role.raiderCarrier').run(creep);
        case "raiderBuilder":
            return require('role.raiderBuilder').run(creep);
        case "reserver":
            return require('role.reserver').run(creep);
        case "explorer":
            return require('role.explorer').run(creep);
        case "smallInvaderKiller":
            return require('role.smallInvaderKiller').run(creep);
        case "squad1Attacker_attacker":
            return require('role.squad1AttackerAttacker').run(creep);
        case "squad1Attacker_healer":
            return require('role.squad1AttackerHealer').run(creep);
        case "resourceMiner":
            return require('role.resourceMiner').run(creep);
        case "courier":
            return require('role.courier').run(creep);
        case "cannonFodder":
            return require('role.cannonFodder').run(creep);
        case "raiderCourier":
            return require('role.raiderCourier').run(creep);
    }
}

module.exports = creepManager;