## Code for my bots in Screeps game

Hi! So, there is a game called [Screeps](https://screeps.com/) it is "MMO sandbox game for programmers" according to their site. So basically you need to program virtual bots to build your base, and protect it from other players and evil bots. 
I cannot create folders, so don't be afraid of file names and project structure 😅.

### Gameplay 
You can watch right now what's going on in screeps world. Take a look! [https://screeps.com/a/#!/map/shard3?pos=6.409,-16.368](https://screeps.com/a/#!/map/shard3?pos=6.409,-16.368)
Here is a shout demo gif of how my bots are building my base:

![example1](https://user-images.githubusercontent.com/54911879/193472485-bcdf716a-5fee-43f8-8f5f-0e298dd32c7a.gif)


And here towers are updating some constructions, and bots are updating controller, harvasting energy, and moving somewhere 😁.

https://user-images.githubusercontent.com/54911879/193471718-22d9b7dd-0982-48d5-b170-93dc0b57d95d.mp4


## Roles
#### Miner
Sets a source to itself and mines it, after it got max capacity it stores it in link, if there is no link in container, if there is no container either just drops it.

### Energy distribution
- **updater** - sends energy to controller.
- **spawnHelper** - sends energy to spawn and extentions.
- **towerWorker** - sends energy to towers.
- **builder** - sends energy to new constructions.

### Raiders
Groups of creeps to invade to other rooms. TBA

### Helpers 
Creeps to carry energy to other rooms to help friends or my own rooms <3


### Contacts
If you have any questions or suggestions please let me know! My active contacts in my github profile.
