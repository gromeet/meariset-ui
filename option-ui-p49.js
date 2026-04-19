/**
 * 메아리셋 옵션 UI v7.9 — 외부 스크립트 버전
 * product_no=49 전용 (27과 분리된 재구매 자산)
 * v8.0: 모바일 4열 단일행 + NaverPay MutationObserver 방어
 */
(function(){
  var MRS_VERSION = 166; /* 버전 번호 (16.6 = 166) — product_no=49 펜 옵션 추가 + 15% 가격 정합성 반영 */
  var MRS_PRODUCT_BANNER_URL = 'https://meariset.kr/product/detail.html?product_no=49&cate_no=1&display_group=2';
  var MRS_LOGIN_BANNER_URL = 'https://meariset.kr/member/login.html?noMemberOrder&returnUrl=%2Fmyshop%2Findex.html';
  var MRS_DISPLAY_PRICE_BY_COUNT = {1:24650};

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

  /* product_no=49 에서만 실행 (SEO URL 대응 강화) */
  var prdEl = document.querySelector('[data-prd-no]');
  var prdNo = prdEl ? prdEl.getAttribute('data-prd-no') : '';
  var urlHas49 = location.search.indexOf('product_no=49') !== -1 || location.href.indexOf('product_no=49') !== -1;
  var pathMatch49 = location.pathname.match(/\/product\/[^/]*\/(\d+)\//);
  var pathHas49 = !!(pathMatch49 && pathMatch49[1] === '49');
  if(!urlHas49 && !pathHas49 && prdNo !== '49'){ window._mrsOptionLoaded = false; return; }

  if(window.__mrsActiveMode && window.__mrsActiveMode !== 'live49') return;
  window.__mrsActiveMode = 'live49';

  /* placeholder 중복 방지 (같은 버전 재실행 시) */

  /* 즉시 placeholder 생성 — CDN 구버전이 중복 실행되는 것 방지 */
  var _placeholder = document.createElement('div');
  _placeholder.id = 'mrsOptionWrap';
  _placeholder.style.display = 'none';
  (document.body || document.documentElement).appendChild(_placeholder);

  /* ── df-bannermanager JS 강제 fix (CSS !important만으론 SSP inline style 못 막음) ── */
  function _isHeaderSmartBanner(el){
    if(!el) return false;
    if(el.closest && el.closest('.top-banner, [df-banner-code="top-banner"]')) return true;
    if(el.querySelector && el.querySelector('.top-banner__link, [df-banner-code="top-banner"] a')) return true;
    return false;
  }

  function _isLoggedOutState(){
    return !!document.querySelector('.xans-layout-statelogoff .membership__txt, .xans-layout-statelogoff .usm__link[href="/myshop/index.html"]');
  }

  function _getTopBannerUrl(){
    return _isLoggedOutState() ? MRS_LOGIN_BANNER_URL : MRS_PRODUCT_BANNER_URL;
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

  function _dedupeTopLogo(){
    var logos = document.querySelectorAll('header.header .top-logo[df-banner-code="logo"]');
    for(var i=0;i<logos.length;i++){
      var logo = logos[i];
      logo.style.setProperty('pointer-events','auto','important');
      var items = Array.prototype.slice.call(logo.querySelectorAll('.top-logo__item'));
      if(!items.length) continue;

      var chosen = null;
      for(var j=0;j<items.length;j++){
        var item = items[j];
        var href = (item.getAttribute('href') || '').trim();
        var img = item.querySelector('img');
        var imgSrc = img && img.getAttribute('src') ? img.getAttribute('src').trim() : '';
        var txt = (item.textContent || '').replace(/\s+/g,'').trim();
        var hasMeaningfulText = !!(txt && txt.indexOf('{#') === -1 && txt.indexOf('%7B#') === -1);
        var hasUsableHref = !!(href && href.indexOf('{#') === -1 && href.indexOf('%7B#') === -1 && !/^javascript:/i.test(href));
        if((imgSrc || hasMeaningfulText) && (hasUsableHref || imgSrc)){
          chosen = item;
          break;
        }
      }

      if(!chosen){
        for(var k=0;k<items.length;k++){
          var fallback = items[k];
          var fallbackImg = fallback.querySelector('img');
          var fallbackTxt = (fallback.textContent || '').replace(/\s+/g,'').trim();
          if((fallbackImg && fallbackImg.getAttribute('src')) || (fallbackTxt && fallbackTxt.indexOf('{#') === -1 && fallbackTxt.indexOf('%7B#') === -1)){
            chosen = fallback;
            break;
          }
        }
      }
      if(!chosen) chosen = items[0];

      for(var m=0;m<items.length;m++){
        items[m].style.setProperty('pointer-events','auto','important');
        items[m].style.setProperty('cursor','pointer','important');
        if(items[m] === chosen){
          var chosenHref = (items[m].getAttribute('href') || '').trim();
          if(!chosenHref || chosenHref.indexOf('{#') !== -1 || chosenHref.indexOf('%7B#') !== -1 || /^javascript:/i.test(chosenHref)){
            items[m].setAttribute('href','/');
          }
          items[m].setAttribute('target','_self');
        }
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

    var headerTargets = document.querySelectorAll('.top-banner, .top-banner *, [df-banner-code="top-banner"], [df-banner-code="top-banner"] *');
    for(var j=0;j<headerTargets.length;j++){
      headerTargets[j].style.setProperty('pointer-events','auto','important');
    }

    _restoreTopBanner();
    _dedupeTopLogo();
  }
  try{ _fixDfBanner(); }catch(e){}
  /* 전역 MutationObserver는 상세페이지 렉을 유발해서 제거, 짧은 재시도만 유지 */
  setTimeout(function(){ try{ _fixDfBanner(); }catch(e){} }, 200);
  setTimeout(function(){ try{ _fixDfBanner(); }catch(e){} }, 1000);
  setTimeout(function(){ try{ _fixDfBanner(); }catch(e){} }, 2500);
  window.addEventListener('load', function(){ try{ _fixDfBanner(); }catch(e){} }, { once:true });

  /* ── CSS 주입 ── */
  var css = document.createElement('style');
  css.id = 'mrsStyles';
  css.textContent = '\
  .productOption{position:fixed!important;left:-99999px!important;top:-99999px!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important}\
  .xans-product-addproduct,.xans-product-addproduct *,[id*="addproduct"],[name*="addproduct"]{position:fixed!important;left:-99999px!important;top:-99999px!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important}\
  #totalProducts,div#totalPrice,.quantity_price{position:fixed!important;left:-99999px!important;top:-99999px!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important}\
  .ssp.df-bannermanager,.df-bannermanager{pointer-events:none!important}\
  .top-banner,.top-banner *,[df-banner-code="top-banner"],[df-banner-code="top-banner"] *{pointer-events:auto!important}\
  .top-banner{position:relative;z-index:30}\
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
  @media(max-width:767px){.mrs-option-wrap{padding:8px 4px}.mrs-title{font-size:13px;margin-bottom:6px}.mrs-card-img{aspect-ratio:3/4!important}.mrs-start-badge{font-size:8px;padding:4px 8px}.mrs-check{width:20px;height:20px;font-size:11px;top:4px;right:4px}.mrs-info{padding:10px 8px;min-height:auto;font-size:12px}.mrs-info-price{font-size:32px}.mrs-info-sub{font-size:11px}.mrs-info-copy{font-size:13px}.mrs-info-hint{font-size:12px;padding:6px 14px}}\
  .mrs-info{background:#FAFAF8;border:1px solid #eee;border-bottom:none;border-radius:10px 10px 0 0;padding:14px 16px;text-align:center;min-height:70px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;transition:all .25s}\
  .mrs-info-tag{display:inline-block;font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;margin-bottom:2px}\
  .mrs-info-tag.best{background:#E8F5E9;color:#2E7D32}\
  .mrs-info-tag.lowest{background:#FFF3E0;color:#E65100}\
  .mrs-info-price{font-size:30px;font-weight:800;color:#2D2D2D;line-height:1.15}\
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
  .mrs-sticky{position:fixed;bottom:0;left:0;right:0;z-index:99998;background:#fff;border-top:1.5px solid #eee;padding:14px 16px calc(16px + env(safe-area-inset-bottom,0px));display:none;align-items:center;justify-content:space-between;gap:14px;box-shadow:0 -6px 20px rgba(0,0,0,.12)}\
  .mrs-sticky.visible{display:flex}\
  .mrs-sticky-info{display:flex;flex-direction:column;gap:4px}\
  .mrs-sticky-label{font-size:12px;color:#999}\
  .mrs-sticky-price{font-size:18px;font-weight:800;color:#2D2D2D}\
  .mrs-sticky-btn{background:#0A0A0A;color:#fff;border:none;border-radius:10px;padding:13px 24px;font-size:15px;font-weight:700;cursor:pointer;white-space:nowrap;transition:background .2s;font-family:Pretendard,sans-serif}\
  .mrs-sticky-btn:hover{background:#2a2a2a}\
  .mrs-sticky-btn:active{transform:scale(.97)}\
  a.btnSubmit.gFull{background-color:#0A0A0A!important;border-color:#0A0A0A!important;}\
  @media(min-width:768px){.mrs-sticky{display:none!important}}\
  @media(max-width:520px){.mrs-sticky{padding:14px 14px calc(18px + env(safe-area-inset-bottom,0px));gap:12px}.mrs-sticky-price{font-size:16px}.mrs-sticky-btn{padding:13px 18px;font-size:14px}}\
  .mrs-benefit-guide{font-family:Pretendard,sans-serif;background:#FAFAF8;border:1px solid #eee;border-radius:0 0 10px 10px;padding:10px 16px 14px;margin-top:0}\
  .mrs-benefit-title{display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;text-align:center;margin:0 auto 12px;padding:7px 14px;background:#2D2D2D;border-radius:999px;letter-spacing:.2px;box-shadow:0 4px 12px rgba(45,45,45,.14)}\
  .mrs-benefit-list{display:flex;flex-direction:column;gap:6px;text-align:left}\
  .mrs-benefit-row{display:flex;align-items:center;flex-wrap:nowrap;gap:6px;padding:10px 14px;border-radius:8px;transition:background .2s;cursor:pointer}\
  .mrs-benefit-row:hover{background:rgba(212,168,83,.06)}\
  .mrs-benefit-row.active{background:rgba(212,168,83,.1)!important}\
  .mrs-benefit-row:last-child{background:rgba(212,168,83,.06)}\
  .mrs-benefit-qty{font-size:12px;font-weight:700;color:#fff;background:#2D2D2D;min-width:32px;height:32px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}\
  .mrs-benefit-price{font-size:18px;font-weight:800;color:#1a1a1a;white-space:nowrap}\
  .mrs-benefit-discount{font-size:11px;font-weight:700;color:#D32F2F;white-space:nowrap}\
  .mrs-benefit-unit{font-size:10px;color:#999;font-weight:500;white-space:nowrap}\
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
  @media(min-width:768px){.mrs-benefit-guide{padding:8px 8px 0}.mrs-benefit-row{padding:8px 10px;flex-wrap:nowrap}.mrs-benefit-qty{font-size:12px;min-width:30px;height:30px}.mrs-benefit-price{font-size:19px}.mrs-benefit-discount{font-size:11px}.mrs-benefit-unit{display:inline;font-size:11px}.mrs-benefit-badge{font-size:10px;white-space:nowrap}.mrs-benefit-coupon{font-size:13px}}\
  @media(max-width:767px){.mrs-benefit-guide{padding:8px 8px 10px;margin-top:6px}.mrs-benefit-row{padding:9px 10px;gap:5px;flex-wrap:nowrap}.mrs-benefit-qty{font-size:11px;min-width:28px;height:28px}.mrs-benefit-price{font-size:18px}.mrs-benefit-discount{font-size:11px}.mrs-benefit-unit{display:inline;font-size:10px}.mrs-benefit-badge{font-size:10px;padding:2px 6px;white-space:nowrap}.mrs-benefit-coupon{font-size:13px;padding:11px 14px}}\
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
      <div class="mrs-benefit-title">재구매 고객 전용 15% 혜택가</div>\
      <div class="mrs-benefit-list">\
        <div class="mrs-benefit-row active">\
          <span class="mrs-benefit-qty">1권</span>\
          <span class="mrs-benefit-price">24,650원</span>\
          <span class="mrs-benefit-discount">15%↓</span>\
          <span class="mrs-benefit-unit">(선택 시즌 1권 기준)</span>\
          <span class="mrs-benefit-badge popular">🔁 재구매 전용</span>\
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

  /* ── 로직 ── */
  /* A~D는 사용자 제공 라이브 검증값, E~O는 기존 27 조합 순서를 기준으로 배치한 추정 매핑 */
  var COMBO_MAP = {
    '1':'P00000BX000A','1,2':'P00000BX000B','1,2,3':'P00000BX000C','1,2,3,4':'P00000BX000D',
    '2':'P00000BX000F','3':'P00000BX000G','4':'P00000BX000H',
    '1,3':'P00000BX000I','1,4':'P00000BX000J','2,3':'P00000BX000K',
    '2,4':'P00000BX000L','3,4':'P00000BX000M',
    '1,2,4':'P00000BX000N','1,3,4':'P00000BX000O','2,3,4':'P00000BX000E'
  };
  var PRICE_BY_COUNT = MRS_DISPLAY_PRICE_BY_COUNT;
  var INFO_BY_COUNT={
    1:'<span class="mrs-info-tag best">🔁 재구매 전용</span><p class="mrs-info-price"><span id="mrsPriceNum">24,650</span>원 <span style="font-size:15px;font-weight:500;color:#777">(선택 시즌 1권)</span></p><p class="mrs-info-hint" style="cursor:default;animation:none">15% 혜택은 한 권만 받을 수 있어요!</p>'
  };
  var TAGLINE={1:'"작심삼일을 <em>끝내고 싶은 분</em>"',2:'"180일, <em>습관으로 만들고 싶은 분</em>"',3:'"9개월, <em>진짜 달라지고 싶은 분</em>"',4:'"한 해 전체를 <em>내 것으로 만들고 싶은 분</em>"'};
  var PRESET_BY_COUNT={1:'1',2:'1,2',3:'1,2,3',4:'1,2,3,4'};

  var _prevCount=0,_toastTimer=null,_mrsSubmitting=false,_mrsStickyTimer=null,_mrsNativeObserver=null,_mrsAlertRestoreTimer=null;


  var MRS_PEN_PRICE=9900;
  var MRS_PEN_IMAGE_DATA_URI='data:image/png;base64,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';

  var _penAdded=false,_mrsPenSyncPending=false,_mrsPenSyncTimer=null,_mrsPenSyncToken=0,_mrsPenSyncStartedAt=0;
  var _mrsAddonSubmitCache=null,_mrsAddonPrimeTimer=null;

  function mrsGetPenAddonData(){
    var selectors=document.querySelectorAll('.xans-product-addproduct select,.addProduct select,select[id*="addproduct"],select[name*="addproduct"]');
    var keywords=['클립펜','클립 펜','clip pen','clippen','clip_pen','clip-pen'];
    for(var i=0;i<selectors.length;i++){
      var sel=selectors[i];
      if(!sel||!sel.options) continue;
      for(var j=0;j<sel.options.length;j++){
        var opt=sel.options[j];
        var text=mrsGetText(opt);
        for(var k=0;k<keywords.length;k++){
          if(text.toLowerCase().indexOf(keywords[k].toLowerCase())!==-1){
            return {select:sel, option:opt, value:opt.value, text:text, price:mrsParsePriceValue(text)||MRS_PEN_PRICE};
          }
        }
      }
    }
    return null;
  }
  function mrsHasNativePenSelected(){
    var data=mrsGetPenAddonData();
    return !!(data&&data.select&&String(data.select.value||'').trim()===String(data.value||'').trim());
  }
  function mrsIsPenAddonSyncReady(enable,data){
    var current=data&&data.select?data:mrsGetPenAddonData();
    if(!current||!current.select) return false;
    var currentValue=String(current.select.value||'').trim();
    var targetValue=String(current.value||'').trim();
    if(enable) return currentValue===targetValue;
    return currentValue==='*' || !mrsHasNativePenSelected();
  }
  function mrsStartPenAddonSyncMonitor(enable){
    var syncToken=++_mrsPenSyncToken;
    var startedAt=Date.now();
    var readyAfter=startedAt+320;
    var deadline=startedAt+1400;
    _mrsPenSyncPending=true;
    _mrsPenSyncStartedAt=startedAt;
    var check=function(){
      if(syncToken!==_mrsPenSyncToken) return;
      var now=Date.now();
      var ready=now>=readyAfter && mrsIsPenAddonSyncReady(enable);
      if(ready || now>=deadline){
        _mrsPenSyncPending=false;
        return;
      }
      setTimeout(check,60);
    };
    setTimeout(check,60);
  }
  function mrsWaitForPenAddonSync(enable, done){
    if(typeof done!=='function') return;
    var deadline=Date.now()+1600;
    var check=function(){
      var ready=mrsIsPenAddonSyncReady(enable);
      if((!_mrsPenSyncPending && ready) || Date.now()>=deadline){
        done(ready);
        return;
      }
      setTimeout(check,50);
    };
    setTimeout(check,10);
  }
  function mrsSyncPenAddonSelection(enable, done){
    var data=mrsGetPenAddonData();
    if(!data||!data.select){
      if(typeof done==='function') done(false);
      return false;
    }
    var select=data.select;
    var before=String(select.value||'').trim();
    var next=enable?String(data.value||'').trim():'*';
    if(before===next){
      if(enable) mrsPrimeAddonSubmitCache('pen-already-matched');
      if(typeof done==='function'){
        if(_mrsPenSyncPending) mrsWaitForPenAddonSync(enable, done);
        else done(mrsIsPenAddonSyncReady(enable, data));
      }
      return true;
    }
    var prodOpt=document.querySelector('.productOption');
    if(prodOpt)prodOpt.setAttribute('style','position:fixed!important;left:0!important;top:0!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0.01!important;z-index:-1!important;');
    select.value=next;
    mrsTriggerNativeChange(select);
    if(_mrsPenSyncTimer) clearTimeout(_mrsPenSyncTimer);
    _mrsPenSyncTimer=setTimeout(function(){
      if(prodOpt)prodOpt.setAttribute('style','position:fixed!important;left:-99999px!important;top:-99999px!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important;');
      mrsSyncStickySoon();
      if(enable) mrsPrimeAddonSubmitCache('pen-sync');
    },300);
    mrsStartPenAddonSyncMonitor(enable);
    if(typeof done==='function') mrsWaitForPenAddonSync(enable, done);
    return true;
  }
  function mrsGetExpectedAddonPrice(){
    var nativeAddonPrice=mrsGetNativeAddonSelectedPrice();
    if(nativeAddonPrice>0) return nativeAddonPrice;
    return _penAdded ? MRS_PEN_PRICE : 0;
  }

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
  function mrsGetText(el){return((el&&(el.textContent||el.innerText))||'').replace(/\s+/g,' ').trim();}
  function mrsParsePriceValue(text){
    var matches=(text||'').match(/\d[\d,]*/g);
    if(!matches)return 0;
    for(var i=matches.length-1;i>=0;i--){
      var num=parseInt(matches[i].replace(/,/g,''),10);
      if(num>=1000)return num;
    }
    return 0;
  }
  function mrsGetNativeAddonSelectedPrice(){
    var sels=document.querySelectorAll('.xans-product-addproduct select,.addProduct select,select[id*="addproduct"],select[name*="addproduct"]');
    var total=0;
    for(var i=0;i<sels.length;i++){
      var sel=sels[i],val=(sel.value||'').trim();
      if(!val||val==='*')continue;
      var opt=sel.options&&sel.selectedIndex>=0?sel.options[sel.selectedIndex]:null;
      var price=mrsParsePriceValue(mrsGetText(opt)||mrsGetText(sel));
      if(!(price>0)){
        var row=(sel.closest&& (sel.closest('.xans-product-addproduct .product > li')||sel.closest('.product > li')||sel.closest('li'))) || null;
        var salePriceNode=row&&row.querySelector('.information .salePrice');
        price=mrsParsePriceValue(mrsGetText(salePriceNode));
        if(!(price>0)){
          var basePriceNode=row&&(row.querySelector('.information .price')||row.querySelector('.price'));
          price=mrsParsePriceValue(mrsGetText(basePriceNode));
        }
      }
      if(price>0) total+=price;
    }
    return total;
  }
  function mrsGetNativeTotalPrice(){
    var selectors=[
      '#totalPrice .total strong','#totalPrice .total span','#totalPrice strong','#totalPrice',
      '.quantity_price .total strong','.quantity_price .total span','.quantity_price strong','.quantity_price',
      '#totalProducts tfoot .right strong','#totalProducts tfoot strong','#totalProducts .total strong','#totalProducts .total'
    ];
    for(var i=0;i<selectors.length;i++){
      var nodes=document.querySelectorAll(selectors[i]);
      for(var j=nodes.length-1;j>=0;j--){
        var price=mrsParsePriceValue(mrsGetText(nodes[j]));
        if(price>0)return price;
      }
    }
    return 0;
  }
  function mrsSyncStickySoon(){
    if(_mrsStickyTimer)clearTimeout(_mrsStickyTimer);
    _mrsStickyTimer=setTimeout(function(){
      var count=document.querySelectorAll('.mrs-card.selected').length;
      if(count>0)mrsUpdateSticky(count);
    },80);
    setTimeout(function(){
      var count=document.querySelectorAll('.mrs-card.selected').length;
      if(count>0)mrsUpdateSticky(count);
    },260);
    setTimeout(function(){
      var count=document.querySelectorAll('.mrs-card.selected').length;
      if(count>0)mrsUpdateSticky(count);
    },700);
  }
  function mrsObserveNativeTotals(){
    var targets=[];
    var totalProducts=document.getElementById('totalProducts');
    var totalPrice=document.getElementById('totalPrice')||document.querySelector('div#totalPrice');
    var quantityPrice=document.querySelector('.quantity_price');
    if(totalProducts)targets.push(totalProducts);
    if(totalPrice)targets.push(totalPrice);
    if(quantityPrice)targets.push(quantityPrice);
    if(!targets.length){setTimeout(mrsObserveNativeTotals,500);return;}
    if(_mrsNativeObserver){try{_mrsNativeObserver.disconnect();}catch(e){}}
    _mrsNativeObserver=new MutationObserver(function(){mrsSyncStickySoon();});
    for(var i=0;i<targets.length;i++) _mrsNativeObserver.observe(targets[i],{childList:true,subtree:true,characterData:true});
    mrsSyncStickySoon();
  }
  function mrsUpdateSticky(count){
    var bar=document.getElementById('mrsStickyBar');
    if(!bar)return;
    bar.classList.remove('visible');
    bar.style.display='none';
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
    var wasSelected=card.classList.contains('selected');
    var allCards=document.querySelectorAll('.mrs-card');
    for(var i=0;i<allCards.length;i++) allCards[i].classList.remove('selected');
    var selectedSeason=0;
    var prevTotal=PRICE_BY_COUNT[_prevCount]?PRICE_BY_COUNT[_prevCount]+mrsGetExpectedAddonPrice():0;
    if(!wasSelected){
      card.classList.add('selected');
      selectedSeason=parseInt(card.getAttribute('data-season'),10)||0;
    }
    var infoEl=document.getElementById('mrsInfo');
    if(infoEl) infoEl.innerHTML=selectedSeason?INFO_BY_COUNT[1]:'<p class="mrs-title">✍️ 적어라, 메아리 되어 돌아온다</p><p class="mrs-info-copy" style="color:#8B6914;font-size:13px;margin-top:2px">나에게 맞는 시즌을 골라보세요</p>';
    if(selectedSeason&&PRICE_BY_COUNT[1]){
      var priceEl=document.getElementById('mrsPriceNum');
      if(priceEl) priceEl.textContent=prevTotal.toLocaleString('ko-KR');
      requestAnimationFrame(function(){mrsAnimatePrice(prevTotal,PRICE_BY_COUNT[1]+mrsGetExpectedAddonPrice(),350);});
    }
    mrsUpdateTagline(selectedSeason);mrsUpdateSticky(selectedSeason?1:0);mrsUpdateBenefit();_prevCount=selectedSeason?1:0;
    mrsSyncNativeSelection(true);
    setTimeout(mrsSyncStickySoon,120);
  };
  window.mrsHintAdd=function(){var cards=document.querySelectorAll('.mrs-card:not(.selected)');if(cards.length)cards[0].click();};

  function mrsUpdateBenefit(){
    var rows=document.querySelectorAll('.mrs-benefit-row');
    var hasSelection=document.querySelectorAll('.mrs-card.selected').length>0;
    for(var i=0;i<rows.length;i++) rows[i].classList.remove('active');
    if(hasSelection&&rows[0]) rows[0].classList.add('active');
  }

  window.mrsBenefitSelect=function(){
    var firstUnselected=document.querySelector('.mrs-card:not(.selected)');
    if(firstUnselected) firstUnselected.click();
  };

  function mrsTriggerNativeChange(sel){
    if(window.jQuery){window.jQuery(sel).trigger('change');}
    else{sel.dispatchEvent(new Event('change',{bubbles:true}));}
  }
  function mrsSetProductOptionVisible(show){
    var prodOpt=document.querySelector('.productOption');
    if(!prodOpt)return;
    if(show) prodOpt.setAttribute('style','position:fixed!important;left:0!important;top:0!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0.01!important;z-index:-1!important;');
    else prodOpt.setAttribute('style','position:fixed!important;left:-99999px!important;top:-99999px!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important;');
  }
  function mrsSuppressNativeOptionAlerts(ms){
    var orig=window._mrsOrigAlert || window.alert;
    window._mrsOrigAlert=orig;
    window.alert=function(msg){
      var text=(msg||'')+'';
      if(text.indexOf('이미 선택한 옵션')!==-1 || text.indexOf('이미 선택된 옵션')!==-1 || text.indexOf('아래 리스트에서')!==-1 || text.indexOf('삭제 후 다시 선택')!==-1){
        return;
      }
      return window._mrsOrigAlert.apply(this, arguments);
    };
    if(_mrsAlertRestoreTimer) clearTimeout(_mrsAlertRestoreTimer);
    _mrsAlertRestoreTimer=setTimeout(function(){
      if(window._mrsOrigAlert) window.alert=window._mrsOrigAlert;
    }, ms || 1200);
  }
  function mrsClearMainOptionRowsSilent(){
    var removed=false;
    var dels=document.querySelectorAll('#totalProducts .option_box_del, #totalProducts img[alt="삭제"]');
    for(var i=dels.length-1;i>=0;i--){
      var row=dels[i].closest('tr');
      if(row&&row.classList.contains('add_product')) continue;
      var link=dels[i].closest('a')||dels[i];
      try{link.click();removed=true;}catch(e){}
    }
    var tp=document.getElementById('totalProducts');
    if(tp){
      var tbody=tp.querySelector('tbody');
      if(tbody){
        var rows=tbody.querySelectorAll('tr');
        for(var j=rows.length-1;j>=0;j--){
          if(rows[j].classList.contains('add_product')) continue;
          if(rows[j].querySelector('th')) continue;
          rows[j].remove();
          removed=true;
        }
      }
    }
    return removed;
  }
  function mrsClearOptions(){
    var removed=mrsClearMainOptionRowsSilent();
    var sel=document.getElementById('product_option_id1');
    if(sel){
      mrsSetProductOptionVisible(true);
      sel.value='*';
      mrsTriggerNativeChange(sel);
      setTimeout(function(){ mrsSetProductOptionVisible(false); },300);
    }
    _mrsAddonSubmitCache=null;
    mrsSyncPenAddonSelection(false);
    return removed;
  }
  function mrsSyncNativeSelection(force){
    var sel=document.getElementById('product_option_id1');
    if(!sel) return false;
    var desiredValue=COMBO_MAP[mrsGetComboKey()]||'*';
    mrsSetProductOptionVisible(true);
    if(!force){
      if(sel.value!==desiredValue) sel.value=desiredValue;
      mrsTriggerNativeChange(sel);
      setTimeout(function(){
        mrsSetProductOptionVisible(false);
        if(desiredValue==='*'){
          _mrsAddonSubmitCache=null;
          mrsSyncPenAddonSelection(false);
          return;
        }
        mrsSyncPenAddonSelection(_penAdded);
        if(_penAdded) mrsPrimeAddonSubmitCache('native-selection-ready');
      },300);
      return desiredValue!=='*';
    }
    mrsSuppressNativeOptionAlerts(1500);
    var hadRows=mrsClearMainOptionRowsSilent();
    sel.value='*';
    mrsTriggerNativeChange(sel);
    if(desiredValue==='*'){
      setTimeout(function(){
        mrsSetProductOptionVisible(false);
        _mrsAddonSubmitCache=null;
        mrsSyncPenAddonSelection(false);
      },300);
      return false;
    }
    setTimeout(function(){
      sel.value=desiredValue;
      mrsTriggerNativeChange(sel);
      setTimeout(function(){
        mrsSetProductOptionVisible(false);
        mrsSyncPenAddonSelection(_penAdded);
        if(_penAdded) mrsPrimeAddonSubmitCache('native-selection-built');
      },300);
    }, hadRows ? 120 : 60);
    return true;
  }
  function mrsSelectOption(optionValue){
    var sel=document.getElementById('product_option_id1');if(!sel)return false;
    mrsSetProductOptionVisible(true);
    sel.value=optionValue;
    mrsTriggerNativeChange(sel);
    setTimeout(function(){ mrsSetProductOptionVisible(false); },300);
    return true;
  }

  function mrsGetProductName(){
    var selectors=['.headingArea h2','.headingArea .name','meta[property="og:title"]'];
    for(var i=0;i<selectors.length;i++){
      var el=document.querySelector(selectors[i]);
      if(!el) continue;
      var text=(el.getAttribute&&el.getAttribute('content')) || mrsGetText(el);
      if(text) return text;
    }
    return '[재구매 15% 할인] 메아리셋 90일 목표달성 다이어리';
  }
  function mrsGetMainSelectedItem(){
    var input=document.querySelector('#totalProducts input[name="item_code[]"]');
    if(!input||!input.value) return '';
    return '1||'+String(input.value||'').trim();
  }
  function mrsGetAddonSelectedItems(){
    var inputs=document.querySelectorAll('#totalProducts input[name="basket_add_product[]"]');
    var values=[];
    for(var i=0;i<inputs.length;i++){
      var val=String(inputs[i].value||'').trim();
      if(val) values.push('1||'+val);
    }
    return values;
  }
  function mrsBuildAddonSubmitCache(){
    var mainSelectedItem=mrsGetMainSelectedItem();
    var addonSelectedItems=mrsGetAddonSelectedItems();
    var option1=String((document.querySelector('#totalProducts input[name="item_code[]"]')||{}).value||'');
    if(!mainSelectedItem||!option1||!addonSelectedItems.length) return null;
    var params=new URLSearchParams();
    params.append('selected_item[]',mainSelectedItem);
    for(var i=0;i<addonSelectedItems.length;i++) params.append('selected_add_item[]',addonSelectedItems[i]);
    params.append('relation_product','yes');
    params.append('is_individual','F');
    params.append('product_no','49');
    params.append('product_name',mrsGetProductName());
    params.append('main_cate_no','1');
    params.append('display_group','2');
    params.append('option_type','T');
    params.append('product_min','1');
    params.append('command','add');
    params.append('has_option','T');
    params.append('product_price','24650');
    params.append('multi_option_schema','');
    params.append('multi_option_data','');
    params.append('delvType','A');
    params.append('redirect','1');
    params.append('product_max_type','F');
    params.append('product_max','-1');
    params.append('basket_type','A0000');
    params.append('ch_ref','');
    params.append('prd_detail_ship_type','');
    params.append('quantity','1');
    params.append('is_direct_buy','F');
    params.append('optionids[]','option1');
    params.append('needed[]','option1');
    params.append('option1',option1);
    params.append('quantity_override_flag','F');
    params.append('is_cultural_tax','F');
    return {
      mainSelectedItem: mainSelectedItem,
      addonSelectedItems: addonSelectedItems,
      option1: option1,
      body: params.toString()
    };
  }
  function mrsPrimeAddonSubmitCache(){
    if(_mrsAddonPrimeTimer) clearTimeout(_mrsAddonPrimeTimer);
    _mrsAddonPrimeTimer=setTimeout(function(){
      _mrsAddonSubmitCache=mrsBuildAddonSubmitCache();
    },0);
  }
  function mrsGetAddonSubmitCache(){
    var currentMain=mrsGetMainSelectedItem();
    var currentAddons=mrsGetAddonSelectedItems();
    if(_mrsAddonSubmitCache){
      if(!currentMain) return _mrsAddonSubmitCache;
      if(_mrsAddonSubmitCache.mainSelectedItem===currentMain && (!currentAddons.length || _mrsAddonSubmitCache.addonSelectedItems.join('||')===currentAddons.join('||'))) return _mrsAddonSubmitCache;
    }
    _mrsAddonSubmitCache=mrsBuildAddonSubmitCache();
    return _mrsAddonSubmitCache;
  }
  function mrsFinishSubmitFlow(restoreFns,_origCheck){
    _mrsSubmitting=false;
    window.alert=restoreFns.alert;
    window.confirm=restoreFns.confirm;
    if(_origCheck) window.checkOptionRequired=_origCheck;
    else delete window.checkOptionRequired;
  }
  function mrsSubmitWithAddon(type, restoreFns, _origCheck){
    var cache=mrsGetAddonSubmitCache();
    if(!cache||!cache.mainSelectedItem){
      mrsFinishSubmitFlow(restoreFns, _origCheck);
      restoreFns.alert('선택한 옵션 정보를 다시 불러오지 못했습니다. 다시 시도해주세요.');
      return;
    }
    fetch('/exec/front/order/basket/',{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
      body:cache.body,
      credentials:'include'
    }).then(function(res){
      return res.text().then(function(text){ return { status: res.status, text: text, url: res.url }; });
    }).then(function(payload){
      var result=null;
      try{ result=payload.text?JSON.parse(payload.text):null; }catch(e){}
      if(result&&result.result===0){
        mrsFinishSubmitFlow(restoreFns, _origCheck);
        if(type===1){
          if(result.isLogin==='T') location.href='/order/orderform.html?basket_type=A0000&delvtype=A';
          else location.href='/member/login.html?noMember=1&returnUrl=%2Forder%2Forderform.html%3Fbasket_type%3DA0000%26delvtype%3DA&delvtype=A';
          return;
        }
        location.href='/order/basket.html';
        return;
      }
      mrsFinishSubmitFlow(restoreFns, _origCheck);
      restoreFns.alert(result&&result.alertMSG?result.alertMSG:'입력하신 정보가 올바르지 않습니다.');
    }).catch(function(){
      mrsFinishSubmitFlow(restoreFns, _origCheck);
      restoreFns.alert('구매 정보를 전송하지 못했습니다. 다시 시도해주세요.');
    });
  }
  function mrsFinalizeSubmit(type, restoreFns){
    var _origCheck=window.checkOptionRequired;window.checkOptionRequired=function(){return true;};
    if(_penAdded&&type===1){
      mrsSubmitWithAddon(type, restoreFns, _origCheck);
      return;
    }
    try{if(typeof product_submit!=='undefined'){var btnEl=type===2?document.querySelector('button.actionCart'):document.querySelector('a.btnSubmit.gFull');product_submit(type,'/exec/front/order/basket/',btnEl||null);}}catch(e){}
    setTimeout(function(){mrsFinishSubmitFlow(restoreFns,_origCheck);},1800);
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
    window.confirm=function(msg){if(_mrsSubmitting&&msg.indexOf('함께 구매')!==-1)return true;return _origConfirm.apply(this,arguments);};
    mrsSuppressNativeOptionAlerts(5000);
    var finalize=function(){
      mrsSyncPenAddonSelection(_penAdded,function(){
        mrsFinalizeSubmit(type,{alert:_origAlert,confirm:_origConfirm});
      });
    };
    mrsClearOptions();
    setTimeout(function(){
      mrsSelectOption(optVal);
      var waitCount=0;
      var waitForOption=function(){
        var tp=document.getElementById('totalProducts'),hasItem=tp&&tp.querySelector('tbody tr, .option_box');
        if(!hasItem&&waitCount<15){waitCount++;setTimeout(waitForOption,200);return;}
        if(_penAdded) mrsPrimeAddonSubmitCache();
        finalize();
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
          var clickTarget=el;
          var fastClick=function(){
            mrsSyncPenAddonSelection(_penAdded,function(){
              _mrsPayBypass=true;
              clickTarget.click();
            });
          };
          mrsSyncNativeSelection(true);
          setTimeout(fastClick,120);
          return;
        }
        el=el.parentElement;depth++;
      }
    },true);

    document.addEventListener('change',function(e){
      var el=e.target;if(!el)return;
      var id=(el.id||'').toLowerCase(),name=(el.name||'').toLowerCase(),cls=(el.className||'').toString().toLowerCase();
      if(id.indexOf('addproduct')!==-1||name.indexOf('addproduct')!==-1||cls.indexOf('addproduct')!==-1||id.indexOf('option')!==-1){
        mrsSyncStickySoon();
      }
    },true);
  }

  /* ── 네이버페이 방어: 원래 위치에서 이탈 방지 ── */
  function mrsGuardNpay(){
    var appPay = document.querySelector('.app-pay-wrap');
    if(!appPay) return;

    var npay = document.getElementById('NaverChk_Button');
    if(npay) {
      npay.style.setProperty('display','block','important');
      npay.style.setProperty('visibility','visible','important');
      if(!appPay.contains(npay)) {
        appPay.insertBefore(npay, appPay.firstChild);
      }
    }

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
    setTimeout(function(){ guard.disconnect(); }, 8000);
  }


  function mrsInjectPenAddonStyles(){
    if(document.getElementById('mrsPenAddonStyles')) return;
    var penCss=document.createElement('style');
    penCss.id='mrsPenAddonStyles';
    penCss.textContent='\
    #mrsOptionWrap #mrsPenAddonBlock{margin-top:16px}\
    #mrsOptionWrap .addon-section-label{font-size:13px;color:#1C1A17;font-weight:800;letter-spacing:.1px;margin:0 0 10px;padding-left:2px;display:flex;align-items:center;gap:6px}\
    #mrsOptionWrap .addon-section-label::before{content:"✦";color:#D94A4A;font-size:12px}\
    #mrsOptionWrap .bundle-reason{font-size:12px;color:#8A8173;line-height:1.45;margin:-4px 0 10px 2px;letter-spacing:-.1px;text-align:left;display:block;width:100%}\
    #mrsOptionWrap .addon{background:#fff;border:1px solid #E8DFD0;border-radius:12px;padding:14px;margin-bottom:12px;transition:border-color .18s ease,background .18s ease,transform .22s cubic-bezier(0.34,1.56,0.64,1);display:flex;align-items:center;gap:12px;flex-wrap:nowrap;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;box-shadow:0 2px 10px rgba(28,26,23,.06)}\
    #mrsOptionWrap .addon:hover{border-color:#D9CDB8}\
    #mrsOptionWrap .addon.selected{border-color:#1C1A17;background:#FBF6ED}\
    #mrsOptionWrap .addon.bounce{animation:cardBounce .32s cubic-bezier(0.34,1.56,0.64,1)}\
    @keyframes cardBounce{0%{transform:scale(1)}40%{transform:scale(.975)}100%{transform:scale(1)}}\
    #mrsOptionWrap .addon-img{width:84px;flex-shrink:0;display:flex;align-items:center;justify-content:center}\
    #mrsOptionWrap .addon-img img{width:100%;height:auto;display:block}\
    #mrsOptionWrap .addon-info{flex:1;min-width:0;text-align:left}\
    #mrsOptionWrap .addon-head{display:flex;flex-direction:column;align-items:flex-start;gap:6px;margin-bottom:4px}\
    #mrsOptionWrap .addon-title{font-size:13.5px;font-weight:700;display:block;line-height:1.25;width:100%;text-align:left}\
    #mrsOptionWrap .addon-title-text{white-space:nowrap;display:block}\
    #mrsOptionWrap .limit-tag{font-size:9px;font-weight:800;color:#7A5F28;border:1px solid #C9A96E;background:rgba(201,169,110,0.08);padding:2px 6px;border-radius:2px;letter-spacing:.8px;text-transform:uppercase;line-height:1.3;white-space:nowrap}\
    #mrsOptionWrap .addon-meta{font-size:11.5px;color:#5B5349;line-height:1.55;margin-bottom:9px;text-align:left}\
    #mrsOptionWrap .addon-meta .usp{display:block;position:relative;padding-left:11px;white-space:nowrap}\
    #mrsOptionWrap .addon-meta .usp::before{content:"";position:absolute;left:0;top:7px;width:4px;height:4px;border-radius:50%;background:#C9A96E}\
    #mrsOptionWrap .addon-price-line{display:flex;flex-direction:column;align-items:flex-start;gap:4px}\
    #mrsOptionWrap .addon-price-row1{display:flex;align-items:center;gap:6px;flex-wrap:nowrap}\
    #mrsOptionWrap .addon-price-row2{display:flex;align-items:center;flex-wrap:nowrap;gap:6px}\
    #mrsOptionWrap .addon-price-label{font-size:11px;color:#8A8173;font-weight:500;white-space:nowrap}\
    #mrsOptionWrap .addon-price-line .strike{color:#8A8173;text-decoration:line-through;font-size:11px;font-weight:500;white-space:nowrap}\
    #mrsOptionWrap .addon-price-line .now{font-weight:800;color:#1C1A17;font-size:17px;white-space:nowrap}\
    #mrsOptionWrap .addon-price-line .save{font-size:12px;font-weight:800;color:#fff;background:#D94A4A;padding:3px 8px;border-radius:12px;white-space:nowrap;margin-left:2px}\
    #mrsOptionWrap .addon-toggle{background:#fff;color:#1C1A17;border:1.5px solid #1C1A17;border-radius:999px;padding:10px 16px;font-size:12px;font-weight:700;cursor:pointer;flex-shrink:0;transition:background .15s ease,color .15s ease,border-color .15s ease;display:flex;align-items:center;gap:4px;min-height:40px;-webkit-tap-highlight-color:transparent}\
    #mrsOptionWrap .addon-toggle:hover{background:#FBF6ED}\
    #mrsOptionWrap .addon-toggle .ico{font-size:14px;line-height:1;font-weight:400;display:inline-block;transition:transform .25s cubic-bezier(0.34,1.56,0.64,1)}\
    #mrsOptionWrap .addon.selected .addon-toggle .ico{animation:checkPop .32s cubic-bezier(0.34,1.56,0.64,1)}\
    @keyframes checkPop{0%{transform:scale(.4) rotate(-12deg)}60%{transform:scale(1.25) rotate(4deg)}100%{transform:scale(1) rotate(0)}}\
    #mrsOptionWrap .addon.selected .addon-toggle{background:#1C1A17;color:#fff;border-color:#1C1A17}\
    #mrsOptionWrap .addon.selected .addon-toggle .ico::before{content:"✓"}\
    #mrsOptionWrap .addon-toggle .ico::before{content:"+"}\
    #mrsOptionWrap .addon.selected .addon-toggle .txt::before{content:"추가됨"}\
    #mrsOptionWrap .addon-toggle .txt::before{content:"담기"}\
    @media(min-width:768px){#mrsOptionWrap .addon{gap:10px;padding:14px 16px 12px 14px}#mrsOptionWrap .addon-img{width:76px}#mrsOptionWrap .addon-info{margin-left:-6px}#mrsOptionWrap .addon-title-text{font-size:13px;white-space:nowrap}}\
    @media(max-width:767px){#mrsOptionWrap .addon{padding:12px;gap:10px}#mrsOptionWrap .addon-img{width:74px}#mrsOptionWrap .addon-head{gap:5px}#mrsOptionWrap .addon-title{font-size:13px}#mrsOptionWrap .addon-meta{font-size:11px}#mrsOptionWrap .addon-price-line .now{font-size:17px}#mrsOptionWrap .addon-price-row2{gap:6px}}\
    ';
    document.head.appendChild(penCss);
  }

  function mrsEnsurePenAddon(){
    var guide=document.getElementById('mrsBenefitGuide')||document.getElementById('mrsInfo');
    if(!guide||document.getElementById('mrsPenAddonBlock')) return;
    guide.insertAdjacentHTML('afterend','\
    <div id="mrsPenAddonBlock">\
      <div class="addon-section-label">함께 구매하면 <span style="color:#D94A4A; margin-left:2px;">34% 할인</span></div>\
      <div class="bundle-reason">✍️ 펜을 따로 챙기지 않아도 돼요</div>\
      <div class="addon" id="penAddon">\
        <div class="addon-img">\
          <img loading="lazy" decoding="async" src="'+MRS_PEN_IMAGE_DATA_URI+'" alt="메아리셋 클립펜 M13 Midnight Black" />\
        </div>\
        <div class="addon-info">\
          <div class="addon-head">\
            <span class="limit-tag">LIMITED EDITION</span>\
            <div class="addon-title">\
              <span class="addon-title-text">[메아리셋 전용] 한정판 클립펜</span>\
            </div>\
          </div>\
          <div class="addon-meta">\
            <span class="usp">노트에 끼워 휴대하는 펜</span>\
            <span class="usp">독일 0.7mm 펜촉</span>\
            <span class="usp">글로벌 3대 디자인 어워드</span>\
          </div>\
          <div class="addon-price-line">\
            <div class="addon-price-row1">\
              <span class="addon-price-label">정상가</span>\
              <span class="strike">15,000원</span>\
            </div>\
            <div class="addon-price-row2">\
              <span class="addon-price-label">같이 구매 시</span>\
              <span class="now">9,900원</span>\
              <span class="save">-34% 할인</span>\
            </div>\
          </div>\
        </div>\
        <button class="addon-toggle" id="penToggle" type="button">\
          <span class="ico"></span>\
          <span class="txt"></span>\
        </button>\
      </div>\
    </div>');
    var penCard=document.getElementById('penAddon');
    var penToggle=document.getElementById('penToggle');
    if(!penCard||!penToggle) return;
    function togglePen(e){
      if(e) e.stopPropagation();
      var count=document.querySelectorAll('.mrs-card.selected').length;
      var prevAdded=_penAdded;
      var prevTotal=(count>0&&PRICE_BY_COUNT[count])?(PRICE_BY_COUNT[count]+(prevAdded?MRS_PEN_PRICE:0)):0;
      _penAdded=!_penAdded;
      var nextTotal=(count>0&&PRICE_BY_COUNT[count])?(PRICE_BY_COUNT[count]+(_penAdded?MRS_PEN_PRICE:0)):0;
      penCard.classList.toggle('selected',_penAdded);
      penCard.classList.remove('bounce');
      void penCard.offsetWidth;
      penCard.classList.add('bounce');
      mrsSyncPenAddonSelection(_penAdded);
      if(count>0){
        mrsAnimatePrice(prevTotal,nextTotal,350);
        mrsUpdateSticky(count);
      }
    }
    penCard.addEventListener('click',togglePen);
    penToggle.addEventListener('click',function(e){
      e.stopPropagation();
      togglePen();
    });
  }

  /* ── 초기화 ── */
  function mrsEnsureUI(){
    var readyWrap = document.querySelector('#mrsOptionWrap .mrs-card');
    if(!readyWrap) insertUI();
  }

  var _mrsBaseEnsureUI=mrsEnsureUI;
  mrsEnsureUI=function(){
    _mrsBaseEnsureUI();
    mrsInjectPenAddonStyles();
    mrsEnsurePenAddon();
  };

  function mrsInit(){
    insertUI();
    mrsInstallCapture();
    setTimeout(mrsObserveNativeTotals, 300);
    setTimeout(mrsSyncStickySoon, 500);
    setTimeout(mrsEnsureUI, 300);
    setTimeout(mrsEnsureUI, 1200);
    setTimeout(mrsEnsureUI, 2500);
    setTimeout(mrsGuardNpay, 1200);
    setTimeout(mrsGuardNpay, 3500);
    mrsInjectPenAddonStyles();
    mrsEnsurePenAddon();
    setTimeout(mrsEnsurePenAddon,400);
    setTimeout(mrsEnsurePenAddon,1200);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mrsInit);
  else mrsInit();
  window.addEventListener('load', function(){ mrsEnsureUI(); mrsEnsurePenAddon(); });
})();
