let print = console.log;

// FLAG 's' for this squad
let roleSquadAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // creep.heal(creep)
        // creep.moveTo(Game.flags['heal_me1'].pos, {visualizePathStyle: {stroke: '#ffffff'}});
        // return;
        let target = Game.creeps['balast1']
        if (target === null || target === undefined || creep.hitsMax - creep.hits > 300){
            creep.heal(creep);
            creep.moveTo(Game.flags['home'].pos, {visualizePathStyle: {stroke: '#ffffff'}});
            return;
        }
        let res = creep.heal(target)
        if (res === ERR_NOT_IN_RANGE){
            creep.moveTo(target.pos, {visualizePathStyle: {stroke: '#ffffff'}});
            creep.heal(creep);
        }

        // let target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        //     filter: function(object) {
        //         return object.hits < object.hitsMax;
        //     }
        // });
        // // // Follow atacker and heal, if no atacker follow damaged creeps if no damaged creeps follow flag
        // //
        // // let flag = Game.flags['attack']
        // // creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});
        // //
        // if (target !== null) {
        //     let res = creep.heal(target);
        //     if (res !== ERR_NOT_IN_RANGE || res !== OK) {
        //         print('healer: error healing', res)
        //     }
        //     if (res === ERR_NOT_IN_RANGE){
        //         creep.moveTo(target.pos, {visualizePathStyle: {stroke: '#ffffff'}});
        //     }
        //     return;
        // }
        //

        // if (target === null || target === undefinea){
        //     let flag = Game.flags['s']
        //     creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});
        // }
        // creep.memory.followCreepName = 'balast1'
        // if (!(creep.memory.followCreepName in Game.creeps)){
        //     print('healer: no creep with name to follow, waiting', creep.memory.followCreepName)
        //     if (target !== null){
        //         creep.moveTo(target.pos, {visualizePathStyle: {stroke: '#13ef13'}});
        //         return;
        //     }
        //
        //     return;
        // }
        // let followCreep = Game.creeps[creep.memory.followCreepName];
        // creep.moveTo(followCreep.pos, {visualizePathStyle: {stroke: '#13ef13'}});
        // if (creep.memory.sobralis === true){
        //     return;
        // }
        // creep.heal(creep)
        // if (!('s' in Game.flags)){
        //     print('squad1Attacker healer', creep.name, ': no s flag, waiting')
        //     return;
        // }
        // let flag = Game.flags['s']
        // if (creep.room.name === flag.pos.roomName && Math.abs(creep.pos.x - flag.pos.x) < 3 &&  Math.abs(creep.pos.y - flag.pos.y) < 3){
        //     return;
        // }
        // if (creep.hits <= 500) {
        //     creep.moveTo(new RoomPosition(47, 10, 'E58S5'));
        //     return;
        // }

    },
};

module.exports = roleSquadAttacker;