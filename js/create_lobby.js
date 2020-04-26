var socket = io.connect('http://localhost:3010');
const remote = require('electron').remote;
var fs = require('fs');

let dia = remote.getCurrentWindow();
document.getElementById('cancel_button').addEventListener('click', () => {
    dia.close();
});

let ic = document.getElementById('i_lock');
ic.addEventListener('click', () => {
  if(ic.className == 'fas fa-lock-open') {
    ic.className = 'fas fa-lock';
    document.getElementById('pass').className = '';
    document.getElementById('pass').focus();
  }
  else {
    ic.className = 'fas fa-lock-open';
    document.getElementById('pass').className += 'innactive';
    document.getElementById('pass').value = '';
  }
});

document.getElementById('confirm_button').addEventListener('click', () => { 
  let title = document.getElementById('lobby_title').value;
  let pass = document.getElementById('pass').value;
  let nop = document.getElementById("number_of_players").options[document.getElementById("number_of_players").selectedIndex].text;
  if(title == '') {
    document.getElementById('lobby_title').className = "wrong_input";
    document.querySelector('.wrong_input').focus();
    setTimeout(() => {
        document.querySelector('.wrong_input').className = '';
    }, 1000);
    return;
  }
  if(title.length > 18) {
    let wi = document.getElementById('lobby_title');
    wi.className = "wrong_input";
    wi.value = '';
    wi.setAttribute('placeholder', 'Покороче, пожалуйста...');
    document.querySelector('.wrong_input').focus();
    setTimeout(() => {
        document.querySelector('.wrong_input').className = '';
        wi.setAttribute('placeholder', '');
    }, 1000);
    return;
  }
  if(ic.className == 'fas fa-lock' && pass == '') {  
    document.getElementById('pass').className = "wrong_input";
    document.querySelector('.wrong_input').focus();
    setTimeout(() => {
      document.querySelector('.wrong_input').className = '';
    }, 1000);
    return;
  }

  let cfg = JSON.parse(fs.readFileSync('./cfg.json'));
  username = cfg.username;
  let lobby_info = `{
    "title" : "${title}",
    "pass" : "${pass}",
    "maxPlayers" : "${nop}",
    "host" : "${username}"
  }`;
  socket.emit('create_lobby', lobby_info);
  dia.close();
});
