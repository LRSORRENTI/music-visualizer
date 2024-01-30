let audio1 = new Audio();
const audioContext = new (window.AudioContext)();
console.log(audioContext)
audio1.src = 'audio/Narvent-Memory-Reboot.mp3'

const container = document.getElementById('container');

const canvas = document.getElementById('canvas1');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
let audioSource;
let analyser;

container.addEventListener('click', () => {
    audio1.play();
    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
})