let print = console.log;
let playersNotAttack =  require('config').playersNotAttack

// Describe attackRoom in memory on birth
let roleSmallInvaderKiller = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.attackRoom === undefined) {
            print('smallInvaderKiller: no attack attackRoom in Memory')
            return;
        }

        let target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
            filter: (creep) => !playersNotAttack.includes(creep.owner.username)
        });

        if (target !== null) {
            let res = null; //creep.attack(target);
            if (res !== ERR_NOT_IN_RANGE && res !== OK) {
                print('smallInvaderKiller: error attacking', res)
            }
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0d0d'}});
            return;
        }

        if (creep.memory.attackRoom === creep.room.name){
            print('attacker: no invader core in room from memory ', creep.memory.attackRoom)
            creep.say('hoho🏆')
            return;
        }
        creep.moveTo(new RoomPosition(25,25, creep.memory.attackRoom), {visualizePathStyle: {stroke: '#e1e1e1'}});
    },
};

module.exports = roleSmallInvaderKiller;