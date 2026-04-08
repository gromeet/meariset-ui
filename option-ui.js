/**
 * 메아리셋 상세페이지 긴급 안전모드
 * product_no=27 전용
 * 광고 라이브 중 결제/상세 노출 안정성 우선
 */
(function(){
  var MRS_VERSION = 138; /* 긴급 안전모드: 이미지 배너 복구 + NPay/native 유지 */
  if(window._mrsEmergencyHotfixLoaded && window._mrsEmergencyHotfixVersion >= MRS_VERSION) return;
  window._mrsEmergencyHotfixLoaded = true;
  window._mrsEmergencyHotfixVersion = MRS_VERSION;

  var prdEl = document.querySelector('[data-prd-no]');
  var prdNo = prdEl ? prdEl.getAttribute('data-prd-no') : '';
  var urlHas27 = location.search.indexOf('product_no=27') !== -1 || location.href.indexOf('product_no=27') !== -1;
  if(!urlHas27 && prdNo !== '27') return;

  function cleanupCustomUI(){
    var oldWrap = document.getElementById('mrsOptionWrap');
    if(oldWrap){
      var npayInWrap = oldWrap.querySelector('#NaverChk_Button');
      var appPay = document.querySelector('.app-pay-wrap');
      if(npayInWrap && appPay && !appPay.contains(npayInWrap)) {
        appPay.insertBefore(npayInWrap, appPay.firstChild);
      }
    }
    var ids = ['mrsOptionWrap','mrsStyles','mrsMobileBar','mrsCouponBanner','mrsTagline','mrsUnitGuide','mrsSafeBanner'];
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

  function ensureVisualBanner(){
    var existing = document.getElementById('mrsSafeBanner');
    if(existing) existing.remove();
    var anchor = document.querySelector('.summary-info') || document.querySelector('.infoArea');
    if(!anchor || !anchor.parentNode) return;
    var style = document.getElementById('mrsSafeBannerStyle');
    if(!style){
      style = document.createElement('style');
      style.id = 'mrsSafeBannerStyle';
      style.textContent = '.mrs-safe-banner{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0 14px}.mrs-safe-card{border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 0 0 1px #e8e8e8}.mrs-safe-card img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover;background:#f5f3ef}.mrs-safe-card__label{padding:8px 4px 10px;font-size:13px;line-height:1.35;font-weight:700;color:#1a1a1a;text-align:center;font-family:"Malgun Gothic","맑은 고딕",sans-serif}@media(max-width:767px){.mrs-safe-banner{gap:6px;margin:10px 0 12px}.mrs-safe-card__label{font-size:12px;padding:6px 2px 8px}}';
      document.head.appendChild(style);
    }
    var box = document.createElement('div');
    box.id = 'mrsSafeBanner';
    box.className = 'mrs-safe-banner';
    box.innerHTML = ''+
      '<div class="mrs-safe-card"><img src="https://hyunvis.vercel.app/meariset/s1_banner.jpg" alt="90일 플래너"><div class="mrs-safe-card__label">90일 플래너</div></div>'+
      '<div class="mrs-safe-card"><img src="https://hyunvis.vercel.app/meariset/s2_banner.jpg" alt="180일 플래너"><div class="mrs-safe-card__label">180일 플래너</div></div>'+
      '<div class="mrs-safe-card"><img src="https://hyunvis.vercel.app/meariset/s3_banner.jpg" alt="270일 플래너"><div class="mrs-safe-card__label">270일 플래너</div></div>'+
      '<div class="mrs-safe-card"><img src="https://hyunvis.vercel.app/meariset/s4_banner.jpg" alt="360일 플래너"><div class="mrs-safe-card__label">360일 플래너</div></div>';
    anchor.parentNode.insertBefore(box, anchor.nextSibling);
  }

  function ensureUnitPriceGuide(){
    var existing = document.getElementById('mrsUnitGuide');
    if(existing) existing.remove();
    var anchor = document.querySelector('.summary-info') || document.querySelector('.infoArea');
    if(!anchor || !anchor.parentNode) return;
    var style = document.getElementById('mrsUnitGuideStyle');
    if(!style){
      style = document.createElement('style');
      style.id = 'mrsUnitGuideStyle';
      style.textContent = '.mrs-unit-guide{margin:10px 0 12px;padding:12px 14px;background:#FAFAF8;border:1px solid #eee;border-radius:10px;font-family:"Malgun Gothic","맑은 고딕",sans-serif}.mrs-unit-guide__row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:6px 0;font-size:14px;line-height:1.4}.mrs-unit-guide__row + .mrs-unit-guide__row{border-top:1px solid #f0f0f0}.mrs-unit-guide__left{font-weight:700;color:#1a1a1a}.mrs-unit-guide__right{color:#DF002E;font-weight:700}.mrs-unit-guide__sub{font-size:12px;color:#777;font-weight:400;margin-left:6px}';
      document.head.appendChild(style);
    }
    var box = document.createElement('div');
    box.id = 'mrsUnitGuide';
    box.className = 'mrs-unit-guide';
    box.innerHTML = ''+
      '<div class="mrs-unit-guide__row"><span class="mrs-unit-guide__left">1권 (90일)<span class="mrs-unit-guide__sub">권당</span></span><span class="mrs-unit-guide__right">29,000원</span></div>'+
      '<div class="mrs-unit-guide__row"><span class="mrs-unit-guide__left">2권 (180일)<span class="mrs-unit-guide__sub">권당</span></span><span class="mrs-unit-guide__right">24,500원</span></div>'+
      '<div class="mrs-unit-guide__row"><span class="mrs-unit-guide__left">3권 (270일)<span class="mrs-unit-guide__sub">권당</span></span><span class="mrs-unit-guide__right">23,000원</span></div>'+
      '<div class="mrs-unit-guide__row"><span class="mrs-unit-guide__left">4권 (360일)<span class="mrs-unit-guide__sub">권당</span></span><span class="mrs-unit-guide__right">22,250원</span></div>';
    anchor.parentNode.insertBefore(box, anchor.nextSibling);
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
    ensureVisualBanner();
    ensureUnitPriceGuide();
    forceDetailImages();
    setTimeout(function(){ cleanupCustomUI(); ensureNativePayVisible(); ensureVisualBanner(); ensureUnitPriceGuide(); forceDetailImages(); }, 300);
    setTimeout(function(){ cleanupCustomUI(); ensureNativePayVisible(); ensureVisualBanner(); ensureUnitPriceGuide(); forceDetailImages(); }, 1200);
    setTimeout(function(){ cleanupCustomUI(); ensureNativePayVisible(); ensureVisualBanner(); ensureUnitPriceGuide(); forceDetailImages(); }, 3000);
    window.addEventListener('pageshow', function(){ cleanupCustomUI(); ensureNativePayVisible(); ensureVisualBanner(); ensureUnitPriceGuide(); forceDetailImages(); });
    document.addEventListener('visibilitychange', function(){ if(!document.hidden){ cleanupCustomUI(); ensureNativePayVisible(); ensureVisualBanner(); ensureUnitPriceGuide(); forceDetailImages(); } });
    window.addEventListener('resize', function(){ ensureVisualBanner(); forceDetailImages(); }, {passive:true});
    window.addEventListener('orientationchange', function(){ ensureVisualBanner(); forceDetailImages(); }, {passive:true});
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
