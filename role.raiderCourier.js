const {courierData} = require("./config");
let print = console.log;


// define roomCreation on birth
let roleCourier  = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // if (creep.name === 'raiderCourier1'){
        //     creep.memory.isRightRoom = true;
        //     creep.memory.collect = false;
        //     // let target = Game.getObjectById('65981fbeafce45614b2aec27')
        //     // let res = creep.withdraw(target, 'XGH2O')
        //     // if (res === ERR_NOT_IN_RANGE) {
        //     //         creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        //     //         return;
        //     //     }
        //     // return;
        // }
        // if (creep.name === 'raiderCourier4'){
        //     creep.memory.isRightRoom = false;
        //     creep.memory.collect = true;
        // }
        if (creep.memory.roomCreation === 'E56S7') {
            // my main room. go by z route
            // goto flag zRoute1 -> zRoute2 -> zRoute3
            if (creep.memory.isRightRoom === undefined) {
                creep.memory.isRightRoom = false;
            }
            if (creep.memory.collect === undefined) {
                creep.memory.collect = true;
            }
            // if (creep.memory.passedZRoute1Flag === undefined) {
            //     creep.memory.passedZRoute1Flag = false;
            // }
            // if (creep.memory.passedZRoute2Flag === undefined) {
            //     creep.memory.passedZRoute2Flag = false;
            // }
            // if (creep.memory.passedZRoute3Flag === undefined) {
            //     creep.memory.passedZRoute3Flag = false;
            // }
            // if (creep.memory.passedZRoute4Flag === undefined) {
            //     creep.memory.passedZRoute4Flag = false;
            // }
            // if (creep.memory.passedZRoute5Flag === undefined) {
            //     creep.memory.passedZRoute5Flag = false;
            // }

            if (creep.memory.isRightRoom === false) {
                if (creep.memory.collect) {
                    // go for resource
                    let flag = Game.flags['zRoute5']
                    if (creep.pos.roomName === flag.pos.roomName) {
                        creep.memory.isRightRoom = true;
                    } else {
                        creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}})
                        return;
                    }
                } else{
                    // print('courierRaider: go home', creep.name, creep.pos.roomName, creep.memory.roomCreation)
                    if (creep.room.name === creep.memory.roomCreation) {
                        creep.memory.isRightRoom = true;
                        // print('courierRaider: isRightRoom true', creep.name, creep.pos.roomName, creep.memory.roomCreation)
                    } else {
                        creep.moveTo(new RoomPosition(2, 7, creep.memory.roomCreation), {visualizePathStyle: {stroke: '#ffffff'}})
                        return;
                    }
                }
            }
        }
        if (creep.memory.roomCreation === 'E57S5') {
            // my second room. go by y route
            // goto flag yRoute1 -> yRoute2 -> yRoute3
            if (creep.memory.isRightRoom === undefined) {
                creep.memory.isRightRoom = false;
            }
            if (creep.memory.collect === undefined) {
                creep.memory.collect = true;
            }
            if (creep.memory.passedZRoute1Flag === undefined) {
                creep.memory.passedZRoute1Flag = false;
            }
            if (creep.memory.passedZRoute2Flag === undefined) {
                creep.memory.passedZRoute2Flag = false;
            }
            if (creep.memory.passedZRoute3Flag === undefined) {
                creep.memory.passedZRoute3Flag = false;
            }
            if (creep.memory.passedZRoute4Flag === undefined) {
                creep.memory.passedZRoute4Flag = false;
            }
            if (creep.memory.passedZRoute5Flag === undefined) {
                creep.memory.passedZRoute5Flag = false;
            }

            if (creep.memory.isRightRoom === false) {
                if (creep.memory.collect){
                    // go for resource
                    // if (creep.memory.passedZRoute1Flag === false) {
                    //     let flag = Game.flags['zRoute1']
                    //     if (flag.pos.roomName === creep.pos.roomName && flag.pos.x === creep.pos.x && flag.pos.y === creep.pos.y) {
                    //         creep.memory.passedZRoute1Flag = true;
                    //         return;
                    //     }
                    //     creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}})
                    //     return;
                    // }
                    // if (creep.memory.passedZRoute2Flag === false && creep.memory.passedZRoute1Flag === true) {
                    //     let flag = Game.flags['zRoute2']
                    //     if (flag.pos.roomName === creep.pos.roomName && flag.pos.x === creep.pos.x && flag.pos.y === creep.pos.y) {
                    //         creep.memory.passedZRoute2Flag = true;
                    //         return;
                    //     }
                    //     creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}})
                    //     return;
                    // }
                    // if (creep.memory.passedZRoute3Flag === false && creep.memory.passedZRoute2Flag === true) {
                    //     let flag = Game.flags['zRoute3']
                    //     if (flag.pos.roomName === creep.pos.roomName && flag.pos.x === creep.pos.x && flag.pos.y === creep.pos.y) {
                    //         creep.memory.passedZRoute3Flag = true;
                    //         return;
                    //     }
                    //     creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}})
                    //     return;
                    // }
                    // if (creep.memory.passedZRoute4Flag === false && creep.memory.passedZRoute3Flag === true) {
                    //     let flag = Game.flags['zRoute4']
                    //     if (flag.pos.roomName === creep.pos.roomName && flag.pos.x === creep.pos.x && flag.pos.y === creep.pos.y) {
                    //         creep.memory.passedZRoute4Flag = true;
                    //         return;
                    //     }
                    //     creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}})
                    //     return;
                    // }
                    // if (creep.memory.passedZRoute5Flag === false && creep.memory.passedZRoute4Flag === true) {
                    //     let flag = Game.flags['zRoute5']
                    //     if (flag.pos.roomName === creep.pos.roomName && flag.pos.x === creep.pos.x && flag.pos.y === creep.pos.y) {
                    //         creep.memory.passedZRoute5Flag = true;
                    //         return;
                    //     }
                    //     creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}})
                    //     return;
                    // }
                    // if (creep.memory.passedZRoute5Flag === true) {
                    //     creep.memory.isRightRoom = true;
                    //     return;
                    // }
                } else {
                    // go home
                }
            }
        }



        if (creep.memory.isRightRoom === false) {
            print('courierRaider: isRightRoom false, you should not be here', creep.name, creep.pos.roomName)
            return;
        }

        if (creep.store.getFreeCapacity() === 0) {
            creep.memory.collect = false;
            creep.memory.passedZRoute1Flag = false;
            creep.memory.passedZRoute2Flag = false;
            creep.memory.passedZRoute3Flag = false;
            creep.memory.passedZRoute4Flag = false;
            creep.memory.passedZRoute5Flag = false;
            creep.memory.isRightRoom = false;
        }
        if (creep.store.getFreeCapacity() === 700){
            creep.memory.collect = true;
            creep.memory.passedZRoute1Flag = false;
            creep.memory.passedZRoute2Flag = false;
            creep.memory.passedZRoute3Flag = false;
            creep.memory.passedZRoute4Flag = false;
            creep.memory.passedZRoute5Flag = false;
            creep.memory.isRightRoom = false;
        }


        print('courierRaider: collect', creep.memory.collect, creep.name)
        if (creep.memory.collect) {
//             let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
//     filter: (structure) => {
//         return structure.my === false && (structure.structureType === STRUCTURE_LAB) && structure.store['XGH2O'] > 0
//     }
// });


            let target = Game.getObjectById('6426d6d8edea30c31e6aa054')
            if (target === null) {
                print('courierRaider: no target')
                return;
            }
            let priority = ['XGH2O', 'GH2O', 'GH', 'XUHO2', 'G', 'UHO2', 'ZHO2', 'KH', 'KHO2','KH2O', 'OH', 'UO', 'ZO', 'ZH', 'UH', 'ZK', 'X', 'U', 'K', 'L','O', 'H', 'Z', 'energy']
            for (let i = 0; i < priority.length; i++) {
                if (target.store[priority[i]] === 0) {
                    continue;
                }
                let res = creep.withdraw(target, priority[i])
                if (res === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    return;
                }
                if (res === OK) {
                    return;
                }
                print('courierRaider: error withdraw', res)
            }
        } else {
            // store
            let target = null;
            // print('courierRaider: roomCreation', creep.memory.roomCreation)
            if (creep.memory.roomCreation=== 'E56S7') {
                target = Game.getObjectById('657e1988b74780d6ccd3295a')
            }
            if (creep.memory.roomCreation=== 'E57S5') {
                target = Game.getObjectById('658f84a71f6566719e95997e')
            }
            // print('courierRaider: target', target)
            if (target === null) {
                print('courierRaider: no target to store')
                return;
            }
            // print('courierRaider: creep.store', JSON.stringify(creep.store))
            for (let resourceType in creep.store) {
                let res = creep.transfer(target, resourceType)
                // print('courierRaider: res', res, resourceType)
                if (res === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    return;
                }
                if (res === OK) {
                    return;
                }
                print('courierRaider: error transfer', res)
            }
        }
    },
};

module.exports = roleCourier;