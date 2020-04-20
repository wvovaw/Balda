let dia = remote.getCurrentWindow();
document.getElementById('cancel_button').addEventListener('click', () => {
    dia.close();
});
let ic = document.getElementById('i_lock')
ic.addEventListener('click', () => {
  if(ic.className == 'fas fa-unlock') {
    ic.className = 'fas fa-lock';
    document.getElementById('pass').className += 'innactive';
    document.getElementById('pass').value = '';
  }
  else {
    ic.className = 'fas fa-unlock';
    document.getElementById('pass').className = '';
  }
});
document.getElementById('accept_button').addEventListener('click', () => {
    document.getElementById('lobby_title');
    document.getElementById('number_of_players');
    document.getElementById('lobby_title');
    //Сохраняем инпут, отпаравляем серверу и закрываем окно
    dia.close();

});
