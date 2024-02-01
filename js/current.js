// let audio1 = new Audio();
// const audioContext = new (window.AudioContext)();
// console.log(audioContext)
// audio1.src = 'audio/Narvent-Memory-Reboot.mp3'

const container = document.getElementById('container');

const canvas = document.getElementById('canvas1');

const file = document.getElementById('fileupload')

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
let audioSource;
let analyser;

container.addEventListener('click', () => {
    let audio1 = new Audio();
    const audioContext = new (window.AudioContext)();
    console.log(audioContext)
    // audio1.src = 'audio/Narvent-Memory-Reboot.mp3'
    audio1.play();
    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 1024;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = 15;
    let barHeight;
    let x;

    function animate(){
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray)
        requestAnimationFrame(animate);
    }
    animate()
});

function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray){
    // for(let i = 0; i < bufferLength; i++) {
    //     // this will take the bar height and set it 
    //     // equal to the dataArray of i, louder sounds 
    //     // produce larger bars
    //     barHeight = dataArray[i] * 2;
    //     const red = i * barHeight / 20;
    //     const green = i / 2;
    //     const blue =  barHeight;
    //     ctx.fillStyle = 'magenta'
    //     ctx.fillRect(canvas.width / 2 - x, canvas.height - barHeight - 30, barWidth, 10)
    //     // ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
    //     ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')'
    //     ctx.fillRect(canvas.width / 2 - x, canvas.height - barHeight, barWidth, barHeight)
    //     // the x+= below will place the bars next to 
    //     // one another along the x-axis
    //     x += barWidth;
    // }
    for(let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.5;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(i * Math.PI * 20 / bufferLength);
        const hue = i * 0.3;
        ctx.fillStyle = 'hsl(' + hue + ' ,100%,' + barHeight / 3 + '%)'
        ctx.fillRect(0, 0, barWidth, barHeight)
        x += barWidth;
        ctx.restore();
    }
    for(let i = 10; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.5;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(i * Math.PI * 100 / bufferLength);
        const hue = i * 0.3;
        ctx.fillStyle = 'hsl(' + hue + ' ,100%,' + barHeight / 3 + '%)'
        ctx.fillRect(0, 0, barWidth, barHeight)
        x += barWidth;
        ctx.restore();
    }
}

file.addEventListener('change', function() {
    // console.log(this.files
    const files = this.files;
    const audio1 = document.getElementById('audio1');
    const audioContext = new (window.AudioContext)();
    audio1.src = URL.createObjectURL(files[0]);
    audio1.load();
    audio1.play();

    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = 15;
    let barHeight;
    let x;

    function animate(){
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray)
        requestAnimationFrame(animate);
    }
    animate()
})
