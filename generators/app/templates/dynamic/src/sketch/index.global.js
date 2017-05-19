let x, y, backgroundColor;

const width = 500;
const height = 500;

export function setup() {
  createCanvas(width, height);
  backgroundColor = color(random(255), random(255), random(255));

  x = random(width);
  y = height / 2;
}

export function draw() {
  background(backgroundColor);
  fill(color(255, 0, 0));
  ellipse(x, y, 100, 100);

  x = (x + 1) % width;
}

export function mousePressed() {
  backgroundColor = color(random(255), random(255), random(255));
}
