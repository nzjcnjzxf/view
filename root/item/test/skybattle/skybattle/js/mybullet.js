function mybullet(){
    this.x=150;
    this.y=480;
    this.speed=20;
    this.width=5;
    this.height=25;
}
mybullet.prototype.init=function(i,j){
     this.x=game.plane.x+i*5;
     this.y=game.plane.y+j*5;
}
mybullet.prototype.update=function(i){
    var self=this;
    this.y-=this.speed;
    if(self.y<-100){
        game.mybullet.splice(i,1);
    }
    for(var x in game.Enmy){
        if(boom(self,game.Enmy[x])){
            game.Enmy[x].hp=game.Enmy[x].hp-(game.plane.damage-game.Enmy[x].defense);
            game.mybullet.splice(i,1);
            var a=new bulletfeel();
            a.init(self);
            game.bulletfeel.push(a);
        }
    }
}
mybullet.prototype.rander=function(){
    game.ctx.drawImage(game.R.mybullet1,this.x,this.y,5,25);
}
 

 function myweaponbullet(){
   this.x=150;
   this.y=450;
   this.speed=5;
   this.damage=50;
   this.width=5;
   this.height=25;
 }
 myweaponbullet.prototype.init=function(i){
    this.x=game.plane.x+i*5;
     this.y=game.plane.y;
 }
 myweaponbullet.prototype.update=function(i){
    var self=this;
    this.y-=this.speed;
    if(self.y<-100){
        game.mybullet.splice(i,1);
    }
    for(var x in game.Enmy){
        if(boom(self,game.Enmy[x])){
            game.Enmy[x].hp=game.Enmy[x].hp-(self.damage-game.Enmy[x].defense);
            game.mybullet.splice(i,1);
            var a=new bulletfeel();
          a.init(self);
           game.bulletfeel.push(a);
        }
    }
 }
  myweaponbullet.prototype.rander=function(){
    game.ctx.drawImage(game.R.mybullet2,this.x,this.y,6,40);
 }

 //end
 //
 //
 
 function maxmybullet(){
    this.x=150;
    this.y=450;
    this.speed=15;
    this.width=5;
    this.height=25;
    this.damage=10;
 }
maxmybullet.prototype.init=function(i,j){
       this.x=game.plane.x+i*5;
     this.y=game.plane.y+j*5;
}
maxmybullet.prototype.update=function(i){
 var self=this;
    this.y-=this.speed;
    if(self.y<-100){
        game.mybullet.splice(i,1);
    }
    for(var x in game.Enmy){
        if(boom(self,game.Enmy[x])){
            game.Enmy[x].hp=game.Enmy[x].hp-(self.damage-game.Enmy[x].defense);
            game.mybullet.splice(i,1);
            var a=new bulletfeel();
            a.init(self);
            game.bulletfeel.push(a);
        }
    }
}
maxmybullet.prototype.rander=function(){
    game.ctx.drawImage(game.R.bossbullet1,this.x,this.y,this.width,this.height);
}
function bigbullet(){
    this.x=120;
    this.y=500;
    this.damage=50;
}
bigbullet.prototype.update=function(i){
     var self=this;
     self.y-=20;
     for(var x in game.Enmy){
            game.Enmy[x].hp=game.Enmy[x].hp-(self.damage-game.Enmy[x].defense);
    }
    game.Enmybullet.length=0;
     if(self.y<-200){
       game.bigbullet.splice(i, 1)
     }
}
bigbullet.prototype.rander=function(){
game.ctx.drawImage(game.R.bigbullet,this.x,this.y);
}

