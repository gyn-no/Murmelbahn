const Engine = Matter.Engine;
const Runner = Matter.Runner;
const Bodies = Matter.Bodies;
const Events = Matter.Events;
const World = Matter.World;

// the Matter engine to animate the world
let engine;
let world;
let mouse;
let isDrag = false;
// an array to contain all the blocks created
let blocks = [];
let murmel;
let resetBlock;

let canvasElem;
let off = { x: 0, y: 0 };

 // das ist die Dimension des kompletten Levels 
const dim = { w: 3840, h: 2160 };

// Speichere die Anfangsposition der Murmel
const murmelStartPos = { x: 2950, y: 600, };

class TrampolineBlock extends BlockCore {
  constructor(world, options, properties) {
    super(world, options, properties);
    this.restitution = options.restitution || 0.0; // Adjust the restitution value here
    this.friction = options.friction;
    this.density = options.density;
    this.trigger = options.trigger;
  }

  draw() {
    super.draw(); // Call the parent class's draw method to render the block's shape

    // Custom drawing code for the trampoline block
    fill(255, 165, 0); // Set the fill color to orange
    noStroke(); // Disable stroke

    // Draw a trampoline-like shape on top of the block
    beginShape();
    vertex(this.x, this.y);
    bezierVertex(this.x + this.w / 2, this.y - this.h / 4, this.x + this.w, this.y);
    vertex(this.x + this.w, this.y + this.h);
    bezierVertex(this.x + this.w / 2, this.y + this.h * 1.25, this.x, this.y + this.h);
    endShape(CLOSE);

    // Add some texture to the trampoline block
    fill(255); // Set the fill color to white
    textSize(24);
    textAlign(CENTER, CENTER);
    text("TRAMPOLINE", this.x + this.w / 2, this.y + this.h / 2);
  }
}

let murmelImage
function preload() {
  backgroundImage = loadImage('room1 test.png'); // Pfad zu Ihrem Hintergrundbild

  let murmelDiameter = 30 * 2; // Der Durchmesser der Murmel wird verdoppelt, da er als Radius verwendet wird
  let imageSize = Math.min(murmelDiameter, 100); // Begrenze die Bildgröße auf maximal 100 (kann angepasst werden)
  murmelImage = loadImage('murmel texture test.png');
  murmelImage.resize(imageSize, imageSize); // Skaliere die Textur auf die gewünschte Größe
}





function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('thecanvas');

  // Das ist nötig für den 'Endless Canvas'
  canvasElem = document.getElementById('thecanvas');

  engine = Engine.create();
  world = engine.world;

  // add a mouse so that we can manipulate Matter objects
  mouse = new Mouse(engine, canvas, { stroke: 'blue', strokeWeight: 3 });
  // const mouseScale = 1 + (1 / (scale / (1 - scale)))
  // Mouse.setScale(mouse, { x: mouseScale, y: mouseScale });

  // process mouseup events in order to drag objects or add more balls
  mouse.on("startdrag", evt => {
    isDrag = true;
  });
  

 // process collisions - check whether block "Murmel" hits another Block
Events.on(engine, 'collisionStart', function (event) {
  var pairs = event.pairs;
  pairs.forEach((pair, i) => {
    if ((pair.bodyA.label == 'Murmel' && pair.bodyB === resetBlock.body) ||
        (pair.bodyB.label == 'Murmel' && pair.bodyA === resetBlock.body)) {
      resetMurmelPosition();
    }
    if (pair.bodyA.label == 'Murmel') {
      pair.bodyA.plugin.block.collideWith(pair.bodyB.plugin.block);
    }
    if (pair.bodyB.label == 'Murmel') {
      pair.bodyB.plugin.block.collideWith(pair.bodyA.plugin.block);
    }
  });
});

  createScene();
  // run the engine
  Runner.run(engine);
}

function createScene() {
  // create some blocks 
  resetBlock = new BlockCore(
    world,
    { x: 2700, y: 1200, w: 1000, h: 20, color: 'rgba(0, 0, 0, 0)', angle: 0 }, // horizontal block
    { isStatic: true }
  );
  blocks.push(resetBlock);

  // Left vertical block
  blocks.push(new BlockCore(
    world,
    { x: 2000, y: 950, w: 50, h: 500, color: 'rgba(0, 0, 0, 0)', angle: PI / 2 }, // vertical block on the left
    { isStatic: true }
  ));

   // Right vertical block
   blocks.push(new BlockCore(
    world,
    { x: 3200, y: 950, w: 50, h: 500, color: 'rgba(0, 0, 0, 0)', angle: PI / 2 }, // vertical block on the right
    { isStatic: true }

  ));


  // right trampoline block
  blocks.push(new TrampolineBlock(
    world,
    {
      x: 3000, y: 1070, w: 200, h: 20, color: 'rgba(0, 0, 0, 0)',
      restitution: 0.0,
      friction: 0.5,
      density: 0.1,
      trigger: (ball, block) => {
        Matter.Body.applyForce(ball.body, ball.body.position, { x: 0, y: -0.5 });
      }
    },
    { isStatic: true }
  ));

  // Set the starting position of the marble directly above the right trampoline
  murmel = new Ball(
    world,
    { x: 2950, y: 600, r: 30, color: 'rgba(0, 0, 0, 0)' }, // Startposition der Murmel geändert
    { label: "Murmel", restitution: 0.0, friction: 0.0, frictionAir: 0.0, density: 0.006 }
  );
  blocks.push(murmel);

  // Left trampoline block
  blocks.push(new TrampolineBlock(
    world,
    {
      x: 2320, y: 1070, w: 200, h: 20, color: 'rgba(0, 0, 0, 0)',
      restitution: 0.0,
      friction: 0.5,
      density: 0.1,
      trigger: (ball, block) => {
        Matter.Body.applyForce(ball.body, ball.body.position, { x: 0, y: -0.5 });
      }
    },
    { isStatic: true }
  ));

  // Center trampoline block
  blocks.push(new TrampolineBlock(
    world,
    {
      x: 2660, y: 1070, w: 200, h: 20, color: 'rgba(0, 0, 0, 0)',
      restitution: 0.0,
      friction: 0.5,
      density: 0.1,
      trigger: (ball, block) => {
        Matter.Body.applyForce(ball.body, ball.body.position, { x: 0, y: -0.5 });
      }
    },
    { isStatic: true }
  ));
}

