function buttons(image,x,y,w,h,c,ctx,event){
    var M=0;
    ctx.drawImage(image,x,y,w,h);
    c.addEventListener("mousemove", function(evt){
        M=getMousePos(c,evt);
    }, false);
    var ss=function(){
     if((M.x>=x&&M.x<=x+w)&&(M.y>=y&&M.y<=y+h)){
                event();
        c.removeEventListener("click", ss, false);
    }
    }
    c.addEventListener("click", ss, false);
}
function getMousePos (c, evt){
            var rect = c.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }