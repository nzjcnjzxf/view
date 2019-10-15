function enmy_f1(){//第一种敌人追踪
    this.x=0;
    this.y=-20;
    this.hp=8;
    this.damage=10;
    this.defense=5;
    this.speed=8;
    this.width=40;
    this.height=40;
}
enmy_f1.prototype.init=function(i){
     this.x=i*50;
}
enmy_f1.prototype.update=function(i){
     var self=this;
     trace(self,game.plane);
     self.y+=self.speed;
     if(boom(self,game.plane)){
        if((self.damage-game.plane.defense)>0){
        game.plane.hp-=(self.damage-game.plane.defense);
          }
     }
     if(self.hp<0){
         var a=new burst();
        a.init(self);
        game.burst.push(a);
        game.score+=100;
        game.Enmy.splice(i,1);
        odds(self);

     }
}
enmy_f1.prototype.rander=function(){
   game.ctx.drawImage(game.R.enmy_f1,this.x,this.y,this.width,this.height);
}
//end
function enmy_f2(){//第二种敌人普通一级飞机
    this.x=0;
    this.y=-20;
    this.time=0
    this.count=0;
    this.hp=20;
    this.damage=10;
    this.defense=5;
    this.speed=3;
    this.width=100;
    this.height=50;
    this.im=0;
}
enmy_f2.prototype.init=function(i,j){
    var self=this;
    if(j==1){
     self.x=i*50;
     self.im=game.R.enmy_f4;
    }
    else{
     self.x=i*50;
     self.im=game.R.enmy_f7;
 }
}
enmy_f2.prototype.update=function(i){
    var self=this;
    self.y+=self.speed;
    self.count++;
    if(self.count>=200||(self.count>=20&&self.count<=70)){
        self.time++;
         if(self.time==15){
            var a1=new enmybullet1();
             a1.init(self,0);
             game.Enmybullet.push(a1);
              self.time=0;
         }
        if(self.count>=270){
          self.count=40;
          } 
    }
    if(boom(self,game.plane)){
        if((self.damage-game.plane.defense)>0){
        game.plane.hp-=(self.damage-game.plane.defense);
          }
     }
     if(self.hp<0){
        var a=new burst();
        a.init(self);
        game.burst.push(a);
        game.score+=200;
        game.Enmy.splice(i,1);  
        odds(self);
    }
}
enmy_f2.prototype.rander=function(){
    game.ctx.drawImage(this.im,this.x,this.y,this.width,this.height);
}
//end
//
//
//
function enmy_f3(){//第三种敌人精英散射飞机
    this.x=0
    this.y=-50;
    this.count=0;
    this.yy=0;
    this.hp=50;
    this.damage=10;
    this.defense=5;
    this.speed=5;
    this.width=100;
    this.height=68;
}
enmy_f3.prototype.init=function(i,d){
    var self=this;
     self.x=i*50;
     self.yy=d*20
}
enmy_f3.prototype.update=function(i){
    var self=this;
    self.count++;
    if(self.count==40){
          self.count=0;
            var a1=new enmybullet2();
            var a2=new enmybullet2();
            var a3=new enmybullet2();
            a1.init(self,1);
            a2.init(self,2);
            a3.init(self,3);
            game.Enmybullet.push(a1);
            game.Enmybullet.push(a2);
            game.Enmybullet.push(a3);
        }
     self.y+=self.speed;
     if(self.y>=self.yy){
        self.y=self.yy;
     }
     if(boom(self,game.plane)){
        if((self.damage-game.plane.defense)>0){
        game.plane.hp-=(self.damage-game.plane.defense);
          }
     }
     if(self.hp<0){
        var a=new burst();
        a.init(self)
        game.burst.push(a);
        game.score+=500;
        game.Enmy.splice(i,1);
        odds(self);
    }
}
enmy_f3.prototype.rander=function(){
    game.ctx.drawImage(game.R.enmy_f10,this.x,this.y,this.width,this.height);
}



