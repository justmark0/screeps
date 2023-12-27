let print = console.log;
let roomNames = require('config').roomNames
let playersNotAttack =  require('config').playersNotAttack

function getRepairTargets(roomName, amountOfFreeTowers){
    let damagedStructures = Game.rooms[roomName].find(FIND_STRUCTURES, {
        filter: (structure) => structure.hitsMax - structure.hits > 200 && structure.hits < 1500000
    });
    if(damagedStructures.length === 0){
        return false;
    }
    damagedStructures.sort((a,b) => a.hits < b.hits ? -1 : 1);
    let targets = []
    for (let i = 0; i < amountOfFreeTowers; i++){
        targets.push(damagedStructures[i]);
    }
    return targets;
}

function getAttackTargets(roomName, amountOfFreeTowers){
    let toAttack = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
    // print('toAttack', JSON.stringify(toAttack))
    // print('amountOfFreeTowers', amountOfFreeTowers)
    if (toAttack.length === 0){
        return [];
    }
    // TODO smart selection of creeps to attack
    let targets = []
    for (let attackTarget of toAttack){

        if (targets.length >= amountOfFreeTowers){
            return targets
        }
        for (let i = 0; i < Math.floor(attackTarget.hits/150) + 1; i++){
            targets.push(attackTarget);
        }
    }
    return targets;
}

function getHealTargets(tower){
    // TODO write logic to heal creeps
    return []
}

function towerManager(){
    for (let roomName of roomNames){
        roomTowerManager(roomName)
    }
}

function roomTowerManager(roomName){
    let towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_TOWER &&
                structure.store[RESOURCE_ENERGY] >= 10;
        }
    });
    if (towers.length === 0){
        return
    }
    towers.sort((a,b) => a.store[RESOURCE_ENERGY] < b.store[RESOURCE_ENERGY] ? -1 : 1);
    // print('sorted towers', JSON.stringify(towers))
    let towerTargets = getAttackTargets(roomName, towers.length);
    // print('attack targets', JSON.stringify(towerTargets))
    let currentTower = 0;
    for (let towerTarget in towerTargets) {
        if (currentTower >= towers.length){
            return
        }
        let target = towerTargets[towerTarget]
        print('ATACKK', target)
        towers[currentTower].attack(target);
        currentTower++;
    }

    for (;true;) {
        if (currentTower >= towers.length){
            return
        }
        if (towers[currentTower].store[RESOURCE_ENERGY] < 600){
            currentTower++;
            continue;
        }
        break;
    }
    if (towers.length - currentTower <= 0){
        return
    }

    let healTargets = getHealTargets(roomName, towers.length - currentTower);
    for (let healTarget in healTargets) {
        if (currentTower >= towers.length){
            return
        }
        let target = healTargets[healTarget]
        towers[currentTower].heal(target);
        currentTower++;
    }

    for (;true;) {
        if (currentTower >= towers.length){
            return
        }
        if (towers[currentTower].store[RESOURCE_ENERGY] < 700){
            currentTower++;
            continue;
        }
        break;
    }
    if (towers.length - currentTower <= 0){
        return
    }
    let repairTargets = getRepairTargets(roomName, towers.length - currentTower);
    for (let repairTarget in repairTargets) {
        if (currentTower >= towers.length){
            return
        }
        let target = repairTargets[repairTarget]
        towers[currentTower].repair(target);
        currentTower++;
    }

}

module.exports = towerManager;