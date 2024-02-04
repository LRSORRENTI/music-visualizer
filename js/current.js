const container = document.getElementById('container');

const canvas = document.getElementById('canvas1');

const file = document.getElementById('fileupload')

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
function resizeCanvas() {
    const width = canvas.clientWidth + 100;
    const height = canvas.clientHeight + 300;
    
    // Check if canvas size is different from its drawing buffer size
    if (canvas.width !== width || canvas.height !== height) {
        // Set the internal size to match client size
        canvas.width = width;
        canvas.height = height;
    }
}

// Initial resize
resizeCanvas();

// Ensure canvas size adjusts on window resize
window.addEventListener('resize', resizeCanvas);

let audioContext;
let audioSource;
let analyser;

const audio1 = document.getElementById('audio1');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');

playButton.addEventListener('click', function() {
  audio1.play();
});

pauseButton.addEventListener('click', function() {
  audio1.pause();
});

// colors for visualizer
const colors = [
    'hsl(160, 100%, 75%)', // #7fffd4
    'hsl(165, 33%, 50%)',  // #59b2a2
    'hsl(160, 100%, 92%)', // #dffff9
    'hsl(160, 100%, 87%)', // #bffff3
    // 'hsl(0, 0%, 100%)'     // #ffffff
];


function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray){
    // UNCOMMENT BELOW FOR BAR VISUALIZER RISING FROM 
    // BOTTOM INSTEAD OF SPIRAL

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
        const hue = i * 5.2;
        ctx.fillStyle = 'hsl(' + hue + ' ,100%,' + barHeight / 3 + '%)'
        ctx.fillRect(0, 0, barWidth, barHeight)
        x += barWidth;
        ctx.restore();
    }
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.5;
        const color = colors[i % colors.length]; // Cycle through the color array
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i * Math.PI * 20 / bufferLength);
        ctx.fillStyle = color;  // Use the color from the array
        ctx.fillRect(0, 0, barWidth, barHeight);
        x += barWidth;
        ctx.restore();
    }
}
const initializeVisualizer = (audioElement) => {
    if (!audioContext) {
        audioContext = new (window.AudioContext)();
        audioSource = audioContext.createMediaElementSource(audioElement);
        analyser = audioContext.createAnalyser();
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 1024;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = 15;
    let barHeight;
    let x;

    const animate = () => {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
        requestAnimationFrame(animate);
    }
    animate();
};

// Get the default audio element and set up the visualization on play event
const defaultAudio = document.getElementById('audio1');
defaultAudio.addEventListener('play', function() {
    initializeVisualizer(this);
});

file.addEventListener('change', function() {
    // console.log(this.files
    const files = this.files;
    const audio1 = document.getElementById('audio1');
    const audioContext = new (window.AudioContext)();
    audio1.src = URL.createObjectURL(files[0]);
    audio1.load();
    audio1.play();
    initializeVisualizer(audio1);
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

