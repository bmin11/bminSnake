var UP = 1;
var RIGHT = 2;
var DOWN = 3;
var LEFT = 4;

function Head(dir, hex, x, y) {
  this.x = x * 25;
  this.y = y * 25;
  this.i = x;
  this.j = y;
  this.w = 24;
  this.h = 24;
  this.hex = hex;
  this.limit = 3;
  if (dir == RIGHT)
  {
      this.Vx = 25;
      this.Vy = 0;
      this.dir = dir;
      this.currentDir = dir;
  }
  else if (dir == LEFT)
  {
      this.Vx = -25;
      this.Vy = 0;
      this.dir = dir;
      this.currentDir = dir;
  }
  this.Draw = function() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.fillStyle = this.hex;
    context.fillRect(this.x,this.y,this.w,this.h);
  };
  this.Move = function() {
    this.x = this.x + this.Vx;
    this.y = this.y + this.Vy;
  };
  this.changeDirection = function(dir) {
    if (dir == UP && this.dir != DOWN)
    {
        this.dir = dir;
    }
    else if (dir == RIGHT && this.dir != LEFT)
    {
        this.dir = dir;
    }
    else if (dir == DOWN && this.dir != UP)
    {
        this.dir = dir;
    }
    else if (dir == LEFT && this.dir != RIGHT)
    {
        this.dir = dir;
    }
  };
  this.finalChange = function() {
    if (this.dir == UP && this.currentDir != DOWN)
    {
        this.Vx = 0;
        this.Vy = 25 * -1;
        this.currentDir = this.dir;
    }
    else if (this.dir == RIGHT && this.currentDir != LEFT)
    {
        this.Vx = 25;
        this.Vy = 0;
        this.currentDir = this.dir;
    }
    else if (this.dir == DOWN && this.currentDir != UP)
    {
        this.Vx = 0;
        this.Vy = 25;
        this.currentDir = this.dir;
    }
    else if (this.dir == LEFT && this.currentDir != RIGHT)
    {
        this.Vx = 25 * -1;
        this.Vy = 0;
        this.currentDir = this.dir;
    }
  };
}
