let cow;
let timer = 30;
let ufo;
let state = 'grazing';
let newCowX;
let clouds = [];
let flowers = [];
let xfilesSound; // Variable to hold the sound file

function preload() {
  // Load sound file
  xfilesSound = loadSound('xfiles.mp3'); // Replace with your actual sound file name
}

function setup() {
  createCanvas(400, 400);
  cow = new Cow(200, 300);
  ufo = new UFO(-100, 50);
  newCowX = -100;
  
  // Generate random clouds with spacing
  for (let i = 0; i < 10; i++) {  // Increased to 10 clouds
    let cloudX = random(width);
    let cloudY = random(50, 150);
    
    // Check if the new cloud is too close to existing clouds
    let valid = true;
    for (let cloud of clouds) {
      let d = dist(cloudX, cloudY, cloud.x, cloud.y);
      if (d < 80) {  // Adjust this distance to control spacing between clouds
        valid = false;
        break;
      }
    }
    
    if (valid) {
      clouds.push(new Cloud(cloudX, cloudY));
    }
  }
  
  // Generate random flowers
  for (let i = 0; i < 30; i++) {  // Increased to 30 flowers
    flowers.push(new Flower(random(width), random(360, 400)));
  }
}

function draw() {
  background(173, 216, 230); // Light blue background
  
  // Draw clouds
  for (let cloud of clouds) {
    cloud.display();
  }
  
  // Draw grass
  fill(34, 139, 34);
  noStroke();
  rect(0, 350, width, 50);
  
  // Draw flowers
  for (let flower of flowers) {
    flower.display();
  }
  
  // Display timer
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(ceil(timer), width/2, 50);
  
  if (state === 'grazing') {
    cow.display();
    cow.graze();
    timer -= 1/60;
    if (timer <= 0) {
      timer = 0;
      state = 'abduction';
      xfilesSound.play(); // Play the sound when abduction starts
    }
  } else if (state === 'abduction') {
    cow.display();
    ufo.display();
    ufo.abduct(cow);
    if (cow.y < -50) {
      state = 'waiting';
    }
  } else if (state === 'waiting') {
    ufo.display();
    newCowX += 2;
    if (newCowX > -50) {
      state = 'new cow';
    }
  } else if (state === 'new cow') {
    let newCow = new Cow(newCowX, 300);
    newCow.display();
    newCowX += 2;
    if (newCowX > 200) {
      cow = newCow;
      state = 'grazing';
      timer = 30;
    }
  }
}

class Cow {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.direction = 1;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    scale(this.direction, 1);
    
    // Legs (draw first so they are behind the body)
    fill(255);
    rect(-40, 20, 10, 40, 5);
    rect(-20, 20, 10, 40, 5);
    rect(10, 20, 10, 40, 5);
    rect(30, 20, 10, 40, 5);
    
    // Body
    fill(255);
    noStroke();
    ellipse(0, 0, 120, 80);
    
    // Spots
    fill(0);
    ellipse(-30, -10, 30, 20);
    ellipse(10, 10, 40, 30);
    ellipse(30, -20, 20, 15);
    
    // Head
    fill(255);
    ellipse(50, -20, 40, 30);
    
    // Ears
    fill(0);
    ellipse(30, -30, 20, 10);
    ellipse(70, -30, 20, 10);
    
    // Eyes
    fill(255);
    ellipse(45, -25, 10, 10);
    ellipse(55, -25, 10, 10);
    fill(0);
    ellipse(46, -25, 5, 5);
    ellipse(56, -25, 5, 5);
    
    // Nose
    fill(255, 192, 203);
    ellipse(50, -10, 20, 15);
    
    // Tail
    stroke(0);
    strokeWeight(2);
    line(-50, -20, -60, -40);
    fill(0);
    ellipse(-60, -40, 10, 10);
    
    // Udder
    fill(255, 192, 203);
    ellipse(0, 35, 30, 20);
    
    pop();
  }
  
  graze() {
    this.x += this.direction * 0.5;
    if (this.x > width - 60 || this.x < 60) {
      this.direction *= -1;
    }
  }
}

class UFO {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    
    // UFO body
    fill(150);
    ellipse(0, 0, 120, 40);
    
    // Dome
    fill(200);
    arc(0, 0, 60, 60, PI, TWO_PI);
    
    // Lights
    for (let i = 0; i < 3; i++) {
      fill(random(100, 255), random(100, 255), random(100, 255));
      ellipse(-30 + i * 30, 15, 10, 5);
    }
    
    pop();
  }
  
  abduct(cow) {
    this.x = lerp(this.x, cow.x, 0.05);
    this.y = lerp(this.y, cow.y - 100, 0.05);
    cow.y -= 2;
  }
}

class Cloud {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  display() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, 60, 40);
    ellipse(this.x + 20, this.y + 10, 60, 40);
    ellipse(this.x - 20, this.y + 10, 60, 40);
  }
}

class Flower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    
    // Stem
    stroke(0, 128, 0);
    strokeWeight(2);
    line(0, 0, 0, -10);
    
    // Petals
    fill(255, 0, 0);
    noStroke();
    for (let i = 0; i < 8; i++) {
      ellipse(5, -15, 5, 10);
      rotate(PI / 4);
    }
    
    // Center
    fill(255, 255, 0);
    ellipse(0, 0, 5, 5);
    
    pop();
  }
}
