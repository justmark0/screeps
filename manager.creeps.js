// Worker is responsible to collect energy and transfer to spawn, collect garbage
// Updater is responsible to update controller, support rampart and towers
// Builder is responsible to create all buildings that need to build
// Miner will mine and pass to container
let print = console.log;

let creepCanChangeProfessionIn = 120;
let creepAmount = 4;
let minProfessions = {"worker": 1, "updater": 1, "builder":1} // "miner": 2,
let roomName = "W28S11"


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
    dict = {}
    for(let field in dictToCopy){
        dict[field] = 0
    }
    return dict
}

spawnName = "Spawn1";
minCreepCost = 200;

let CreepSpawnData = class{
    constructor(spawnerName='', spawnParams='', spawnNow= false) {
        this.spawnerName = spawnerName;
        this.spawnParams = spawnParams;
        this.spawnNow = spawnNow;
    }

    getMaxParams (){
        let strToAttribute = {"MOVE": MOVE, "WORK": WORK, "CARRY": CARRY, "ATTACK": ATTACK}
        let featureCost = {"MOVE": 50, "WORK": 100, "CARRY": 50, "ATTACK": 80}
        // https://docs.screeps.com/api/#Creep
        //                 50    100   200   300    350    400
        let paramsList = ["MOVE", "CARRY", "WORK", "CARRY", "MOVE", "WORK", "CARRY", "MOVE"]
        if(Game.rooms[roomName].energyAvailable < minProfessions){
            this.spawnNow = false;
            return []
        }
        this.spawnNow = true;
        let params = []
        let creepTotalCost = 0
        for(let param in paramsList) {
            param = paramsList[param]
            if (creepTotalCost + featureCost[param] <= Game.rooms[roomName].energyAvailable) {
                params.push(strToAttribute[param])
                creepTotalCost += featureCost[param]
            }
        }
        return params
    }

    main (){
        let okToCreateCreepFromEnergy = 350;
        let minCreepCost = 200;
        let params = []
        if (Game.rooms[roomName].energyAvailable < okToCreateCreepFromEnergy){
            if(Game.rooms[roomName].energyAvailable >= minCreepCost){ // noEnergyInLast20Moves &&
                params = this.getMaxParams()
            }
        }
        else{
            params = this.getMaxParams()
        }

        if(this.spawnNow) {
            Game.spawns[spawnName].spawnCreep(params, Game.time);
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
            if (Game.time - creep.memory.role_since >= creepCanChangeProfessionIn || creep.memory.role == null) {
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
    if(_(Game.creeps).size() < creepAmount){
        // Create exactly 1 creep, to avoid name collision
        new CreepSpawnData().main()
    }

    nowProfessions = calculateNowProfessions();
    createMinProfessions(nowProfessions);

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if(creep.memory.role === undefined){
            creep.memory.role = "builder"
        }
    }

    // If creeps have same professions, make sure  to create at least one in profession
    creepLogs();
    runCreepsAndDeleteDead();
}


function runCreepProgram(creepProfession, creep){
    if(creepProfession === "builder"){
        // print("for creep", creep.name, " prof is builder")
        return require('role.builder').run(creep);
    }
    if(creepProfession === "miner"){
        // print("for creep", creep.name, " prof is miner")
        return require('role.miner').run(creep);
    }
    if(creepProfession === "updater"){
        // print("for creep", creep.name, " prof is updater")
        return require('role.updater').run(creep);
    }
    if(creepProfession === "worker"){
        // print("for creep", creep.name, " prof is worker")
        return require('role.worker').run(creep);
    }
}

module.exports = creepManager;