// Get canvas and context
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

// Current drawing state
let currentShape = "ellipse";
let currentSize = "medium";
let currentColor = "black";
let currentBackgroundColor = "white";
let isDrawing = false;
let startX, startY;

// Sizes
const sizes = { 
  small: 2,
  medium: 4,
  large: 6,
};

// Array to store drawn shapes
const drawnShapes = [];

// Shape selection
document.querySelectorAll("[data-shape]").forEach((button) => {
  button.addEventListener("click", () => {
    // Remove "active" class from all shape buttons
    document.querySelectorAll("[data-shape]").forEach((button) => {
      button.classList.remove("active");
    });
    // Add "active" class to clicked button
    button.classList.add("active");
    // Update current shape
    currentShape = button.dataset.shape;
  });
});

// Size selection
document.querySelectorAll("[data-size]").forEach((button) => {
  button.addEventListener("click", () => {
    // Remove "active" class from all size buttons
    document.querySelectorAll("[data-size]").forEach((button) => {
      button.classList.remove("active");
    });
    // Add "active" class to clicked button
    button.classList.add("active");
    // Update current size
    currentSize = button.dataset.size;
  });
});

// Color selection
document.querySelectorAll("[data-color]").forEach((button) => {
  button.addEventListener("click", () => {
    // Remove "active" class from all color buttons
    document.querySelectorAll("[data-color]").forEach((button) => {
      button.classList.remove("active");
    });
    // Add "active" class to clicked button
    button.classList.add("active");
    // Update current color
    currentColor = button.dataset.color;
  });
});

// Background color selection
document.querySelectorAll("[data-background-color]").forEach((button) => {
  button.addEventListener("click", () => {
    // Remove "active" class from allbackground color buttons
    document.querySelectorAll("[data-background-color]").forEach((button) => {
      button.classList.remove("active");
    });
    // Add "active" class to clicked button
    button.classList.add("active");
    // Update current background color
    currentBackgroundColor = button.dataset.backgroundColor;
    // Redraw canvas with new background
    redrawCanvas();
  });
});

// Set initial active states for toolbar buttons
document.querySelector('[data-shape="ellipse"]').classList.add("active");
document.querySelector('[data-size="medium"]').classList.add("active");
document.querySelector('[data-color="black"]').classList.add("active");
document
  .querySelector('[data-background-color="white"]')
  .classList.add("active");

// Mouse event listeners for canvas
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Gets mouse position relative to canvas
function getMousePosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const position = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
  return position;
}

// Starts the drawing process when mouse is pressed
function startDrawing(event) {
  isDrawing = true;

  // Get the starting position
  const position = getMousePosition(canvas, event);
  startX = position.x;
  startY = position.y;
}

// Draws one shape based on its type (ellipse, rectangle or line)
function drawShape(shape) {
  ctx.beginPath();
  ctx.strokeStyle = shape.color;
  ctx.lineWidth = shape.lineWidth;

  switch (shape.type) {
    case "ellipse": {
      const centerX = shape.startX + (shape.endX - shape.startX) / 2;
      const centerY = shape.startY + (shape.endY - shape.startY) / 2;
      const radiusX = Math.abs(shape.endX - shape.startX) / 2;
      const radiusY = Math.abs(shape.endY - shape.startY) / 2;

      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      break;
    }
    case "rectangle": {
      const width = shape.endX - shape.startX;
      const height = shape.endY - shape.startY;

      ctx.rect(shape.startX, shape.startY, width, height);
      break;
    }
    case "line": {
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      break;
    }
  }

  ctx.stroke();
}

// Redraws the entire canvas with all shapes
function redrawCanvas() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  ctx.fillStyle = currentBackgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw all shapes
  drawnShapes.forEach((shape) => drawShape(shape));
}

// Called every time the mouse is moving on canvas,
// but draws only if the mouse is pressed (isDrawing = true)
function draw(event) {
  if (isDrawing === false) return;

  const position = getMousePosition(canvas, event);

  // Clear the canvas for preview
  redrawCanvas();

  // Details for the shape that is going to be drawn
  const shape = {
    type: currentShape,
    startX: startX,
    startY: startY,
    endX: position.x,
    endY: position.y,
    color: currentColor,
    lineWidth: sizes[currentSize],
  };
  drawShape(shape);
}

// Finishes drawing the shape when user releases the mouse button
// Adds the drawn shape into shape list
function stopDrawing(event) {
  if (isDrawing === false) return;

  isDrawing = false;

  const position = getMousePosition(canvas, event);

  // Save the completed shape
  drawnShapes.push({
    type: currentShape,
    startX: startX,
    startY: startY,
    endX: position.x,
    endY: position.y,
    color: currentColor,
    lineWidth: sizes[currentSize],
  });

  updateShapeList();
}

// Deletes specified shape from the canvas
function deleteShape(index) {
  drawnShapes.splice(index, 1);
  redrawCanvas();
  updateShapeList();
}

// Updates the shape list in the user interface
function updateShapeList() {
  const shapeList = document.getElementById("shapeList");
  shapeList.innerHTML = "";

  drawnShapes.forEach((shape, index) => {
    const shapeItem = document.createElement("div");
    shapeItem.className =
      "border-bottom p-2 d-flex justify-content-between align-items-center mb-2";

    const shapeTitle = document.createElement("div");
    shapeTitle.innerHTML = `${shape.type} ${index + 1}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
    deleteBtn.setAttribute("onclick", `deleteShape(${index})`);

    shapeItem.appendChild(shapeTitle);
    shapeItem.appendChild(deleteBtn);
    shapeList.appendChild(shapeItem);
  });
}
