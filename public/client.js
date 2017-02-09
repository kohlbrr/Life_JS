var state = [];

function fillState(cols, rows, fill) {
  var newState = [];
  for(var i = 0; i < rows; i = i + 1) {
    var row = [];
    for(var j = 0; j < cols; j = j + 1) {
      row.push(fill(j, i));
    }
    newState.push(row);
  }
  return newState;
}

function randomState(cols, rows) {
  return fillState(cols, rows, function(){
    return Math.floor(Math.random() * 2)
  })
}

function emptyState(cols, rows) {
  return fillState(cols, rows, function(x, y){
    return 0;
  })
}

function getElementAt(state, row, col) {
  if(row < 0 || row >= state.length || col < 0 || col >= state[0].length) {
    return 0;
  } else {
    return state[row][col];
  }
}

function nextState(state) {
  // Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
  // Any live cell with two or three live neighbours lives on to the next generation.
  // Any live cell with more than three live neighbours dies, as if by overpopulation.
  // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  
  var newState = [];
  // Math.random() – returns a random value between 0 and 1 (but never actually 1)
  // Math.floor(Math.random() * 10) returns something in the range 0 - 9
  for(var i = 0; i < state.length; i = i + 1) {
    var row = [];
    for(var j = 0; j < state[0].length; j = j + 1) {
      var neighbors = -getElementAt(state, i, j);
      
      for(var di = i - 1; di < i + 2; di = di + 1) {
        for(var dj = j - 1; dj < j + 2; dj = dj + 1) {
          neighbors += getElementAt(state, di, dj)
        }
      }
      var element = 
        neighbors < 2 ? 0 :
        neighbors == 2 ? state[i][j] :
        neighbors == 3 ? 1 : 0
      row.push(element);
    }
    newState.push(row);
  }
  return newState;
}

// Below is mystical Canvas incantation stuff
var size = 10;
var canvas = document.getElementById('output');
var context = canvas.getContext('2d');
var width = 80;
var height = 80;
var paused = true;

canvas.width = width * size;
canvas.height = height * size;

function drawState(state) {
  context.fillStyle = '#eee';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  context.fillStyle = '#000';
  state.forEach(function(row, rowIndex) {
    row.forEach(function(element, colIndex) {
      if(element == 1) {
        context.fillRect(colIndex * size, rowIndex * size, size - 1, size - 1);          
      }
    })
  })
}

function step(ts) {
  if(!paused) {
    state = nextState(state);      
  }
  
  drawState(state);
    
  scheduleNext();
}

function scheduleNext() {
  //setTimeout(step, 1000);
  requestAnimationFrame(step); // 30 times a second
}

//state = randomState(width, height);
state = emptyState(width, height);
scheduleNext();

var drag = false

var outputElement = document.getElementById('output')

outputElement.addEventListener('mousedown', function(e){
  var clickX = e.offsetX;
  var clickY = e.offsetY;

  var xAxis = Math.floor(clickX/10)
  var yAxis = Math.floor(clickY/10)
  //state[yAxis][xAxis] = 1;
  state[yAxis][xAxis] = (state[yAxis][xAxis] === 1 ? 0 : 1);
  drag = true
})
outputElement.addEventListener('mouseup', function(e){
  drag = false
})

outputElement.addEventListener('mousemove', function(e){
  var clickX = e.offsetX;
  var clickY = e.offsetY;

  var xAxis = Math.floor(clickX/10)
  var yAxis = Math.floor(clickY/10)
  //state[yAxis][xAxis] = (state[yAxis][xAxis] === 1 ? 0 : 1)
  //drawState(state);
  if(drag) {
    state[yAxis][xAxis] = 1;
  }
})

document.getElementById('clear').addEventListener('click', function(e){
  state = emptyState(width, height);
})

document.getElementById('random').addEventListener('click', function(e){
  state = randomState(width, height);
})

document.getElementById('pause').addEventListener('click', function(e){
  paused = !paused
})