// let audio1 = new Audio();
// const audioContext = new (window.AudioContext)();
// console.log(audioContext)
// audio1.src = 'audio/Narvent-Memory-Reboot.mp3'

const container = document.getElementById('container');

const canvas = document.getElementById('canvas1');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
let audioSource;
let analyser;

container.addEventListener('click', () => {
    let audio1 = new Audio();
    const audioContext = new (window.AudioContext)();
    console.log(audioContext)
    audio1.src = 'audio/Narvent-Memory-Reboot.mp3'
    audio1.play();
    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = canvas.width / bufferLength;
    let barHeight;
    let x;

    function animate(){
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        for(let i = 0; i < bufferLength; i++) {
            // this will take the bar height and set it 
            // equal to the dataArray of i, louder sounds 
            // produce larger bars
            barHeight = dataArray[i];
            ctx.fillStyle = 'lime';
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
            // the x+= below will place the bars next to 
            // one another along the x-axis
            x += barWidth;
        }
        requestAnimationFrame(animate);
    }
    animate()
});