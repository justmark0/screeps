let print = console.log;

let roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        let target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(object) {
                return object.hits < object.hitsMax;
            }
        });
        // Follow atacker and heal, if no atacker follow damaged creeps if no damaged creeps follow flag

        let flag = Game.flags['attack']
        creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});

        if (target !== null) {
            let res = creep.heal(target);
            if (res !== ERR_NOT_IN_RANGE || res !== OK) {
                print('healer: error healing', res)
            }
        }
        if (!(creep.memory.followCreepName in Game.creeps)){
            print('healer: no creep with name to follow, waiting', creep.memory.followCreepName)
            if (target !== null){
                creep.moveTo(target.pos, {visualizePathStyle: {stroke: '#13ef13'}});
                return;
            }

            return;

        }
        let followCreep = Game.creeps[creep.memory.followCreepName];
        creep.moveTo(followCreep.pos, {visualizePathStyle: {stroke: '#13ef13'}});
    },
};

module.exports = roleHealer;