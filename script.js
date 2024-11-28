let apples = [];
let currentApple = null;
let origin;
let gravitationalConstant = 10000;
let atmosphereLayer;
let radiusThreshold;
let appleRadius

function setup() {
  createCanvas(windowWidth, windowHeight); // 화면 크기에 맞는 캔버스 생성
  origin = createVector(width / 2, height / 2);

  atmosphereLayer = createGraphics(windowWidth, windowHeight); // 대기를 그릴 그래픽 레이어 생성

  // 대기층 그리기
  atmosphereLayer.noStroke();
  atmosphereLayer.fill(255, 255, 255, 50); // 반투명 흰색
  atmosphereLayer.ellipse(windowWidth / 2, windowHeight / 2, min(width, height) * 0.65, min(width, height) * 0.65); // 지구를 감싸는 대기

  console.log('Width: ' + width);
  console.log('Height: ' + height);

  radiusThreshold = min(width, height) * 0.6 / 2 * 0.94
  appleRadius = 13 * min(width, height) / 714
}

function draw() {
  background(135, 206, 235); // 하늘색 배경

  for (let i = 0; i < apples.length; i++) {
    apples[i].update();
    if (apples[i].shouldBeRemoved()) {
      apples.splice(i, 1); // 사과를 배열에서 삭제
    }
    else {
      apples[i].display();
    }
  }

  // 대기층 레이어를 그리기 (사과 위에 그려짐)
  image(atmosphereLayer, 0, 0);

  // 지구 모양 이모지 삽입
  textSize(min(width, height) * 0.6)
  textAlign(CENTER, CENTER)
  text('🌎', width / 2, height / 2 + min(width, height) * 25 / 820)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 창 크기가 바뀔 때 캔버스 크기 조정
  redraw(); // 캔버스를 다시 그림
}

function drawApple(x, y, appleSize) {
  noStroke();
  push();
  translate(x, y);

  // 사과 본체 그리기
  fill(204, 55, 51);
  ellipseMode(CENTER);
  ellipse(0, 0, 80 * appleSize, 75 * appleSize);

  // 줄기 그리기
  stroke(78, 38, 0);
  strokeWeight(5 * appleSize);
  line(-5 * appleSize, -50 * appleSize, 0, -25 * appleSize);

  // 잎 그리기
  noStroke();
  rotate(radians(-30));
  fill(39, 166, 21);
  ellipse(7 * appleSize, -33 * appleSize, 15 * appleSize, 25 * appleSize);

  pop();
}

function mousePressed() {
  // 현재 사과가 선택된 상태가 아니고 드래그 중이 아닌 경우에만 새로운 사과 생성
  currentApple = new Apple(mouseX, mouseY);
  apples.push(currentApple);
}

function mouseDragged() {
  // 클릭한 상태에서 마우스를 움직이면 apple의 위치 업데이트
  if (currentApple != null) {
    currentApple.followMouse(mouseX, mouseY);
  }
}

function mouseReleased() {
  // 클릭을 해제할 때 속도 계산
  currentApple.release();
  currentApple = null;
}

class Apple {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.previousMouse = createVector(x, y); // 이전 마우스 위치
  }

  followMouse(x, y) {
    let mousePos = createVector(x, y);
    this.velocity = p5.Vector.sub(mousePos, this.previousMouse); // 속도는 현재 마우스 위치와 이전 마우스 위치의 차이
    this.position.set(mousePos);
    this.previousMouse.set(mousePos);
  }

  release() {
    // 클릭 해제 시 가속도 초기화
    this.acceleration.set(0, 0);
  }

  update() {
    if (!mouseIsPressed) {
      this.positionVector = p5.Vector.sub(this.position, origin);
      this.distance = this.positionVector.mag();
      this.acceleration = p5.Vector.mult(this.positionVector, (-1) * gravitationalConstant / pow(this.distance, 3))
      // 클릭이 해제된 상태에서 가속도 및 속도 업데이트
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
    }
  }

  display() {
    drawApple(this.position.x, this.position.y, 1/3 * min(width, height) / 714)
  }

  shouldBeRemoved() {
    // 원점과의 거리가 지구 반지름의 0.7배보다 작아지면 true 반환 (사과가 지구 안에 있는 경우)
    return this.position.dist(origin) < radiusThreshold || this.position.x > width + appleRadius || this.position.x < (-1) * appleRadius || this.position.y > height + appleRadius || this.position.y < (-1) * appleRadius
  }
}
