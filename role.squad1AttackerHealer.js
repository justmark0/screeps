let print = console.log;

// FLAG 's' for this squad
let roleSquadAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.sobralis === true){
            return;
        }
        if (!('s' in Game.flags)){
            print('squad1Attacker healer', creep.name, ': no s flag, waiting')
            return;
        }
        let flag = Game.flags['s']
        if (creep.room.name === flag.pos.roomName && Math.abs(creep.pos.x - flag.pos.x) < 5 &&  Math.abs(creep.pos.y - flag.pos.y) < 5){
            return;
        }
        creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});
    },
};

module.exports = roleSquadAttacker;