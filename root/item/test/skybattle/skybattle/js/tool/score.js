function score(i){
var a=[];
var j=1;
while(i%Math.pow(10,j)!=i){
    j++;
}
var x=j;
for(var z=0;z<x;z++){
    if(z==0){
        a[z]=parseInt(i/Math.pow(10,j-1));
    }
    else{
        a[z]=parseInt((i%Math.pow(10,j))/Math.pow(10,j-1));
    }
          j--;
}
      return a;
}
function rander(x,y,i,c){
    if(c==1){
        for(var b=0;b<score(i).length;b++){
        game.ctx.drawImage(game.R.number,score(i)[b]*19,0,19,26,x+b*15,y,9,13);
    }
    }
    else if(c==2){
    for(var b=0;b<score(i).length;b++){
        game.ctx.drawImage(game.R.number,score(i)[b]*19,0,19,26,x+b*25,y,19,26);
    }
}
    else if(c==3){
        for(var b=0;b<score(i).length;b++){
        game.dtx.drawImage(game.R.number,score(i)[b]*19,0,19,26,x+b*15,y,9,13);
    }
    }
    else if(c==4){
    for(var b=0;b<score(i).length;b++){
        game.dtx.drawImage(game.R.number,score(i)[b]*19,0,19,26,x+b*25,y,19,26);
    }
    }
}