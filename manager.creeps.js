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
// костыль на время чтобы не думать о умном создании крипов пока
let coolDown = 100

// One of primary ideas is to fully consume and distubute energy with minimal amount of creeps.
function creepManager() {
    testFunc()
    deleteDeadCreeps()
    for (let roomName in roomNames) {
        let roomCreeps = _(Game.creeps).filter((creep) => creep.room.name === roomName)
        let roles = calculateNeededRoles(roomName)
        let rolesToCreate = distributeEnergySupplyRoles(roomCreeps, roles)
        let nextRole = roleToCreateNext(rolesToCreate)
        createCreepIfEnoughEnergy(roomName, nextRole)
    }
}

// function to test some theories or check code.
function testFunc() {
    // print(JSON.stringify(Game.creeps));
    for(let creepName in Game.creeps) {
        creep = Game.creeps[creepName]
        print(JSON.stringify(creep))
        // creep.memory.role = 'worker'
    }
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

// This function returns roles to
function distributeEnergySupplyRoles(roomCreeps, roles) {
    let [creepsCanChangeRole, rolesNeeded] = getCreepsCanChangeRoleAndRolesRemaining(roomCreeps, roles)
    for (let role in rolesNeeded){
        if (creepsCanChangeRole.length === 0){
            break;
        }
        if (role === 'miner' || role === 'raider' || role === 'helper' || rolesNeeded[role] === 0){
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
    let creepsCanChangeRole = []
    for(let creepName in roomCreeps) {
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
    if ('miner' in rolesToCreate){
        return 'miner'
    }
    if ('spawnHelper' in rolesToCreate){
        return 'spawnHelper'
    }
    if ('updater' in rolesToCreate){
        return 'updater'
    }
    if ('towerWorker' in rolesToCreate){
        return 'towerWorker'
    }
    if ('helper' in rolesToCreate){
        return 'helper'
    }
    return 'updater'
}

function createCreepIfEnoughEnergy(roomName, role) {
    let spawn = Game.spawns['mama']  // TODO filter right spawn
    let body = getBodyByRole(role)
    let creepName = getCreepName(role)
    // let structuresOrder = findClosestByRange()
    let result = spawn.spawnCreep(body, creepName, {memory: {role: role, roomName: roomName}})
    if (result !== OK){
        print('cant create creep', creepName, 'with role', role, 'and body', body, 'because', result)
    }
}

function getBodyByRole(role, availableEnergy) { // TODO get available energy
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
    return Game.time
}


// function getRandomInt(max) {
//     return Math.floor(Math.random() * max);
// }
//
// function getKeysWithZeros(dictToCopy){
//     let dict = {}
//     for(let field in dictToCopy){
//         dict[field] = 0
//     }
//     return dict
// }

let spawnName = "Spawn1";
let minCreepCost = 500;
let okToCreateCreepFromEnergy = 500;
let featureCost = {'move': 50, 'work': 100, 'carry': 50, 'attack': 80}

let CreepSpawnData = class{
    constructor(spawnerName='', spawnParams='', spawnNow= false) {
        this.spawnerName = spawnerName;
        this.spawnParams = spawnParams;
        this.spawnNow = spawnNow;
    }

    getParamCost(params){
        let creepTotalCost = 0;
        for(let param in params){
            creepTotalCost += featureCost[params[param]];
        }
        return creepTotalCost
    }

    getMaxParams (spawn){
        // https://docs.screeps.com/api/#Creep
        //                50    100    200   250    300   400   450    500
        let paramsList = [MOVE, CARRY, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, WORK, WORK];
        if(spawn.room.energyAvailable < 200){
            this.spawnNow = false;
            return [];
        }
        this.spawnNow = true;
        let params = [];
        let creepTotalCost = 0;
        for(let param in paramsList) {
            param = paramsList[param];
            if (creepTotalCost + featureCost[param] <= spawn.room.energyAvailable) {
                params.push(param);
                creepTotalCost += featureCost[param];
            }
        }
        return params;
    }

    main (spawn, params, role){
        let timeToSpawn = 1400
        print("can spawn creep? ", (timeToSpawn / creepAmount) - 400 < (Game.time - Memory.lastSpawn), " since last cretion",  (Game.time - Memory.lastSpawn), "can create only from ", (timeToSpawn / creepAmount) - 400)
        if((timeToSpawn / creepAmount) - 400 > (Game.time - Memory.lastSpawn)){
            return
        }
        print('is params und', params === undefined)
        if(params === undefined){
            params = []
            if (spawn.room.energyAvailable < okToCreateCreepFromEnergy){
                if(spawn.room.energyAvailable >= minCreepCost){ // noEnergyInLast20Moves &&
                    params = this.getMaxParams(spawn)
                }
            }
            else{
                params = this.getMaxParams(spawn)
            }
        }
        if(this.getParamCost(params) > minCreepCost){
            this.spawnNow = true
        }
        if(this.spawnNow && this.getParamCost(params) <= spawn.room.energyAvailable) {
            Memory.lastSpawn = Game.time
            spawn.spawnCreep(params, Game.time);
            if(role !== undefined){
                Game.creeps[Game.time].memory.role = role
            }
        }
    }
}
//
// function distributeProfessionTime(){
//     // TODO optimize of delete
//     for(let name in Game.creeps) {
//         let creep = Game.creeps[name];
//          // We distribute only general supply roles.
//          // Body (abilities they have) spesific roles should stick for all lifetime.
//          // In other words, miners should mine because they have a lot of [work].
//         if (!(creep.memory.role === 'worker' ||
//               creep.memory.role === 'updater'||
//               creep.memory.role === 'builder')){
//
//
//         }
//         for(let name2 in Game.creeps) {
//             let creep2 = Game.creeps[name2];
//             if(creep.name === creep2.name){
//                 continue;
//             }
//             if(creep.memory.role_since === creep2.memory.role_since){
//                 creep.memory.role_since = getRandomInt(creepCanChangeProfessionIn)
//                 break;
//             }
//         }
//     }
// }
//
// function calculateNowProfessions(){
//     let nowProfessions = getKeysWithZeros(minProfessions);
//     for(let name in Game.creeps) {
//         let creep = Game.creeps[name];
//         if (creep.memory.role_since == null) {
//             creep.memory.role_since = Game.time;
//         }
//         nowProfessions[creep.memory.role] += 1;
//     }
//     return nowProfessions
// }
//
// function createMinProfessions(nowProfessions){
//     for (let profession in nowProfessions) {
//         for(let name in Game.creeps) {
//             let creep = Game.creeps[name];
//             // Create needed min unit
//             if ((Game.time - creep.memory.role_since >= creepCanChangeProfessionIn || creep.memory.role == null)
//                 && creep.memory.role !== "helper" && creep.memory.role !== "raider" && creep.memory.role !== "miner") {
//                 let needCreate = minProfessions[profession] - nowProfessions[profession];
//                 if (needCreate > 0) {
//                     creep.memory.role = profession;
//                     creep.memory.role_since = Game.time;
//                     nowProfessions[profession] -= 1;
//                 }
//                 else{
//                     break;
//                 }
//             }
//         }
//     }
// }
//
//
// function checkMaxProfessions(){
//     let helpers = 0
//     let raiders = 0
//     for(let name in Game.creeps) {
//         let creep = Game.creeps[name];
//         if(creep.memory.role === "helper"){
//             helpers ++
//         }
//         if(creep.memory.role === "raider"){
//             raiders ++
//         }
//     }
//     if(helpers > maxProfessions['helper']){
//         for(let name in Game.creeps) {
//             let creep = Game.creeps[name];
//             if (creep.pos.roomName === roomName && helpers > maxProfessions['helper']) {
//                 creep.memory.role = undefined;
//                 helpers --
//             }
//         }
//     }
//     if(raiders > maxProfessions['raider']) {
//         for (let name in Game.creeps) {
//             let creep = Game.creeps[name];
//             if (creep.pos.roomName === roomName && raiders > maxProfessions['raider']) {
//                 creep.memory.role = undefined;
//                 raiders--
//             }
//         }
//     }
// }
//
// function creepLogs(){
//     print("__________________________")
//     for(let name in Game.creeps) {
//         let creep = Game.creeps[name];
//         print("role of creep", creep.name, " prof since ", Game.time - creep.memory.role_since, " prof is ", creep.memory.role, " ttl", creep.ticksToLive)
//     }
// }
//
// function canCreateExternalRoomCreeps(professionsNow){
//     return (creepAmount - minProfessions['raider'] - minProfessions['helper']) < _(Game.creeps).size()
// }
//
function creepManagerOld(){
    testFunc()
    // updateEnergyHistory()
    distributeProfessionTime()
    let beforeCreationProfessions = calculateNowProfessions();
    if(_(Game.creeps).size() < creepAmount){
        // Create exactly 1 creep, to avoid name collision
        if(minProfessions['raider'] - beforeCreationProfessions['raider'] > 0 && canCreateExternalRoomCreeps(beforeCreationProfessions)){
            new CreepSpawnData().main(Game.spawns[spawnName], [MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK], 'raider');
            beforeCreationProfessions['raider'] ++;
        }
        else{
            // if(isMinerNeeded()){
            //     let sourceId = getFreeSouce()
            //     new CreepSpawnData().main(Game.spawns[spawnName], [MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK], 'miner');
            // }
            new CreepSpawnData().main(Game.spawns[spawnName]);
        }
    }

    let nowProfessions = calculateNowProfessions();
    createMinProfessions(nowProfessions);
    checkMaxProfessions()

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if(creep.memory.role === undefined){
            creep.memory.role = "updater"
        }
    }

    // If creeps have same professions, make sure  to create at least one in profession
    creepLogs();
    print("creep amount", creepAmount)
    runCreepsAndDeleteDead();
}
//
//
// function runCreepProgram(creepProfession, creep){
//     switch(creepProfession){
//         case "builder":
//             return require('role.builder').run(creep);
//         case "miner":
//             return require('role.miner').run(creep);
//         case "towerWorker":
//             return require('role.towerWorker').run(creep);
//         case "updater":
//             return require('role.updater').run(creep);
//         case "worker":
//             return require('role.worker').run(creep);
//         case "helper":
//             return require('role.helper').run(creep);
//         case "raider":
//             return require('role.raider').run(creep);
//     }
// }
//
module.exports = creepManager;