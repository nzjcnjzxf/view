function boom(a,b){
    if((Math.abs((a.x+a.width/2)-(b.x+b.width/2))<a.width/2+b.width/2)&&
   (Math.abs((a.y+a.height/2)-(b.y+b.height/2))<a.height/2+b.height/2-10)){
    return true;
            }
}