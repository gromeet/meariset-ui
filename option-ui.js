/**
 * 메아리셋 옵션 UI v7.9 — 외부 스크립트 버전
 * product_no=27 전용 (다른 상품에서는 실행 안 됨)
 * v8.0: 모바일 4열 단일행 + NaverPay MutationObserver 방어
 */
(function(){
  var MRS_VERSION = 98; /* 버전 번호 (9.8 = 98) — SEO URL 대응 강화 + 옵션 UI 재주입 안전망 */
  var MRS_PRODUCT_BANNER_URL = 'https://meariset.kr/product/500%EA%B0%9C-%ED%95%9C%EC%A0%95-%EB%A9%94%EC%95%84%EB%A6%AC%EC%85%8B-%EB%85%B8%ED%8A%B8-season1-%EB%AA%A9%ED%91%9C-%EB%8B%AC%EC%84%B1-%EB%8F%99%EA%B8%B0%EB%B6%80%EC%97%AC-%EB%8B%A4%EC%9D%B4%EC%96%B4%EB%A6%AC/27/category/1/display/2/?icid=MAIN.product_listmain_1';
  var MRS_LOGIN_BANNER_URL = 'https://meariset.kr/member/login.html?noMemberOrder&returnUrl=%2Fmyshop%2Findex.html';

  /* 구버전이 먼저 로드된 경우 → 강제 교체 */
  if(window._mrsOptionLoaded && window._mrsVersion && window._mrsVersion >= MRS_VERSION) return;
  if(window._mrsOptionLoaded && (!window._mrsVersion || window._mrsVersion < MRS_VERSION)) {
    /* ⚠️ NaverPay가 wrap 안에 있으면 먼저 꺼내기 (remove()로 같이 삭제 방지) */
    var oldWrap = document.getElementById('mrsOptionWrap');
    if(oldWrap) {
      var npayInWrap = oldWrap.querySelector('#NaverChk_Button');
      if(npayInWrap) {
        var appPay = document.querySelector('.app-pay-wrap');
        if(appPay) {
          appPay.insertBefore(npayInWrap, appPay.firstChild);
        } else {
          /* fallback: productAction 영역에 복구 */
          var prodAction = document.querySelector('.productAction');
          if(prodAction) prodAction.appendChild(npayInWrap);
        }
      }
      oldWrap.remove();
    }
    var oldStyle = document.getElementById('mrsStyles');
    if(oldStyle) oldStyle.remove();
    var oldBar = document.getElementById('mrsMobileBar');
    if(oldBar) oldBar.remove();
    window._npayMoved = false;
  }
  window._mrsOptionLoaded = true;
  window._mrsVersion = MRS_VERSION;

  /* product_no=27 에서만 실행 (SEO URL 대응 강화) */
  var prdEl = document.querySelector('[data-prd-no]');
  var prdNo = prdEl ? prdEl.getAttribute('data-prd-no') : '';
  var urlHas27 = location.search.indexOf('product_no=27') !== -1 || location.href.indexOf('product_no=27') !== -1;
  var pathMatch27 = location.pathname.match(/\/product\/[^/]*\/(\d+)\//);
  var pathHas27 = !!(pathMatch27 && pathMatch27[1] === '27');
  if(!urlHas27 && !pathHas27 && prdNo !== '27'){ window._mrsOptionLoaded = false; return; }

  if(window.__mrsActiveMode && window.__mrsActiveMode !== 'live27') return;
  window.__mrsActiveMode = 'live27';

  /* placeholder 중복 방지 (같은 버전 재실행 시) */

  /* 즉시 placeholder 생성 — CDN 구버전이 중복 실행되는 것 방지 */
  var _placeholder = document.createElement('div');
  _placeholder.id = 'mrsOptionWrap';
  _placeholder.style.display = 'none';
  (document.body || document.documentElement).appendChild(_placeholder);

  /* ── df-bannermanager JS 강제 fix (CSS !important만으론 SSP inline style 못 막음) ── */
  function _isHeaderSmartBanner(el){
    if(!el) return false;
    if(el.closest && el.closest('.top-logo, [df-banner-code="logo"], .top-banner, [df-banner-code="top-banner"]')) return true;
    if(el.querySelector && el.querySelector('.top-logo__item, [df-banner-code="logo"] a, .top-banner__link, [df-banner-code="top-banner"] a')) return true;
    return false;
  }

  function _isLoggedOutState(){
    return !!document.querySelector('.xans-layout-statelogoff .membership__txt, .xans-layout-statelogoff .usm__link[href="/myshop/index.html"]');
  }

  function _getTopBannerUrl(){
    return _isLoggedOutState() ? MRS_LOGIN_BANNER_URL : MRS_PRODUCT_BANNER_URL;
  }

  function _restoreHeaderLogo(){
    var logoBoxes = document.querySelectorAll('.header__bottom .top-logo, .header__bottom [df-banner-code="logo"]');
    if(!logoBoxes.length) logoBoxes = document.querySelectorAll('.top-logo, [df-banner-code="logo"]');
    for(var i=0;i<logoBoxes.length;i++){
      var box = logoBoxes[i];
      box.hidden = false;
      box.style.setProperty('display','flex','important');
      box.style.setProperty('visibility','visible','important');
      box.style.setProperty('opacity','1','important');
      box.style.setProperty('pointer-events','auto','important');

      var links = box.querySelectorAll('a');
      var hasRealLogo = false;
      for(var j=0;j<links.length;j++){
        var href = links[j].getAttribute('href') || '';
        var html = (links[j].innerHTML || '').replace(/\s|&nbsp;/g, '');
        var hasVisual = !!links[j].querySelector('img,svg') || (!!html && html.indexOf('{#item}') === -1);
        if(href && href.indexOf('{#href}') === -1 && hasVisual){
          hasRealLogo = true;
          links[j].setAttribute('href','/');
          links[j].setAttribute('target','_self');
          links[j].style.setProperty('pointer-events','auto','important');
        }
      }

      var oldFallback = box.querySelector('.mrs-fallback-logo');
      if(hasRealLogo){
        if(oldFallback) oldFallback.remove();
      } else if(!oldFallback){
        var fallback = document.createElement('a');
        fallback.className = 'mrs-fallback-logo';
        fallback.href = '/';
        fallback.target = '_self';
        fallback.textContent = 'meariset';
        box.appendChild(fallback);
      }
    }
  }

  function _restoreTopBanner(){
    var banners = document.querySelectorAll('.top-banner, [df-banner-code="top-banner"]');
    for(var i=0;i<banners.length;i++){
      var banner = banners[i];
      banner.hidden = false;
      banner.style.setProperty('display','block','important');
      banner.style.setProperty('visibility','visible','important');
      banner.style.setProperty('opacity','1','important');
      banner.style.setProperty('pointer-events','auto','important');

      banner.style.setProperty('background','#0a0a0a','important');
      banner.style.setProperty('color','#ffffff','important');

      var anchors = banner.querySelectorAll('a');
      for(var j=0;j<anchors.length;j++){
        anchors[j].href = _getTopBannerUrl();
        anchors[j].target = '_self';
        anchors[j].style.setProperty('pointer-events','auto','important');
        anchors[j].style.setProperty('cursor','pointer','important');
        anchors[j].style.setProperty('color','#ffffff','important');
        anchors[j].style.setProperty('background','#0a0a0a','important');
      }

      var items = banner.querySelectorAll('.top-banner__item');
      for(var k=0;k<items.length;k++){
        items[k].style.setProperty('background','#0a0a0a','important');
        items[k].style.setProperty('color','#ffffff','important');
      }
    }
  }

  function _fixDfBanner(){
    var els = document.querySelectorAll('.df-bannermanager, .ssp.df-bannermanager');
    for(var i=0;i<els.length;i++){
      var el = els[i];
      if(_isHeaderSmartBanner(el)){
        el.style.setProperty('pointer-events','auto','important');
      } else {
        el.style.setProperty('pointer-events','none','important');
      }
    }

    var headerTargets = document.querySelectorAll('.top-logo, .top-logo *, [df-banner-code="logo"], [df-banner-code="logo"] *, .top-logo__item, .top-banner, .top-banner *, [df-banner-code="top-banner"], [df-banner-code="top-banner"] *');
    for(var j=0;j<headerTargets.length;j++){
      headerTargets[j].style.setProperty('pointer-events','auto','important');
    }

    _restoreHeaderLogo();
    _restoreTopBanner();
  }
  try{ _fixDfBanner(); }catch(e){}
  /* MutationObserver: SSP가 나중에 다시 만들거나 style 바꿔도 재적용 */
  if(window.MutationObserver){
    var _bannerObs = new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++){
        var m=muts[i];
        if(m.type === 'childList'){
          try{ _fixDfBanner(); }catch(e){}
          break;
        }
        if(m.type === 'attributes' && m.target && m.target.classList && m.target.classList.contains('df-bannermanager')){
          try{ _fixDfBanner(); }catch(e){}
          break;
        }
      }
    });
    var _bodyEl = document.body || document.documentElement;
    _bannerObs.observe(_bodyEl, { childList:true, subtree:true, attributes:true, attributeFilter:['style','class'] });
    setTimeout(function(){ try{ _bannerObs.disconnect(); }catch(e){} }, 10000);
  }
  /* 추가 안전망: 500ms 후 재실행 (SSP 비동기 로드 대응) */
  setTimeout(function(){ try{ _fixDfBanner(); }catch(e){} }, 200);
  setTimeout(function(){ try{ _fixDfBanner(); }catch(e){} }, 800);
  setTimeout(function(){ try{ _fixDfBanner(); }catch(e){} }, 2000);

  /* ── CSS 주입 ── */
  var css = document.createElement('style');
  css.id = 'mrsStyles';
  css.textContent = '\
  .productOption{position:fixed!important;left:-99999px!important;top:-99999px!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important}\
  #totalProducts,div#totalPrice,.quantity_price{position:fixed!important;left:-99999px!important;top:-99999px!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important}\
  .ssp.df-bannermanager,.df-bannermanager{pointer-events:none!important}\
  .top-logo,.top-logo *,[df-banner-code="logo"],[df-banner-code="logo"] *,.top-logo__item,.top-banner,.top-banner *,[df-banner-code="top-banner"],[df-banner-code="top-banner"] *{pointer-events:auto!important}\
  .header .top-logo,.top-banner{position:relative;z-index:30}\
  .header__bottom .top-logo{min-width:120px;min-height:24px}\
  .mrs-fallback-logo{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:24px!important;color:#111!important;font-size:22px!important;font-weight:700!important;letter-spacing:-0.02em!important;text-decoration:none!important;line-height:1!important}\
  .ssp,.ssp__container,.ssp__list,.ssp__item--naver,.ssp__item--kakao{visibility:visible!important}\
  .ssp__item--naver a,.ssp__item--naver button,.ssp__item--naver [onclick],.ssp__item--kakao a,.ssp__item--kakao button,.ssp__item--kakao [onclick]{pointer-events:auto!important}\
  .mrs-option-wrap{max-width:600px;margin:4px auto;font-family:Pretendard,sans-serif;color:#2D2D2D;background:#fff;border-radius:12px;padding:12px 8px;text-align:center;overflow:visible}\
  .mrs-option-wrap *{box-sizing:border-box;margin:0;padding:0}\
  .mrs-title{font-size:16px;font-weight:800;margin-bottom:4px;text-align:center;color:#1a1a1a;letter-spacing:0.5px}\
  .mrs-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:8px;overflow:visible}\
  @media(min-width:768px){.mrs-option-wrap{max-width:100%;padding:8px 6px 0;margin:4px auto;border-radius:0;background:transparent;overflow:visible}.mrs-grid{grid-template-columns:repeat(4,1fr)!important;gap:6px!important;padding:4px 6px 6px!important;overflow:visible}.mrs-card-img{aspect-ratio:3/4!important}.mrs-card-label{font-size:11px;padding:4px 2px 1px;white-space:nowrap;letter-spacing:-0.3px}.mrs-card-color{font-size:10px;padding:0 2px 4px}.mrs-title{font-size:14px;margin-bottom:6px}.mrs-info{padding:10px 12px;min-height:60px;font-size:13px}}\
  .mrs-card{position:relative;border:none;border-radius:12px;overflow:hidden;cursor:pointer;transition:box-shadow .2s,transform .2s;background:#fff;box-shadow:0 0 0 1.5px #ddd;transform:scale(1)}\
  .mrs-card:hover{box-shadow:0 0 0 1.5px #bcbcbc;transform:scale(1.02)}\
  .mrs-card.selected{box-shadow:0 0 0 2.5px #D4A853,0 0 0 6px rgba(212,168,83,.25);transform:scale(1.04)}\
  .mrs-start-badge{position:absolute;top:-1px;left:50%;transform:translateX(-50%);background:#D4A853;color:#fff;font-size:10px;font-weight:700;padding:6px 14px;border-radius:0 0 8px 8px;white-space:nowrap;letter-spacing:.5px;z-index:3}\
  @keyframes mrs-badge-bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-2px)}}\
  .mrs-start-badge{animation:mrs-badge-bounce 1.5s ease-in-out infinite}\
  .mrs-check{position:absolute;top:8px;right:8px;width:24px;height:24px;border-radius:50%;background:#D4A853;color:#fff;display:none;align-items:center;justify-content:center;font-size:14px;font-weight:700;z-index:2;transform:scale(0);transition:transform .2s cubic-bezier(.34,1.56,.64,1)}\
  .mrs-card.selected .mrs-check{display:flex;transform:scale(1)}\
  .mrs-card-img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;background:#f5f3ef;transition:filter .25s}\
  .mrs-card.selected .mrs-card-img{filter:brightness(1.08) saturate(1.15)}\
  .mrs-card::after{content:"";position:absolute;inset:0;background:rgba(212,168,83,0);transition:background .25s;pointer-events:none;z-index:1;border-radius:10px}\
  .mrs-card.selected::after{background:transparent}\
  .mrs-card-label{text-align:center;padding:6px 4px 2px;font-size:12px;font-weight:600;white-space:nowrap}\
  .mrs-card-color{text-align:center;font-size:11px;color:#999;padding:0 4px 6px;letter-spacing:0.3px}\
  @media(max-width:767px){.mrs-option-wrap{padding:8px 4px}.mrs-title{font-size:13px;margin-bottom:6px}.mrs-card-img{aspect-ratio:3/4!important}.mrs-start-badge{font-size:8px;padding:4px 8px}.mrs-check{width:20px;height:20px;font-size:11px;top:4px;right:4px}.mrs-info{padding:10px 8px;min-height:auto;font-size:12px}.mrs-info-price{font-size:17px}.mrs-info-sub{font-size:11px}.mrs-info-copy{font-size:13px}.mrs-info-hint{font-size:11px;padding:5px 12px}}\
  .mrs-info{background:#FAFAF8;border:1px solid #eee;border-bottom:none;border-radius:10px 10px 0 0;padding:14px 16px;text-align:center;min-height:70px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;transition:all .25s}\
  .mrs-info-tag{display:inline-block;font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;margin-bottom:2px}\
  .mrs-info-tag.best{background:#E8F5E9;color:#2E7D32}\
  .mrs-info-tag.lowest{background:#FFF3E0;color:#E65100}\
  .mrs-info-price{font-size:20px;font-weight:800;color:#2D2D2D}\
  .mrs-info-sub{font-size:13px;color:#777;line-height:1.5}\
  .mrs-info-copy{font-size:15px;font-weight:600;line-height:1.6}\
  .mrs-info-hint{display:inline-block;font-size:13px;color:#8B6914;font-weight:700;margin-top:8px;cursor:pointer;background:#FFF8E7;border:1.5px solid #D4A853;border-radius:20px;padding:6px 16px;transition:background .2s}\
  .mrs-info-hint:hover{background:#FFEFC0;text-decoration:none}\
  @keyframes mrs-hint-shine{0%,100%{box-shadow:0 0 0 0 rgba(212,168,83,.4)}60%{box-shadow:0 0 0 5px rgba(212,168,83,0)}}\
  .mrs-info-hint{animation:mrs-hint-shine 2.5s ease-in-out infinite}\
  @keyframes mrs-price-pop{0%{transform:scale(1)}40%{transform:scale(1.12)}100%{transform:scale(1)}}\
  .mrs-price-anim{animation:mrs-price-pop .35s ease-out}\
  .mrs-toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(30px);background:#2E7D32;color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:40px;box-shadow:0 4px 20px rgba(0,0,0,.25);z-index:99999;opacity:0;transition:opacity .3s,transform .3s;pointer-events:none;white-space:nowrap}\
  .mrs-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}\
  .mrs-toast.red{background:#D32F2F;box-shadow:0 4px 20px rgba(211,47,47,.35)}\
  #mrsTagline{font-family:Pretendard,sans-serif;padding:4px 0 2px;font-size:17px;font-weight:800;color:#1A1A1A;line-height:1.4;letter-spacing:-.3px;opacity:0;transition:opacity .35s,transform .35s;transform:translateY(4px)}\
  #mrsTagline.visible{opacity:1;transform:translateY(0);display:block}\
  #mrsTagline.hidden{display:none!important}\
  #mrsTagline em{font-style:normal;color:#D4A853}\
  .mrs-sticky{position:fixed;bottom:0;left:0;right:0;z-index:99998;background:#fff;border-top:1.5px solid #eee;padding:10px 16px;display:none;align-items:center;justify-content:space-between;gap:12px;box-shadow:0 -4px 16px rgba(0,0,0,.1)}\
  .mrs-sticky.visible{display:flex}\
  .mrs-sticky-info{display:flex;flex-direction:column;gap:2px}\
  .mrs-sticky-label{font-size:12px;color:#999}\
  .mrs-sticky-price{font-size:18px;font-weight:800;color:#2D2D2D}\
  .mrs-sticky-btn{background:#0A0A0A;color:#fff;border:none;border-radius:10px;padding:12px 24px;font-size:15px;font-weight:700;cursor:pointer;white-space:nowrap;transition:background .2s;font-family:Pretendard,sans-serif}\
  .mrs-sticky-btn:hover{background:#2a2a2a}\
  .mrs-sticky-btn:active{transform:scale(.97)}\
  a.btnSubmit.gFull{background-color:#0A0A0A!important;border-color:#0A0A0A!important;}\
  @media(min-width:768px){.mrs-sticky{display:none!important}}\
  @media(max-width:520px){.mrs-sticky-price{font-size:16px}.mrs-sticky-btn{padding:12px 18px;font-size:14px}}\
  .mrs-benefit-guide{font-family:Pretendard,sans-serif;background:#FAFAF8;border:1px solid #eee;border-radius:0 0 10px 10px;padding:10px 16px 14px;margin-top:0}\
  .mrs-benefit-title{font-size:13px;font-weight:700;color:#8B6914;text-align:center;margin-bottom:10px;letter-spacing:.3px}\
  .mrs-benefit-list{display:flex;flex-direction:column;gap:6px;text-align:left}\
  .mrs-benefit-row{display:flex;align-items:center;flex-wrap:wrap;gap:6px 10px;padding:10px 14px;border-radius:8px;transition:background .2s;cursor:pointer}\
  .mrs-benefit-row:hover{background:rgba(212,168,83,.06)}\
  .mrs-benefit-row.active{background:rgba(212,168,83,.1)!important}\
  .mrs-benefit-row:last-child{background:rgba(212,168,83,.06)}\
  .mrs-benefit-qty{font-size:12px;font-weight:700;color:#fff;background:#2D2D2D;min-width:32px;height:32px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}\
  .mrs-benefit-price{font-size:15px;font-weight:800;color:#1a1a1a}\
  .mrs-benefit-unit{font-size:12px;color:#888;font-weight:500}\
  .mrs-benefit-discount{font-size:11px;font-weight:700;color:#D32F2F}\
  .mrs-benefit-badge{font-size:11px;font-weight:700;padding:2px 8px;border-radius:12px;white-space:nowrap;margin-left:auto}\
  .mrs-benefit-badge.popular{background:rgba(45,45,45,.08);color:#2D2D2D}\
  .mrs-benefit-badge.saving{background:rgba(45,45,45,.08);color:#2D2D2D}\
  .mrs-benefit-badge.freeship{background:rgba(45,45,45,.08);color:#2D2D2D}\
  .mrs-benefit-badge.lowest{background:rgba(45,45,45,.08);color:#2D2D2D}\
  .mrs-benefit-row.best-deal{background:transparent;border:none}\
  .mrs-benefit-coupon{font-size:13px;font-weight:600;color:#2D2D2D;text-align:left;margin-top:10px;padding:11px 14px;background:#F5F3EF;border-radius:0 10px 10px 0;border:none;border-left:3px solid #C8B48C}\
  .mrs-coupon-amount{font-weight:800;color:#D32F2F}\
  .mrs-cafe-banner{display:flex;align-items:center;gap:10px;background:#F5F3EF;border-left:3px solid #2D4A3E;padding:11px 14px;border-radius:0 10px 10px 0;margin-bottom:12px;text-align:left}\
  .mrs-cafe-text{font-size:13px;font-weight:600;color:#2D2D2D;line-height:1.4}\
  .mrs-cafe-free{font-weight:800;color:#2D4A3E}\
  @media(min-width:768px){.mrs-benefit-guide{padding:8px 8px 0}.mrs-benefit-row{padding:6px 8px;flex-wrap:nowrap}.mrs-benefit-qty{font-size:11px;min-width:28px;height:28px}.mrs-benefit-price{font-size:13px}.mrs-benefit-unit{display:none}.mrs-benefit-discount{font-size:10px}.mrs-benefit-badge{font-size:10px;white-space:nowrap}.mrs-benefit-coupon{font-size:13px}}\
  @media(max-width:767px){.mrs-benefit-guide{padding:8px 8px 10px;margin-top:6px}.mrs-benefit-row{padding:8px 10px;gap:6px;flex-wrap:nowrap}.mrs-benefit-qty{font-size:11px;min-width:28px;height:28px}.mrs-benefit-price{font-size:13px}.mrs-benefit-unit{display:none}.mrs-benefit-discount{font-size:10px}.mrs-benefit-badge{font-size:10px;padding:2px 6px;white-space:nowrap}.mrs-benefit-coupon{font-size:13px;padding:11px 14px}}\
  ';
  document.head.appendChild(css);

  /* ── Pretendard 폰트 ── */
  var font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/pretendard.css';
  document.head.appendChild(font);

  /* ── HTML 주입 ── */
  var html = '\
  <div class="mrs-option-wrap" id="mrsOptionWrap">\
    <div class="mrs-cafe-banner">\
      <span class="mrs-cafe-text">☕ 네이버카페 12주 인증 완료 시 <span class="mrs-cafe-free">다음 시즌 무료!</span></span>\
    </div>\
    <div class="mrs-grid">\
      <div class="mrs-card" data-season="1" onclick="mrsToggle(this)">\
        <span class="mrs-start-badge">✦ 입문자 추천</span>\
        <span class="mrs-check">✓</span>\
        <img class="mrs-card-img" src="https://hyunvis.vercel.app/meariset/s1_banner.jpg" onerror="this.style.background=\'#1a1a2e\'" alt="Season 1">\
        <div class="mrs-card-label">Season 1</div>\
        <div class="mrs-card-color">Black</div>\
      </div>\
      <div class="mrs-card" data-season="2" onclick="mrsToggle(this)">\
        <span class="mrs-check">✓</span>\
        <img class="mrs-card-img" src="https://hyunvis.vercel.app/meariset/s2_banner.jpg" onerror="this.style.background=\'#3a3a3a\'" alt="Season 2">\
        <div class="mrs-card-label">Season 2</div>\
        <div class="mrs-card-color">Gray</div>\
      </div>\
      <div class="mrs-card" data-season="3" onclick="mrsToggle(this)">\
        <span class="mrs-check">✓</span>\
        <img class="mrs-card-img" src="https://hyunvis.vercel.app/meariset/s3_banner.jpg" onerror="this.style.background=\'#1a3a1a\'" alt="Season 3">\
        <div class="mrs-card-label">Season 3</div>\
        <div class="mrs-card-color">Olive</div>\
      </div>\
      <div class="mrs-card" data-season="4" onclick="mrsToggle(this)">\
        <span class="mrs-check">✓</span>\
        <img class="mrs-card-img" src="https://hyunvis.vercel.app/meariset/s4_banner.jpg" onerror="this.style.background=\'#0d1b3e\'" alt="Season 4">\
        <div class="mrs-card-label">Season 4</div>\
        <div class="mrs-card-color">Navy</div>\
      </div>\
    </div>\
    <div class="mrs-info" id="mrsInfo">\
      <p class="mrs-title">✍️ 적어라, 메아리 되어 돌아온다</p>\
      <p class="mrs-info-copy" style="color:#8B6914;font-size:13px;margin-top:2px">나에게 맞는 시즌을 골라보세요</p>\
    </div>\
    <div class="mrs-benefit-guide" id="mrsBenefitGuide">\
      <div class="mrs-benefit-list">\
        <div class="mrs-benefit-row" onclick="mrsBenefitSelect(1)">\
          <span class="mrs-benefit-qty">1권</span>\
          <span class="mrs-benefit-price">29,000원</span>\
          <span class="mrs-benefit-unit">(29,000원/권)</span>\
          <span class="mrs-benefit-discount">36%↓</span>\
          <span class="mrs-benefit-badge popular">⭐ 가장 많이 선택</span>\
        </div>\
        <div class="mrs-benefit-row" onclick="mrsBenefitSelect(2)">\
          <span class="mrs-benefit-qty">2권</span>\
          <span class="mrs-benefit-price">49,000원</span>\
          <span class="mrs-benefit-unit">(24,500원/권)</span>\
          <span class="mrs-benefit-discount">46%↓</span>\
          <span class="mrs-benefit-badge saving">💰 9,000원 절약</span>\
        </div>\
        <div class="mrs-benefit-row" onclick="mrsBenefitSelect(3)">\
          <span class="mrs-benefit-qty">3권</span>\
          <span class="mrs-benefit-price">69,000원</span>\
          <span class="mrs-benefit-unit">(23,000원/권)</span>\
          <span class="mrs-benefit-discount">49%↓</span>\
          <span class="mrs-benefit-badge freeship">🚚 무료배송</span>\
        </div>\
        <div class="mrs-benefit-row best-deal" onclick="mrsBenefitSelect(4)">\
          <span class="mrs-benefit-qty">4권</span>\
          <span class="mrs-benefit-price">89,000원</span>\
          <span class="mrs-benefit-unit">(22,250원/권)</span>\
          <span class="mrs-benefit-discount">51%↓</span>\
          <span class="mrs-benefit-badge lowest">🏆 최저가+무배</span>\
        </div>\
      </div>\
      <p class="mrs-benefit-coupon">💳 회원가입 시 <span class="mrs-coupon-amount">3,000원 웰컴쿠폰</span> 지급!</p>\
    </div>\
  </div>\
  <div class="mrs-toast" id="mrsToast"></div>\
  <div class="mrs-sticky" id="mrsStickyBar">\
    <div class="mrs-sticky-info">\
      <span class="mrs-sticky-label" id="mrsStickyLabel">시즌 선택 후 구매</span>\
      <span class="mrs-sticky-price" id="mrsStickyPrice">—</span>\
    </div>\
    <button class="mrs-sticky-btn" onclick="mrsStickyBuy()">🛒 지금 구매하기</button>\
  </div>';

  /* ── 옵션 영역 앞에 삽입 ── */
  function insertUI(){
    var existingWrap = document.getElementById('mrsOptionWrap');
    if(existingWrap && existingWrap.querySelector('.mrs-card')) return; /* 이미 완성된 UI */
    if(existingWrap) existingWrap.remove(); /* placeholder 제거 */
    var optArea = document.querySelector('.productOption');
    if(!optArea){ setTimeout(insertUI, 300); return; }
    var container = document.createElement('div');
    container.innerHTML = html;
    while(container.firstChild){
      optArea.parentNode.insertBefore(container.firstChild, optArea);
    }
    setTimeout(mrsInsertTagline, 500);
  }

  /* ── 로직 (동일) ── */
  var COMBO_MAP = {
    '1':'P00000BB000D','2':'P00000BB000H','3':'P00000BB000I','4':'P00000BB000J',
    '1,2':'P00000BB000E','1,3':'P00000BB000K','1,4':'P00000BB000L',
    '2,3':'P00000BB000M','2,4':'P00000BB000N','3,4':'P00000BB000O',
    '1,2,3':'P00000BB000F','1,2,4':'P00000BB000P','1,3,4':'P00000BB000Q',
    '2,3,4':'P00000BB000R','1,2,3,4':'P00000BB000G'
  };
  var PRICE_BY_COUNT={1:29000,2:49000,3:69000,4:89000};
  var INFO_BY_COUNT={
    1:'<span class="mrs-info-tag best">⭐ 가장 많이 선택</span><p class="mrs-info-price"><span id="mrsPriceNum">29,000</span>원 <span style="font-size:14px;font-weight:400;color:#e65100">+ 배송비 3,000원</span></p><p class="mrs-info-hint" onclick="mrsHintAdd()">💡 1권 더 담으면 9,000원 절약</p>',
    2:'<span class="mrs-info-tag best">💰 9,000원 절약</span><p class="mrs-info-price"><span id="mrsPriceNum">49,000</span>원 <span style="font-size:14px;font-weight:400;color:#e65100">+ 배송비 3,000원</span></p><p class="mrs-info-hint" onclick="mrsHintAdd()">💡 1권만 더 담으면 배송비 무료</p>',
    3:'<span class="mrs-info-tag best">🚚 배송비 무료</span><p class="mrs-info-price"><span id="mrsPriceNum">69,000</span>원 <span style="font-size:14px;font-weight:400;color:#777">(권당 23,000원)</span></p><p class="mrs-info-hint" onclick="mrsHintAdd()">🎁 1권만 더 담으면 최저가 + 한정판 사은품</p>',
    4:'<span class="mrs-info-tag lowest">🏆 최저가 + 한정판 사은품</span><p class="mrs-info-price"><span id="mrsPriceNum">89,000</span>원 <span style="font-size:14px;font-weight:400;color:#777">(권당 22,250원)</span></p><p class="mrs-info-hint" style="cursor:default;animation:none">365일 메아리셋 완성 🎉</p>'
  };
  var TAGLINE={1:'"작심삼일을 <em>끝내고 싶은 분</em>"',2:'"180일, <em>습관으로 만들고 싶은 분</em>"',3:'"9개월, <em>진짜 달라지고 싶은 분</em>"',4:'"한 해 전체를 <em>내 것으로 만들고 싶은 분</em>"'};
  var PRESET_BY_COUNT={1:'1',2:'1,2',3:'1,2,3',4:'1,2,3,4'};

  var _prevCount=0,_toastTimer=null,_mrsSubmitting=false;

  function mrsGetComboKey(){
    var cards=document.querySelectorAll('.mrs-card.selected'),seasons=[];
    for(var i=0;i<cards.length;i++) seasons.push(parseInt(cards[i].getAttribute('data-season')));
    seasons.sort(); return seasons.join(',');
  }
  function mrsAnimatePrice(from,to,dur){
    var el=document.getElementById('mrsPriceNum'); if(!el)return;
    var start=null;
    function step(ts){if(!start)start=ts;var p=Math.min((ts-start)/dur,1),e=1-Math.pow(1-p,3),c=Math.round(from+(to-from)*e);el.textContent=c.toLocaleString('ko-KR');if(p<1)requestAnimationFrame(step);else el.textContent=to.toLocaleString('ko-KR');}
    var pr=el.closest('.mrs-info-price')||el.parentElement;if(pr){pr.classList.remove('mrs-price-anim');void pr.offsetWidth;pr.classList.add('mrs-price-anim');}
    requestAnimationFrame(step);
  }
  function mrsShowToast(msg,color){
    var t=document.getElementById('mrsToast');if(!t)return;if(_toastTimer)clearTimeout(_toastTimer);
    t.textContent=msg;t.classList.remove('red');if(color==='red')t.classList.add('red');
    t.classList.add('show');_toastTimer=setTimeout(function(){t.classList.remove('show','red');},2500);
  }
  function mrsUpdateSticky(count){
    var bar=document.getElementById('mrsStickyBar'),label=document.getElementById('mrsStickyLabel'),pr=document.getElementById('mrsStickyPrice');
    if(!bar)return;
    if(count>0&&PRICE_BY_COUNT[count]){bar.classList.add('visible');label.textContent=count+'권 선택됨';pr.textContent=PRICE_BY_COUNT[count].toLocaleString('ko-KR')+'원';}
    else{bar.classList.remove('visible');}
  }
  function mrsInsertTagline(){
    if(document.getElementById('mrsTagline'))return;
    var wrap=document.getElementById('mrsOptionWrap');if(!wrap){setTimeout(mrsInsertTagline,400);return;}
    var el=document.createElement('div');el.id='mrsTagline';el.className='hidden';wrap.parentNode.insertBefore(el,wrap);
  }
  function mrsUpdateTagline(count){
    var el=document.getElementById('mrsTagline');if(!el)return;
    if(TAGLINE[count]){el.innerHTML=TAGLINE[count];el.classList.remove('hidden');void el.offsetWidth;el.classList.add('visible');}
    else{el.classList.remove('visible');el.classList.add('hidden');}
  }

  window.mrsToggle=function(card){
    card.classList.toggle('selected');
    var count=document.querySelectorAll('.mrs-card.selected').length,prevPrice=PRICE_BY_COUNT[_prevCount]||0;
    var info=INFO_BY_COUNT[count];
    document.getElementById('mrsInfo').innerHTML=info?info:'<p class="mrs-title">✍️ 적어라, 메아리 되어 돌아온다</p><p class="mrs-info-copy" style="color:#8B6914;font-size:13px;margin-top:2px">나에게 맞는 시즌을 골라보세요</p>';
    if(info&&PRICE_BY_COUNT[count]) requestAnimationFrame(function(){mrsAnimatePrice(prevPrice,PRICE_BY_COUNT[count],350);});
    if(_prevCount<3&&count>=3&&count<4) setTimeout(function(){mrsShowToast('🎉 배송비 무료 달성!','green');},150);
    if(_prevCount<4&&count>=4) setTimeout(function(){mrsShowToast('🏆 최저가 달성!','red');},150);
    mrsUpdateTagline(count);mrsUpdateSticky(count);mrsUpdateBenefit();_prevCount=count;
  };
  window.mrsHintAdd=function(){var cards=document.querySelectorAll('.mrs-card:not(.selected)');if(cards.length)cards[0].click();};

  function mrsUpdateBenefit(){
    var rows=document.querySelectorAll('.mrs-benefit-row');
    var count=document.querySelectorAll('.mrs-card.selected').length;
    for(var i=0;i<rows.length;i++) rows[i].classList.remove('active');
    if(count >= 1 && count <= 4){
      var target=rows[count-1];
      if(target) target.classList.add('active');
    }
  }

  window.mrsBenefitSelect=function(count){
    var currentKey=mrsGetComboKey();
    var targetKey=PRESET_BY_COUNT[count];
    var allCards=document.querySelectorAll('.mrs-card');
    for(var i=0;i<allCards.length;i++) allCards[i].classList.remove('selected');
    if(currentKey===targetKey){
      var emptyInfo=document.getElementById('mrsInfo');
      if(emptyInfo) emptyInfo.innerHTML='<p class="mrs-title">✍️ 적어라, 메아리 되어 돌아온다</p><p class="mrs-info-copy" style="color:#8B6914;font-size:13px;margin-top:2px">나에게 맞는 시즌을 골라보세요</p>';
      mrsUpdateTagline(0);mrsUpdateSticky(0);mrsUpdateBenefit();_prevCount=0;
      return;
    }
    for(var s=1;s<=count;s++){
      var card=document.querySelector('.mrs-card[data-season="'+s+'"]');
      if(card) card.classList.add('selected');
    }
    var prevPrice=PRICE_BY_COUNT[_prevCount]||0;
    var info=INFO_BY_COUNT[count];
    var infoEl=document.getElementById('mrsInfo');
    if(infoEl) infoEl.innerHTML=info||'<p class="mrs-title">✍️ 적어라, 메아리 되어 돌아온다</p><p class="mrs-info-copy" style="color:#8B6914;font-size:13px;margin-top:2px">나에게 맞는 시즌을 골라보세요</p>';
    if(info&&PRICE_BY_COUNT[count]) requestAnimationFrame(function(){mrsAnimatePrice(prevPrice,PRICE_BY_COUNT[count],350);});
    mrsUpdateTagline(count);mrsUpdateSticky(count);mrsUpdateBenefit();_prevCount=count;
  };

  function mrsClearOptions(){
    var dels=document.querySelectorAll('#totalProducts .option_box_del, #totalProducts img[alt="삭제"]');
    for(var i=dels.length-1;i>=0;i--){var link=dels[i].closest('a')||dels[i];try{link.click();}catch(e){}}
    var tp=document.getElementById('totalProducts');if(tp){var tbody=tp.querySelector('tbody');if(tbody)tbody.innerHTML='';}
    var sel=document.getElementById('product_option_id1');if(sel)sel.value='*';
  }
  function mrsSelectOption(optionValue){
    var sel=document.getElementById('product_option_id1');if(!sel)return false;
    var prodOpt=document.querySelector('.productOption');
    if(prodOpt)prodOpt.setAttribute('style','position:fixed!important;left:0!important;top:0!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0.01!important;z-index:-1!important;');
    sel.value=optionValue;
    if(window.jQuery){window.jQuery(sel).trigger('change');}else{sel.dispatchEvent(new Event('change',{bubbles:true}));}
    setTimeout(function(){if(prodOpt)prodOpt.setAttribute('style','position:fixed!important;left:-99999px!important;top:-99999px!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important;');},300);
    return true;
  }

  function mrsDirectSubmit(type){
    var count=document.querySelectorAll('.mrs-card.selected').length;
    if(!count){alert('시즌을 먼저 선택해 주세요 😊');return;}
    var key=mrsGetComboKey(),optVal=COMBO_MAP[key];
    if(!optVal){alert('선택한 조합을 찾을 수 없습니다. 다시 시도해주세요.');return;}
    _mrsSubmitting=true;
    var _origAlert=window.alert;
    window.alert=function(msg){if(_mrsSubmitting&&(msg.indexOf('이미 선택')!==-1||msg.indexOf('삭제')!==-1||msg.indexOf('필수 옵션')!==-1))return;return _origAlert.apply(this,arguments);};
    var _origConfirm=window.confirm;
    window.confirm=function(msg){if(_mrsSubmitting&&msg.indexOf('함께 구매')!==-1)return false;return _origConfirm.apply(this,arguments);};
    mrsClearOptions();
    setTimeout(function(){
      mrsSelectOption(optVal);
      var waitCount=0;
      var waitForOption=function(){
        var tp=document.getElementById('totalProducts'),hasItem=tp&&tp.querySelector('tbody tr, .option_box');
        if(!hasItem&&waitCount<15){waitCount++;setTimeout(waitForOption,200);return;}
        var _origCheck=window.checkOptionRequired;window.checkOptionRequired=function(){return true;};
        try{if(typeof product_submit!=='undefined'){var btnEl=type===2?document.querySelector('button.actionCart'):document.querySelector('a.btnSubmit.gFull');product_submit(type,'/exec/front/order/basket/',btnEl||null);}}catch(e){}
        setTimeout(function(){_mrsSubmitting=false;window.alert=_origAlert;window.confirm=_origConfirm;if(_origCheck)window.checkOptionRequired=_origCheck;else delete window.checkOptionRequired;},3000);
      };
      setTimeout(waitForOption,600);
    },200);
  }
  window.mrsDirectSubmit=mrsDirectSubmit;
  window.mrsStickyBuy=function(){mrsDirectSubmit(1);};

  function mrsInstallCapture(){
    document.addEventListener('click',function(e){
      var el=e.target,depth=0;
      while(el&&el.tagName!=='BODY'&&depth<6){
        var oc=el.getAttribute('onclick')||'';
        if(oc.indexOf('product_submit')!==-1){
          var count=document.querySelectorAll('.mrs-card.selected').length;
          if(!count){e.preventDefault();e.stopImmediatePropagation();alert('시즌을 먼저 선택해 주세요 😊');return;}
          e.preventDefault();e.stopImmediatePropagation();
          var buyNow=(oc.indexOf('product_submit(2')!==-1);
          mrsDirectSubmit(buyNow?2:1);return;
        }
        el=el.parentElement;depth++;
      }
    },true);

    var _mrsPayBypass=false;
    document.addEventListener('click',function(e){
      var el=e.target,depth=0;
      while(el&&el.tagName!=='BODY'&&depth<6){
        var cls=(el.className||'').toString();
        if(cls.indexOf('kakao')!==-1||cls.indexOf('kakaopay')!==-1||cls.indexOf('naverpay')!==-1||cls.indexOf('naver-pay')!==-1||cls.indexOf('npay')!==-1||cls.indexOf('checkout_btn')!==-1||cls.indexOf('Npay')!==-1){
          if(_mrsPayBypass){_mrsPayBypass=false;return;}
          var count=document.querySelectorAll('.mrs-card.selected').length;
          if(!count){e.preventDefault();e.stopImmediatePropagation();alert('시즌을 먼저 선택해 주세요 😊');return;}
          e.preventDefault();e.stopImmediatePropagation();
          var clickTarget=el;mrsClearOptions();
          setTimeout(function(){mrsSelectOption(COMBO_MAP[mrsGetComboKey()]);setTimeout(function(){_mrsPayBypass=true;clickTarget.click();},800);},200);
          return;
        }
        el=el.parentElement;depth++;
      }
    },true);
  }

  /* ── 네이버페이 방어: 원래 위치에서 이탈 방지 ── */
  /* v7.9: 구버전 스크립트의 setTimeout(mrsRelocateNpay)가 뒤늦게 실행돼도
     MutationObserver가 즉시 원위치 복구. 30초 후 자동 해제. */
  function mrsGuardNpay(){
    var appPay = document.querySelector('.app-pay-wrap');
    if(!appPay) return;
    
    /* 네이버페이 visible 보장 */
    var npay = document.getElementById('NaverChk_Button');
    if(npay) {
      npay.style.setProperty('display','block','important');
      npay.style.setProperty('visibility','visible','important');
      /* 이미 app-pay-wrap 밖이면 복구 */
      if(!appPay.contains(npay)) {
        appPay.insertBefore(npay, appPay.firstChild);
      }
    }
    
    /* MutationObserver: 네이버페이가 app-pay-wrap에서 빠지면 즉시 복구 */
    var guard = new MutationObserver(function(){
      var n = document.getElementById('NaverChk_Button');
      var ap = document.querySelector('.app-pay-wrap');
      if(n && ap && !ap.contains(n)) {
        ap.insertBefore(n, ap.firstChild);
        n.style.setProperty('display','block','important');
        n.style.setProperty('visibility','visible','important');
      }
    });
    guard.observe(document.body, { childList: true, subtree: true });
    setTimeout(function(){ guard.disconnect(); }, 30000);
  }

  /* ── 초기화 ── */
  function mrsEnsureUI(){
    var readyWrap = document.querySelector('#mrsOptionWrap .mrs-card');
    if(!readyWrap) insertUI();
  }

  function mrsInit(){
    insertUI();
    mrsInstallCapture();
    setTimeout(mrsEnsureUI, 300);
    setTimeout(mrsEnsureUI, 1200);
    setTimeout(mrsEnsureUI, 2500);
    /* SDK 로딩 대기 후 네이버페이 방어 시작 (1초 간격으로 5회 시도) */
    var tries = 0;
    var guardInterval = setInterval(function(){
      mrsGuardNpay();
      if(++tries >= 5) clearInterval(guardInterval);
    }, 2000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mrsInit);
  else mrsInit();
  window.addEventListener('load', mrsEnsureUI);
})();
