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
let cooldown = 150
let rolesNotToChange = ['miner', 'raider', 'helper', 'updater', 'claimer']
let recommendedRolesCost = {
    "miner": 500,
    "updater": 700,
    "claimer": 800,
    "worker": 300,
}

// One of primary ideas is to fully consume and distubute energy with minimal amount of creeps.
function creepManager() {
    try {
        testFunc()
    } catch (error) {
        print('testFunc: ' + error.message);
    }
    deleteDeadCreeps()
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

        let rolesToCreate = distributeEnergySupplyRoles(roomCreeps, roles)
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
            continue;
        }
        createCreepIfEnoughEnergy(roomName, nextRole, roomRoles)
    }
    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName]
        runCreepProgram(creep.memory.role, creep);
    }
}

// function to test some theories or check code.
function testFunc() {
    // creep = Game.creeps['54173855']
    // Memory.lastSpawn = {"E56S7": Game.time}
    // print(JSON.stringify(Game));
    // creep.memory.role = 'worker'
}

function deleteDeadCreeps(){
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]){
            delete Memory.creeps[name];
        }
    }
}

// This function returns calculated roles needed in a room or returned manualRoles
function calculateNeededRoles() {
    if (enableManualRoles){
        return { ...manualRoles }
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
// function NeedToCreateCreep(roomCreeps, rolesNeeded) {
//     for (let role in rolesNeeded){
//         if (rolesNeeded[role] > 0){
//             return true
//         }
//     }
//     return false
// }

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
    if (isRoomHasMiner){
        if (rolesToCreate.includes('worker')){
            return 'worker'
        }
        if (rolesToCreate.includes('miner')){
            return 'miner'
        }
    } else {
        if (rolesToCreate.includes('miner')){
            return 'miner'
        }
        if (rolesToCreate.includes('worker')){
            return 'worker'
        }
    }

    if (rolesToCreate.includes('updater')){
        return 'updater'
    }
    if (rolesToCreate.includes('towerWorker')){
        return 'towerWorker'
    }
    if (rolesToCreate.includes('helper')){
        return 'helper'
    }
    if (rolesToCreate.includes('claimer')){
        return 'claimer'
    }
    if (rolesToCreate.includes('worker')){
        return 'worker'
    }
    return 'updater'
}

function createCreepIfEnoughEnergy(roomName, role, roomRoles) {
    let spawn = Game.spawns[spawns[roomName]['norm'][0]]  // TODO filter right spawn
    if (spawn === undefined){
        print('NO SPAWN IN CONFIG')
    }
    let body = getBodyByRole(role, spawn.room.energyAvailable, roomRoles)
    if (body.length === 0){
        return
    }
    let creepName = getCreepName(role)
    // let structuresOrder = findClosestByRange()
    let result = spawn.spawnCreep(body, creepName, {memory: {role: role}})
    if (result === OK){
        Memory.lastSpawn[roomName] = Game.time
        return
    }
    if (result !== ERR_BUSY){
        print('creep manager: can not create creep', creepName, 'with role', role, 'and body', body, 'because', result)
    }
    // Primary spawn busy creating creep, using secondary.
    if (spawns[roomName]['norm'][1] !== ""){
        spawn = Game.spawns[spawns[roomName]['norm'][1]]  // TODO filter right spawn
        result = spawn.spawnCreep(body, creepName, {memory: {role: role}})
        if (result === OK){
            Memory.lastSpawn[roomName] = Game.time
            return
        }
        print('creep manager: can not create creep', creepName, 'with role', role, 'and body', body, 'because', result)
    }
}

function getBodyByRole(role, availableEnergy, roomRoles) {
    let minEnergy = 300
    if (roomRoles.has('miner') && roomRoles.has('worker')){
        if (recommendedRolesCost[role] !== undefined){
            minEnergy = recommendedRolesCost[role]
            print('since room has miner and worker, minEnergy for', role, 'is ', minEnergy)
        }
    }
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
        let maxBody = [MOVE, CARRY, WORK, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'claimer'){
        let maxBody = [MOVE, MOVE, MOVE, MOVE, CLAIM]
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
    return resultParams
}
function getCreepName(role) {
    if (role === 'miner'){
        return 'miner' + Game.time
    }
    if (role === 'helper'){
        return 'helper' + Game.time
    }
    if (role === 'miner'){
        return '' + Game.time
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
    }
}

module.exports = creepManager;