function background(){
    this.x=0;
    this.y=0;
    this.im=0;
    this.count=0;
}
background.prototype.update=function(){
    var self=this;
      self. count++;
    if(self.count==2){
     self.y+=5;
     self.count=0;
}
    if(self.y==550)
    self.y=0;
}
background.prototype.rander=function(){
game.ctx.drawImage(game.R.background,this.x,this.y,400,550);
game.ctx.drawImage(game.R.background,this.x,this.y-550,400,550);
game.ctx.drawImage(game.R.background,this.x,this.y-1100,400,550);
}