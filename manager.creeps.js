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
let cooldown = 20
// let rolesToChange = ['miner', 'raider', 'helper', 'updater', 'claimer', 'attacker', 'healer']
let recommendedRolesCost = {
    "miner": 500,
    "updater": 700,
    "claimer": 800,
    "attacker": 1400,
    "healer":1500,
    "worker": 300,
    "raiderCarrier": 1000,
    "raiderMiner": 600,
}

// One of primary ideas is to fully consume and distubute energy with minimal amount of creeps.
function creepManager() {
    try {
        testFunc()
    } catch (error) {
        print('testFunc: ' + error.message);
    }
    deleteDeadCreeps()
    require('manager.outCreeps').run();
    setClaimerRoomTarget("", "E56S7")
    for (let roomName of roomNames) {
        print('=====roomName:', roomName)
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

        let rolesNeededLog = ""
        for (let role in roles){
            if (roles[role] > 0){
                rolesNeededLog += role + ":" + roles[role] + ", "
            }
        }
        print('roles needed:', rolesNeededLog)

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
        if (!isNeedToCreateCreep(rolesToCreate)){
            // try to create out creeps
            let outCreepName = getOutCreepsForRoom(roomName)
            if (outCreepName === null){
                continue;
            }
            let outCreep = Memory.outCreeps[roomName][outCreepName]
            let res = createCreepIfEnoughEnergy(roomName, outCreep['role'], roomRoles, outCreepName, outCreep['memory'])
            if (res !== OK){
                print('could not create outCreep', outCreepName, res)
                continue;
            }
            Memory.outCreeps[roomName][outCreepName] = null;
            continue;
        }
        if (nextRole === null) {
            continue
        }
        print('nextRole is', nextRole)
        createCreepIfEnoughEnergy(roomName, nextRole, roomRoles, getCreepName(nextRole), null)
    }
    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName]
        runCreepProgram(creep.memory.role, creep);
    }
}

// notRoomCreeps: {
//     "E56S7": {"attacker_1283": {"role": "attacker", "memory": {""}}},
// },


// function to test some theories or check code.
function testFunc() {
    // let res = getMaxParams( [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL], 10000)
    // for (let creepName in Game.creeps) {
    //     let creep = Game.creeps[creepName]
    //     // creep.memory.role = 'worker'
    //     if (creep.memory.role === 'healer'){
    //         creep.memory.followCreepName = 'attacker54187845'
    //     }
    // }
    // Memory.creeps['pervinah'].alreadyAtSource = false;
    // Memory.outCreeps["E56S7"]['pervinahCarry'].respawn = true;
    // delete Memory.outCreeps["E56S7"]['pervinah']
    // delete Memory.outCreeps["E56S7"]['pervinahCarry']


    // Memory.outCreeps['E56S7']['pervinahCarry']['busy'] = true;
    // let pos = RoomPosition(25,25,'E56S7');
    // Game.map.visual.circle(pos);
    // Game.map.visual.circle(pos, {fill: 'transparent', radius: NUKE_RANGE*50, stroke: '#ff0000'});
    // Memory.lastSpawn = {"E56S7": Game.time}
    // print(JSON.stringify(Game));
}

function deleteDeadCreeps(){
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]){
            try {
                // print('TRY TO DELETE OUT CREEP', name)
                Memory.outCreeps[Memory.creeps[name].room.name][outCreepName] = null;
            } catch (error) {print('not out creep or err', name, error.message)}
            delete Memory.creeps[name];
        }
    }
}

function getOutCreepsForRoom(roomName){
    for (let outCreep in Memory.outCreeps[roomName]){
        if (Memory.outCreeps[roomName][outCreep] === null){
            continue
        }
        return outCreep
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
        print('creep', roomCreeps[0].memory.role, 'will die in', roomCreeps[0].ticksToLive)
        print('creep', roomCreeps[1].memory.role, 'will die in', roomCreeps[1].ticksToLive)
        print('creep', roomCreeps[2].memory.role, 'will die in', roomCreeps[2].ticksToLive)
    }
}

function setClaimerRoomTarget(creepName, roomName){

}

function getRolesToCreate(roomCreeps, roles) {
    if (roomCreeps.length === 0 || roomCreeps.length === undefined) {
        return [[], roles]
    }
    for(let creepName in roomCreeps) {
        let creep = roomCreeps[creepName]
        roles[creep.memory.role] -= 1
    }
    let rolesToCreate = [] // todo maybe change to set
    for (let role in roles){
        if (roles[role] > 0){
            rolesToCreate.push(role)
        }
    }
    print('rolestocreate', rolesToCreate)
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
        'raiderMiner',
        'raiderCarrier']
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
    print('creep manager: try to create creep', creepName, 'with role', role, 'and body', body, 'result', result)
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
        let maxBody = [MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, CARRY]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'helper'){
        let maxBody = [MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, CARRY]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'updater'){
        let maxBody = [MOVE, CARRY, WORK, MOVE, CARRY, WORK, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, WORK]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'claimer'){
        let maxBody = [MOVE, MOVE, MOVE, MOVE, CLAIM]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'worker'){
        return getMaxParams([MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, WORK], availableEnergy)
    }
    if (!roomIsStable){
        return []
    }
    if (role === 'attacker'){
        let maxBody =  [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK]
            return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'healer'){
        let maxBody =  [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'raiderCarrier'){
        let maxBody =  [MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'raiderMiner'){
        let maxBody =  [MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, CARRY]
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
    if (role === 'miner'){
        return 'miner' + Game.time
    }
    if (role === 'helper'){
        return 'helper' + Game.time
    }
    if (role === 'attacker'){
        return 'attacker' + Game.time
    }
    return Game.time
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
        case "raiderCarrier":
            return require('role.raiderCarrier').run(creep);
        case "raiderMiner":
            return require('role.raiderMiner').run(creep);
    }
}

module.exports = creepManager;