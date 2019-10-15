function trace(a,b){//飞机追踪 在定时器中调用
    if(a.x!=b.x){
    if(a.x>b.x)
        a.x--;
    if(a.x<b.x)
        a.x++;
    }
}                                 
function separate(a,i){//敌机散射子弹的路径
if(i==1){
    a.x-=6;
    a.y+=6;
}
if(i==2){
    a.y+=6;
}
if(i==3){
    a.x+=6;
    a.y+=6;
}
}
function cicle(a,i){//圆环子弹
if(i==1){
    a.x-=6;
    a.y+=6;
   }
if(i==2){
    a.y+=6;
        }
if(i==3){
    a.x+=6;
    a.y+=6;
    }
if(i==4){
    a.x-=6;
    a.y-=6;
    }
if(i==5){
    a.y-=6;
    }
if(i==6){
    a.x+=6;
    a.y-=6;
    }
if(i==7){
    a.x+=6;
}
if(i==8){
    a.x-=6;
}
}
function every(a,b){
    var x=Math.abs(a.x-b.x);
    var y=Math.abs(a.y-b.y);
    var sum=Math.sqrt(x*x+y*y);
    if(a.x>b.x&&a.y>b.y){
       var ss={
        "x":x/sum,
        "y":y/sum,
        "j":1
       }
        return ss;
    }
    if(a.x<b.x&&a.y>b.y){
         var ss={
        "x":x/sum,
        "y":y/sum,
        "j":2
       }
        return ss;
    }
    if(a.x>b.x&&a.y<b.y){
        var ss= {
        "x":x/sum,
        "y":y/sum,
        "j":3
       }
        return ss;
    }
    if(a.x<b.x&&a.y<b.y){
        var ss={
        "x":x/sum,
        "y":y/sum,
        "j":4
       }
      return ss;
    }
}
function everypath(a,x,y,j){
    var xx=6*x;
    var yy=6*y;
    if(j==1){
      a.x-=xx;
      a.y-=yy;
    }
    if(j==2){
        a.x+=xx;
        a.y-=yy;
    }
    if(j==3){
     a.x-=xx;
     a.y+=yy;
    }
    if(j==4){
        a.x+=xx;
        a.y+=yy;
    }
}
function bosspath(a){
  if(a.top==1){
     a.y--;
  }
  if(a.down==1){
    a.y++;
  }
if(a.left==1){
    a.x--;
}
if(a.right==1){
    a.x++;
}
if(a.x>=300){
    a.left=1;
    a.right=0;
}
if(a.x<=0){
    a.left=0;
    a.right=1;
}
if(a.y>=100){
    a.top=1;
    a.down=0;
}
if(a.y<=0){
    a.top=0;
    a.down=1;
}
}

