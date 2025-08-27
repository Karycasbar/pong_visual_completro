let score = 0;
let gameState = "serve";
let ball, paddle;
let boxes = []; // <-- CAMBIO: Usamos un arreglo para guardar todas las cajas en lugar de muchas variables individuales

function setup() {
  createCanvas(400, 400); // <-- CAMBIO: Es necesario crear el canvas en p5.js

  // CAMBIO: Creamos las cajas en un bucle para simplificar y usamos un array para almacenarlas
  let colors = ["Indigo", "LightBlue"];
  for (let i = 0; i < 8; i++) {
    let box = createSprite(25 + i * 50, 75, 50, 50);
    box.shapeColor = colors[i % 2];
    boxes.push(box);
  }
  for (let i = 0; i < 8; i++) {
    let box = createSprite(25 + i * 50, 125, 50, 50);
    box.shapeColor = colors[(i + 1) % 2];
    boxes.push(box);
  }

  // Pelota
  ball = createSprite(200, 200, 20, 20);
  ball.shapeColor = "black";

  // Paleta
  paddle = createSprite(200, 380, 100, 20);
  paddle.shapeColor = "green";
}

function draw() {
  background("LavenderBlush");

  textSize(17);
  stroke("blue");
  fill("black");
  text("Puntuación: " + score, 260, 20);

  if (gameState === "serve") {
    stroke("red");
    text("Presiona Enter para comenzar", 100, 180);
    if (keyDown("enter")) {
      // CAMBIO: Velocidades iniciales de la pelota
      ball.velocityX = 3;
      ball.velocityY = 4;
      gameState = "play";
    }
  }

  if (gameState === "play") {
    paddle.x = mouseX; // CAMBIO: Usamos mouseX directamente (en lugar de World.mouseX)

    // CAMBIO: Creamos nuestros propios bordes (no existe createEdgeSprites en p5.js)
    // Rebota a los lados
    if (ball.position.x < 0 || ball.position.x > width) {
      ball.velocityX *= -1;
    }
    // Rebota en la parte superior
    if (ball.position.y < 0) {
      ball.velocityY *= -1;
    }

    // CAMBIO: Detectamos si la pelota toca el borde inferior (fin del juego)
    if (ball.position.y > height || score === boxes.length) {
      gameState = "end";
    }

    // Rebotar en la paleta
    ball.bounceOff(paddle);

    // CAMBIO: Revisamos colisión con todas las cajas en el array
    for (let i = boxes.length - 1; i >= 0; i--) {
      if (ball.isTouching(boxes[i])) {
        ball.bounceOff(boxes[i]); // CAMBIO: Añadimos rebote al tocar la caja
        boxes[i].remove(); // CAMBIO: Elimina la caja
        boxes.splice(i, 1); // CAMBIO: La sacamos del array
        score++;
      }
    }
  }

  if (gameState === "end") {
    ball.velocityX = 0;
    ball.velocityY = 0;
    textSize(20);
    fill("red");
    text("Fin del juego", 140, 200);
  }

  drawSprites();
}
