
function Orb(hex, x, y) {
  this.x = x * 25;
  this.y = y * 25;
  this.w = 24;
  this.h = 24;
  this.Vx = -2;
  this.hex = hex;
  this.Draw = function() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.fillStyle = this.hex;
    context.fillRect(this.x,this.y,this.w,this.h);
  };
}
