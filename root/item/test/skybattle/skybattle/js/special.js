function odds(i){
     var z=_.random(1,100);
     if(z>=90&&z<94){
        var x=new defense();
        x.init(i);
        game.Prop.push(x);
     }
     if(z>=94&&z<98){
      var x=new power();
        x.init(i);
        game.Prop.push(x);
     }
     if(z>=98&&z<100){
      var x=new skill();
        x.init(i);
        game.Prop.push(x);
     }
}
function defense(){//防御罩
    this.x=0;
    this.y=0;
    this.speed=1;
    this.width=30;
    this.height=30;                     
}
defense.prototype.init=function(i){
     this.x=i.x+i.width/2;
     this.y=i.y+i.height/2;
}
defense.prototype.update=function(i){
    var self=this;
    trace(self,game.plane);
    self.y+=self.speed;
    if(boom(self,game.plane)){
        game.plane.debool=true;
        game.Prop.splice(i,1);
    }
}

defense.prototype.rander=function(){
    game.ctx.drawImage(game.R.defense,this.x,this.y,this.width,this.height);
}

//end
//

function power(){// 升级等级
    this.x=0;
    this.y=0;
    this.speed=1;
    this.width=30;
    this.height=30;  
}
power.prototype.init=function(i){
     this.x=i.x+i.width/2;
     this.y=i.y+i.height/2;
}
power.prototype.update=function(i){
    var self=this;
    trace(self,game.plane);
    self.y+=self.speed;
    if(boom(self,game.plane)){
        game.plane.level++;
        game.Prop.splice(i,1);
    }
}
power.prototype.rander=function(){
    game.ctx.drawImage(game.R.power,this.x,this.y,this.width,this.height);
}
//end
//
//
function skill(){// 炸弹
    this.x=0;
    this.y=0;
    this.speed=1;
    this.width=30;
    this.height=30
}
skill.prototype.init=function(i){
     this.x=i.x+i.width/2;
     this.y=i.y+i.height/2;
}
skill.prototype.update=function(i){
    var self=this;
    trace(self,game.plane);
    self.y+=self.speed;
     if(boom(self,game.plane)){
        game.plane.bigbulletcount++;
        game.Prop.splice(i,1);
    }
}
skill.prototype.rander=function(){
    game.ctx.drawImage(game.R.skill,this.x,this.y,this.width,this.height);
}