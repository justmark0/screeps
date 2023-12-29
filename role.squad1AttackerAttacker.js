let print = console.log;

let roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.sobralis === true){
            return;
        }
        if (!('s' in Game.flags)){
            print('squad1Attacker attacker: no s flag, waiting')
            return;
        }
        let flag = Game.flags['s']
        if (creep.room.name === flag.pos.roomName && creep.pos.x === flag.pos.x &&  creep.pos.y === flag.pos.y){
            return;
        }
        creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});
    },
};

module.exports = roleAttacker;