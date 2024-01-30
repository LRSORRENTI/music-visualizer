const button1 = document.getElementById('button1');

let audio1 = new Audio();

audio1.src = 'audio/Narvent-Memory-Reboot.mp3'

button1.addEventListener('click', () => {
    audio1.play();
    audio1.addEventListener('playing', () => {
        console.log('audio 1 has started playing')
    });
    audio1.addEventListener('ended', () => {
        console.log('audio has ended')
    })
})