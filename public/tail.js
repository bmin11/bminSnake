
function Tail(head, hex, x, y) {
  this.x = x * 25;
  this.y = y * 25;
  this.w = 24;
  this.h = 24;
  this.Vx = -1;
  this.hex = hex;
  this.life = 0;
  this.head = head;
  this.Draw = function() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.fillStyle = this.hex;
    context.fillRect(this.x,this.y,this.w,this.h);
  };
  this.Tick = function() {
    this.life = this.life + 1;
    return this.head.limit <= this.life;
  }
}
