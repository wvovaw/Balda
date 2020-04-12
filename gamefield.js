window.onload = function() {
  //Game field
  for (var i = 0; i < 49; i++) {
    document.getElementById('gamezone').innerHTML += '<div class="letterblock">' + i + '</div>';    
  }
  //Keyboard
  var rus_alph = '?АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
  document.getElementById('gamezone').innerHTML += '<div id="keyboard"></div>'; 
  for (var i = 0; i < rus_alph.length; i++) {
    document.getElementById('keyboard').innerHTML += '<div class="letter">' + rus_alph[i] + '</div>';    
  }
}