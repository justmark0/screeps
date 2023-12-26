let print = console.log;
let roomNames = require('config').roomNames
let playersNotAttack =  require('config').playersNotAttack

function getRepairTargets(tower, target){
    if(tower.store[RESOURCE_ENERGY] < 700){
        // if tower has not enough to defence, we do not repair
        return []
    }
    let damagedStructures = Game.rooms[roomName].find(FIND_STRUCTURES, {
        filter: (structure) => structure.hitsMax - structure.hits > 200 && structure.hits < 10000000000
    });
    if(damagedStructures.length === 0){
        return false;
    }
    damagedStructures.sort((a,b) => a.hits < b.hits ? -1 : 1);
    let targets = []
    for (let i = 0; i < amountOfFreeTowers; i++){
        targets.push({
            target: damagedStructures[i],
            method: 'repair',
        });
    }
    return targets;
}

function getAttackTargets(roomName, amountOfFreeTowers){
    let toAttack = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS, {filter: (creep) => !playersNotAttack.includes(creep.owner.username)});
    if (toAttack.length === 0){
        return false;
    }
    // TODO smart selection of creeps to attack
    let targets = []
    for (let attackTarget of toAttack){
        if (targets.length >= amountOfFreeTowers){
            return targets
        }
        for (let i = 0; i < Math.floor(attackTarget.hits/150); i++){
            targets.push({
                target: attackTarget,
                method: 'attack',
            });
        }
    }
    return targets;
}

function getHealTargets(tower){
    if(tower.store[RESOURCE_ENERGY] < 600){
        // if tower has not enough to defence, we do not heal
        return []
    }
    // TODO write logic to heal creeps
    return []
}

function towerManager(){
    for (let roomName of roomNames){
        roomTowerManager(roomName)
    }
}

function roomTowerManager(roomName){
    let towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    if (towers.length === 0){
        return
    }

    let amountOfFreeTowers = towers.length;
    let towerTargets = getAttackTargets(roomName, amountOfFreeTowers);
    amountOfFreeTowers = amountOfFreeTowers - attackTargets.length;
    if (amountOfFreeTowers > 0){
        let healTargets = getHealTargets(roomName, amountOfFreeTowers);
        towerTargets.concat(healTargets)
        amountOfFreeTowers = amountOfFreeTowers - healTargets.length;
        if (amountOfFreeTowers > 0){
            let repairTargets = getRepairTargets(roomName, amountOfFreeTowers);
            towerTargets.concat(repairTargets)
        }
    }
    let target = 0;
    for(let tower_id in towers) {
        let tower = towers[tower_id]
        if (towerTargets[target].method === 'attack'){
            tower.attack(towerTargets[target].target);
        }
        else if (towerTargets[target].method === 'heal'){
            tower.heal(towerTargets[target].target);
        }
        else if (towerTargets[target].method === 'repair'){
            tower.repair(towerTargets[target].target);
        }
    }
}

module.exports = towerManager;