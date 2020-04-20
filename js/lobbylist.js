let lobby_list = document.getElementById('lobby_list');

function fill_lobby_list() {
    for(var i = 0; i < 30; i++) {
        lobby_list.innerHTML += ` <ul class="lobby_block" id="${i}}">
                                <i id="fa-lock" class="fas fa-lock"></i>
                                <div class="lobby_title">Игорю в школу ${i}</div>
                                <div class="players_count">
                                    <i id="fa-users" class="fas fa-users"></i>
                                    <div class="connected">2 / </div> 
                                    <div class="required">5</div>
                                </div>
                                <div class="pass_wrap"><input type="password" name="pass_input" id="pass_input"></div>
                                <button class="join_button"><i class="fas fa-sign-in-alt"></i></button>
                            </ul>`
    }
}
setTimeout(() => {
    fill_lobby_list();
}, 100);