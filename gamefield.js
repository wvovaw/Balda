window.onload = function() {
  //Game field (All the letters is empty at the begining)
  for (var i = 0; i < 49; i++) {
    document.getElementById('gamezone').innerHTML += '<div id="' + i + '" class="empty letterblock"></div>';    
  }
  //Keyboard
  var rus_alph = '?АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
  var eng_alph = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  //Realize multilanguage feature
  var gameLanguage = rus_alph; 
  document.getElementById('gamezone').innerHTML += '<div id="keyboard"></div>'; 
  for (var i = 0; i < gameLanguage.length; i++) {
    document.getElementById('keyboard').innerHTML += '<div class="letter" draggable="true">' + gameLanguage[i] + '</div>';    
  }

  function drawInitWord() {
    var gamezone = document.getElementById('gamezone');
    gamezone.children[22].innerHTML = 'А';
    gamezone.children[22].className = 'letterblock filled';
    gamezone.children[23].innerHTML = 'Б';
    gamezone.children[23].className = 'letterblock filled';
    gamezone.children[24].innerHTML = 'В';
    gamezone.children[24].className = 'letterblock filled';
    gamezone.children[25].innerHTML = 'Г';
    gamezone.children[25].className = 'letterblock filled';
    gamezone.children[26].innerHTML = 'Д';
    gamezone.children[26].className = 'letterblock filled';
    gamezone.children[27].innerHTML = 'Е';
    gamezone.children[27].className = 'letterblock filled';
    gamezone.children[28].innerHTML = 'Ё';
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
  const letters = document.querySelectorAll('.letter');
  const empties = document.querySelectorAll('.empty');
  var filleds = document.querySelectorAll('.filled');
  var letterText;  //variable of a choosed letter

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
    filleds = new Array(filleds, this);
    //Unlock word assembly
    
    document.getElementById('remove_letter_button').style.pointerEvents = 'auto';
  }
  
  document.getElementById('remove_letter_button').addEventListener('click', () => {
    letterToRemove = document.querySelector('.lastFilled');
    letterToRemove.innerHTML = '';
    letterToRemove.className = 'empty letterblock';
    for(const letter of letters) {
      letter.style.pointerEvents = 'auto';
      letter.style.backgroundColor = '#909090';
    }
    filleds--;
    document.getElementById('remove_letter_button').style.pointerEvents = 'none';
  });

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

}