function createScene2() {
  new BlocksFromSVG(world, 'static.svg', blocks, { isStatic: true });

  // the box triggers a function on collisions
  blocks.push(new BlockCore(world,
    {
      x: 200, y: 200, w: 60, h: 60, color: 'blue',
      trigger: (ball, block) => { ball.attributes.color = color(Math.random() * 256, Math.random() * 256, Math.random() * 256); }
    },
    { isStatic: false, density: 0.05, restitution: 0.5, frictionAir: 0.01 }
  ));

  // the ball has a label and can react on collisions
  murmel = new Ball(world,
    { x: 2950, y: 600, r: 25, color: 'green' },
    { label: "Murmel", density: 0.004, restitution: 0.5, friction: 0.0, frictionAir: 0.0 }
  );
  blocks.push(murmel);
}

function scrollEndless(point) {
  // wohin muss verschoben werden damit point wenn möglich in der Mitte bleibt
  off = { x: Math.min(Math.max(0, point.x - windowWidth / 2), dim.w -  windowWidth), y: Math.min(Math.max(0, point.y - windowHeight / 2), dim.h -  windowHeight) };
  // plaziert den Canvas im aktuellen Viewport
  canvasElem.style.left = Math.round(off.x) + 'px';
  canvasElem.style.top = Math.round(off.y) + 'px';
  // korrigiert die Koordinaten
  translate(-off.x, -off.y);
  // verschiebt den ganzen Viewport
  window.scrollTo(off.x, off.y);
  // Matter mouse needs the offset as well
  mouse.setOffset(off);
}

function keyPressed(event) {
  switch (keyCode) {
    case 32:
      console.log("Space");
      event.preventDefault();
      Matter.Body.applyForce(murmel.body, murmel.body.position, { x: -0.2, y: -0.2   });
      // Matter. Body.scale(murmel.body, 1.5, 1.5);
      break;
    default:
      console.log(keyCode);
  }
}

function draw() {
  //background(0, 60);
  clear();

  // Zeichne den Hintergrund
  //image(backgroundImage, 0, 0, windowWidth, windowHeight);
  // position canvas and translate coordinates
  scrollEndless(murmel.body.position);

  // Check if the murmel has fallen below a certain point
  if (murmel.body.position.y > dim.h) {
    resetMurmelPosition();
  }

  // animate attracted blocks
  blocks.forEach(block => block.draw());
  mouse.draw();

  // draw the murmel with image texture
  drawMurmel();

  function mouseDragged() {
    if (mouseButton === LEFT) {
      off.x -= mouseX - pmouseX;
      off.y -= mouseY - pmouseY;
      off.x = constrain(off.x, 0, dim.w - windowWidth);
      off.y = constrain(off.y, 0, dim.h - windowHeight);
      scrollEndless({ x: mouseX + off.x, y: mouseY + off.y });
    }
  }
  
  function mouseReleased() {
    return false; // prevent default
  }
  
}


function resetMurmelPosition() {
  Matter.Body.setPosition(murmel.body, { x: murmelStartPos.x, y: murmelStartPos.y });
  Matter.Body.setVelocity(murmel.body, { x: 0, y: 0 });
  Matter.Body.setAngularVelocity(murmel.body, 0);
}

function getBlockAtPosition(x, y) {
  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    if (block instanceof TrampolineBlock) {
      let pos = block.body.position;
      let w = block.w;
      let h = block.h;
      if (x > pos.x - w / 2 && x < pos.x + w / 2 && y > pos.y - h / 2 && y < pos.y + h / 2) {
        return block;
      }
    }
  }
  return null;
}

function drawMurmel() {
  let pos = murmel.body.position;
  let angle = murmel.body.angle;

  push();
  translate(pos.x, pos.y);
  rotate(angle);
  imageMode(CENTER);
  let imageSize = 30 * 3; // Durchmesser der Murmel wird verdoppelt
  image(murmelImage, 0, 0, imageSize, imageSize); // Verwende die PNG-Textur mit der festgelegten Größe
  pop();
}