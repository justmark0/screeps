let print = console.log;
let roomNames = require('config').roomNames
let playersNotAttack =  require('config').playersNotAttack

function getRepairTargets(roomName, amountOfFreeTowers){
    let damagedContainers = Game.rooms[roomName].find(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < 1000000 && structure.structureType === STRUCTURE_CONTAINER && structure.hitsMax !== structure.hits
    });
    if(damagedContainers.length !== 0){
        return damagedContainers;
    }

    let damagedStructures = Game.rooms[roomName].find(FIND_STRUCTURES, {
        filter: (structure) => structure.hitsMax - structure.hits > 200 && structure.hits < 1000000
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
    let healTargets = ['balast1', 'ubivalka0047', 'ubivalka048']
    for (let creepidx in healTargets){
        let creepName = healTargets[creepidx]
        let balast = Game.creeps[creepName]
        // print('balast', balast)
        if (balast !== undefined){
            if (balast.hitsMax - balast.hits >= 200){
                return [balast, balast]
            }
            if (balast.hitsMax !== balast.hits){
                return [balast]
            }
        }
    }
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
    // print('roomName', roomName, towers)
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
        // print('ATACKK', target)
        towers[currentTower].attack(target);
        currentTower++;
    }


    if (roomName === 'E56S7'){
        for (;true;) {
            if (currentTower >= towers.length){
                return
            }
            if (towers[currentTower].store[RESOURCE_ENERGY] < 0){
                currentTower++;
                continue;
            }
            break;
        }
        if (towers.length - currentTower <= 0){
            return
        }

        let healTargets = getHealTargets(roomName, towers.length - currentTower);
        // print('heal targets', JSON.stringify(healTargets))
        for (let healTarget in healTargets) {
            if (currentTower >= towers.length){
                return
            }
            let target = healTargets[healTarget]
            towers[currentTower].heal(target);
            currentTower++;
        }
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
    // print('reparTargets', repairTargets)
    for (let repairTarget in repairTargets) {
        if (currentTower >= towers.length){
            continue
        }
        // let target = repairTargets[repairTarget]
        let res = towers[currentTower].repair(repairTargets[repairTarget]);
        currentTower++;
    }

}

module.exports = towerManager;