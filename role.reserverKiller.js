let print = console.log;


// Describe attackRoom in memory on birth
let roleReserverKiller = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.attackRoom === undefined) {
            print('reserverKiller: no attack attackRoom in Memory')
            return;
        }

        let target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (target !== null) {
            let res = creep.attack(target);
            if (res !== ERR_NOT_IN_RANGE && res !== OK) {
                print('reserverKiller: error attacking', res)
            }
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0d0d'}});
            return;
        }


        let invaderCore = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_INVADER_CORE
        });

        if (invaderCore === null) {
            if (creep.memory.attackRoom === creep.room.name){
                print('attacker: no invader core in room from memory ', creep.memory.attackRoom)
                creep.say('hoho🏆')
                return;
            }
            creep.moveTo(new RoomPosition(25,25, creep.memory.attackRoom), {visualizePathStyle: {stroke: '#e1e1e1'}});
            return;
        }

        let res = creep.attack(invaderCore);
        if (res !== ERR_NOT_IN_RANGE && res !== OK) {
            print('attacker: error attacking', res)
        }
        creep.moveTo(invaderCore, {visualizePathStyle: {stroke: '#ff0d0d'}});
    },
};

module.exports = roleReserverKiller;