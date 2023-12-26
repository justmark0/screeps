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
} = require('config');
let cooldown = 100

// One of primary ideas is to fully consume and distubute energy with minimal amount of creeps.
function creepManager() {
    testFunc()
    deleteDeadCreeps()
    for (let roomName of roomNames) {
        // print('roomName', roomName)
        let roomCreeps = []
        for (let creepName in Game.creeps) {
            let creep = Game.creeps[creepName];
            if (creep.room.name === roomName){
                roomCreeps.push(creep)
            }
        }
        // let roomCreeps = _(Game.creeps).filter((creep) => creep.room.name === roomName)
        print('creeps', roomCreeps.length)
        let roles = calculateNeededRoles(roomName)
        print('needed roles', JSON.stringify(roles))
        let rolesToCreate = distributeEnergySupplyRoles(roomCreeps, roles)
        let nextRole = roleToCreateNext(rolesToCreate)
        print('nextRole', nextRole, rolesToCreate)
        if (!isNeedToCreateCreep(rolesToCreate)){
            continue
        }
        print('createCreepIfEnoughEnergy', roomName, nextRole)
        createCreepIfEnoughEnergy(roomName, nextRole)
    }
    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName]
        runCreepProgram(creep.memory.role, creep);
    }
}

// function to test some theories or check code.
function testFunc() {
    // print(JSON.stringify(Game.creeps));
    // for(let creepName in Game.creeps) {
    //     creep = Game.creeps[creepName]
    //     print('mlem1', _(Game.creeps).filter((creep) => creep.room.name === 'W2N2'))
    //     // creep.memory.role = 'worker'
    // }
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
        return manualRoles
    }
    print("calculateNeededRoles NOT IMPLEMENTED YET")
}

function isNeedToCreateCreep(rolesToCreate) {
    return rolesToCreate.length !== 0;
}

// This function returns roles to
function distributeEnergySupplyRoles(roomCreeps, roles) {
    print('distributeEnergySupplyRoles', JSON.stringify(roles))
    let [creepsCanChangeRole, rolesNeeded] = getCreepsCanChangeRoleAndRolesRemaining(roomCreeps, roles)
    for (let role in rolesNeeded){
        if (creepsCanChangeRole.length === 0){
            break;
        }
        print('distribution', role, rolesNeeded[role])
        if (role === 'miner' || role === 'raider' || role === 'helper' || rolesNeeded[role] === 0){
            continue;
        }
        print('not skipped')
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
    // print(typeof(roomCreeps), JSON.stringify(roomCreeps), roomCreeps.length)
    let creepsCanChangeRole = []
    for(let creepName in roomCreeps) {
        // print(creepName)
        let creep = roomCreeps[creepName]
        if(roles[creep.memory.role] > 0){
            roles[creep.memory.role] -= 1
        }
        else{
            creepsCanChangeRole.push(creep)
        }
    }
    return [creepsCanChangeRole, roles];
}

function roleToCreateNext(rolesToCreate) {
    if (rolesToCreate.includes('miner')){
        return 'miner'
    }
    if (rolesToCreate.includes('spawnHelper')){
        return 'spawnHelper'
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
    if (rolesToCreate.includes('worker')){
        return 'worker'
    }
    return 'updater'
}

function createCreepIfEnoughEnergy(roomName, role) {
    if (Game.time - Memory.lastSpawn < cooldown){
        return
    }
    let spawn = Game.spawns['mama']  // TODO filter right spawn
    let body = getBodyByRole(role, spawn.room.energyAvailable)
    if (body.length === 0){
        return
    }
    let creepName = getCreepName(role)
    // let structuresOrder = findClosestByRange()
    // print('trying to create creep', creepName, 'with role', role, 'and body', body)
    let result = spawn.spawnCreep(body, creepName, {memory: {role: role}})
    if (result !== OK){
        print('can not create creep', creepName, 'with role', role, 'and body', body, 'because', result)
        return
    }
    // print('created creep', creepName, 'with role', role, 'and body', body)
    Memory.lastSpawn = Game.time
}

function getBodyByRole(role, availableEnergy) { // TODO get available energy
    // print('try max params')
    if (role === 'miner'){
        if (availableEnergy < 300){
            return []
        }
        let maxBody = [MOVE, CARRY, WORK, WORK, WORK, WORK, WORK]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (role === 'helper'){
        if (availableEnergy < 300){
            return []
        }
        let maxBody = [MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, CARRY]
        return getMaxParams(maxBody, availableEnergy)
    }
    if (availableEnergy < 300){
        return []
    }
    return getMaxParams([MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK, WORK], availableEnergy)
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