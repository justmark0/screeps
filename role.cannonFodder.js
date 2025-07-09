let print = console.log;

let roleExplorer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //  creep.moveTo(Game.flags['home'].pos, {visualizePathStyle: {stroke: '#ffffff'}});
// return;
        if (creep.name === 'balast1'){
            if (creep.hits > 3500){
                creep.moveTo(Game.flags['daut_po_ebalu'].pos)
                return;
            }
            if (creep.hits < 3200) {
                let flag = Game.flags['heal_me']
                creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        if (creep.name === 'balast2'){
            if (creep.hits === creep.hitsMax){
                creep.moveTo(Game.flags['daut_po_ebalu'].pos)
                return;
            }
            if (creep.hits > 4500){
                creep.moveTo(Game.flags['daut_po_ebalu'].pos)
                return;
            }
            if (creep.hits < 3000) {
                let flag = Game.flags['heal_me']
                creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    },
};

module.exports = roleExplorer;