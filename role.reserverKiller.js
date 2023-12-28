let print = console.log;

let roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!(creep.memory.attackFlag in Game.flags)){
            print('no attack flag, waiting')
            return;
        }
        // let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        let target = Game.getObjectById('658d9b99a8f660596d585e1a');
        // print('reserver Killer: target', target)
        if (target !== null) {
            let res = attackController(creep.room.controller);
            // print('attacker: attack on', target)
            if (res !== ERR_NOT_IN_RANGE && res !== OK) {
                print('attacker: error attacking', res)
            }
        }
        let flag = Game.flags[creep.memory.attackFlag]
        creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ff0d0d'}});
    },
};

module.exports = roleAttacker;