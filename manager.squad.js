// Configure max and min amount of sceeps to spawn by role in config. For all rooms same config
// Or configure manualRoles and enable it by enableManualRoles.
// But the rest creeps should manage itself.
let print = console.log;

let RIGHT = 'right';
let LEFT = 'left';
let UP = 'up';
let DOWN = 'down';

let healAtOneTime = 300;
// Allows to easy create creeps for out of Room things. You have time to disable it before it will be spawned.
function oneAttackerSquad1Local(){
    if (!Game.creeps['s1a'] || !Game.creeps['s1h1'] || !Game.creeps['s1h2'] || !Game.creeps['s1h3']){
        // not logging because it will spam
        return;
    }
    if (!Game.flags['s']){
        print('oneAttackerSquad1: no flag')
        return;
    }
    let flag = Game.flags['s'];
    let fpos = flag.pos;

    let attacker = Game.creeps['s1a'];
    let healer1 = Game.creeps['s1h1'];
    let healer2 = Game.creeps['s1h2'];
    let healer3 = Game.creeps['s1h3'];


    // attacker.memory.sobralis = false;


    if (attacker.memory.sobralis === undefined){attacker.memory.sobralis = false;}
    if (attacker.memory.sobralis === false){
        if ((attacker.pos.roomName === fpos.roomName && attacker.pos.x === fpos.x && attacker.pos.y === fpos.y) &&
            (healer1.pos.roomName === fpos.roomName && healer1.pos.x === fpos.x + 1 && healer1.pos.y === fpos.y) &&
            (healer2.pos.roomName === fpos.roomName && healer2.pos.x === fpos.x && healer2.pos.y === fpos.y + 1) &&
            (healer3.pos.roomName === fpos.roomName && healer3.pos.x === fpos.x + 1 && healer3.pos.y === fpos.y + 1)){
            attacker.memory.sobralis = true;
            healer1.memory.sobralis = true;
            healer2.memory.sobralis = true;
            healer3.memory.sobralis = true;
        }
    }

    if (attacker.memory.sobralis === false){
        // INITIAL is:
        //  flag ->A  H1
        //         H2 H3
        if (attacker.pos.roomName !== fpos.roomName || attacker.pos.x !== fpos.x || attacker.pos.y !== fpos.y){
            attacker.moveTo(fpos, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        if (healer1.pos.roomName !== fpos.roomName || healer1.pos.x !== fpos.x + 1 || healer1.pos.y !== fpos.y){
            healer1.moveTo(new RoomPosition(fpos.x + 1, fpos.y, fpos.roomName), {visualizePathStyle: {stroke: '#ffffff'}});
        }
        if (healer2.pos.roomName !== fpos.roomName || healer2.pos.x !== fpos.x || healer2.pos.y !== fpos.y + 1){
            healer2.moveTo(new RoomPosition(fpos.x, fpos.y + 1, fpos.roomName), {visualizePathStyle: {stroke: '#ffffff'}});
        }
        if (healer3.pos.roomName !== fpos.roomName || healer3.pos.x !== fpos.x + 1 || healer3.pos.y !== fpos.y + 1){
            healer3.moveTo(new RoomPosition(fpos.x + 1, fpos.y + 1, fpos.roomName), {visualizePathStyle: {stroke: '#ffffff'}});
        }
        return;
    }

    // sobralis, heal and goto flag s
    // every healer has 25 heal body parts, so it should heal for 25 * 12 = 300 hp per tick

    let healPriority = [
        {name: 's1a', heal: attacker.hitsMax - attacker.hits, pos: attacker.pos},
        {name: 's1h1', heal: healer1.hitsMax - healer1.hits, pos: healer1.pos},
        {name: 's1h2', heal: healer2.hitsMax - healer2.hits, pos: healer2.pos},
        {name: 's1h3', heal: healer3.hitsMax - healer3.hits, pos: healer3.pos}
    ]
    // TODO make tests here
    healPriority.sort((a, b) => a.heal < b.heal ? -1 : 1);
    // print("heal priority", JSON.stringify(healPriority))
    let [healTargets, healPriorityRest]= pushToTargetUtilizeHill(healPriority);
    healTargets = pushToTargetFullHeal(healPriorityRest, healTargets)

    if (healTargets.length < 3){
        healTargets = pushToTargetsClosestToFlag(healPriorityRest, healTargets, fpos);
    }
    // print('heal targets', JSON.stringify(healTargets))
    // heal
    healer1.heal(getCreep(attacker, healer1, healer2, healer3, healTargets[0]));
    healer2.heal(getCreep(attacker, healer1, healer2, healer3, healTargets[1]));
    healer3.heal(getCreep(attacker, healer1, healer2, healer3, healTargets[2]));

    // goto flag
    let x = new Set([attacker.pos.x, healer1.pos.x, healer2.pos.x, healer3.pos.x]);
    let y = new Set([attacker.pos.y, healer1.pos.y, healer2.pos.y, healer3.pos.y]);
    let creepByposition = {}
    creepByposition[getPosString(attacker.pos)] = attacker;
    creepByposition[getPosString(healer1.pos)] = healer1;
    creepByposition[getPosString(healer2.pos)] = healer2;
    creepByposition[getPosString(healer3.pos)] = healer3;

    if (fpos.x !== attacker.pos.x){
        if (fpos.x > attacker.pos.x && x.has(attacker.pos.x + 1)) {
            innerSquadMoveRL(attacker, creepByposition[getPosStringXY(attacker.pos.x + 1, attacker.pos.y)]);
            return;
        }
        if (fpos.x < attacker.pos.x && x.has(attacker.pos.x - 1)) {
            innerSquadMoveRL(attacker, creepByposition[getPosStringXY(attacker.pos.x - 1, attacker.pos.y)]);
            return;
        }
        if (fpos.x > attacker.pos.x) {
            moveSquad(attacker, healer1, healer2, healer3, RIGHT);
            return;
        }
        if (fpos.x < attacker.pos.x) {
            moveSquad(attacker, healer1, healer2, healer3, LEFT);
            return;
        }
    }
    if (fpos.y !== attacker.pos.y){
        if (fpos.y > attacker.pos.y && y.has(attacker.pos.y + 1)) {
            innerSquadMoveUD(attacker, creepByposition[getPosStringXY(attacker.pos.x, attacker.pos.y + 1)]);
            return;
        }
        if (fpos.y < attacker.pos.y && y.has(attacker.pos.y - 1)) {
            innerSquadMoveUD(attacker, creepByposition[getPosStringXY(attacker.pos.x, attacker.pos.y - 1)]);
            return;
        }
        if (fpos.y > attacker.pos.y) {
            moveSquad(attacker, healer1, healer2, healer3, DOWN);
            return;
        }
        if (fpos.y < attacker.pos.y) {
            moveSquad(attacker, healer1, healer2, healer3, UP);
            return;
        }
    }
    print('oneAttackerSquad1: on flag!')
}

function pushToTargetUtilizeHill(healPriority){
    let targets = []
    for (let healData in healPriority){
        for (let i = 0; i < Math.ceil(healData['heal'] / healAtOneTime); i++){
            targets.push(healData.name);
            healData['heal'] -= healAtOneTime;
        }
    }
    return [targets, healPriority];
}

function pushToTargetFullHeal(healPriority, targets){
    for (let healData in healPriority){
        if (healData.heal > healAtOneTime){
            targets.push(healData.name);
        }
    }
    return targets;
}

function pushToTargetsClosestToFlag(healPriority, targets, flagPosition){
    healPriority.sort((a, b) => ((a.pos.x - flagPosition.x) * (a.pos.x - flagPosition.x) + (a.pos.y - flagPosition.y) * (a.pos.y - flagPosition.y))  < ((b.pos.x - flagPosition.x) * (b.pos.x - flagPosition.x) + (b.pos.y - flagPosition.y) * (b.pos.y - flagPosition.y)) ? -1 : 1);
    targets.push(healPriority[0].name);
    targets.push(healPriority[1].name);
    targets.push(healPriority[2].name);
    return targets;
}

function getCreep(attacker, healer1, healer2, healer3, target){
    if (target === attacker.name){
        return attacker;
    }
    if (target === healer1.name){
        return healer1;
    }
    if (target === healer2.name){
        return healer2;
    }
    if (target === healer3.name){
        return healer3;
    }
    print('getCreep: no creep with name', target)
}

function getPosString(pos){
    return 'x' + pos.x.toString() + 'y' + pos.y.toString()
}

function getPosStringXY(x, y){
    return 'x' + x.toString() + 'y' + y.toString()
}

function innerSquadMoveRL(attacker, healer){
    if (attacker.pos.x > healer.pos.x){
        attacker.moveTo(attacker.pos.x - 1, attacker.pos.y);
        healer.moveTo(healer.pos.x + 1, healer.pos.y);
        return;
    }
    attacker.moveTo(attacker.pos.x + 1, attacker.pos.y);
    healer.moveTo(healer.pos.x - 1, healer.pos.y);
}

function innerSquadMoveUD(attacker, healer){
    if (attacker.pos.y > healer.pos.y){
        attacker.moveTo(attacker.pos.x, attacker.pos.y - 1);
        healer.moveTo(healer.pos.x, healer.pos.y + 1);
        return;
    }
    attacker.moveTo(attacker.pos.x, attacker.pos.y + 1);
    healer.moveTo(healer.pos.x, healer.pos.y - 1);
}

function moveSquad(attacker, healer1, healer2, healer3, direction){
    if (direction === RIGHT){
        attacker.moveTo(attacker.pos.x + 1, attacker.pos.y);
        healer1.moveTo(healer1.pos.x + 1, healer1.pos.y);
        healer2.moveTo(healer2.pos.x + 1, healer2.pos.y);
        healer3.moveTo(healer3.pos.x + 1, healer3.pos.y);
        return;
    }
    if (direction === LEFT){
        attacker.moveTo(attacker.pos.x - 1, attacker.pos.y);
        healer1.moveTo(healer1.pos.x - 1, healer1.pos.y);
        healer2.moveTo(healer2.pos.x - 1, healer2.pos.y);
        healer3.moveTo(healer3.pos.x - 1, healer3.pos.y);
        return;
    }
    if (direction === DOWN){
        attacker.moveTo(attacker.pos.x, attacker.pos.y + 1);
        healer1.moveTo(healer1.pos.x, healer1.pos.y + 1);
        healer2.moveTo(healer2.pos.x, healer2.pos.y + 1);
        healer3.moveTo(healer3.pos.x, healer3.pos.y + 1);
        return;
    }
    if (direction === UP){
        attacker.moveTo(attacker.pos.x, attacker.pos.y - 1);
        healer1.moveTo(healer1.pos.x, healer1.pos.y - 1);
        healer2.moveTo(healer2.pos.x, healer2.pos.y - 1);
        healer3.moveTo(healer3.pos.x, healer3.pos.y - 1);
        return;
    }
    print('moveSquad: wrong direction', direction)
}

module.exports = {
    oneAttackerSquad1: oneAttackerSquad1Local,
};