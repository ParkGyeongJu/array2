let movers = [];

let attractor;

function setup() {
  createCanvas(640, 360);
  for (let i = 0; i < 10; i++) {
    movers[i] = new Mover(random(0.1, 2), random(width), random(height));
  }
  attractor = new Attractor();
}

function draw() {
  //background(50);

  attractor.display();

  for (let i = 0; i < movers.length; i++) {
    let force = attractor.calculateAttraction(movers[i]);
    movers[i].applyForce(force);
    movers[i].update();
    movers[i].display();
  }
}
function mouseMoved() {
  attractor.handleHover(mouseX, mouseY);
}
function mousePressed() {
  attractor.handlePress(mouseX, mouseY);
}
function mouseDragged() {
  attractor.handleHover(mouseX, mouseY);
  attractor.handleDrag(mouseX, mouseY);
}
function mouseReleased() {
  attractor.stopDragging();
}

class Mover {
  constructor(mass, x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(1, 1);
    this.acceleration = createVector(1, 1);
    this.mass = mass;
  }
  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
  display() {
    stroke(0);
    strokeWeight(1);
    fill(this.position.x/2, this.position.y, this.position.x);
    ellipse(this.position.x, this.position.y, this.mass * 16, this.mass * 16);
    rect(this.position.x/1.5, this.position.y*1.5, this.mass * 16, this.mass * 16);
    line(320,180,this.position.x, this.position.y);
  }

  checkEdges() {
    if (this.position.x > width) {
      this.position.x = width;
      this.velocity.x *= -1;
    } else if (this.position.x < 0) {
      this.velocity.x *= -1;
      this.position.x = 0;
    }
    if (this.position.y > height) {
      this.velocity.y *= -1;
      this.position.y = height;
    }
  }
}
class Attractor {
  constructor() {
    this.position = createVector(width / 2, height / 2);
    this.mass = 20;
    this.G = 2;
    this.dragOffset = createVector(0, 0);
    this.dragging = false;
    this.rollover = false;
  }

  calculateAttraction(m) {
    let force = p5.Vector.sub(this.position, m.position);
    let distance = force.mag();
    distance = constrain(distance, 5, 25);
    force.normalize();
    let strength = (this.G * this.mass * m.mass)/(distance * distance);
    force.mult(strength);
    return force;
  }

  display() {
    ellipseMode(CENTER);
    strokeWeight(1);
    stroke(0);
    if (this.dragging) {
      fill(100, 200, 150);
    } else if (this.rollover) {
      fill(175);
    } else {
      fill(101, 200);
    }
    ellipse(this.position.x, this.position.y, this.mass * 2, this.mass * 2);
  }
  handlePress(mx, my) {
    let d = dist(mx, my, this.position.x, this.position.y);
    if (d < this.mass) {
      this.dragging = true;
      this.dragOffset.x = this.position.x - mx;
      this.dragOffset.y = this.position.y - my;
    }
  }
  handleHover(mx, my) {
    let d = dist(mx, my, this.position.x, this.position.y);
    if (d < this.mass) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }

  stopDragging() {
    this.dragging = false;
  }

  handleDrag(mx, my) {
    if (this.dragging) {
      this.position.x = mx + this.dragOffset.x;
      this.position.y = my + this.dragOffset.y;
    }
  }
}

