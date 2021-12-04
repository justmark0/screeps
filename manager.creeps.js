// Worker is responsible to collect energy and transfer to spawn, collect garbage
// Updater is responsible to update controller, support rampart and towers
// Builder is responsible to create all buildings that need to build
// Miner will mine and pass to container
let print = console.log;
let roomName = require('constants').roomName
let creepCanChangeProfessionIn = require('constants').creepCanChangeProfessionIn
let creepAmount = require('constants').creepAmount
let minProfessions = require('constants').minProfessions
let maxProfessions = require('constants').maxProfessions



function runCreepsAndDeleteDead(){
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]){
            delete Memory.creeps[name];
            continue;
        }
        let creep = Game.creeps[name];
        runCreepProgram(creep.memory.role, creep);
    }
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getKeysWithZeros(dictToCopy){
    let dict = {}
    for(let field in dictToCopy){
        dict[field] = 0
    }
    return dict
}

let spawnName = "Spawn1";
let minCreepCost = 200;
let okToCreateCreepFromEnergy = 350;
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
        let paramsList = [MOVE, CARRY, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, WORK, WORK, WORK];
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
        if(this.getParamCost(params) > 200){
            this.spawnNow = true
        }
        if(this.spawnNow && this.getParamCost(params) <= spawn.room.energyAvailable) {
            spawn.spawnCreep(params, Game.time);
            if(role !== undefined){
                Game.creeps[Game.time].memory.role = role
            }
        }
    }
}

function distributeProfessionTime(){
    // TODO optimize of delete
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        for(let name2 in Game.creeps) {
            let creep2 = Game.creeps[name2];
            if(creep.name === creep2.name){
                continue;
            }
            if(creep.memory.role_since === creep2.memory.role_since){
                creep.memory.role_since = getRandomInt(creepCanChangeProfessionIn)
                break;
            }
        }
    }
}

function calculateNowProfessions(){
    let nowProfessions = getKeysWithZeros(minProfessions);
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role_since == null) {
            creep.memory.role_since = Game.time;
        }
        nowProfessions[creep.memory.role] += 1;
    }
    return nowProfessions
}

function createMinProfessions(nowProfessions){
    for (let profession in nowProfessions) {
        for(let name in Game.creeps) {
            let creep = Game.creeps[name];
            // Create needed min unit
            if ((Game.time - creep.memory.role_since >= creepCanChangeProfessionIn || creep.memory.role == null)
                && creep.memory.role !== "helper" && creep.memory.role !== "raider") {
                let needCreate = minProfessions[profession] - nowProfessions[profession];
                if (needCreate > 0) {
                    creep.memory.role = profession;
                    creep.memory.role_since = Game.time;
                    nowProfessions[profession] -= 1;
                }
                else{
                    break;
                }
            }
        }
    }
}


function checkMaxProfessions(){
    let helpers = 0
    let raiders = 0
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if(creep.memory.role === "helper"){
            helpers ++
        }
        if(creep.memory.role === "raider"){
            raiders ++
        }
    }
    if(helpers > maxProfessions['helper']){
        for(let name in Game.creeps) {
            let creep = Game.creeps[name];
            if (creep.pos.roomName === roomName && helpers > maxProfessions['helper']) {
                creep.memory.role = undefined;
                helpers --
            }
        }
    }
    if(raiders > maxProfessions['raider']) {
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            if (creep.pos.roomName === roomName && raiders > maxProfessions['raider']) {
                creep.memory.role = undefined;
                raiders--
            }
        }
    }
}

function creepLogs(){
    print("__________________________")
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        print("role of creep", creep.name, " prof since ", Game.time - creep.memory.role_since, " prof is ", creep.memory.role, " ttl", creep.ticksToLive)
    }
}

function creepManager(){
    // updateEnergyHistory()
    distributeProfessionTime()
    let beforeCreationProfessions = calculateNowProfessions();
    if(_(Game.creeps).size() < creepAmount){
        // Create exactly 1 creep, to avoid name collision
        if(beforeCreationProfessions['raider'] - minProfessions['raider'] < 0 &&
            (creepAmount - minProfessions['raider'] - minProfessions['helper']) > _(Game.creeps).size()){
            new CreepSpawnData().main(Game.spawns[spawnName], [MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, CARRY, CARRY], 'raider');
            beforeCreationProfessions['raider'] ++;
        }
        else{
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
    runCreepsAndDeleteDead();
}


function runCreepProgram(creepProfession, creep){
    switch(creepProfession){
        case "builder":
            return require('role.builder').run(creep);
        case "miner":
            return require('role.miner').run(creep);
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