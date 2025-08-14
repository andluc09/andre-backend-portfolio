const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let size; 
let center;
let offset;
let positions;

// Carrega imagem local do losango
const images = [
	loadImg("image/Losango_1.png"), // topo
	loadImg("image/Losango_2.png"), // direita 
	loadImg("image/Losango_4.png"), // baixo 
	loadImg("image/Losango_3.png") // esquerda
];

function loadImg(url) {
  const img = new Image();
  img.src = url;
  return img;
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  size = Math.min(window.innerWidth, window.innerHeight) * 0.28;
  center = {x: canvas.width / 2, y: canvas.height / 2};
  offset = size / 2;
  positions = [
    {x: center.x, y: center.y - offset},
    {x: center.x + offset, y: center.y},
    {x: center.x, y: center.y + offset},
    {x: center.x - offset, y: center.y}
  ];
}

function drawImageDiamond(img, x, y, size, strokeColor = null) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y - size/2);
  ctx.lineTo(x + size/2, y);
  ctx.lineTo(x, y + size/2);
  ctx.lineTo(x - size/2, y);
  ctx.closePath();
  ctx.clip();
  if (img.complete) {
    ctx.drawImage(img, x - size/2, y - size/2, size, size);
  }
  ctx.restore();
  if (strokeColor) {
    ctx.shadowBlur = 6;
    ctx.shadowColor = strokeColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y - size/2);
    ctx.lineTo(x + size/2, y);
    ctx.lineTo(x, y + size/2);
    ctx.lineTo(x - size/2, y);
    ctx.closePath();
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

function drawColorDiamond(x, y, size, color) {
  ctx.beginPath();
  ctx.moveTo(x, y - size/2);
  ctx.lineTo(x + size/2, y);
  ctx.lineTo(x, y + size/2);
  ctx.lineTo(x - size/2, y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawFixedDiamonds() {
  drawImageDiamond(images[3], positions[3].x, positions[3].y, size, "#22D4FD");
  drawImageDiamond(images[1], positions[1].x, positions[1].y, size, "#22D4FD");
  drawImageDiamond(images[2], positions[2].x, positions[2].y, size, "#22D4FD");
  drawImageDiamond(images[0], positions[0].x, positions[0].y, size, "#22D4FD");
}

function lerp(a, b, t) { return a + (b - a) * t; }

let moverA = {posIndex: 3, x: 0, y: 0, target: 0, color: "black"};
let moverB = {posIndex: 1, x: 0, y: 0, target: 2, color: "white"};

let t = 0;
let speed = 0.01;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFixedDiamonds();
  t += speed;
  if (t >= 1) {
    t = 0;
    moverA.posIndex = moverA.target;
    moverB.posIndex = moverB.target;
    moverA.target = (moverA.posIndex + 1) % 4;
    moverB.target = (moverB.posIndex + 1) % 4;
  }
  let startA = positions[moverA.posIndex];
  let targetApos = positions[moverA.target];
  moverA.x = lerp(startA.x, targetApos.x, t);
  moverA.y = lerp(startA.y, targetApos.y, t);

  let startB = positions[moverB.posIndex];
  let targetBpos = positions[moverB.target];
  moverB.x = lerp(startB.x, targetBpos.x, t);
  moverB.y = lerp(startB.y, targetBpos.y, t);

  drawColorDiamond(moverA.x, moverA.y, size, moverA.color);
  drawColorDiamond(moverB.x, moverB.y, size, moverB.color);
  requestAnimationFrame(animate);
}

// Executa
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  moverA.x = positions[moverA.posIndex].x;
  moverA.y = positions[moverA.posIndex].y;
  moverB.x = positions[moverB.posIndex].x;
  moverB.y = positions[moverB.posIndex].y;
});
moverA.x = positions[moverA.posIndex].x;
moverA.y = positions[moverA.posIndex].y;
moverB.x = positions[moverB.posIndex].x;
moverB.y = positions[moverB.posIndex].y;
animate();

// ⏳ Mostra o loading por 6.35 segundos e depois exibe o site:
setTimeout(() => {
  const loader = document.getElementById('loading-screen');
  loader.style.transition = 'opacity 0.5s ease';
  loader.style.opacity = '0';
  setTimeout(() => loader.style.display = 'none', 500);
  document.getElementById('site-content').style.display = 'block';
}, 6350); // 6.35 segundos

sessionStorage.setItem("passouLoader", "true");