const canvas = document.querySelector("canvas"),
  ctx = canvas.getContext("2d"),
  options = document.querySelectorAll(".option"),
  brushSize = document.getElementById("brush-size"),
  colorPalette = document.getElementById("color"),
  fillColor = document.getElementById("fill"),
  saveBtn = document.getElementById("save"),
  clearBtn = document.getElementById("clear"),
  toggleBtn = document.querySelector(".toggle");

let brushValue = brushSize.value,
  isDrawing = false,
  selectOption = document.querySelector(".active").id,
  prevMouseX,
  prevMouseY,
  touch,
  prevTouchX,
  prevTouchY,
  snapShot;

window.addEventListener("load", () => {
  canvas.height = canvas.offsetHeight;
  canvas.width = canvas.offsetWidth;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = colorPalette.value;
});

window.addEventListener("resize", () => {
  canvas.height = canvas.offsetHeight;
  canvas.width = canvas.offsetWidth;
});

brushSize.addEventListener("change", () => {
  brushValue = brushSize.value;
  document.getElementById("current-px").innerHTML = `${brushValue}px`;
});

options.forEach((option) => {
  option.addEventListener("click", () => {
    options.forEach((selection) => {
      selection.classList.remove("active");
    });

    option.classList.add("active");
    selectOption = option.id;
  });
});

const drawing = (event) => {
  if (!isDrawing) return;

  ctx.putImageData(snapShot, 0, 0);
  if (selectOption === "brush" || selectOption === "eraser") {
    ctx.strokeStyle = selectOption === "eraser" ? "#fff" : colorPalette.value;
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
  } else if (selectOption === "rect") {
    drawRectangle(event);
  } else if (selectOption === "circle") {
    drawCircle(event);
  } else {
    drawTriangle(event);
  }
};

const startDraw = (event) => {
  selectOption = document.querySelector(".active").id;
  prevMouseX = event.offsetX;
  prevMouseY = event.offsetY;
  isDrawing = true;
  ctx.beginPath();
  ctx.lineWidth = brushValue;
  ctx.strokeStyle = colorPalette.value;
  ctx.fillStyle = colorPalette.value;
  snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const endDraw = () => {
  isDrawing = false;
};

function drawTriangle(event) {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.lineTo(prevMouseX * 2 - event.offsetX, event.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
}

function drawCircle(event) {
  ctx.beginPath();
  let radius = Math.sqrt(
    Math.pow(prevMouseX - event.offsetX, 2) +
      Math.pow(prevMouseY - event.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
}

function drawRectangle(event) {
  if (!fillColor.checked) {
    return ctx.strokeRect(
      event.offsetX,
      event.offsetY,
      prevMouseX - event.offsetX,
      prevMouseY - event.offsetY
    );
  }
  ctx.fillRect(
    event.offsetX,
    event.offsetY,
    prevMouseX - event.offsetX,
    prevMouseY - event.offsetY
  );
}

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = fillColor.value;
});

saveBtn.addEventListener("click", () => {
  const img = document.createElement("a");
  img.href = canvas.toDataURL();
  img.download = `${Date.now()}.jpg`;
  img.click();
});

//!for touch screens

function touchDrawing(event, touch) {
  touch = event.targetTouches[0];
  if (!isDrawing) return;

  ctx.lineTo(touch.pageX - canvas.offsetLeft, touch.pageY - canvas.offsetTop);
  ctx.stroke();

  ctx.putImageData(snapShot, 0, 0);
  if (selectOption === "brush" || selectOption === "eraser") {
    ctx.strokeStyle = selectOption === "eraser" ? "#fff" : colorPalette.value;
    ctx.lineTo(touch.offsetX, touch.offsetY);
    ctx.stroke();
  } else if (selectOption === "rect") {
    touchdrawRectangle(event, touch);
  } else if (selectOption === "circle") {
    8666;
    touchdrawCircle(event, touch);
  } else {
    touchdrawTriangle(event, touch);
  }
}

function touchDrawStart(event, touch) {
  selectOption = document.querySelector(".active").id;
  touch = event.targetTouches[0];
  prevTouchX = touch.pageX - canvas.offsetLeft;
  prevTouchY = touch.pageY - canvas.offsetTop;
  isDrawing = true;
  ctx.beginPath();
  ctx.lineWidth = brushValue;
  ctx.strokeStyle = colorPalette.value;
  ctx.fillStyle = colorPalette.value;
  snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function touchdrawRectangle(event, touch) {
  touch = event.targetTouches[0];
  if (!fillColor.checked) {
    return ctx.strokeRect(
      touch.pageX,
      touch.pageY,
      prevTouchX - touch.pageX,
      prevTouchY - touch.pageY
    );
  }
  ctx.fillRect(
    touch.pageX,
    touch.pageY,
    prevTouchX - touch.pageX,
    prevTouchY - touch.pageY
  );
}

function touchdrawCircle(event, touch) {
  touch = event.targetTouches[0];
  ctx.beginPath();
  let radius = Math.sqrt(
    Math.pow(prevTouchX - touch.pageX, 2) +
      Math.pow(prevTouchY - touch.pageY, 2)
  );
  ctx.arc(prevTouchX, prevTouchY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
}

function touchdrawTriangle(event, touch) {
  touch = event.targetTouches[0];
  ctx.beginPath();
  ctx.moveTo(prevTouchX, prevTouchY);
  ctx.lineTo(touch.pageX, touch.pageY);
  ctx.lineTo(prevTouchX * 2 - prevTouchY, touch.pageY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
}

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("touchmove", touchDrawing);
canvas.addEventListener("touchstart", touchDrawStart);
canvas.addEventListener("touchend", endDraw);
canvas.addEventListener("touchcancel", endDraw);

toggleBtn.addEventListener("click", () => {
  toggleBtn.classList.toggle("open");
  document.querySelector('section[role="sidebar"]').classList.toggle("open");
});
