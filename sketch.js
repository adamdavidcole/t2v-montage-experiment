let SHOULD_BOOMERANG = true;
let MOUSE_CONTROL = false;

let SOURCE_01 = "source_files/01";
let SOURCE_01_LENGTH = 605;
const SOURCE_VARIATIONS = ["a", "b"];

let images = [];
let currSourceImageIndex = 0;
let sourceFrameIndex = 0;
let moveForward = true;

let imageWidth = 512;
let imageHeight = 288;

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
  createCanvas(800, 800);
}

function draw() {
  let flipSpeedDriver;
  let movieSpeedDriver;
  if (MOUSE_CONTROL) {
    flipSpeedDriver = constrain(map(mouseX, 0, width, 0, 1), 0, 1);
    movieSpeedDriver = constrain(map(mouseY, 0, height, 0, 1), 0, 1);
  } else {
    flipSpeedDriver = map(sin(frameCount / 1000), -1, 1, 0, 1);
    movieSpeedDriver = map(sin(frameCount / 1000), -1, 1, 0, 1);
    // movieSpeedDriver = 0.5;
  }

  const flipSpeed = constrain(
    round(map(flipSpeedDriver, 0, 1, SOURCE_01_LENGTH, 1)),
    1,
    SOURCE_01_LENGTH
  );
  const movieSpeed = constrain(
    round(map(movieSpeedDriver, 0, 1, 1, 20)),
    0,
    20
  );

  //   frameRate(frameRateSpeed);
  console.log("flipSpeed", flipSpeed);

  if (frameCount % flipSpeed == 0) {
    currSourceImageIndex = (currSourceImageIndex + 1) % images.length;
  }

  const sourceImages = images[currSourceImageIndex];

  if (moveForward) {
    sourceFrameIndex += movieSpeed;

    // prepare to move backwards
    if (sourceFrameIndex > sourceImages.length) {
      //   sourceFrameIndex =
      //     sourceImages.length - (sourceFrameIndex - sourceImages.length);
      sourceFrameIndex = sourceImages.length - 1;
      moveForward = false;
    }
  } else {
    sourceFrameIndex -= movieSpeed;

    // prepare to mov forward
    if (sourceFrameIndex < 0) {
      //   sourceFrameIndex = Math.abs(sourceFrameIndex);
      sourceFrameIndex = 0;
      moveForward = true;
    }
  }

  if (sourceFrameIndex < 0) {
    sourceFrameIndex = sourceImages.length - Math.abs(sourceFrameIndex);
  }
  console.log("sourceFrameIndex", sourceFrameIndex);

  image(sourceImages[sourceFrameIndex % sourceImages.length], 0, 0);
}
