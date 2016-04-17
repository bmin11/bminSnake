var UP = 1;
var RIGHT = 2;
var DOWN = 3;
var LEFT = 4;

var socket = io();

var heads = [];
var objects = [];
var TAIL_COLOR = ["#ff9999", "#66ccff"];
var winner = [false, false];

var timer;

function handleClick(cb) {
  socket.emit('host', cb.checked);
  document.getElementById("btStart").hidden = !cb.checked;
}

socket.on('host', function(e){
  document.getElementById("host").disabled = e;
});

function stop() {
  socket.emit('stop game');
}

socket.on('stop game', function(){
  clearInterval(timer);
  document.getElementById("btStop").hidden = true;
  document.getElementById("btResume").hidden = false;
});

function resume() {
  socket.emit('resume game');
}

socket.on('resume game', function() {
  clearInterval(timer);
  timer = setInterval(tick , 500);
  document.getElementById("btResume").hidden = true;
  document.getElementById("btStop").hidden = false;
});

function start() {
  var e = {host: false};
  e.host = document.getElementById("host").checked
  socket.emit('start game', e);
}

socket.on('start game', function(e){
  clearInterval(timer);
  document.getElementById("btStop").hidden = false;

  for (var i = 0; i < 32; i++) {
    objects[i] = [];
    for (var j = 0; j < 32; j++) {
        objects[i][j] = "";
    }
  }

  heads[0] = new Head(RIGHT, "#ff0000", 9, 9);
  objects[9][9] = heads[0];
  objects[8][9] = new Tail(heads[0], "#ff9999", 8, 9);
  objects[7][9] = new Tail(heads[0], "#ff9999", 7, 9);
  objects[7][9].life = 1;
  objects[6][9] = new Tail(heads[0], "#ff9999", 6, 9);
  objects[6][9].life = 2;

  heads[1] = new Head(LEFT, "#0000ff", 20, 20);
  objects[20][20] = heads[1];
  objects[21][20] = new Tail(heads[1], "#66ccff", 21, 20);
  objects[22][20] = new Tail(heads[1], "#66ccff", 22, 20);
  objects[22][20].life = 1;
  objects[23][20] = new Tail(heads[1], "#66ccff", 23, 20);
  objects[23][20].life = 2;

  if (document.getElementById("host").checked == e.host) {
    randomOrb();
  }

  timer = setInterval(tick , 500);
});


function randomOrb() {
  var done = false;
  var x;
  var y;
  var e = {x: 0, y: 0};
  while (!done)
  {
      x = Math.floor((Math.random() * 32) + 1);
      y = Math.floor((Math.random() * 32) + 1);
      if (objects[x][y] == "")
      {
          e.x = x;
          e.y = y;
          socket.emit('create orb', e);
          done = true;
      }
  }
}

socket.on('create orb', function(e){
  objects[e.x][e.y] = new Orb("#ffff00", e.x, e.y);
});

document.addEventListener('keydown', function(event) {
  var e = {keyCode: 0, player: false};
  e.keyCode = event.keyCode;
  e.player = document.getElementById("host").checked;
  socket.emit('change direction', e);
});

socket.on('change direction', function(e){
  var a = 1;
  if (e.player) {
    a = 0;
  }
  //up
  if(e.keyCode == 38) {
      heads[a].changeDirection(UP);
  }
  //right
  else if(e.keyCode == 39) {
      heads[a].changeDirection(RIGHT);
  }
  //down
  else if(e.keyCode == 40) {
      heads[a].changeDirection(DOWN);
  }
  //left
  else if(e.keyCode == 37) {
      heads[a].changeDirection(LEFT);
  }
});

