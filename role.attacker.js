let print = console.log;

let roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!(creep.memory.attackFlag in Game.flags)){
            print('no attack flag, waiting')
            return;
        }
        let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        print('attacker: target', target)
        if (target !== null) {
            let res = creep.rangedAttack(target);
            if (res !== ERR_NOT_IN_RANGE || res !== OK) {
                print('attacker: error attacking', res)
            }
        }
        let flag = Game.flags['attack']
        creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});
    },
};

module.exports = roleAttacker;