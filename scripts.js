const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        })
        .then(localMediaStrean => {
            console.log(localMediaStrean);
            video.src = window.URL.createObjectURL(localMediaStrean);
            video.play();
        })
        .catch(err => console.error('Oh NOOOOOO', err))
}

function paintToCanvas() {
    const {
        videoWidth: width,
        videoHeight: height
    } = video;

    canvas.widht = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0, 0, width, height);
        pixels = redEffect(pixels);
    }, 16);
}

function redEffect(pixels) {
    for (let i = 0, len = pixels.data.length; i < len; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100;
        pixels.data[i + 1] = pixels.data[i + 1] - 50;
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0, len = pixels.data.length; i < len; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0];
        pixels.data[i + 100] = pixels.data[i + 1];
        pixels.data[i - 150] = pixels.data[i + 2];
    }
    return pixels;
}

function greeScreen(pixels) {
    const levels = {};
    [...document.querySelectorAll('.rgb input')].forEach((input) => {
        levels[input.name] = input.nodeValue;
    });

    for (let i = 0, len = pixels.data.lenght; i < len; i += 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];
        if (
            red >= levels.rmin &&
            green >= levels.gmin &&
            blue >= levels.bmin &&
            red <= levels.rmax &&
            green <= levels.gmax &&
            blue <= levels.bmax
        ) {
            pixels.data[i + 3] = 0;
        }
    }
    return pixels;
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="" />`;
    strip.insertBefore(link.strip.firstChild)
}

video.addEventListener('canplay', paintToCanvas);