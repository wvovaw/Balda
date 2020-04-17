# Server for the "Balda" game

## Functional of the server
### Server's part 
* Connect users on the server. Give them GUID (Until I don't have a personal account system  implemented).
### Lobby part
* Create lobby on user's demand.
* Connect user to the lobby.
* Remove the lobby when nobody is connected to it (host leave) or after end of the game.
* Start the game when all players are ready. Build a circuled queue.
### In game part 
* Toggle round. The round ends after the time is up or the player has finished the move
* End the game when all the letter blocks was filled. 
* Remove a player from the queue if he is disconnected or he decided to leave the game.
* Find the word in the dictionary.