//end
function enmy_f4(){     //第四种敌人激光飞机
    this.x=0;
    this.y=-20;
    this.hp=10;
    this.damage=20;
    this.defense=5;
    this.speed=4;
    this.width=57;
    this.height=64;
    this.count=43;
}
enmy_f4.prototype.init=function(i){
     this.x=i*50;
}
enmy_f4.prototype.update=function(i){
    var self=this;
     self.y+=self.speed; 
     self.count++;
     if(self.count>=30){
        var a=new enmybullet3();
        a.init(self);
        game.Enmybullet.push(a);
        self.count=0;
     }
     if(boom(self,game.plane)){
        if((self.damage-game.plane.defense)>0){
        game.plane.hp-=(self.damage-game.plane.defense);
          }
     }
    if(self.hp<0){
        var a=new burst();
        a.init(self)
        game.burst.push(a);
        game.score+=300;
        game.Enmy.splice(i,1);
        odds(self);
    }   
}
enmy_f4.prototype.rander=function(){
game.ctx.drawImage(game.R.enmy_f8,this.x,this.y,this.width,this.height);
}
//end
//
//
//
//
function enmy_f5(){//第五种敌人横向圆环飞机
    this.x=-50;
    this.y=0;
    this.hp=150;
    this.damage=20;
    this.defense=5;
    this.speed=1;
    this.width=57;
    this.height=64;
    this.count=0;
}
enmy_f5.prototype.init=function(i){//参数i规定y坐标
   this.y=i*50;
}
enmy_f5.prototype.update=function(i){
   var self=this;
   self.x+=self.speed; 
   self.count++;
   if(self.count>=50){
    var a1=new enmybullet4();
    var a2=new enmybullet4();
    var a3=new enmybullet4();
    var a4=new enmybullet4();
    var a5=new enmybullet4();
    var a6=new enmybullet4();
    var a7=new enmybullet4();
    var a8=new enmybullet4();
    a1.init(self,1);
    a2.init(self,2);
    a3.init(self,3);
    a4.init(self,4);
    a5.init(self,5);
    a6.init(self,6);
    a7.init(self,7);
    a8.init(self,8);
    game.Enmybullet.push(a1);
    game.Enmybullet.push(a2);
    game.Enmybullet.push(a3);
    game.Enmybullet.push(a4);
    game.Enmybullet.push(a5);
    game.Enmybullet.push(a6);
    game.Enmybullet.push(a7);
    game.Enmybullet.push(a8);
    self.count=0;
   }
   if(boom(self,game.plane)){
        if((self.damage-game.plane.defense)>0){
        game.plane.hp-=(self.damage-game.plane.defense);
          }
     }
   if(self.hp<0){
        var a=new burst();
        a.init(self);
        game.burst.push(a);
        game.score+=500;
        game.Enmy.splice(i,1);
        odds(self);
    } 
    if(self.x>600){
        game.Enmy.splice(i,1);
    }  
}
enmy_f5.prototype.rander=function(){
game.ctx.drawImage(game.R.enmy_f5,this.x,this.y,this.width,this.height)
}

