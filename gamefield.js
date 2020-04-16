window.onload = function() {
  //Game field (All the letters is empty at the begining)
  for (var i = 0; i < 49; i++) {
    document.getElementById('gamezone').innerHTML += '<div id="' + i + '" class="empty letterblock"></div>';    
  }
  //Adjacency list
  var adjacencyList = [
    [1, 7], // 0
    [0, 2, 8], //1
    [1, 3, 9], //2
    [2, 4, 10], //3
    [3, 5, 11], //4
    [4, 6, 12], //5
    [5, 13], //6
    [0, 8, 14], //7
    [1, 7, 9, 15], // 8
    [2, 8, 10, 16], //9
    [3, 9, 11, 17], //10
    [4, 10, 12, 18], //11
    [5, 11, 13, 19], //12
    [6, 12, 20], //13
    [7, 15, 21], //14
    [8, 14, 16, 22], //15
    [9, 15, 17, 23], //16
    [10, 16, 18, 24], // 17
    [11, 17, 19, 25], //18
    [12, 18, 20, 26], //19
    [13, 19, 27], //20
    [14, 22, 28], //21
    [15, 21, 23, 29], //22
    [16, 22, 24, 30], //23
    [17, 23, 25, 31], //24
    [18, 24, 26, 32], //25
    [19, 25, 27, 33], //26
    [20, 26, 34], //27
    [21, 29, 35], //28
    [22, 28, 30, 36], //29
    [23, 29, 31, 37], //30
    [24, 30, 32, 38], //31
    [25, 31, 33, 39], //32
    [26, 32, 34, 40], //33
    [27, 33, 41], //34
    [28, 36, 42], //35
    [29, 35, 37, 43], //36
    [30, 36, 38, 44], //37
    [31, 37, 39, 45], //38
    [32, 38, 40, 46], //39
    [33, 39, 41, 47], //40
    [34, 40, 48], //41
    [35, 43], //42
    [36, 42, 44], //43
    [37, 43, 45], //44
    [38, 44, 46], //45
    [39, 45, 47], //46
    [40, 46, 48], //47
    [41, 47] //48
  ];
  //Keyboard
  var rus_alph = '?АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
  var eng_alph = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //Realize multilanguage feature
  var gameLanguage = rus_alph; 
  document.getElementById('gamezone').innerHTML += '<div id="keyboard"></div>'; 
  for (var i = 0; i < gameLanguage.length; i++) {
    document.getElementById('keyboard').innerHTML += '<div class="letter" draggable="true">' + gameLanguage[i] + '</div>';    
  }

  function drawInitWord() {
    var gamezone = document.getElementById('gamezone');
    gamezone.children[22].innerHTML = 'П';
    gamezone.children[22].className = 'letterblock filled';
    gamezone.children[23].innerHTML = 'А';
    gamezone.children[23].className = 'letterblock filled';
    gamezone.children[24].innerHTML = 'Р';
    gamezone.children[24].className = 'letterblock filled';
    gamezone.children[25].innerHTML = 'О';
    gamezone.children[25].className = 'letterblock filled';
    gamezone.children[26].innerHTML = 'Х';
    gamezone.children[26].className = 'letterblock filled';
    gamezone.children[27].innerHTML = 'О';
    gamezone.children[27].className = 'letterblock filled';
    gamezone.children[28].innerHTML = 'Д';
    gamezone.children[28].className = 'letterblock filled';
}
drawInitWord();

 //drag'n'drop
  /*
  1) Drug a letter up
  2) Hover it over a letter block
    a)  If it's not empty, then don't do anything. Continue
    b)  If it's empty, drop a letter in it 
        and close the keyboard (Disable 'draggable')
        while a letter is in the letterblock.
  3) Open the keyboard if turn has begun or the letter was removed from the field 
   */
  //Collections of elements by class
  let letters = document.querySelectorAll('.letter');
  let empties = document.querySelectorAll('.empty');
  let filleds = document.querySelectorAll('.filled');
  let letterText;  //variable of a choosed letter

  //Events for letters
  for(const letter of letters) {
    letter.addEventListener('dragstart', dragStart);
    letter.addEventListener('dragend', dragEnd);
  }
  //Events for empty letterblocks
  for(const empty of empties) {
    empty.addEventListener('dragover', dragOver);
    empty.addEventListener('dragenter', dragEnter);
    empty.addEventListener('dragleave', dragLeave);
    empty.addEventListener('drop', dragDrop);
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
    //Block until the end of turn or deleting of the last placed letter
    for(const letter of letters) {
      letter.style.pointerEvents = 'none';
      letter.style.backgroundColor = '#606060';
    }
    this.addEventListener('click', markLetter);
    //Rebuild filleds
    filleds = document.querySelectorAll('.filled');

    console.log(filleds);
    //Unlock word assembly
    
    document.getElementById('remove_letter_button').style.pointerEvents = 'auto';
  }
  //Remove letter event
  document.getElementById('remove_letter_button').addEventListener('click', () => {
    if(wordStack.length > 0) removeWord();
    letterToRemove = document.querySelector('.lastFilled');
    letterToRemove.innerHTML = '';
    letterToRemove.className = 'empty letterblock';
    for(const letter of letters) {
      letter.style.pointerEvents = 'auto';
      letter.style.backgroundColor = '#909090';
    }
    filleds--;
    wordStack = Array();
    document.getElementById('remove_letter_button').style.pointerEvents = 'none';
    document.getElementById('confirm_word_button').style.pointerEvents = 'none';
  });
  //Remove word event
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
  /* Word assembling:
  1) Set a letter 
  2) click on the 1-st letter of the needed word
  3) drag it over the next one letterblock
    a) If cursor is over an empty letterblock then cancel word assembling
    b) If cursor is over the letter then check if this already in the stack
      ba) If true then make it inactive
      bb) If false then continue  
  
  repeate while drop event (or right click event) does not occur.
  
  4) Check if last placed letter isn't in the collection
    a) If true then cancel assembling
    b) Else send a word to check 

    P.S: I've tried all this stuf and found it's prety complicated so now I'll realize click-style word assembling... Leave all this draggable mechanics to the best future...
    P.P.S: I've returned back to slide because click logic would be more comlicated.

  */

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
  // Confirm button
  let completeWord = ''; 
  document.getElementById('confirm_word_button').addEventListener('click', () => {
    //Rebuild empties
    empties = document.querySelectorAll('.empty');
    wordStack = wordStack.slice(1);
    for(letterblock of wordStack) {
      //Remove event listener of empty class
      if(String(letterblock.className).includes('lastFilled')) {
        letterblock.removeEventListener('dragover', dragOver);
        letterblock.removeEventListener('dragenter', dragEnter);
        letterblock.removeEventListener('dragleave', dragLeave);
        letterblock.removeEventListener('drop', dragDrop);
      }
      else letterblock.className = 'letterblock filled';
      completeWord += letterblock.innerHTML;
    }
    document.getElementById('used_words').innerHTML += '<li>' + completeWord + '</li>';
    for(letterblock of wordStack) {
      letterblock.className = 'letterblock filled';
    }
    wordStack = Array();
    document.getElementById('remove_letter_button').style.pointerEvents = 'none';
    document.getElementById('remove_word_button').style.pointerEvents = 'none';
    document.getElementById('confirm_word_button').style.pointerEvents = 'none';
    newTurn();
  });
  function newTurn() {
    //Unlock the keyboard
    for(const letter of letters) {
      letter.style.pointerEvents = 'auto';
      letter.style.backgroundColor = '#909090';
    }
    //clear wordStack
    wordStack = Array();
    //Clear word
    completeWord = '';
  }
}
