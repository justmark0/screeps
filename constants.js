let print = console.log;
let minProfessions = {"worker": 2, "towerWorker": 1, "updater": 5, "builder":0, "helper": 0, "raider": 4} // "miner": 2,

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
    roomName : "E33N38",
    creepCanChangeProfessionIn: 60,
    minProfessions: minProfessions,
    creepAmount: sum(),
    maxProfessions: {"helper": 0, "raider": 5},
    homeEnergySources: ["5bbcaeda9099fc012e639a7f", "5bbcaeda9099fc012e639a7e"],
};