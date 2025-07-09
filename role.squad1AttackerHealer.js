let print = console.log;

// FLAG 's' for this squad
let roleSquadAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) { creep.heal(creep);
        creep.moveTo(Game.flags['healPoint1'].pos); return;


        //creep.heal(creep);
//                 creep.heal(Game.creeps['balast1']);
// return;
//                 creep.moveTo(Game.creeps['s1h1'])
//                 creep.heal(creep);
//                 creep.heal(Game.creeps['s1h1']);
// return;

        let roomToRaid = 'E59S2'
        if (creep.room.name === roomToRaid){
            let target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter: function(creep) {
                    return creep.hits < creep.hitsMax && creep.room.name === roomToRaid;
                }});
            if (target === null || target === undefined){
                //creep.say('everyone is healty')
                creep.moveTo(Game.flags['healPoint1'].pos)
                return;
            }
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            creep.heal(target);
            return;
        } else {
            creep.moveTo(Game.flags['healPoint1'].pos)
            return;
        }




        if (creep.memory.wasAtFlag === undefined){
            creep.memory.wasAtFlag = false;
        }
        if (creep.memory.wasAtFlag === false){
            if (creep.room.name === Game.flags['home'].pos.roomName){
                creep.memory.wasAtFlag = true;
            }
            creep.moveTo(Game.flags['home'].pos, {visualizePathStyle: {stroke: '#ffffff'}});
            return;
        }

        // creep.heal(creep)
        // creep.moveTo(Game.flags['heal_me1'].pos, {visualizePathStyle: {stroke: '#ffffff'}});
        // return;
        target = Game.creeps['balast1']
        if (target === null || target === undefined){

            //target = Game.creeps['balast2']
            //print("targert2", target)
            //if (target === null || target === undefined || target.room.name !== 'E59S2'){ //  || target.hits === target.hitsMax){
            let target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter: function(object) {
                    return object.hits < object.hitsMax;
                }
            });
            //}
        }

        if (target === null || target === undefined || creep.hitsMax - creep.hits > 100){
            creep.heal(creep);
            creep.moveTo(Game.flags['home'].pos, {visualizePathStyle: {stroke: '#ffffff'}});
            return;
        }
        let res = creep.heal(target)
        if (res === ERR_NOT_IN_RANGE){
            creep.moveTo(target.pos, {visualizePathStyle: {stroke: '#ffffff'}});
            creep.heal(creep);
        }
        creep.heal(creep)


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