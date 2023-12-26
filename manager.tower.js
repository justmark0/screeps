let print = console.log;
let roomNames = require('config').roomNames
let playersNotAttack =  require('config').playersNotAttack

function repair(tower, target){
    if(tower.store[RESOURCE_ENERGY] < 700){
        // if tower has not enough to defence, we do not repair
        return false
    }
    // print("pos ", toRepair.pos, " hits", toRepair.hits, " to repair", toRepair.hitsMax - toRepair.hits)
    tower.repair(target);
    return true;
}

function attack(roomName, tower){
    let toAttack = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS, {filter: (creep) => !playersNotAttack.includes(creep.owner.username)});
    if (toAttack.length === 0){
        return false;
    }
    // TODO smart selection of creeps to attack
    if(toAttack[0]) {
        tower.attack(toAttack[0]);
        return true;
    }
    return false;
}

function heal(tower){
    if(tower.store[RESOURCE_ENERGY] < 600){
        // if tower has not enough to defence, we do not heal
        return false
    }
    // TODO write logic to heal creeps
    return false
}

function towerManager(){
    for (let roomName of roomNames){
        roomTowerManager(roomName)
    }
}

function roomTowerManager(roomName){
    print('roomTowerManager debug', roomName)
    let towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    print('towers debug', JSON.stringify(towers))
    if (towers.length === 0){
        return
    }

    let damagedStructures = Game.rooms[roomName].find(FIND_STRUCTURES, {
        filter: (structure) => structure.hitsMax - structure.hits > 200 && structure.hits < 10000000000
    });
    if(damagedStructures.length === 0){
        return false;
    }
    damagedStructures.sort((a,b) => a.hits > b.hits);
    let repairID = 0;
    for(let tower_id in towers){
        let tower = towers[tower_id]
        if(tower) {
            // first of all we attack, then heal creeps, then repair buildings
            if(!attack(tower, tower_id)){
                if(!heal(tower, tower_id)){
                    if (repairID >= damagedStructures.length){
                        continue
                    }
                    repair(tower, repairID)
                    repairID++;
                }
            }
        }
    }
}

module.exports = towerManager;