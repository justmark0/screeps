// Worker is responsible to collect energy and transfer to spawn, collect garbage
// Updater is responsible to update controller, support rampart and towers
// Builder is responsible to create all buildings that need to build
// Miner will mine and pass to container

function creepManager(){
    let creepAmount = 7;
    let creepCanChangeProfessionIn = 120;
    // First one if a priority
    let minProfessions = {"builder": 1, "miner": 2, "updater": 1, "worker":1}
    let nowProfessions = {"builder": 0, "miner": 0, "updater": 0, "worker": 0}

    for(i = Game.creeps.length ; i < creepAmount; i++) {
        Game.spawns["Spawn1"].spawnCreep([WORK, WORK, CARY, MOVE], Game.time);
    }

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role_since == null) {
            creep.memory.role_since = Game.time;
        }
        if (creep.memory.role == null) {
            creep.memory.role = Object.keys(minProfessions)[0];
        }
        nowProfessions[creep.memory.role] += 1;
    }

    // Create needed min units
    if((Game.time - creep.memory.role_since >= creepCanChangeProfessionIn || Game.time - creep.memory.role_since === 0)){
        for(let profession in Object.keys(nowProfessions)){
            let needCreate = minProfessions[profession] - nowProfessions[profession];
            if(needCreate > 0){
                for(let i = 0; i < needCreate; i++){
                    creep.memory.role = profession;
                }
            }
        }
    }

    // TODO can add different roles. Smart profession
}

function runCreepProgram(creepProfession, creep){
    if(creepProfession === "builder"){
        return require('role.builder').run(creep);
    }
    if(creepProfession === "miner"){
        return require('role.miner').run(creep);
    }
    if(creepProfession === "updater"){
        return require('role.updater').run(creep);
    }
    if(creepProfession === "worker"){
        return require('role.worker').run(creep);
    }
}

function run_creeps_and_delete_dead(){
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]){
            delete Memory.creeps[name];
        }
        let creep = Game.creeps[name];
        runCreepProgram(creep.role, creep);
    }
}

module.exports = {
    creepManager: creepManager,
}