function tick() {

  for(var a = 0; a < 31; a++)
  {
      for (var b = 0; b < 31; b++)
      {
          if (objects[a][b] != null)
          {
            if (objects[a][b].Vx == -1)
            {
              if (objects[a][b].Tick())
              {
                objects[a][b] = "";
              }
            }
          }
      }
  }

  var end = false;
  var caught = false;
  for (a = 0; a < heads.length; a++) {
    heads[a].finalChange();
    var i = heads[a].i;
    var j = heads[a].j;
    if (heads[a].currentDir == UP)
    {
        //Hit the edge
        if (j <= 0)
        {
          winner[(a+1)%2] = true;
          end = true;
        }
        //Hit the tail
        else if (objects[i][j - 1] != "")
        {
          if(objects[i][j - 1].Vx == -2)
          {
            heads[a].limit = heads[a].limit + 1;
            caught = true;
          }
          else if(objects[i][j - 1].Vx == -1)
          {
            objects[i][j - 1].head.limit = objects[i][j - 1].life;
          }
          else {
            heads[0].limit = 1;
            heads[1].limit = 1;
          }
        }
        //No winner yet
        if (!end)
        {
            objects[i][j] = new Tail(heads[a], TAIL_COLOR[a], i, j);
            objects[i][j - 1] = heads[a];
            heads[a].j = j - 1;
            heads[a].Move();
        }
    }
    else if (heads[a].currentDir == RIGHT)
    {
        //Hit the edge
        if (i >= 31)
        {
          winner[(a+1)%2] = true;
          end = true;
        }
        //Hit the tail
        else if (objects[i + 1][j] != "")
        {
          if(objects[i + 1][j].Vx == -2)
          {
            heads[a].limit = heads[a].limit + 1;
            caught = true;
          }
          else if(objects[i + 1][j].Vx == -1)
          {
            objects[i + 1][j].head.limit = objects[i + 1][j].life;
          }
          else {
            heads[0].limit = 1;
            heads[1].limit = 1;
          }
        }
        //No winner yet
        if (!end)
        {
            objects[i][j] = new Tail(heads[a], TAIL_COLOR[a], i, j);
            objects[i + 1][j] = heads[a];
            heads[a].i = i + 1;
            heads[a].Move();
        }
    }
    else if (heads[a].currentDir == DOWN)
    {
        //Hit the edge
        if (j >= 31)
        {
          winner[(a+1)%2] = true;
          end = true;
        }
        //Hit the tail
        else if (objects[i][j + 1] != "")
        {
          if(objects[i][j + 1].Vx == -2)
          {
            heads[a].limit = heads[a].limit + 1;
            caught = true;
          }
          else if(objects[i][j + 1].Vx == -1)
          {
            objects[i][j + 1].head.limit = objects[i][j + 1].life;
          }
          else {
            heads[0].limit = 1;
            heads[1].limit = 1;
          }
        }
        //No winner yet
        if (!end)
        {
            objects[i][j] = new Tail(heads[a], TAIL_COLOR[a], i, j);
            objects[i][j + 1] = heads[a];
            heads[a].j = j + 1;
            heads[a].Move();
        }
    }
    else if (heads[a].currentDir == LEFT)
    {
        //Hit the edge
        if (i <= 0)
        {
          winner[(a+1)%2] = true;
          end = true;
        }
        //Hit the tail
        else if (objects[i - 1][j] != "")
        {
          if(objects[i - 1][j].Vx == -2)
          {
            heads[a].limit = heads[a].limit + 1;
            caught = true;
          }
          else if(objects[i - 1][j].Vx == -1)
          {
            objects[i - 1][j].head.limit = objects[i - 1][j].life;
          }
          else {
            heads[0].limit = 1;
            heads[1].limit = 1;
          }
        }
        //No winner yet
        if (!end)
        {
            objects[i][j] = new Tail(heads[a], TAIL_COLOR[a], i, j);
            objects[i - 1][j] = heads[a];
            heads[a].i = i -1;
            heads[a].Move();
        }
    }
  }
  if (heads[0].limit >= 10) {
    winner[0] = true;
    end = true;
  }
  if(heads[1].limit >= 10) {
    winner[1] = true;
    end = true;
  }
  if (end)
  {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.font = "62px Arial";
    context.textAlign="center";
    context.fillStyle = "#ffffff";
    if (winner[0] && winner[1]) {
      context.fillText("DRAW", 400, 400);
    }
    else if (winner[0]) {
      context.fillText("Player 1 WON", 400, 400);
    }
    else if (winner[1]) {
      context.fillText("Player 2 WON", 400, 400);
    }
    clearInterval(timer);
  }
  else
  {
    if (caught)
    {
      if (document.getElementById("host").checked) {
        randomOrb();
      }
    }
    var canvas = document.getElementById("canvas");
    var h = parseInt(canvas.getAttribute("height"));
    var w = parseInt(canvas.getAttribute("width"));
    var context = canvas.getContext("2d");
    context.fillStyle = "#000000";
    context.fillRect(0,0,w,h);
    for(var a = 0; a < 31; a++)
    {
      for (var b = 0; b < 31; b++)
      {
        if (objects[a][b] != "")
        {
          objects[a][b].Draw();
        }
      }
    }
  }
}
