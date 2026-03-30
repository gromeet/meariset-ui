(function(){
  if(window.innerWidth<768||window._npayMoved)return;
  window._npayMoved=true;
  var t=0;
  function m(){
    var n=document.getElementById('NaverChk_Button');
    if(!n||n.offsetHeight<10){if(t++<20){setTimeout(m,1000);}return;}
    var i=document.getElementById('mrsInfo');
    if(!i){var w=document.getElementById('mrsOptionWrap');if(w)i=w;}
    if(i&&i.parentNode){
      i.parentNode.insertBefore(n,i.nextSibling);
      n.style.cssText='display:block!important;visibility:visible!important;margin:12px auto 0;max-width:500px;';
    }
  }
  setTimeout(m,3000);
})();