//end
//
//
//
//
function enmy_f6(){ //第六种敌人爆炸飞机
    this.x=0;
    this.y=0;
    this.hp=10;
    this.damage=20;
    this.defense=5;
    this.speed=2;
    this.width=57;
    this.height=64;
   
}
enmy_f6.prototype.init=function(i){
    this.x=i*50;
}
enmy_f6.prototype.update=function(i){
    var self=this;
    self.y+=self.speed;
    if(boom(self,game.plane)){
        if((self.damage-game.plane.defense)>0){
        game.plane.hp-=(self.damage-game.plane.defense);
          }
     }
    if(self.hp<0){
        var a=new burst();
        a.init(self);
        game.burst.push(a);
        game.Enmy.splice(i,1);
        game.score+=100;
        var a1=new enmybullet4();
        var a2=new enmybullet4();
        var a3=new enmybullet4();
        var a4=new enmybullet4();
        var a5=new enmybullet4();
        var a6=new enmybullet4();
        var a7=new enmybullet4();
        var a8=new enmybullet4();
        a1.init(self,1);
        a2.init(self,2);
        a3.init(self,3);
        a4.init(self,4);
        a5.init(self,5);
        a6.init(self,6);
        a7.init(self,7);
        a8.init(self,8);
        game.Enmybullet.push(a1);
        game.Enmybullet.push(a2);
        game.Enmybullet.push(a3);
        game.Enmybullet.push(a4);
        game.Enmybullet.push(a5);
        game.Enmybullet.push(a6);
        game.Enmybullet.push(a7);
        game.Enmybullet.push(a8);
        odds(self);
    } 
}
enmy_f6.prototype.rander=function(){
    game.ctx.drawImage(game.R.enmy_f11,this.x,this.y,this.width,this.height);
}
//end
//
//
//
 function enmy_f7(){//第七种敌人双子弹精英飞机
    this.x=0;
    this.y=-20;
    this.hp=30;
    this.damage=20;
    this.defense=5;
    this.speed=3;
    this.width=57;
    this.height=64;
    this.count=0;
}
enmy_f7.prototype.init=function(i){
       this.x=i*50;
}
enmy_f7.prototype.update=function(i){
    var self=this;
    self.count++;
    self.y+=self.speed;
    if(self.count>40){
        var a1=new enmybullet1();
        var a2=new enmybullet1();
        a1.init(self,1);
        a2.init(self,2);
        game.Enmybullet.push(a1);
        game.Enmybullet.push(a2);
        self.count=0;
      }
      if(boom(self,game.plane)){
        if((self.damage-game.plane.defense)>0){
        game.plane.hp-=(self.damage-game.plane.defense);
          }
     }
      if(self.hp<0){
        var a=new burst();
        a.init(self);
        game.burst.push(a);
        game.score+=200;
        game.Enmy.splice(i,1);
        odds(self);
    }   
}
enmy_f7.prototype.rander=function(){
    game.ctx.drawImage(game.R.enmy_f12,this.x,this.y,this.width,this.height);
}
//
//
//
//end
function boss1(){//第一关boss
    this.x=0;
    this.y=0;
    this.hp=4000;
    this.damage=20;
    this.defense=5;
    this.speed=2;
    this.width=100;
    this.height=85;
    this.count=0;
    this.time=0;
    this.cd1=0;
    this.cd2=0;
    this.down=1;
    this.top=0;
    this.left=0;
    this.right=1;
}
boss1.prototype.init=function(i){
   this.x=i*50;
}
boss1.prototype.update=function(i){
      var self=this;
        self.count++;
        self.time++;
        if(self.count>30){
        var a1=new enmybullet1();
        var a2=new enmybullet2();
        a1.init(self,1);
        a2.init(self,2);
        game.Enmybullet.push(a1);
        game.Enmybullet.push(a2);
        self.count=0;
        }
        if(self.time>300&&self.time<460){
            self.cd1++;
            if(self.cd1>10){
                var b1=new bossbullet1();
                var b2=new bossbullet1();
                b1.init(self,1);
                b2.init(self,2);
                game.Enmybullet.push(b1);
                game.Enmybullet.push(b2);
                self.cd1=0;
            }
        }
        if(self.time>500&&self.time<700){
            self.cd2++;
            if(self.cd2>10){
                var c1=new bossbullet2();
                var c2=new bossbullet2();
                var c3=new bossbullet2();
                var c4=new bossbullet2();
                var c5=new bossbullet2();
                var c6=new bossbullet2();
                var c7=new bossbullet2();
                var c8=new bossbullet2();
             c1.init(self,1);
             c2.init(self,2);
             c3.init(self,3);
             c4.init(self,4);
             c5.init(self,5);
             c6.init(self,6);
             c7.init(self,7);
             c8.init(self,8);
        game.Enmybullet.push(c1);
        game.Enmybullet.push(c2);
        game.Enmybullet.push(c3);
        game.Enmybullet.push(c4);
        game.Enmybullet.push(c5);
        game.Enmybullet.push(c6);
        game.Enmybullet.push(c7);
        game.Enmybullet.push(c8);
              self.cd2=0;
            }
        }
        if(self.time>700){
            self.time=0;
        }
       bosspath(self);
       if(boom(self,game.plane)){
        if((self.damage-game.plane.defense)>0){
        game.plane.hp-=(self.damage-game.plane.defense);
          }
     }
       if(self.hp<0){
        var a=new burst();
        a.init(self);
        game.burst.push(a);
        game.bossboom.load();
        game.bossboom.play();
        game.score+=5000;
        game.Enmy.splice(i,1);
        odds(self);
        game.passes=true;
    }   
}
boss1.prototype.rander=function(){
    game.ctx.drawImage(game.R.boss1,this.x,this.y,this.width,this.height);
}
function boss3(){
    this.x=0;
    this.y=0;
    this.hp=10000;
    this.damage=20;
    this.defense=5;
    this.speed=2;
    this.width=200;
    this.height=200;
     this.left=0;
    this.right=1;
    this.down=1;
    this.top=0;
    this.cd1=0;
    this.cd2=0;
    this.count=0;//普通攻击
    this.btime=0;//特殊攻击
}
boss3.prototype.init=function(i){
    this.x=i*50;
}
boss3.prototype.update=function(i){
    var self=this;
    self.count++;
    self.btime++;
    if(self.count>30){
        var a1=new boss2bullet1();
        var a2=new boss2bullet1();
        var a3=new boss2bullet1();
        var a4=new boss2bullet1();
        a1.init(self,1);
        a2.init(self,2);
        a3.init(self,3);
        a4.init(self,4);
        game.Enmybullet.push(a1);
        game.Enmybullet.push(a2);
        game.Enmybullet.push(a3);
        game.Enmybullet.push(a4);
        self.count=0;
    }
    if(self.btime>100&&self.btime<300){
         self.cd1++;
         if(self.cd1>=20){
            var b1=new boss2bullet2();
            var b2=new boss2bullet2();
            var b3=new boss2bullet2();
            var b4=new boss2bullet2();
            var b5=new boss2bullet2();
            var b6=new boss2bullet2();
            b1.init(self,1);
            b2.init(self,2);
            b3.init(self,3);
            b4.init(self,4);
            b5.init(self,5);
            b6.init(self,6);
            game.Enmybullet.push(b1);
            game.Enmybullet.push(b2);
            game.Enmybullet.push(b3);
            game.Enmybullet.push(b4);
            game.Enmybullet.push(b5);
            game.Enmybullet.push(b6);
            self.cd1=0;
         }
    }
    if(self.btime>500&&self.btime<750){
        self.cd2++;
        if(self.cd2>20){
            var d1= new enmy_f1();
            var d2= new enmy_f1();
            d1.init(_.random(0,7));
            d2.init(_.random(0,7));
            game.Enmy.push(d1);
            game.Enmy.push(d2);
            self.cd2=0;
        }
    }
    if(self.btime==1000){
        var c=new boss2bullet3();
        c.init(self);
        game.Enmybullet.push(c);
        self.btime=0;
    }
    if(boom(self,game.plane)){
        if((self.damage-game.plane.defense)>0){
        game.plane.hp-=(self.damage-game.plane.defense);
          }
     }
    if(self.hp<0){
        var a=new burst();
        a.init(self);
        game.burst.push(a);
        game.bossboom.load();
        game.bossboom.play();
        game.score+=200;
        game.Enmy.splice(i,1);
        odds(self);
        game.score+=10000;
        game.victory=true;
    }   
    bosspath(self);
}
boss3.prototype.rander=function(){
game.ctx.drawImage(game.R.boss2,this.x,this.y,this.width,this.height);
}





























