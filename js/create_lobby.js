let dia = remote.getCurrentWindow();
document.getElementById('cancel_button').addEventListener('click', () => {
    console.log('close!');
    dia.close();
});
