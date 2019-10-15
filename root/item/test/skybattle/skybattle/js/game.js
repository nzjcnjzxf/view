 var game=function (){
    this.R={};
    this.backmusic=document.getElementById("back1");
    this.boommusic=document.getElementById("boom");
    this.bossboom=document.getElementById("bossboom");
    this.boombiu=document.getElementById("boombiu");
    this.biubiubiu=document.getElementById("biubiubiu");
    this.biu=document.getElementById("biu");
    this.c=document.getElementById("ID");
    this.ctx=this.c.getContext("2d");
    this.d=document.getElementById("ID1");
    this.dtx=this.d.getContext("2d");
    this.background=new background();
    this.plane=new plane();
    this.Actor=[];
    this.myplane=[];
    this.mybullet=[];
    this.Enmy=[];
    this.Enmybullet=[];
    this.Prop=[];
    this.burst=[];
    this.bigbullet=[];
    this.bulletfeel=[];
    this.gametime=0;
    this.score=0;
    this.bestscore=0;
    this.fail=false;
    this.passes=false;
    this.passescount=0;
    this.die=false;
    this.newlifecount=0;
    this.chapter=0;
    this.victory=false;
    this.load();
}
game.prototype.load=function(){
    var count=0;
    var self=this;
    for(var i in images){
        this.R[i]=new Image();
        this.R[i].src=images[i];
        this.R[i].onload=function(){
               count++;
               if(count==53){
                self.ctx.drawImage(self.R.startback,0,0);
                buttons(self.R.door,170,350,70,70,self.d,self.dtx,function(){
                  game.d.height=game.d.height;
                  self.start();
                });
         }
        }
    } 
}
game.prototype.start=function(){
  

    var self=this;
    self.backmusic.load();
    self.backmusic.play();
    self.myplane.push(self.plane);
    self.Actor.push(self.background);
    var s1=setInterval(function(){
         self.gametime++;
         self.bulletcount++;
         if(self.chapter==0){
          map1();
        }
        else if(self.chapter==1)
        {
          map2();
        }
        self.c.height=self.c.height;    
        if(self.die==true){
          self.newlifecount++;
          if(self.newlifecount==70){
            game.plane.rest();
            self.newlifecount=0;
            self.die=false;
          }
        }
           for (var g in self.Actor){
            self.Actor[g].rander();
            self.Actor[g].update(g);
          }
          if(self.gametime<70&&self.chapter==0){
          self.ctx.drawImage(game.R.firstlevel,110,170);
          }
          if(self.gametime<70&&self.chapter==1){
          self.ctx.drawImage(game.R.secendlevel,110,170);
           }
          for (var h in self.myplane){
            self.myplane[h].rander();
            self.myplane[h].update(h);
          }
          for(var i in self.mybullet){
              self.mybullet[i].rander();
             self.mybullet[i].update(i);
          }
          for(var j in self.Enmy){
            self.Enmy[j].rander();
             self.Enmy[j].update(j);
          }
          for(var k in self.Enmybullet){
            self.Enmybullet[k].rander();
            self.Enmybullet[k].update(k);
          }
          for(var l  in self.burst){
            self.burst[l].update(l);
            self.burst[l].rander();
          }
          for(var m in self.Prop){
            self.Prop[m].rander();
            self.Prop[m].update(m);
          }
          for(var n in self.bigbullet){
            self.bigbullet[n].rander();
            self.bigbullet[n].update(n);
          }
          for(var o in self.bulletfeel){
            self.bulletfeel[o].rander();
            self.bulletfeel[o].update(o);
          }
          //得分计数
          //
          //
          game.ctx.drawImage(game.R.score,10,30,43,11);
           rander(70,30,game.score,1);
          game.ctx.drawImage(game.R.bigcount,0,450,50,50);
          rander(70,460,game.plane.bigbulletcount,2);
          game.ctx.drawImage(game.R.lifecount,0,500,50,50);
          rander(70,510,game.plane.life,2);
          if(self.passes==true){
            self.passescount++;
            if(self.passescount==50){
                self.pass();
                self.passescount=0;
              clearInterval(s1);
            }
          }
          if(self.fail==true){
            self.passescount++;
            if(self.passescount==50){
                  self.over();
                  self.passescount=0;
                  clearInterval(s1);
                }
           }
           if(self.victory==true){
             self.passescount++;
            if(self.passescount==50){
                self.victorys();
                self.passescount=0;
              clearInterval(s1);
            }   
           }
    },30);
}
game.prototype.over=function(){
  game.d.height=game.d.height;
  game.dtx.drawImage(game.R.gameover,120,80,179,30);
  game.dtx.drawImage(game.R.overp,120,130,180,250);
  game.dtx.drawImage(game.R.newscore,130,160,75,22.5);
  rander(220,165,game.score,3);
  game.dtx.drawImage(game.R.bestscore,130,230,75,22.5);
  buttons(game.R.submit,280,400,43,43,this.d,this.dtx,function(){
    //提交分数
    // 
    game.d.height=game.d.height;
    game.dtx.drawImage(game.R.overp,100,100,200,300);
    game.dtx.font="20px Georgia";
    game.dtx.fillStyle="White";
    game.dtx.fillText("排行榜", 170, 90, 50);
    game.dtx.font="10px Georgia";
    buttons(game.R.rest,170,400,50,50,game.d,game.dtx,function(){
    //重新开始
    game.d.height=game.d.height;
    game.rest();
    self.victory=false;
  });
    window.h5api.submitScore(game.score,function (obj){
    console.log('代码:' + obj.code + ',消息:' + obj.message + ',数据:' + obj.data);
    if(obj.code === 10000){
        console.log('上传成功');
    } else {
        console.log('上传失败');
    }
});
    window.h5api.getRank(function(obj){
    console.log('代码:' + obj.code + ',消息:' + obj.message + ',数据:' + obj.data)
    if(obj.code === 10000){
        console.log('获取成功')
        var data = obj.data;
        for(var i = 0; i < 10; i++){
            game.dtx.fillText("积分："+data[i].score+"   "+'排名:'+data[i].rank, 140, 150+i*20,200);
        }
    } else{
        console.log('获取失败')
    }
});
  });
  buttons(game.R.rest,100,400,43,43,this.d,this.dtx,function(){
    //重新开始
    //
    game.d.height=game.d.height;
    game.rest();
  });
}
game.prototype.rest=function(){
  game.gametime=0;
  game.Actor.length=0;
  game.myplane.length=0;
  game.mybullet.length=0;
  game.Enmy.length=0;
  game.Enmybullet.length=0;
  game.Prop.length=0;
  game.burst.length=0;
  game.bigbullet.length=0;
  game.chapter=0;
  game.score=0;
  game.fail=false;
  game.plane.life=3;
  game.start();
}
game.prototype.pass=function(){
  game.dtx.drawImage(game.R.pass,130,40,150,80);
  game.dtx.drawImage(game.R.overp,120,130,180,250);
  game.dtx.drawImage(game.R.passscore,140,190,50,24);
  rander(220,195,game.score,3);
  buttons(game.R.nexts,190,320,43,43,this.d,this.dtx,function(){
    game.d.height=game.d.height;
    //下一关
    game.next();
  });
}
game.prototype.next=function(){
    game.gametime=0;
    game.Actor.length=0;
    game.myplane.length=0;
    game.mybullet.length=0;
    game.Enmy.length=0;
    game.Enmybullet.length=0;
    game.Prop.length=0;
    game.burst.length=0;
    game.bigbullet.length=0;
    game.chapter++;
    game.passes=false;
    game.start();       
}
game.prototype.victorys=function(){
  game.dtx.drawImage(game.R.victory,40,40,322,84);
  game.dtx.drawImage(game.R.victoryplane,60,150,300,150);
  game.dtx.drawImage(game.R.passscore,90,220,50,24);
  rander(150,220,game.score,4);
  buttons(game.R.submit,270,350,50,50,this.d,this.dtx,function(){
    //提交分数
    game.d.height=game.d.height;
    game.dtx.drawImage(game.R.overp,100,100,200,300);
    game.dtx.font="20px Georgia";
    game.dtx.fillStyle="White";
    game.dtx.fillText("排行榜", 170, 90, 50);
    game.dtx.font="10px Georgia";
     buttons(game.R.rest,170,400,50,50,game.d,game.dtx,function(){
    //重新开始
    game.d.height=game.d.height;
    game.rest();
    self.victory=false;
  }); 
    window.h5api.submitScore(game.score,function (obj){
    console.log('代码:' + obj.code + ',消息:' + obj.message + ',数据:' + obj.data);
    if(obj.code === 10000){
        console.log('上传成功')
    } else {
        console.log('上传失败')
    }
});
    window.h5api.getRank(function(obj){
    console.log('代码:' + obj.code + ',消息:' + obj.message + ',数据:' + obj.data)
    if(obj.code === 10000){
        console.log('获取成功')
        var data = obj.data;
        for(var i = 0; i < 10; i++){
            game.dtx.fillText("积分："+data[i].score+"   "+'排名:'+data[i].rank, 140, 150+i*20,200);
        }
    } else{
        console.log('获取失败')
    }
});
  });
  buttons(game.R.rest,100,350,50,50,this.d,this.dtx,function(){
    //重新开始
    game.d.height=game.d.height;
    game.rest();
    self.victory=false;
  });
}
