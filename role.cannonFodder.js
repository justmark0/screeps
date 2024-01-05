let print = console.log;

let roleExplorer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.name === 'balast1'){
            if (creep.hits > 4000){
                creep.moveTo(Game.flags['daut_po_ebalu'].pos)
                return;
            }
            if (creep.hits < 4000) {
                let flag = Game.flags['heal_me']
                creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        if (creep.name === 'balast2'){
            if (creep.hits > 4000){
                creep.moveTo(Game.flags['daut_po_ebalu1'].pos)
                return;
            }
            if (creep.hits < 4000) {
                let flag = Game.flags['heal_me1']
                creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    },
};

module.exports = roleExplorer;