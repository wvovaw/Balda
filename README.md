# The "Balda" game

![GitHub watchers](https://img.shields.io/github/watchers/wvovaw/Balda?label=Watched&style=social)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/wvovaw/Balda)
[![CodeFactor](https://www.codefactor.io/repository/github/wvovaw/balda/badge)](https://www.codefactor.io/repository/github/wvovaw/balda)
## Description

This is the game on the 7x7 (comminly 5x5 but not in this case) field that starts from the word on the middle row. Players should place a letter to the free circuit and assemble a new one word. Person who have used more letters to assemble words wins.

The server is now deployed on Heroku. Server repo is ![here](https://github.com/wvovaw/Balda-server)

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
- [ ] Fill the bottom pane ⬇
- [ ] Limit user's time on turn ⏲

## Server side 🔗

- [X] Build the server 💾
- [X] Implement a lobby system 🚪
- [X] Add a dictionary 📖
- [ ] Create an account system 🛂
- [ ] Start to collect statistics 📈


## Troubleshooting

- [ ] Figure out how does the 'failed: WebSocket is closed before the connection is established.' problem occure. ⚠