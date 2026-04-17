/**
 * 메아리셋 옵션 UI v7.9 — 외부 스크립트 버전
 * product_no=49 전용 (27과 분리된 재구매 자산)
 * v8.0: 모바일 4열 단일행 + NaverPay MutationObserver 방어
 */
(function(){
  var MRS_VERSION = 155; /* 버전 번호 (15.5 = 155) — product_no=49 카카오 버튼 직접 주문서 우회 */
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

  function mrsGetComboKey(){
    var cards=document.querySelectorAll('.mrs-card.selected'),seasons=[];
    for(var i=0;i<cards.length;i++) seasons.push(parseInt(cards[i].getAttribute('data-season')));
    seasons.sort(); return seasons.join(',');
  }

  function mrsGetKakaoButtonConfig(){
    if(window._mrsKakaoConfig) return window._mrsKakaoConfig;
    var scripts=document.scripts||[];
    function grab(text,re){ var m=text.match(re); return m?m[1]:null; }
    for(var i=0;i<scripts.length;i++){
      var t=(scripts[i].textContent||scripts[i].innerText||'');
      if(t.indexOf('kakaoCheckout.createButton')===-1 || t.indexOf('authKey:')===-1) continue;
      var cfg={
        authKey: grab(t,/authKey:\s*"([^"]+)"/),
        shopProductId: grab(t,/shopProductId:\s*'([^']+)'/),
        buttonType: grab(t,/buttonType:\s*"([^"]+)"/),
        darkMode: grab(t,/darkMode:\s*(true|false)/)==='true',
        showWishButton: grab(t,/showWishButton:\s*(true|false)/)!=='false',
        usePayOrder: grab(t,/usePayOrder:\s*(true|false)/)!=='false',
        isLogin: grab(t,/isLogin:\s*(true|false)/)==='true',
        snackMode: grab(t,/snackMode:\s*(true|false)/)==='true'
      };
      if(cfg.authKey){ window._mrsKakaoConfig=cfg; return cfg; }
    }
    return null;
  }
  function mrsRunKakaoFallbackCheckout(btn){
    if(!COMBO_MAP[mrsGetComboKey()]){
      alert('시즌을 먼저 선택해 주세요 😊');
      return false;
    }
    if(btn && btn.getAttribute('data-loading')==='T') return false;
    if(btn){
      btn.setAttribute('data-loading','T');
      btn.textContent='카카오 주문서 여는 중...';
      btn.style.opacity='0.7';
    }
    mrsSyncNativeSelection(true);
    setTimeout(function(){
      if(typeof setKakaoBasketAction!=='function'){
        if(btn){
          btn.setAttribute('data-loading','F');
          btn.textContent='카카오페이 간편결제';
          btn.style.opacity=COMBO_MAP[mrsGetComboKey()] ? '1' : '0.45';
        }
        alert('카카오 주문 경로를 찾지 못했어요. 다시 시도해 주세요.');
        return;
      }
      setKakaoBasketAction().then(function(){
        if(typeof(basket_type)==='undefined') basket_type='A0000';
        var oTarget=(typeof CAPP_SHOP_FRONT_COMMON_UTIL!=='undefined' && CAPP_SHOP_FRONT_COMMON_UTIL.findTargetFrame)
          ? CAPP_SHOP_FRONT_COMMON_UTIL.findTargetFrame()
          : window;
        oTarget.location.href='/order/orderform.html?basket_type='+basket_type+'&delvtype='+delvtype+'&paymethod=kakaopay&only_one_paymethod=T';
      }).catch(function(){
        if(btn){
          btn.setAttribute('data-loading','F');
          btn.textContent='카카오페이 간편결제';
          btn.style.opacity=COMBO_MAP[mrsGetComboKey()] ? '1' : '0.45';
        }
        alert('카카오 주문서 연결에 실패했어요. 다시 시도해 주세요.');
      });
    }, 260);
    return true;
  }
  function mrsSyncKakaoButton(){
    var box=document.getElementById('appPaymentButtonBox');
    if(!box) return false;
    var enabled=!!(COMBO_MAP[mrsGetComboKey()]);
    box.innerHTML='';
    var wrap=document.createElement('div');
    wrap.id='mrsKakaoProxyWrap';
    wrap.style.cssText='margin-top:8px;';
    var btn=document.createElement('button');
    btn.type='button';
    btn.id='mrsKakaoProxyBtn';
    btn.textContent='카카오페이 간편결제';
    btn.style.cssText='width:100%;height:45px;border:0;border-radius:8px;background:#FEE500;color:#191919;font-weight:700;font-size:15px;cursor:pointer;';
    if(!enabled){
      btn.style.opacity='0.45';
      btn.style.cursor='not-allowed';
    }
    btn.addEventListener('click', function(e){
      e.preventDefault();
      if(!COMBO_MAP[mrsGetComboKey()]){
        alert('시즌을 먼저 선택해 주세요 😊');
        return;
      }
      mrsRunKakaoFallbackCheckout(btn);
    });
    wrap.appendChild(btn);
    box.appendChild(wrap);
    return true;
  }


  function mrsScheduleKakaoButtonSync(){
    var delays=[80,250,700,1500,3000];
    for(var i=0;i<delays.length;i++){
      (function(delay){
        setTimeout(function(){ mrsSyncKakaoButton(); }, delay);
      })(delays[i]);
    }
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
    if(!wasSelected){
      card.classList.add('selected');
      selectedSeason=parseInt(card.getAttribute('data-season'),10)||0;
    }
    var infoEl=document.getElementById('mrsInfo');
    if(infoEl) infoEl.innerHTML=selectedSeason?INFO_BY_COUNT[1]:'<p class="mrs-title">✍️ 적어라, 메아리 되어 돌아온다</p><p class="mrs-info-copy" style="color:#8B6914;font-size:13px;margin-top:2px">나에게 맞는 시즌을 골라보세요</p>';
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
      if(text.indexOf('이미 선택된 옵션')!==-1 || text.indexOf('아래 리스트에서')!==-1 || text.indexOf('삭제 후 다시 선택')!==-1){
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
      mrsScheduleKakaoButtonSync();
      setTimeout(function(){ mrsSetProductOptionVisible(false); },300);
      return desiredValue!=='*';
    }
    mrsSuppressNativeOptionAlerts(1500);
    var hadRows=mrsClearMainOptionRowsSilent();
    sel.value='*';
    mrsTriggerNativeChange(sel);
    if(desiredValue==='*'){
      mrsScheduleKakaoButtonSync();
      setTimeout(function(){ mrsSetProductOptionVisible(false); },300);
      return false;
    }
    setTimeout(function(){
      sel.value=desiredValue;
      mrsTriggerNativeChange(sel);
      mrsScheduleKakaoButtonSync();
      setTimeout(function(){ mrsSetProductOptionVisible(false); },300);
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

    document.addEventListener('click',function(e){
      var el=e.target,depth=0;
      while(el&&el.tagName!=='BODY'&&depth<6){
        var cls=(el.className||'').toString();
        if(cls.indexOf('kakao')!==-1||cls.indexOf('kakaopay')!==-1||cls.indexOf('naverpay')!==-1||cls.indexOf('naver-pay')!==-1||cls.indexOf('npay')!==-1||cls.indexOf('checkout_btn')!==-1||cls.indexOf('Npay')!==-1){
          var count=document.querySelectorAll('.mrs-card.selected').length;
          if(!count){e.preventDefault();e.stopImmediatePropagation();alert('시즌을 먼저 선택해 주세요 😊');return;}
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

  /* ── 초기화 ── */
  function mrsEnsureUI(){
    var readyWrap = document.querySelector('#mrsOptionWrap .mrs-card');
    if(!readyWrap) insertUI();
  }

  function mrsInit(){
    insertUI();
    mrsInstallCapture();
    setTimeout(mrsObserveNativeTotals, 300);
    setTimeout(mrsSyncStickySoon, 500);
    setTimeout(mrsEnsureUI, 300);
    setTimeout(mrsEnsureUI, 1200);
    setTimeout(mrsEnsureUI, 2500);
    setTimeout(mrsScheduleKakaoButtonSync, 600);
    setTimeout(mrsScheduleKakaoButtonSync, 1800);
    setTimeout(mrsGuardNpay, 1200);
    setTimeout(mrsGuardNpay, 3500);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mrsInit);
  else mrsInit();
  window.addEventListener('load', function(){ mrsEnsureUI(); mrsScheduleKakaoButtonSync(); });
})();
