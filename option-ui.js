/**
 * 메아리셋 상세페이지 긴급 안전모드
 * product_no=27 전용
 * 광고 라이브 중 결제/상세 노출 안정성 우선
 */
(function(){
  var MRS_VERSION = 136; /* 긴급 안전모드: native UI 유지 + 상세이미지 강제 로드 */
  if(window._mrsEmergencyHotfixLoaded && window._mrsEmergencyHotfixVersion >= MRS_VERSION) return;
  window._mrsEmergencyHotfixLoaded = true;
  window._mrsEmergencyHotfixVersion = MRS_VERSION;

  var prdEl = document.querySelector('[data-prd-no]');
  var prdNo = prdEl ? prdEl.getAttribute('data-prd-no') : '';
  var urlHas27 = location.search.indexOf('product_no=27') !== -1 || location.href.indexOf('product_no=27') !== -1;
  if(!urlHas27 && prdNo !== '27') return;

  function cleanupCustomUI(){
    var ids = ['mrsOptionWrap','mrsStyles','mrsMobileBar','mrsCouponBanner','mrsTagline'];
    for(var i=0;i<ids.length;i++){
      var el = document.getElementById(ids[i]);
      if(el) el.remove();
    }
    document.documentElement.classList.remove('mrs-ui-ready');
    window._mrsOptionLoaded = false;
    window._mrsVersion = 0;
  }

  function ensureNativePayVisible(){
    var appPay = document.querySelector('.app-pay-wrap');
    if(appPay){
      appPay.style.removeProperty('display');
      appPay.style.removeProperty('visibility');
      appPay.style.removeProperty('min-height');
    }
    var npay = document.getElementById('NaverChk_Button');
    if(npay){
      npay.style.removeProperty('display');
      npay.style.removeProperty('visibility');
      npay.style.removeProperty('min-height');
      npay.style.removeProperty('opacity');
    }
  }

  function forceDetailImages(){
    var root = document.getElementById('prdDetail') || document.querySelector('.xans-product-additional .additional-inner');
    if(!root) return;
    var imgs = root.querySelectorAll('img[ec-data-src], img[data-src]');
    for(var i=0;i<imgs.length;i++){
      var img = imgs[i];
      var src = img.getAttribute('src') || '';
      var lazy = img.getAttribute('ec-data-src') || img.getAttribute('data-src') || '';
      if((!src || src === '#' || src === window.location.href) && lazy){
        if(lazy.indexOf('//') === 0) lazy = location.protocol + lazy;
        img.setAttribute('src', lazy);
      }
      img.style.setProperty('visibility','visible','important');
      img.style.setProperty('height','auto','important');
      img.style.setProperty('display','block','important');
      img.loading = 'eager';
      img.decoding = 'async';
    }
  }

  function boot(){
    cleanupCustomUI();
    ensureNativePayVisible();
    forceDetailImages();
    setTimeout(function(){ cleanupCustomUI(); ensureNativePayVisible(); forceDetailImages(); }, 300);
    setTimeout(function(){ cleanupCustomUI(); ensureNativePayVisible(); forceDetailImages(); }, 1200);
    setTimeout(function(){ cleanupCustomUI(); ensureNativePayVisible(); forceDetailImages(); }, 3000);
    window.addEventListener('pageshow', function(){ cleanupCustomUI(); ensureNativePayVisible(); forceDetailImages(); });
    document.addEventListener('visibilitychange', function(){ if(!document.hidden){ cleanupCustomUI(); ensureNativePayVisible(); forceDetailImages(); } });
    window.addEventListener('resize', forceDetailImages, {passive:true});
    window.addEventListener('orientationchange', forceDetailImages, {passive:true});
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
