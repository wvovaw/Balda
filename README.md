# The "Balda" game

![GitHub watchers](https://img.shields.io/github/watchers/wvovaw/Balda?label=Watched&style=social)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/wvovaw/Balda)
[![CodeFactor](https://www.codefactor.io/repository/github/wvovaw/balda/badge)](https://www.codefactor.io/repository/github/wvovaw/balda)

## Description

Balda is the game on the 7x7 (usually 5x5 but not in this case) field that starts from the word on the middle row. Players should place a letter to the free circuit and assemble a new one word. Person who have used more letters to assemble words wins.

The server is now deployed on Heroku. Repo is ![here](https://github.com/wvovaw/Balda-server)

# Clone and build

```sh
git clone https://github.com/wvovaw/Balda.git
cd Balda
npm install
npm run build
```
# Todo ☑

## Client side 🖥

- [X] Build a gamefield 📋
- [X] Create a keyboard ⌨
- [X] Hide the native title bar ❎
- [X] Implement drag'n'drop mechanic with letters 🖐
- [X] Implement word assembling mechanic 🔤
- [X] Finish the main game conception 🏁 (place a letter, assemble a word, confirm it)
- [X] Build a list of the used words on the right pane 📝
- [X] Create a color scheme 🎨
- [X] Build a score bar on the left pane 💯
- [X] Build a lobby list 🚪
- [X] Limit the number of characters for lobby title and nickname 🔢
- [X] Handle all the wrong inputs ⁉
- [X] Create a 'Game Over' popup window 🌟 
- [X] Build dialog element that will say player some information 💁
- [X] Limit user's time on turn ⏲
- [ ] Fill the bottom pane (Plese, do it...) ⬇

### Friend requests 🙋
- [ ] Each player should have his own color. All the words he have assembled in the right used words list should have this font color. Or may be I should put player name beside. 🎨
- [ ] The last assembled word should be highlited until any user's act:
 - The first lettetblock background color is a color of the player from the last turn.
 - The Word direction should be displayed by arrows. ⤴
- [X] Add reload lobby list button 🔁

## Troubleshooting ⚠

- [ ] Figure out how does the 'failed: WebSocket is closed before the connection is established.' problem occure. ⚠
- [ ] On OS Windows sometimes window opens again when you create new lobby or connect to lobby. So you should  have loaded the game.html page but after window reopens you are still to lobbylist.html /shrug   

- [ ] One accident has occured when 1 player left from one lobby and in this time another one lobby was changing so the turn has ended in the first lobby but new turn has not started... ⚠

```log
2020-05-03T10:27:03.456433+00:00 app[web.1]: User wvovaw has successfully connected.
2020-05-03T10:27:17.947385+00:00 app[web.1]: Lobby 'asdasd' was succsessfully created by wvovaw
2020-05-03T10:27:18.461807+00:00 app[web.1]: Player wvovaw has succsessfuly connected to lobby asdasd
2020-05-03T10:27:39.228363+00:00 app[web.1]: Player wvovaw has succsessfuly connected to lobby asdasd
2020-05-03T10:27:47.608678+00:00 app[web.1]: Kicking wvovaw
2020-05-03T10:27:47.609443+00:00 app[web.1]: BEFORE:
2020-05-03T10:27:47.612339+00:00 app[web.1]: [
2020-05-03T10:27:47.612340+00:00 app[web.1]:   Player {
2020-05-03T10:27:47.612340+00:00 app[web.1]:     playerName: 'wvovaw',
2020-05-03T10:27:47.612341+00:00 app[web.1]:     playerAvatar: 'https://picsum.photos/72/72?random=1',
2020-05-03T10:27:47.612342+00:00 app[web.1]:     socket: Socket {
2020-05-03T10:27:47.612345+00:00 app[web.1]:       id: 'iOAENp953qm4_0sTAAAD',
2020-05-03T10:27:47.612348+00:00 app[web.1]:     }
2020-05-03T10:27:47.612348+00:00 app[web.1]:   },
2020-05-03T10:27:47.612348+00:00 app[web.1]:   Player {
2020-05-03T10:27:47.612348+00:00 app[web.1]:     playerName: 'wvovaw',
2020-05-03T10:27:47.612349+00:00 app[web.1]:     playerAvatar: 'https://picsum.photos/72/72?random=1',
2020-05-03T10:27:47.612349+00:00 app[web.1]:     socket: Socket {
2020-05-03T10:27:47.612350+00:00 app[web.1]:       id: 'Z5bGMmfG4oZ4v2kUAAAF',
2020-05-03T10:27:47.612353+00:00 app[web.1]:     }
2020-05-03T10:27:47.612353+00:00 app[web.1]:   }
2020-05-03T10:27:47.612353+00:00 app[web.1]: ]
2020-05-03T10:27:47.612394+00:00 app[web.1]: Player 'wvovaw' disconnected from the 'asdasd'
2020-05-03T10:27:47.612657+00:00 app[web.1]: Winner at lobby "asdasd": "wvovaw"! He beat 0 letters!
2020-05-03T10:27:47.612744+00:00 app[web.1]: AFTER:
2020-05-03T10:27:47.613058+00:00 app[web.1]: [
2020-05-03T10:27:47.613059+00:00 app[web.1]:   Player {
2020-05-03T10:27:47.613059+00:00 app[web.1]:     playerName: 'wvovaw',
2020-05-03T10:27:47.613060+00:00 app[web.1]:     playerAvatar: 'https://picsum.photos/72/72?random=1',
2020-05-03T10:27:47.613060+00:00 app[web.1]:     socket: Socket {
2020-05-03T10:27:47.613061+00:00 app[web.1]:       id: 'Z5bGMmfG4oZ4v2kUAAAF',
2020-05-03T10:27:47.613068+00:00 app[web.1]:     }
2020-05-03T10:27:47.613068+00:00 app[web.1]:   }
2020-05-03T10:27:47.613069+00:00 app[web.1]: ]
```