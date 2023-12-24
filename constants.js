let print = console.log;
let minProfessions = {
    "worker": 3, 
    "towerWorker": 0, 
    "updater":  4, 
    "builder": 0, 
    "helper": 0, 
    "raider": 0,
    "miner": 0,
}

function sum() {
    obj = minProfessions
    var sum = 0;
    for( var el in obj ) {
        if( obj.hasOwnProperty( el ) ) {
            sum += parseFloat( obj[el] );
        }
    }
    return sum;
}

module.exports = {
    roomName : "E56S7",
    creepCanChangeProfessionIn: 60,
    minProfessions: minProfessions,
    creepAmount: sum(),
    maxProfessions: {"helper": 0, "raider": 0},
};