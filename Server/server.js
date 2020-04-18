let connectedUsers = [];
let lobbyList = [];

class Lobby {
    constructor(lobbyName, hostUser) {
        this.lobbyName = lobbyName;
        this.addPlayer(hostUser);
        lobbyList.push(this);
        console.log(`Lobby '${this.lobbyName}' was succsessfully created by ${this.hostUser}`);
    }
    playerList = Array(); //userName
    addPlayer(userName) {
        if(this.playerList.length < 5) {
            player = new Player(userName);
            this.playerList.push(player);
            console.log(`Player ${this.player.userName} has succsessfuly connected to lobby ${this.lobbyName}`);
        } 
    }
    kickPlayer(userName) {
        var pos = this.playerList.indexOf(userName);
        if(pos > -1) {
            var removedPlayer = playerList[pos].userName;
            this.playerList.splice(pos, 1);
            console.log(`Player ${removedPlayer} has disconnected from the '${this.lobbyName}'`);
        } 
    }
    startGame() {
       //Send start game signal to all clients from the playerList
       //there is gonna be an implementation of the game cycle (player 1, 2, 3, 4, 5) untill the gamefield isn't filled
       
    }
    endGame() {
        //End game signal to trigger end-game window 
    }
}
class User {
    constructor(userName, userAvatar) {
      this.userName = userName;
      this.userAvatar = userAvatar;
    }
}
class Player {
    constructor(userName) {
        this.playerName = userName;
    }
    #points = 0;
    addPoints(points) {
        this.#points += points;
    }
}