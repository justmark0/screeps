let print = console.log;
let roomName = "W28S11"


function repair(tower){
    if(tower.store[RESOURCE_ENERGY] < 500){
        // if tower has not enough to defence, we do not repair
        return false
    }
    var damagedStructures = Game.rooms[roomName].find(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
    });
    if(damagedStructures.length === 0){
        return false;
    }
    minHits = damagedStructures[0].hits
    id = 0
    for(let i in damagedStructures){
        structure = damagedStructures[i]
        if(structure.hits < minHits && (structure.hitsMax - structure.hits) > 200){
            minHits = structure.hits
            id = i
        }
    }
    toRepair = damagedStructures[id]
    if(toRepair.hitsMax - toRepair.hits < 1000000){
        // If we need to repair 1m we do not repair Hehehe
        // it is needed in case of damaged walls
        print("pos ", toRepair.pos, " hits", toRepair.hits, " to repair", toRepair.hitsMax - toRepair.hits)
        tower.repair(damagedStructures[id]);
    }
    return true;
}


function attack(tower){
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
        tower.attack(closestHostile);
        return true;
    }
    return false;
}

function heal(tower){
    if(tower.store[RESOURCE_ENERGY] < 300){
        // if tower has not enough to defence, we do not heal
        return false
    }
    // TODO write logic to heal creeps
    return false
}

function towerManager(){
    var tower = Game.getObjectById('61a5b311be05fa126d28279f');

    if(tower) {
        // first of all we attack,
        if(!attack(tower)){
            if(!heal(tower)){
                repair(tower)
            }
        }
    }
}

module.exports = towerManager;