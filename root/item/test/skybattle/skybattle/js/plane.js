function plane(){
    this.x=170;
    this.y=470;  
    this.hp=1;
    this.damage=7;
    this.defense=5;
    this.lef=false;
    this.rig=false;
    this.up=false;
    this.down=false;
    this.speed=6;
    this.width=35;
    this.height=43;
    this.shoot=false;
    this.bulletcount=0;
    this.decount=0;//防御计时器
    this.debool=false;
    this.level=0;
    this.weapon=false;
    this.wtime=0;
    this.bigbullet=false;
    this.bigbulletcount=3;
    this.life=3;
    this.relifetime=false;
}
plane.prototype.update=function(i){
    var self=this;
    self.bulletcount++;
    this.wtime++;
    if(self.level>3){
        self.level=3;
    }
    if(self.relifetime==true){
       self.y-=5;
      if(self.y<=450){
        self.relifetime=false;
      }
    }
    if(self.bigbullet==true&&self.bigbulletcount>0){
             game.bigbullet.push(new bigbullet());
             self.bigbulletcount--;
             self.bigbullet=false;
    }
    self.bigbullet=false;
    if(self.debool==true){
        self.decount++;
        self.defense=9999;
        game.ctx.drawImage(game.R.d,self.x-20,self.y-20,80,80);
    }
    if(self.decount==300){
        self.debool=false;
        self.defense=5;
        self.decount=0;
    }
    if(self.lef==true){
        self.x-=self.speed;
    }
    if(self.rig==true){
        self.x+=self.speed;
    }
    if(self.up==true){
        self.y+=self.speed;
    }
    if(self.down==true){
        self.y-=self.speed;
    }
    if(self.shoot==true&&self.bulletcount>=7){
      
        if(self.level==0){
          game.biu.load();
           game.biu.play();
        var a1=new mybullet();
        var a2=new mybullet();
           a1.init(2,-5);
           a2.init(5,-5);
           game.mybullet.push(a1);
           game.mybullet.push(a2);
           self.bulletcount=0;
       }
        if(self.level==1){
          game.biu.load();
          game.biu.play();
        var a1=new mybullet();
        var a2=new mybullet();
        var a3=new mybullet();
        var a4=new mybullet();
           a1.init(2,-5);
           a2.init(5,-5);
           a3.init(8,5);
           a4.init(-1,5);
           game.mybullet.push(a1);
           game.mybullet.push(a2);
           game.mybullet.push(a3);
           game.mybullet.push(a4);
           self.bulletcount=0;
       }
       if(self.level==2){
        game.biu.load();
        game.biu.play();
        var a1=new mybullet();
        var a2=new mybullet();
        var a3=new mybullet();
        var a4=new mybullet();
           a1.init(2,-5);
           a2.init(5,-5);
           a3.init(8,5);
           a4.init(-1,5);
           game.mybullet.push(a1);
           game.mybullet.push(a2);
           game.mybullet.push(a3);
           game.mybullet.push(a4);
           self.bulletcount=0;
           if(self.wtime>60){
            game.boombiu.load();
            game.boombiu.play();
          var b1=new myweaponbullet();
          var b2=new myweaponbullet();
                b1.init(-4);
                b2.init(10);
           game.mybullet.push(b1);
           game.mybullet.push(b2);
           self.wtime=0;
         }
           self.weapon=false;
       }
       if(self.level==3){
        game.biubiubiu.load();
      game.biubiubiu.play();
         var a1=new maxmybullet();
        var a2=new maxmybullet();
        var a3=new maxmybullet();
        var a4=new maxmybullet();
           a1.init(2,-5);
           a2.init(5,-5);
           a3.init(8,5);
           a4.init(-1,5);
           game.mybullet.push(a1);
           game.mybullet.push(a2);
           game.mybullet.push(a3);
           game.mybullet.push(a4);
           self.bulletcount=0;
        if(self.wtime>60){
          game.boombiu.load();
            game.boombiu.play();
          var b1=new myweaponbullet();
          var b2=new myweaponbullet();
                b1.init(-4);
                b2.init(10);
           game.mybullet.push(b1);
           game.mybullet.push(b2);
           self.wtime=0;
         }
         self.bulletcount=0;
       }

    }
    window.onkeydown=function(e){
      e.preventDefault();
    if(e.keyCode==37){
        self.lef=true;
    }
    if(e.keyCode==38){
        self.down=true;
    }
    if(e.keyCode==39){
        self.rig=true;
    }
    if(e.keyCode==40){
        self.up=true;
    }
    if(e.keyCode==90){
        self.shoot=true;
    }
    if(e.keyCode==88){
        self.bigbullet=true;
    }
    }
    window.onkeyup=function(e){
    if(e.keyCode==37){
        self.lef=false;
    }
    if(e.keyCode==38){
        self.down=false;
    }
    if(e.keyCode==39){                                                                
        self.rig=false;
    }
    if(e.keyCode==40){
        self.up=false;
    }
    if(e.keyCode==90){
        self.shoot=false;
    }
}
if(self.x>361){
    self.x=361;
}
if(self.x<0){
    self.x=0;
}
if(self.y>490){
    self.y=490;
}
if(self.y<0){
    self.y=0;
}
if(self.hp<0){
    self.life--;
    var a=new burst();
    a.init(self);
    game.burst.push(a);
    game.myplane.splice(i,1);
    if(self.life>0){
     game.die=true;
    }
    else{
      game.fail=true;
    }
}
}
plane.prototype.rander=function(){
    var self=this;
    if(self.lef==true&&self.rig==false){
         game.ctx.drawImage(game.R.plane1,196,0,67,87,this.x,this.y,33,43);
    }
    if(self.lef==false&&self.rig==true){
        game.ctx.drawImage(game.R.plane1,53,0,64,87,this.x,this.y,32,43);
    }
    if((self.lef==true&&self.rig==true)||(self.lef==false&&self.rig==false)){
        game.ctx.drawImage(game.R.plane1,117,0,79,87,this.x,this.y,39,43);
    }
    if(self.weapon==true){
        game.ctx.drawImage(game.R.weapon1,this.x-20,this.y+40,10,10);
        game.ctx.drawImage(game.R.weapon1,this.x+53,this.y+40,10,10);
    } 
}
plane.prototype.rest=function(){
  game.myplane.push(game.plane);
  game.plane.x=170;
  game.plane.y=600;
  game.plane.level=0;
  game.plane.hp=1;
  game.plane.bigbulletcount=3;
  game.plane.debool=true;
  game.plane.relifetime=true;
}