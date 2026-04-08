/**
 * 메아리셋 옵션 UI v7.9 — 외부 스크립트 버전
 * product_no=27 전용 (다른 상품에서는 실행 안 됨)
 * v8.0: 모바일 4열 단일행 + NaverPay MutationObserver 방어
 */
(function(){
  var MRS_VERSION = 133; /* 버전 번호 (13.3 = 133) — 상세 이미지 lazy-load fallback 강제 로드 */

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
    document.documentElement.classList.remove('mrs-ui-ready');
    window._npayMoved = false;
  }
  window._mrsOptionLoaded = true;
  window._mrsVersion = MRS_VERSION;

  /* product_no=27 에서만 실행 (SEO URL 대응) */
  var prdEl = document.querySelector('[data-prd-no]');
  var prdNo = prdEl ? prdEl.getAttribute('data-prd-no') : '';
  var urlHas27 = location.search.indexOf('product_no=27') !== -1 || location.href.indexOf('product_no=27') !== -1;
  if(!urlHas27 && prdNo !== '27'){ window._mrsOptionLoaded = false; return; }

  /* placeholder 중복 방지 (같은 버전 재실행 시) */

  /* 즉시 placeholder 생성 — CDN 구버전이 중복 실행되는 것 방지 */
  var _placeholder = document.createElement('div');
  _placeholder.id = 'mrsOptionWrap';
  _placeholder.style.display = 'none';
  (document.body || document.documentElement).appendChild(_placeholder);

  /* ── df-bannermanager JS 강제 fix (CSS !important만으론 SSP inline style 못 막음) ── */
  function _fixDfBanner(){
    var els = document.querySelectorAll('.df-bannermanager, .ssp.df-bannermanager');
    for(var i=0;i<els.length;i++){
      els[i].style.setProperty('pointer-events','none','important');
    }
  }
  _fixDfBanner();
  /* MutationObserver: SSP가 나중에 다시 만들거나 style 바꿔도 재적용 */
  if(window.MutationObserver){
    var _bannerObs = new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++){
        var m=muts[i];
        if(m.type==='childList'){ _fixDfBanner(); break; }
        if(m.type==='attributes' && m.target && m.target.classList && m.target.classList.contains('df-bannermanager')){
          _fixDfBanner(); break;
        }
      }
    });
    var _bodyEl = document.body || document.documentElement;
    _bannerObs.observe(_bodyEl, { childList:true, subtree:true, attributes:true, attributeFilter:['style','class'] });
  }
  /* 추가 안전망: 500ms 후 재실행 (SSP 비동기 로드 대응) */
  setTimeout(_fixDfBanner, 500);
  setTimeout(_fixDfBanner, 1500);

  /* ── CSS 주입 ── */
  var css = document.createElement('style');
  css.id = 'mrsStyles';
  css.textContent = '\
  .mrs-ui-ready .productOption{display:none!important}\
  .mrs-ui-ready #totalProducts,.mrs-ui-ready div#totalPrice,.mrs-ui-ready .quantity_price,.mrs-ui-ready .infoArea-footer .ec-base-help{display:none!important;height:0!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;opacity:0!important}\
  .mrs-ui-ready #totalProducts table,.mrs-ui-ready #totalProducts tbody,.mrs-ui-ready #totalProducts tr,.mrs-ui-ready #totalProducts td,.mrs-ui-ready #totalProducts th{display:none!important;height:0!important;padding:0!important;margin:0!important;border:0!important}\
  .mrs-ui-ready .infoArea-footer{padding-top:0!important;margin-top:0!important}\
  .mrs-ui-ready .infoArea-footer .productAction{margin-top:0!important}\
  .mrs-ui-ready .app-pay-wrap.mrs-empty{display:none!important;height:0!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important}\
  .mrs-ui-ready .price-spec__item.product_custom_css,.mrs-ui-ready .price-spec__item.product_price_css,.mrs-ui-ready tr.product_custom_css,.mrs-ui-ready tr.product_price_css{display:none!important}\
  .ssp.df-bannermanager,.df-bannermanager{pointer-events:none!important}\
  .ssp,.ssp__container,.ssp__list,.ssp__item--naver,.ssp__item--kakao{visibility:visible!important}\
  .ssp__item--naver a,.ssp__item--naver button,.ssp__item--naver [onclick],.ssp__item--kakao a,.ssp__item--kakao button,.ssp__item--kakao [onclick]{pointer-events:auto!important}\
  .mrs-ui-ready .xans-element.xans-product.xans-product-detaildesign.price-spec.flex.flex--v-center.relative{display:none!important}\
  .mrs-ui-ready .xans-element.xans-product.xans-product-detaildesign.detail-spec{display:none!important;padding:0!important;margin:0!important}\
  .mrs-ui-ready .xans-element.xans-product.xans-product-detaildesign.detail-spec table,.mrs-ui-ready .xans-element.xans-product.xans-product-detaildesign.detail-spec tbody{display:none!important;margin:0!important;padding:0!important}\
  .prd-name,.prd-name.flex,.prd-name.flex.flex--v-center{margin-bottom:12px!important}\
  .summary-info{line-height:1.24!important;margin:8px 0 4px!important}\
  .summary-info br,.price-spec__item.simple_desc_css br{content:"";display:block;margin-top:1px}\
  .price-spec__item.simple_desc_css div,.price-spec__item.simple_desc_css span{line-height:1.24!important}\
  .mrs-option-wrap{max-width:600px;margin:0 auto;font-family:"Malgun Gothic","맑은 고딕","Apple SD Gothic Neo",sans-serif;font-size:15px;line-height:1.5;color:#2D2D2D;background:#fff;border-radius:12px;padding:8px 8px 6px;text-align:center}\
  .mrs-option-wrap *{box-sizing:border-box;margin:0;padding:0;font-family:inherit}\
  .mrs-title{font-size:18px;font-weight:700;margin-bottom:6px;text-align:center;color:#1a1a1a;letter-spacing:-0.2px;line-height:1.45}\
  .mrs-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}\
  @media(min-width:768px){.mrs-option-wrap{max-width:100%;padding:6px 0 4px;margin:0 auto;border-radius:0;background:transparent}.mrs-grid{grid-template-columns:repeat(4,1fr)!important;gap:12px!important}.mrs-card-img{aspect-ratio:3/4!important}.mrs-card-label{font-size:15px;padding:8px 4px 2px;white-space:nowrap;letter-spacing:-0.1px}.mrs-card-color{font-size:12px;padding:0 4px 8px}.mrs-title{font-size:18px;margin-bottom:8px}.mrs-info{padding:12px 16px;min-height:70px;font-size:15px}}\
  .mrs-card{position:relative;border:none;border-radius:12px;overflow:hidden;cursor:pointer;transition:box-shadow .2s,transform .2s;background:#fff;box-shadow:0 0 0 1.5px #ddd;transform:scale(1);width:100%;margin:0}\
  .mrs-card:hover{box-shadow:0 0 0 1.5px #bcbcbc;transform:scale(1.02)}\
  .mrs-card.selected{box-shadow:0 0 0 2.5px #D4A853;transform:scale(1.04);z-index:2}\
  .mrs-start-badge{position:absolute;top:-1px;left:50%;transform:translateX(-50%);background:#D4A853;color:#fff;font-size:12px;font-weight:700;padding:6px 14px;border-radius:0 0 8px 8px;white-space:nowrap;letter-spacing:-0.1px;z-index:3}\
  @keyframes mrs-badge-bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-2px)}}\
  .mrs-start-badge{animation:mrs-badge-bounce 1.5s ease-in-out infinite}\
  .mrs-card.selected .mrs-start-badge{display:none}\
  .mrs-check{position:absolute;top:8px;right:8px;width:24px;height:24px;border-radius:50%;background:#D4A853;color:#fff;display:none;align-items:center;justify-content:center;font-size:14px;font-weight:700;z-index:2;transform:scale(0);transition:transform .2s cubic-bezier(.34,1.56,.64,1)}\
  .mrs-card.selected .mrs-check{display:flex;transform:scale(1)}\
  .mrs-card-img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;background:#f5f3ef;transition:filter .25s}\
  .mrs-card.selected .mrs-card-img{filter:brightness(1.08) saturate(1.15)}\
  .mrs-card::after{content:"";position:absolute;inset:0;background:rgba(212,168,83,0);transition:background .25s;pointer-events:none;z-index:1;border-radius:10px}\
  .mrs-card.selected::after{background:transparent}\
  .mrs-card-label{text-align:center;padding:8px 4px 2px;font-size:15px;font-weight:700;white-space:nowrap;line-height:1.35}\
  .mrs-card-color{text-align:center;font-size:12px;color:#777;padding:0 4px 8px;letter-spacing:0}\
  @media(max-width:767px){.mrs-option-wrap{padding:6px 4px;margin:0 auto}.mrs-title{font-size:17px;margin-bottom:8px}.mrs-card{width:100%}.mrs-card.selected{transform:scale(1.04);z-index:2}.mrs-card-img{aspect-ratio:3/4!important}.mrs-start-badge{font-size:12px;padding:4px 8px}.mrs-check{width:20px;height:20px;font-size:12px;top:4px;right:4px}.mrs-info{padding:10px 10px;min-height:auto;font-size:15px}.mrs-info-price{font-size:18px}.mrs-info-sub{font-size:12px}.mrs-info-copy{font-size:15px}.mrs-info-hint{font-size:15px;padding:6px 14px}}\
  .mrs-info{background:#FAFAF8;border:1px solid #eee;border-bottom:none;border-radius:10px 10px 0 0;padding:16px 18px;text-align:center;min-height:78px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;transition:all .25s}\
  .mrs-info-tag{display:inline-block;font-size:12px;font-weight:700;padding:4px 10px;border-radius:20px;margin-bottom:2px;line-height:1.3}\
  .mrs-info-tag.best{background:#E8F5E9;color:#2E7D32}\
  .mrs-info-tag.lowest{background:#FFF3E0;color:#E65100}\
  .mrs-info-price{font-size:20px;font-weight:700;color:#2D2D2D;line-height:1.4}\
  .mrs-info-sub{font-size:12px;color:#777;line-height:1.5;font-weight:400}\
  .mrs-info-copy{font-size:15px;font-weight:400;line-height:1.6;color:#6B5A2B}\
  .mrs-info-hint{display:inline-block;font-size:15px;color:#8B6914;font-weight:400;margin-top:8px;cursor:pointer;background:#FFF8E7;border:1.5px solid #D4A853;border-radius:20px;padding:6px 16px;transition:background .2s;line-height:1.45}\
  .mrs-info-hint:hover{background:#FFEFC0;text-decoration:none}\
  @keyframes mrs-hint-shine{0%,100%{box-shadow:0 0 0 0 rgba(212,168,83,.4)}60%{box-shadow:0 0 0 5px rgba(212,168,83,0)}}\
  .mrs-info-hint{animation:mrs-hint-shine 2.5s ease-in-out infinite}\
  @keyframes mrs-price-pop{0%{transform:scale(1)}40%{transform:scale(1.12)}100%{transform:scale(1)}}\
  .mrs-price-anim{animation:mrs-price-pop .35s ease-out}\
  .mrs-toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(30px);background:#0A0A0A;color:#fff;font-size:15px;font-weight:700;padding:12px 28px;border-radius:40px;box-shadow:0 4px 20px rgba(10,10,10,.28);z-index:99999;opacity:0;transition:opacity .3s,transform .3s;pointer-events:none;white-space:nowrap}\
  .mrs-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}\
  .mrs-toast.red{background:#DF002E;box-shadow:0 4px 20px rgba(223,0,46,.35)}\
  #mrsTagline{font-family:inherit;padding:0;font-size:18px;font-weight:700;color:#1A1A1A;line-height:1.5;letter-spacing:-0.2px;opacity:0;transition:opacity .35s,transform .35s;transform:translateY(4px);display:block;visibility:hidden;height:18px;min-height:18px;overflow:hidden}\
  #mrsTagline.visible{opacity:1;transform:translateY(0);display:block;visibility:visible;padding:18px 0 2px;height:auto;min-height:0;overflow:visible}\
  #mrsTagline.hidden{display:block!important;visibility:hidden!important;opacity:0!important;height:18px!important;min-height:18px!important;padding:0!important;overflow:hidden!important}\
  #mrsTagline em{font-style:normal;color:#D4A853}\
  .mrs-sticky{position:fixed;bottom:0;left:0;right:0;z-index:99998;background:#fff;border-top:1.5px solid #eee;padding:12px 16px;display:none;align-items:center;justify-content:space-between;gap:12px;box-shadow:0 -4px 16px rgba(0,0,0,.1)}\
  .mrs-sticky.visible{display:flex}\
  .mrs-sticky-info{display:flex;flex-direction:column;gap:4px}\
  .mrs-sticky-label{font-size:12px;color:#777;line-height:1.35}\
  .mrs-sticky-price{font-size:18px;font-weight:700;color:#2D2D2D;line-height:1.35}\
  .mrs-sticky-btn{background:#0A0A0A;color:#fff;border:none;border-radius:10px;padding:12px 24px;font-size:15px;font-weight:700;cursor:pointer;white-space:nowrap;transition:background .2s;font-family:inherit}\
  .mrs-sticky-btn:hover{background:#2a2a2a}\
  .mrs-sticky-btn:active{transform:scale(.97)}\
  a.btnSubmit.gFull{background-color:#0A0A0A!important;border-color:#0A0A0A!important;}\
  @media(min-width:768px){.mrs-sticky{display:none!important}}\
  @media(max-width:520px){.mrs-sticky-price{font-size:17px}.mrs-sticky-btn{padding:12px 18px;font-size:15px}}\
  .mrs-benefit-guide{font-family:inherit;background:#FAFAF8;border:1px solid #eee;border-radius:0 0 10px 10px;padding:8px 14px 10px;margin-top:0}\
  .mrs-benefit-title{font-size:15px;font-weight:700;color:#8B6914;text-align:center;margin-bottom:10px;letter-spacing:-0.1px;line-height:1.45}\
  .mrs-benefit-list{display:flex;flex-direction:column;gap:8px;text-align:left}\
  .mrs-benefit-row{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;transition:background .2s;cursor:pointer}\
  .mrs-benefit-row:hover{background:rgba(212,168,83,.06)}\
  .mrs-benefit-row.active{background:rgba(212,168,83,.1)!important}\
  .mrs-benefit-row:last-child{background:rgba(212,168,83,.06)}\
  .mrs-benefit-side{display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;gap:2px;min-width:72px;flex-shrink:0}\
  .mrs-benefit-before{font-size:12px;color:#BBBBBB;font-weight:400;line-height:1.1;text-decoration:line-through}\
  .mrs-benefit-discount{font-size:21px;font-weight:700;color:#DF002E;line-height:1.1;letter-spacing:-0.2px}\
  .mrs-benefit-main{display:flex;flex-direction:column;align-items:flex-start;gap:2px;min-width:0;flex:1}\
  .mrs-benefit-name{font-size:18px;font-weight:700;color:#1a1a1a;line-height:1.3}\
  .mrs-benefit-name strong{font-weight:700!important;font-size:inherit;line-height:inherit;color:inherit}\
  .mrs-benefit-count{font-size:18px;font-weight:700;color:#1a1a1a;margin-right:4px}\
  .mrs-benefit-pricebox{display:flex;flex-direction:column;align-items:flex-end;justify-content:center;gap:3px;min-width:120px;flex-shrink:0}\
  .mrs-benefit-badge{font-size:11px;font-weight:700;padding:3px 7px;border-radius:999px;white-space:nowrap;line-height:1.2;background:rgba(45,45,45,.08);color:#2D2D2D;align-self:flex-start}\
  .mrs-benefit-badge.popular{background:rgba(45,45,45,.08);color:#2D2D2D}\
  .mrs-benefit-badge.saving{background:rgba(45,45,45,.08);color:#2D2D2D}\
  .mrs-benefit-badge.freeship{background:rgba(45,45,45,.08);color:#2D2D2D}\
  .mrs-benefit-badge.lowest{background:rgba(45,45,45,.08);color:#2D2D2D}\
  .mrs-benefit-price{font-size:21px;font-weight:700;color:#1a1a1a;line-height:1.1;letter-spacing:-0.2px}\
  .mrs-benefit-unit{display:block;font-size:12px;color:#DF002E;font-weight:400;line-height:1.3;letter-spacing:0}\
  .mrs-benefit-row.best-deal{background:rgba(212,168,83,.06)}\
  .mrs-benefit-coupon{font-size:15px;font-weight:400;color:#2D2D2D;text-align:left;margin:12px 0 12px;padding:12px 14px;background:#F5F3EF;border-radius:0 10px 10px 0;border:none;border-left:3px solid #C8B48C;line-height:1.5;display:block;width:auto;max-width:none;box-sizing:border-box}\
  .mrs-coupon-amount{font-weight:700;color:#D32F2F}\
  @media(min-width:768px){.mrs-benefit-guide{padding:6px 10px 8px}.mrs-benefit-row{padding:8px 10px}.mrs-benefit-side{min-width:72px}.mrs-benefit-before{font-size:12px}.mrs-benefit-discount{font-size:21px}.mrs-benefit-name{font-size:18px}.mrs-benefit-count{font-size:18px}.mrs-benefit-pricebox{min-width:120px}.mrs-benefit-price{font-size:21px}.mrs-benefit-badge{font-size:11px}.mrs-benefit-coupon{font-size:15px;margin:12px 0 12px}}\
  @media(max-width:767px){.mrs-benefit-guide{padding:6px 8px 8px;margin-top:2px}.mrs-benefit-row{padding:9px 10px;gap:8px}.mrs-benefit-side{min-width:64px}.mrs-benefit-before{font-size:12px}.mrs-benefit-discount{font-size:19px}.mrs-benefit-name{font-size:17px}.mrs-benefit-count{font-size:17px}.mrs-benefit-pricebox{min-width:100px}.mrs-benefit-price{font-size:19px}.mrs-benefit-badge{font-size:11px;padding:3px 6px}.mrs-benefit-unit{font-size:12px}.mrs-benefit-coupon{font-size:15px;padding:10px 12px;margin:12px 0 12px}}\
  ';
  document.head.appendChild(css);

  /* ── HTML 주입 ── */
  var html = '\
  <p class="mrs-benefit-coupon" id="mrsCouponBanner">💳 회원가입 시 <span class="mrs-coupon-amount">3,000원 웰컴쿠폰</span> 지급!</p>\
  <div class="mrs-option-wrap" id="mrsOptionWrap">\
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
      <p class="mrs-info-copy" style="color:#6B5A2B;font-size:15px;font-weight:400;margin-top:2px">나에게 맞는 시즌을 골라보세요</p>\
    </div>\
    <div class="mrs-benefit-guide" id="mrsBenefitGuide">\
      <div class="mrs-benefit-list">\
        <div class="mrs-benefit-row" onclick="mrsBenefitSelect(1)">\
          <span class="mrs-benefit-side">\
            <span class="mrs-benefit-badge popular">BEST</span>\
            <span class="mrs-benefit-discount">36%</span>\
          </span>\
          <span class="mrs-benefit-main">\
            <span class="mrs-benefit-name"><strong class="mrs-benefit-count">1권</strong> <strong>90일 플래너</strong></span>\
          </span>\
          <span class="mrs-benefit-pricebox">\
            <span class="mrs-benefit-before">45,000원</span>\
            <span class="mrs-benefit-price">29,000원</span>\
            <span class="mrs-benefit-unit">권당 29,000원</span>\
          </span>\
        </div>\
        <div class="mrs-benefit-row" onclick="mrsBenefitSelect(2)">\
          <span class="mrs-benefit-side">\
            <span class="mrs-benefit-badge saving">9,000원↓</span>\
            <span class="mrs-benefit-discount">46%</span>\
          </span>\
          <span class="mrs-benefit-main">\
            <span class="mrs-benefit-name"><strong class="mrs-benefit-count">2권</strong> <strong>180일 플래너</strong></span>\
          </span>\
          <span class="mrs-benefit-pricebox">\
            <span class="mrs-benefit-before">90,000원</span>\
            <span class="mrs-benefit-price">49,000원</span>\
            <span class="mrs-benefit-unit">권당 24,500원</span>\
          </span>\
        </div>\
        <div class="mrs-benefit-row" onclick="mrsBenefitSelect(3)">\
          <span class="mrs-benefit-side">\
            <span class="mrs-benefit-badge freeship">무료배송</span>\
            <span class="mrs-benefit-discount">49%</span>\
          </span>\
          <span class="mrs-benefit-main">\
            <span class="mrs-benefit-name"><strong class="mrs-benefit-count">3권</strong> <strong>270일 플래너</strong></span>\
          </span>\
          <span class="mrs-benefit-pricebox">\
            <span class="mrs-benefit-before">135,000원</span>\
            <span class="mrs-benefit-price">69,000원</span>\
            <span class="mrs-benefit-unit">권당 23,000원</span>\
          </span>\
        </div>\
        <div class="mrs-benefit-row best-deal" onclick="mrsBenefitSelect(4)">\
          <span class="mrs-benefit-side">\
            <span class="mrs-benefit-badge lowest">최저가</span>\
            <span class="mrs-benefit-discount">51%</span>\
          </span>\
          <span class="mrs-benefit-main">\
            <span class="mrs-benefit-name"><strong class="mrs-benefit-count">4권</strong> <strong>360일 플래너</strong></span>\
          </span>\
          <span class="mrs-benefit-pricebox">\
            <span class="mrs-benefit-before">180,000원</span>\
            <span class="mrs-benefit-price">89,000원</span>\
            <span class="mrs-benefit-unit">권당 22,250원</span>\
          </span>\
        </div>\
      </div>\
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
  function mrsSetNativeHidden(hidden){
    document.documentElement.classList.toggle('mrs-ui-ready', !!hidden);
  }

  function insertUI(){
    var existingWrap = document.getElementById('mrsOptionWrap');
    if(existingWrap && existingWrap.querySelector('.mrs-card')) { mrsSetNativeHidden(true); return; } /* 이미 완성된 UI */
    if(existingWrap) existingWrap.remove(); /* placeholder 제거 */
    var optArea = document.querySelector('.productOption');
    if(!optArea){ setTimeout(insertUI, 300); return; }
    var anchor = document.querySelector('.summary-info');
    var container = document.createElement('div');
    container.innerHTML = html;
    while(container.firstChild){
      if(anchor && anchor.parentNode){
        anchor.parentNode.insertBefore(container.firstChild, anchor.nextSibling);
      } else {
        optArea.parentNode.insertBefore(container.firstChild, optArea);
      }
    }
    mrsSetNativeHidden(true);
    setTimeout(mrsInsertTagline, 500);
  }

  function mrsHydrateDetailImages(){
    var root=document.getElementById('prdDetail') || document.querySelector('.xans-product-additional .additional-inner');
    if(!root) return;
    var imgs=root.querySelectorAll('img[ec-data-src], img[data-src]');
    for(var i=0;i<imgs.length;i++){
      var img=imgs[i];
      var src=img.getAttribute('src') || '';
      var lazy=img.getAttribute('ec-data-src') || img.getAttribute('data-src') || '';
      if(!src && lazy){
        if(lazy.indexOf('//')===0) lazy=location.protocol + lazy;
        img.setAttribute('src', lazy);
      }
      img.loading='eager';
      img.decoding='async';
    }
  }

  function mrsRepairUI(){
    var wrap=document.getElementById('mrsOptionWrap');
    var hasCards=!!(wrap && wrap.querySelector('.mrs-card'));
    if(!hasCards){
      mrsSetNativeHidden(false);
      insertUI();
      mrsHydrateDetailImages();
      return;
    }
    mrsSetNativeHidden(true);
    wrap.style.display='none';
    void wrap.offsetHeight;
    wrap.style.display='';
    var tag=document.getElementById('mrsTagline');
    if(tag){tag.style.display='none';void tag.offsetHeight;tag.style.display='block';}
    mrsHydrateDetailImages();
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
    1:'<span class="mrs-info-tag best">⭐ 가장 많이 선택</span><p class="mrs-info-price"><span id="mrsPriceNum">29,000</span>원 <span style="font-size:12px;font-weight:400;color:#e65100">+ 배송비 3,000원</span></p><p class="mrs-info-hint" onclick="mrsHintAdd()">💡 1권 더 담으면 9,000원 절약</p>',
    2:'<span class="mrs-info-tag best">💰 9,000원 절약</span><p class="mrs-info-price"><span id="mrsPriceNum">49,000</span>원 <span style="font-size:12px;font-weight:400;color:#e65100">+ 배송비 3,000원</span></p><p class="mrs-info-hint" onclick="mrsHintAdd()">💡 1권만 더 담으면 배송비 무료</p>',
    3:'<span class="mrs-info-tag best">🚚 배송비 무료</span><p class="mrs-info-price"><span id="mrsPriceNum">69,000</span>원 <span style="font-size:12px;font-weight:400;color:#777">(권당 23,000원)</span></p><p class="mrs-info-hint" onclick="mrsHintAdd()">🎁 1권만 더 담으면 최저가 + 한정판 사은품</p>',
    4:'<span class="mrs-info-tag lowest">🏆 최저가 + 한정판 사은품</span><p class="mrs-info-price"><span id="mrsPriceNum">89,000</span>원 <span style="font-size:12px;font-weight:400;color:#777">(권당 22,250원)</span></p><p class="mrs-info-hint" style="cursor:default;animation:none">365일 메아리셋 완성 🎉</p>'
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
    document.getElementById('mrsInfo').innerHTML=info?info:'<p class="mrs-title">✍️ 적어라, 메아리 되어 돌아온다</p><p class="mrs-info-copy" style="color:#6B5A2B;font-size:15px;font-weight:400;margin-top:2px">나에게 맞는 시즌을 골라보세요</p>';
    if(info&&PRICE_BY_COUNT[count]) requestAnimationFrame(function(){mrsAnimatePrice(prevPrice,PRICE_BY_COUNT[count],350);});
    if(_prevCount<3&&count>=3&&count<4) setTimeout(function(){mrsShowToast('🎉 배송비 무료 달성!','green');},150);
    if(_prevCount<4&&count>=4) setTimeout(function(){mrsShowToast('🏆 최저가 달성!','red');},150);
    mrsUpdateTagline(count);mrsUpdateSticky(count);mrsUpdateBenefit();_prevCount=count;
  };
  window.mrsHintAdd=function(){var cards=document.querySelectorAll('.mrs-card:not(.selected)');if(cards.length)cards[0].click();};

  function mrsUpdateBenefit(){
    var rows=document.querySelectorAll('.mrs-benefit-row');
    var comboKey=mrsGetComboKey();
    for(var i=0;i<rows.length;i++) rows[i].classList.remove('active');
    for(var count=1;count<=4;count++){
      if(comboKey===PRESET_BY_COUNT[count]){
        var target=rows[count-1];
        if(target) target.classList.add('active');
        break;
      }
    }
  }

  window.mrsBenefitSelect=function(count){
    var currentKey=mrsGetComboKey();
    var targetKey=PRESET_BY_COUNT[count];
    var allCards=document.querySelectorAll('.mrs-card');
    for(var i=0;i<allCards.length;i++) allCards[i].classList.remove('selected');
    if(currentKey===targetKey){
      var emptyInfo=document.getElementById('mrsInfo');
      if(emptyInfo) emptyInfo.innerHTML='<p class="mrs-title">✍️ 적어라, 메아리 되어 돌아온다</p><p class="mrs-info-copy" style="color:#6B5A2B;font-size:15px;font-weight:400;margin-top:2px">나에게 맞는 시즌을 골라보세요</p>';
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
    if(infoEl) infoEl.innerHTML=info||'<p class="mrs-title">✍️ 적어라, 메아리 되어 돌아온다</p><p class="mrs-info-copy" style="color:#6B5A2B;font-size:15px;font-weight:400;margin-top:2px">나에게 맞는 시즌을 골라보세요</p>';
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
  function mrsTrimPayGap(){
    var appPay=document.querySelector('.app-pay-wrap');
    if(!appPay) return;
    var npay=document.getElementById('NaverChk_Button');
    var kakao=document.getElementById('appPaymentButtonBox');
    var npayVisible=!!(npay && (npay.children.length || npay.offsetHeight>0 || npay.querySelector('iframe,button,a,div')) && getComputedStyle(npay).display!=='none');
    var kakaoVisible=!!(kakao && (kakao.children.length || kakao.offsetHeight>0 || kakao.querySelector('iframe,button,a,div')) && getComputedStyle(kakao).display!=='none');
    if(npayVisible || kakaoVisible) appPay.classList.remove('mrs-empty');
    else appPay.classList.add('mrs-empty');
  }

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
    mrsTrimPayGap();
    
    /* MutationObserver: 네이버페이가 app-pay-wrap에서 빠지면 즉시 복구 */
    var guard = new MutationObserver(function(){
      var n = document.getElementById('NaverChk_Button');
      var ap = document.querySelector('.app-pay-wrap');
      if(n && ap && !ap.contains(n)) {
        ap.insertBefore(n, ap.firstChild);
        n.style.setProperty('display','block','important');
        n.style.setProperty('visibility','visible','important');
      }
      mrsTrimPayGap();
    });
    guard.observe(document.body, { childList: true, subtree: true, attributes:true, attributeFilter:['style','class'] });
    setTimeout(function(){ guard.disconnect(); }, 30000);
  }

  /* ── 초기화 ── */
  function mrsInit(){
    insertUI();
    mrsHydrateDetailImages();
    mrsInstallCapture();
    /* SDK 로딩 대기 후 네이버페이 방어 시작 (1초 간격으로 5회 시도) */
    var tries = 0;
    var guardInterval = setInterval(function(){
      mrsGuardNpay();
      if(++tries >= 5) clearInterval(guardInterval);
    }, 2000);

    var repairTimer=null;
    function scheduleRepair(){
      if(repairTimer) clearTimeout(repairTimer);
      repairTimer=setTimeout(mrsRepairUI,120);
    }
    window.addEventListener('pageshow', mrsRepairUI);
    document.addEventListener('visibilitychange', function(){ if(!document.hidden) scheduleRepair(); });
    window.addEventListener('resize', scheduleRepair, {passive:true});
    window.addEventListener('orientationchange', scheduleRepair, {passive:true});
    window.addEventListener('scroll', scheduleRepair, {passive:true});
    setTimeout(mrsHydrateDetailImages, 800);
    setTimeout(mrsHydrateDetailImages, 2000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mrsInit);
  else mrsInit();
})();
