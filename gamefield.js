window.onload = function() {
  //Game field (All the letters is empty at the begining)
  for (var i = 0; i < 49; i++) {
    document.getElementById('gamezone').innerHTML += '<div id="' + i + '" class="letterblock empty"></div>';    
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

  //Events for letters
  const letters = document.querySelectorAll('.letter');
  for(const letter of letters) {
    letter.addEventListener('dragstart', dragStart);
    letter.addEventListener('dragend', dragEnd);
  }
  //Events for letterblocks
  const empties = document.querySelectorAll('.empty');
  for(const empty of empties) {
    empty.addEventListener('dragover', dragOver);
    empty.addEventListener('dragenter', dragEnter);
    empty.addEventListener('dragleave', dragLeave);
    empty.addEventListener('drop', dragDrop);
  }

  var letterText;  //variable of a choosed letter
  var filledLetterblock = null; //variable to remember where the letter was set

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
    this.className = 'letterblock';
    filledLetterblock = this;
    //Block until the end of turn or deleting of the last placed letter
    for(const letter of letters) {
      letter.style.pointerEvents = 'none';
      letter.style.backgroundColor = '#606060'
    }
    document.getElementById('remove_letter_button').style.pointerEvents = 'auto';
  }

  document.getElementById('remove_letter_button').addEventListener('click', () => {
    filledLetterblock.innerHTML = '';
    for(const letter of letters) {
      letter.style.pointerEvents = 'auto';
      letter.style.backgroundColor = '#909090'
    }
    document.getElementById('remove_letter_button').style.pointerEvents = 'none';
  })  
}
