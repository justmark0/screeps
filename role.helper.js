let print = console.log;


var roleHelper = {
    run: function(creep) {

        if(creep.memory.work === undefined){
            creep.memory.work = false;
        }

        if(creep.memory.work && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.work = false;
            creep.say('ill go get som ene');
        }
        if(!creep.memory.work && creep.store.getFreeCapacity() === 0) {
            creep.memory.work = true;
            creep.say('go help 👷‍');
        }

        if(creep.memory.work) {
            let flag = Game.flags['help']
            if (flag === undefined){
                creep.say('no helppoint');
                return;
            }
            if((Math.abs(flag.pos.x - creep.pos.x) + Math.abs(flag.pos.y - creep.pos.y)) < 2 && flag.pos.roomName === creep.pos.roomName){
                creep.drop(RESOURCE_ENERGY);
                return;
            }
            creep.moveTo(flag.pos);
        }
        else {
            require('role.charger').run(creep);
        }
    },
};

module.exports = roleHelper;