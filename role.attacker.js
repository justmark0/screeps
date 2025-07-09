let print = console.log;

function getAttackTarget(creep) {
    let mostImportantBuilding = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.my === false && (structure.structureType === STRUCTURE_SPAWN ||
                structure.structureType === STRUCTURE_TOWER ||
                structure.structureType === STRUCTURE_POWER_SPAWN
            )
        }});
    if (mostImportantBuilding !== null){
        return mostImportantBuilding;
    }
    let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.my === false && (structure.structureType === STRUCTURE_EXTENSION ||
                structure.structureType === STRUCTURE_LINK ||
                structure.structureType === STRUCTURE_OBSERVER ||
                structure.structureType === STRUCTURE_NUKER ||
                structure.structureType === STRUCTURE_FACTORY
            )
        }
    });
    if (target !== null){
        return target;
    }
    let NotMyCreep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
        filter: (creep) => {return creep.my === false}
    });
    if (NotMyCreep !== null){
        return NotMyCreep;
    }
    return null;
}
let roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        print(creep.name, creep.room.name)

        // if (creep.room.name !== 'E53S5'){
        //     return;
        // }

        if (!(creep.memory.attackFlag in Game.flags)){
            print('no attack flag, waiting')
            return;
        }
        let target = getAttackTarget(creep);
        // let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        // if (creep.name === 'ubivalka0047'){
        //     target = Game.getObjectById('5e2f4b5a5b7a7e7b5d7d3f5e')
        // }
        // if (creep.name === 'ubivalka047'){
        //     target = Game.getObjectById('6424e9e102b8e34aea55f5c6')
        // }
        //  if (creep.name === 'ubivalka048'){
        //     target = Game.getObjectById('6424e9e102b8e34aea55f5c6')
        // }
        // print('attacker: target', target)

        if (target !== null) {
            let res = creep.attack(target);
            if (res !== ERR_NOT_IN_RANGE && res !== OK) {
                print('attacker: error attacking', res)
            }
            if (res === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
                return;
            }
            return;
        }
        let flag = Game.flags[creep.memory.attackFlag]
        creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});
    },
};

module.exports = roleAttacker;