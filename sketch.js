let SHOULD_BOOMERANG = true;
let MOUSE_CONTROL = false;

let SOURCE_01 = "source_files/01";
let SOURCE_01_LENGTH = 605;
const SOURCE_VARIATIONS = ["a", "b"];

let mySound, mySound2;
let soundFilePath = "sounds/explosion-sound.mp3";
let soundFilePath2 = "sounds/flower-sound.mp3";

let images = [];
let sourceImagesLength = 0;
let currSourceImageIndex = 0;
let sourceFrameIndex = 0;
let moveForward = true;
let framesSinceLastFlip = 0;

let imageWidth = 512;
let imageHeight = 288;

let shouldDraw = false;

let osc, playing, freq, amp;

function constrainMap(
  input,
  inputRangeMin,
  inputRangeMax,
  mappedRangeMin,
  mappedRangeMax
) {
  const constrainMin = Math.min(mappedRangeMin, mappedRangeMax);
  const constrainMax = Math.max(mappedRangeMin, mappedRangeMax);

  return constrain(
    map(input, inputRangeMin, inputRangeMax, mappedRangeMin, mappedRangeMax),
    constrainMin,
    constrainMax
  );
}

function preload() {
  SOURCE_VARIATIONS.forEach((sourceVariation) => {
    let sourceImages = [];
    for (let i = 0; i < SOURCE_01_LENGTH; i++) {
      let filenum = `${i}`.padStart(3, "0");
      let filename = `${filenum}.jpg`;
      let filepath = `${SOURCE_01}/${sourceVariation}/${filename}`;
      img = loadImage(filepath);
      sourceImages.push(img);
      console.log("filepath: ", filepath);
    }

    images.push(sourceImages);
  });

  mySound = loadSound(soundFilePath);
  mySound2 = loadSound(soundFilePath2);

  //   for (let i = 0; i < SOURCE_01_LENGTH; i++) {
  //     let filenum = `${i}`.padStart(3, "0");
  //     let filename = `${filenum}.jpg`;
  //     let filepath = `${SOURCE_01}/a/${filename}`;
  //     img = loadImage(filepath);
  //     imagesA.push(img);
  //     console.log("filepath: ", filepath);
  //   }
}

function setup() {
  let cnv = createCanvas(800, 800);
  sourceImagesLength = SOURCE_01_LENGTH;

  osc = new p5.Oscillator(1200);

  cnv.mousePressed(onCanvasClick);
}

function draw() {
  if (!shouldDraw) return;

  let flipSpeedDriver;
  let movieSpeedDriver;
  if (MOUSE_CONTROL) {
    flipSpeedDriver = constrainMap(mouseX, 0, width, 0, 1);
    movieSpeedDriver = constrainMap(mouseY, 0, height, 0, 1);
  } else {
    flipSpeedDriver = map(sin(frameCount / 1000 - Math.PI / 2), -1, 1, 0, 1);
    movieSpeedDriver = map(sin(frameCount / 1000 - Math.PI / 2), -1, 1, 0, 1);
    // movieSpeedDriver = 0.5;
  }

  let flipSpeedInputPow = flipSpeedDriver < 0.5 ? 2 : 0.5;
  const flipSpeed = constrainMap(
    Math.pow(flipSpeedDriver, flipSpeedInputPow),
    0,
    1,
    SOURCE_01_LENGTH,
    5
  );
  const movieSpeed = constrainMap(movieSpeedDriver, 0, 1, 0.25, 10);

  //   frameRate(frameRateSpeed);
  //   console.log("flipSpeed", flipSpeed);

  if (moveForward) {
    sourceFrameIndex += movieSpeed;

    // prepare to move backwards
    if (sourceFrameIndex >= sourceImagesLength - 1) {
      //   sourceFrameIndex =
      //     sourceImagesLength - (sourceFrameIndex - sourceImagesLength);
      sourceFrameIndex = sourceImagesLength - 1;

      moveForward = false;
      console.log("move backward");
    }
  } else {
    sourceFrameIndex -= movieSpeed;

    // prepare to move forward
    if (sourceFrameIndex <= 0) {
      //   sourceFrameIndex = Math.abs(sourceFrameIndex);
      sourceFrameIndex = 0;

      moveForward = true;
      console.log("move forward");
    }
  }

  //   framesSinceLastFlip += Math.abs(movieSpeed);
  framesSinceLastFlip += 1;

  const imageFrameIndex = round(sourceFrameIndex);
  // special case for first frame
  //   if (frameCount == 0) {
  //     imageFrameIndex = 0;
  //   }

  //   console.log(
  //     "sourceFrameIndex:",
  //     sourceFrameIndex,
  //     "Flip speed",
  //     flipSpeed,
  //     "movie Speed",
  //     movieSpeed,
  //     "framesSinceLastFlip",
  //     framesSinceLastFlip,
  //     "imageFrameIndex",
  //     imageFrameIndex
  //   );

  if (framesSinceLastFlip >= flipSpeed) {
    // console.log(
    //   "CHANGE SOURCE framesSinceLastFlip: ",
    //   framesSinceLastFlip,
    //   ", flipSeed: ",
    //   flipSpeed
    // );
    currSourceImageIndex = (currSourceImageIndex + 1) % images.length;
    framesSinceLastFlip = framesSinceLastFlip % flipSpeed;
  }

  const sourceImages = images[currSourceImageIndex];

  //   if (sourceFrameIndex < 0) {
  //     sourceFrameIndex = sourceImagesLength - Math.abs(sourceFrameIndex);
  //   }
  //   console.log("sourceFrameIndex", sourceFrameIndex);

  image(sourceImages[imageFrameIndex], 0, 0);

  let playbackRate = constrainMap(movieSpeedDriver, 0, 1, 0.05, 4);
  if (!moveForward) {
    playbackRate *= -1;
  }

  if (imageFrameIndex == 0) {
    console.log("play sound");

    // mySound.pause();
    // mySound.stop(0);
    if (!mySound.isPlaying()) {
      mySound.loop();
    }
    if (!mySound2.isPlaying()) {
      mySound2.loop();
    }

    setTimeout(() => mySound.jump(0), 0);
    // setTimeout(() => mySound2.jump(0), 0);
    // mySound.jump(0);
    // mySound.loop();
    // mySound2.jump(0);
    // mySound.rate(playbackRate);
  } else if (imageFrameIndex == sourceImagesLength - 1) {
    mySound.jump(3);
    // mySound2.jump(3);
    // mySound.stop();
    // mySound.loop();
    // mySound.rate(playbackRate);
  }

  console.log(
    "playbackRate",
    playbackRate,
    "current time",
    mySound.currentTime()
  );

  if (currSourceImageIndex == 0) {
    mySound.setVolume(0.9);
    mySound2.setVolume(0.1);
  } else {
    mySound.setVolume(0.1);
    mySound2.setVolume(0.8);
  }

  mySound.rate(playbackRate);
  mySound2.rate(playbackRate);

  //   freq = currSourceImageIndex == 0 ? 200 : 440;
  //   osc.freq(freq + freq / 2 + freq / 4 + freq / 8);
  //   mySound.play();
}

function onCanvasClick() {
  shouldDraw = true;
  frameCount = 0;
  mySound.loop();
  mySound2.loop();
}
