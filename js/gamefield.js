var serverurl = 'https://balda-server.herokuapp.com/';
var socket = io.connect(serverurl);
var ipc = require('electron').ipcRenderer;
var fs = require('fs');

window.onload = function() {
  for (var i = 0; i < 49; i++) {
    document.getElementById('gamezone').innerHTML += '<div id="' + i + '" class="letterblock empty"></div>';    
  }
  var adjacencyList = [
    [1, 7],         
    [0, 2, 8],      
    [1, 3, 9],      
    [2, 4, 10],     
    [3, 5, 11],     
    [4, 6, 12],     
    [5, 13],        
    [0, 8, 14],     
    [1, 7, 9, 15],  
    [2, 8, 10, 16], 
    [3, 9, 11, 17], 
    [4, 10, 12, 18], 
    [5, 11, 13, 19], 
    [6, 12, 20], 
    [7, 15, 21], 
    [8, 14, 16, 22],
    [9, 15, 17, 23],
    [10, 16, 18, 24], 
    [11, 17, 19, 25], 
    [12, 18, 20, 26], 
    [13, 19, 27], 
    [14, 22, 28], 
    [15, 21, 23, 29],
    [16, 22, 24, 30],
    [17, 23, 25, 31],
    [18, 24, 26, 32],
    [19, 25, 27, 33],
    [20, 26, 34], 
    [21, 29, 35], 
    [22, 28, 30, 36], 
    [23, 29, 31, 37], 
    [24, 30, 32, 38], 
    [25, 31, 33, 39], 
    [26, 32, 34, 40], 
    [27, 33, 41], 
    [28, 36, 42], 
    [29, 35, 37, 43], 
    [30, 36, 38, 44], 
    [31, 37, 39, 45], 
    [32, 38, 40, 46], 
    [33, 39, 41, 47], 
    [34, 40, 48],
    [35, 43], 
    [36, 42, 44],
    [37, 43, 45],
    [38, 44, 46],
    [39, 45, 47],
    [40, 46, 48],
    [41, 47]
  ];
  var rus_alph = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
  var eng_alph = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var gameLanguage = rus_alph; 
  document.getElementById('gamezone').innerHTML += '<div id="keyboard"></div>'; 
  for (var i = 0; i < gameLanguage.length; i++) {
    document.getElementById('keyboard').innerHTML += '<div class="letter" draggable="true">' + gameLanguage[i] + '</div>';    
  }
 
  let gamezone = document.getElementById('gamezone');
  function drawInitWord(word) {
    let j=0;
    
    for(var i = 21; i < 28; i++) {
      placeLetter(word[j++], i);
     }
  }
  let letters = document.querySelectorAll('.letter');
  let empties = document.querySelectorAll('.empty');
  let filleds = document.querySelectorAll('.filled');
  let letterText;
  for(const letter of letters) {
    letter.style.pointerEvents = 'none';
    letter.style.backgroundColor = '#606060';
  }
  for(const letter of letters) {
    letter.addEventListener('dragstart', dragStart);
    letter.addEventListener('dragend', dragEnd);
  } 
  function dragStart() {
    letterText = this.innerHTML;
    this.className += ' hold';
  }
  function dragEnd() {
    this.className = 'letter';
  }
  function dragOver(e) {
    e.preventDefault();
  }
  function dragEnter(e) {
    e.preventDefault();
    this.className += ' hovered';
  }
  function dragLeave() {
    this.className = 'letterblock empty';
  }
  function dragDrop() {
    this.innerHTML = letterText;
    this.className = 'letterblock filled lastFilled';
    for(const letter of letters) {
      letter.style.pointerEvents = 'none';
      letter.style.backgroundColor = '#606060';
    }
    this.addEventListener('click', markLetter);
    filleds = document.querySelectorAll('.filled');
    console.log(filleds);
    document.getElementById('remove_letter_button').style.pointerEvents = 'auto';
  }
  document.getElementById('remove_letter_button').addEventListener('click', removeLetter);
  document.getElementById('remove_word_button').addEventListener('click', removeWord);
  function removeWord() {
    for(letterblock of wordStack) {
      if(String(letterblock.className).includes('lastFilled')) letterblock.className = 'letterblock filled lastFilled';
      else letterblock.className = 'letterblock filled';
    }
    wordStack = Array();
    document.getElementById('remove_word_button').style.pointerEvents = 'none';
    document.getElementById('confirm_word_button').style.pointerEvents = 'none';
  }
  function removeLetter() {
    if(wordStack.length > 0) removeWord();
    letterToRemove = document.querySelector('.lastFilled');
    letterToRemove.innerHTML = '';
    letterToRemove.className = 'letterblock empty';
    for(const letter of letters) {
      letter.style.pointerEvents = 'auto';
      letter.style.backgroundColor = '#909090';
    }
    filleds--;
    wordStack = Array();
  }
  let exit_buttons = document.querySelectorAll('.exit_button');
  setTimeout(() => {
    for(e of exit_buttons) {
      e.addEventListener('click', () => {
        socket.emit('player_leave_lobby', username, lobbyId);
        let delLobbyFromJson = JSON.parse(fs.readFileSync('./cfg.json'));
        delete delLobbyFromJson.lobbyId;
        fs.writeFileSync('./cfg.json', JSON.stringify(delLobbyFromJson));
        ipc.send('to_lobbyList', 'args');
      });
    }
  }, 1500);
  document.getElementById('close_button').addEventListener('click', () => {
    socket.emit('player_leave_lobby', username, lobbyId);
    socket.emit('user_logout', username);
  }); 
  let wordStack = Array();
  for(filled of filleds) {
    filled.addEventListener('click', markLetter);
  }
  function markLetter() {
    if(document.querySelector('.lastFilled') === null) return;
    if(wordStack.indexOf(this) > -1) return;
    else if(wordStack.length === 0) {
      this.className += ' hovered';
      wordStack = new Array(wordStack, this);
      return;
    } 
    let lastId = wordStack[wordStack.length - 1];
    if(adjacencyList[lastId.getAttribute('id')].includes(Number(this.getAttribute('id')))) {
      this.className += ' hovered';
      wordStack.push(this);
    } 
    document.getElementById('remove_word_button').style.pointerEvents = 'auto';
    if(wordStack.includes(document.querySelector('.lastFilled'))) document.getElementById('confirm_word_button').style.pointerEvents = 'auto';
  }
  let completeWord; 
  let letterCoord;
  let letter;
  let usedWordsList = new Set();
  let userPoints;
  function check_word(word) {
    return new Promise((resolve) => {
      socket.emit('check_word', word);
      socket.once('check_word_result', (result) => {
        console.log(`WORD CHECKING RESULT: ${result}`);
        resolve(result);
      });
    });
  }
  document.getElementById('confirm_word_button').addEventListener('click', async () => {
    completeWord = '';
    for(letterblock of wordStack) {
      completeWord += letterblock.innerHTML;
    }
    completeWord = completeWord.slice(9);
    if(usedWordsList.has(completeWord)) {
      removeLetter();
      letter = letterCoord = completeWord = wordStack = '';
      return;
    }
    let check_word_result = await check_word(completeWord);
    if(check_word_result == false) {
      removeLetter();
      letter = letterCoord = completeWord = wordStack = '';
      console.log(`Word '${completeWord}' does not exist.`);
      //Show dialog message that word doesn't exist
      showMessage('Такого слова нет', 'Найдите другое');
      return;
    }
    else if(check_word_result == true) console.log(`Word '${completeWord}' exists.`);
    else  {
      console.log('ERR! Can\'t check the word. Try again');
      removeLetter();
      letter = letterCoord = completeWord = wordStack = '';
      return;
    }
    empties = document.querySelectorAll('.empty');
    wordStack = wordStack.slice(1);
    for(letterblock of wordStack) {
      if(String(letterblock.className).includes('lastFilled')) {
        letterblock.removeEventListener('dragover', dragOver);
        letterblock.removeEventListener('dragenter', dragEnter);
        letterblock.removeEventListener('dragleave', dragLeave);
        letterblock.removeEventListener('drop', dragDrop);
      }
      else letterblock.className = 'letterblock filled';
      letterCoord = document.querySelector('.lastFilled').id;
      letter = document.querySelector('.lastFilled').innerHTML;
      for(const letter of letters) {
        letter.style.pointerEvents = 'none';
        letter.style.backgroundColor = '#606060';
      }
    }
    addUsedWord(completeWord, username);
    for(letterblock of wordStack) {
      letterblock.className = 'letterblock filled';
    }
    document.getElementById('remove_letter_button').style.pointerEvents = 'none';
    document.getElementById('remove_word_button').style.pointerEvents = 'none';
    document.getElementById('confirm_word_button').style.pointerEvents = 'none';
    socket.emit('i_end_turn', lobbyId, completeWord, username, letter, letterCoord);
    userPoints = Number(document.getElementById(username).querySelectorAll('.user_profile_userPoints')[0].innerText.split(' ')[1]) + completeWord.length;
    document.getElementById(username).querySelectorAll('.user_profile_userPoints')[0].innerText = `Очки: ${userPoints}`;
    document.getElementById(username).getElementsByClassName('user_turn_progressbar')[0].style.width = '0%';
  });
  function newTurn() {
    for(const letter of letters) {
      letter.style.pointerEvents = 'auto';
      letter.style.backgroundColor = '#909090';
    }
    for(const empty of empties) {
      empty.addEventListener('dragover', dragOver);
      empty.addEventListener('dragenter', dragEnter);
      empty.addEventListener('dragleave', dragLeave);
      empty.addEventListener('drop', dragDrop);
    }
    wordStack = Array();
    completeWord = '';
    letterCoord = '';
    letter = '';
  }
  function endTurn() {
    for(const letter of letters) {
      letter.style.pointerEvents = 'none';
      letter.style.backgroundColor = '#606060';
    }
    for(const empty of empties) {
      empty.removeEventListener('dragover', dragOver);
      empty.removeEventListener('dragenter', dragEnter);
      empty.removeEventListener('dragleave', dragLeave);
      empty.removeEventListener('drop', dragDrop);
    }
    document.getElementById('remove_letter_button').style.pointerEvents = 'none';
    document.getElementById('remove_word_button').style.pointerEvents = 'none';
    document.getElementById('confirm_word_button').style.pointerEvents = 'none';
  }
  let userProfile = JSON.parse(fs.readFileSync('./cfg.json'));
  let username = userProfile.username;
  let useravatar = userProfile.useravatar;
  let lobbyId = userProfile.lobbyId;
  let requiredPlayers = Number(userProfile.required);
  let playerList;
  setTimeout(() => {
    socket.emit('join_lobby', lobbyId, username, useravatar);
  }, 1000); // Causing an error when user leave lobby before he joinned to it
  socket.on('succsess_lobby_connection', (playerListJson) => {
    playerList = JSON.parse(playerListJson).playerList;
    for(const p of playerList) {
      console.log(p);
      document.getElementById('tierlist').innerHTML += `
      <div class="player" id="${p.playerName}">
        <img class="user_profile_avatar" src="${p.playerAvatar}">
        <div class="user_profile_username">${p.playerName}</div>
        <div class="user_profile_userPoints">Очки: ${p.playerPoints}</div>
        <div class="user_turn_progressbar"></div>
      </div>`;
      document.getElementById(p.playerName).getElementsByClassName('user_turn_progressbar')[0].style.width = '0%';
    }
    if(document.querySelectorAll('.player').length == requiredPlayers) {
      socket.emit('start_game', lobbyId);
      console.log('I start the game at ', lobbyId);
    }
  });
  socket.on('playerConnected', (playerName, playerAvatar, playerPoints) => {
    if(username != playerName) showMessage('Игрок подключился:', `${playerName}`);
    document.getElementById('tierlist').innerHTML += `
      <div class="player" id="${playerName}">
        <img class="user_profile_avatar" src="${playerAvatar}">
        <div class="user_profile_username">${playerName}</div>
        <div class="user_profile_userPoints">Очки: ${playerPoints}</div>
        <div class="user_turn_progressbar"></div>
      </div>`;
      document.getElementById(playerName).getElementsByClassName('user_turn_progressbar')[0].style.width = '0%';
  });
  socket.on('playerDisconnected', (playerName) => {
    showMessage('Игрок вышел:', `${playerName}`);
    document.getElementById(playerName).remove();
  });
  socket.on('game_started', (initWord) => {
    console.log(`Game has started. Init word is ${initWord}`);
    setTimeout(() => {
      drawInitWord(initWord.toUpperCase());
      showMessage('Игра началась!', '');
      //Sound alert
    }, 300);

  });
  let progress;
  let w;
  let timer;
  function countDown(playerName) {
    progress = document.getElementById(playerName).getElementsByClassName('user_turn_progressbar')[0];
    w = 90;
    clearInterval(timer);
    timer = null;
    barTick = function() {
      w -= 2;
      progress.style.width = `${w}%`;
      if(w == 0) {
        clearInterval(timer);
        timer = null;
        if(username == playerName) {
          socket.emit('i_skip_turn', lobbyId, username);
          for(letterblock of wordStack) {
            letterblock.className = 'letterblock filled';
          }
          endTurn();
        }
      }
    }
    timer = setInterval(barTick, 2000);
  }
  socket.on('now_turns', (playerName) => {
    let prev = document.querySelector('.nowTurns');
    if(prev !== null && prev !== undefined) {
      prev.children[3].style.width = '0%';
      prev.className = 'player';
    }
    document.getElementById(playerName).className += ' nowTurns';
    document.getElementById(playerName).getElementsByClassName('user_turn_progressbar')[0].style.width = '90%';
    //Timer
    countDown(playerName);
    if(username == playerName) {
      showMessage('Ваш ход!', 'Ищи слово');
      //Sound alert
      newTurn();
      return;
    }
    showMessage(`Ходит ${playerName}`, 'Давай, неудачник...');
  });
  socket.on('looser', (playerName) => {
    if(username == playerName) {
      console.log(`Game over. You have reached three penalties... Better luck next time!`);
      document.getElementById('winner_sign').innerText = 'Поражение...';
      document.getElementById('winner_name').innerText = 'Вы пропустили 3 хода.';
      document.getElementById('endgame_exit_button').remove();
      document.getElementById('bg_endgame').style.display = 'flex';    
      setTimeout(() => {
        let delLobbyFromJson = JSON.parse(fs.readFileSync('./cfg.json'));
        delete delLobbyFromJson.lobbyId;
        fs.writeFileSync('./cfg.json', JSON.stringify(delLobbyFromJson));
        ipc.send('to_lobbyList', 'args');
      }, 5000);
   }
   else showMessage('Поражение', `${playerName} пропустил 3 хода`);
  });
  let coord;
  function removeLastTurnHighlight() {
    if(coord != undefined) {
      document.getElementById(coord).style.backgroundColor = 'rgba(255, 255, 255, 0%)';
      console.log('Ok, i see it!');
      coord = undefined;
    }
  }
  document.addEventListener('mousedown', removeLastTurnHighlight);
  socket.on('board_changes', (usedWord, playerName, letter, letterCoord) => {
    if(usedWord == null) {
      document.getElementById('used_words').innerHTML += `<li class="used_word turn_skip" owner="${playerName}">${playerName} : Пропуск хода</li>`;
    }
    else {
      placeLetter(letter, letterCoord);
      coord = letterCoord;
      document.getElementById(letterCoord).style.backgroundColor = 'rgba(255, 255, 255, 10%)';
      addUsedWord(usedWord, playerName);
      userPoints = Number(document.getElementById(playerName).querySelectorAll('.user_profile_userPoints')[0].innerText.split(' ')[1]) + usedWord.length;
      document.getElementById(playerName).querySelectorAll('.user_profile_userPoints')[0].innerText = `Очки: ${userPoints}`;
  }  
  });
  socket.on('end_game', (winnerName) => {
    console.log(`Game over. ${winnerName} has won! Congrats!`);
    clearInterval(timer);
    document.getElementById('winner_name').innerText = winnerName;
    document.getElementById('bg_endgame').style.display = 'flex';    
  });
  function placeLetter(letter, letterCoord) {
    let l = document.getElementById('gamezone').getElementsByClassName('letterblock')[letterCoord];
    l.innerHTML = letter;
    l.className = 'letterblock filled';
    l.removeEventListener('dragover', dragOver);
    l.removeEventListener('dragenter', dragEnter);
    l.removeEventListener('dragleave', dragLeave);
    l.removeEventListener('drop', dragDrop);
    l.addEventListener('click', markLetter);
    empties = document.querySelectorAll('.empty');
    filleds = document.querySelectorAll('.filled');
  }
  function addUsedWord(word, owner) {
    document.getElementById('used_words').innerHTML += `<li class="used_word" owner="${owner}">${owner} : ${word}</li>`;
    usedWordsList.add(word);
    console.log(usedWordsList);
  }
  function showMessage(title, message) {
    document.getElementById('messagebox_title').innerText = title;
    document.getElementById('messagebox_message').innerText = message;
    let title_width = document.getElementById('messagebox_title').offsetWidth;
    document.getElementById('underline').style.width = title_width + 'px';
    document.getElementById('bg_messagebox').style.display = 'flex'; 
    document.getElementById('messagebox').className = 'animate_messagebox';
    setTimeout(()=>{
      document.getElementById('messagebox').className = '';
      document.getElementById('bg_messagebox').style.display = 'none';
    }, 3000);
  }
}
