/**
 * 메아리셋 옵션 UI v16.0 — product_no=30 전용
 * prototype source: tmp_assets/meariset_30_clippen_redesign.html
 */
(function(){
  var MRS_VERSION = 160;
  var MRS_PRODUCT_BANNER_URL = 'https://meariset.kr/product/detail.html?product_no=30&cate_no=1&display_group=2';
  var MRS_LOGIN_BANNER_URL = 'https://meariset.kr/member/login.html?noMemberOrder&returnUrl=%2Fmyshop%2Findex.html';
  var MRS_NOTE_PRODUCT_NO = 30;
  var MRS_PEN_PRODUCT_NO = 48;
  var MRS_NOTE_PRODUCT_CODE = 'P00000BB';
  var MRS_PEN_PRODUCT_CODE = 'P00000BW';
  var MRS_PEN_ITEM_CODE = 'P00000BW000A';
  var MRS_FREE_GIFT_URL = 'https://meariset.kr/product/detail.html?product_no=27&cate_no=1&display_group=2';
  var MRS_NOTE_FALLBACK_PRICE = 20300;
  var MRS_NOTE_FALLBACK_ORIGIN = 29000;
  var MRS_PEN_FALLBACK_PRICE = 9900;
  var MRS_PEN_FALLBACK_ORIGIN = 15000;
  var MRS_SEASON_MAP = {
    '1': { label: 'Season 1', color: 'Black', itemCode: 'P00000BB000D' },
    '2': { label: 'Season 2', color: 'Gray', itemCode: 'P00000BB000H' },
    '3': { label: 'Season 3', color: 'Olive', itemCode: 'P00000BB000I' },
    '4': { label: 'Season 4', color: 'Navy', itemCode: 'P00000BB000J' }
  };

  if(window._mrsOptionLoaded && window._mrsVersion && window._mrsVersion >= MRS_VERSION) return;
  if(window._mrsOptionLoaded && (!window._mrsVersion || window._mrsVersion < MRS_VERSION)) {
    var oldWrap = document.getElementById('mrsOptionWrap');
    if(oldWrap) {
      var npayInWrap = oldWrap.querySelector('#NaverChk_Button');
      if(npayInWrap) {
        var appPay = document.querySelector('.app-pay-wrap');
        if(appPay) appPay.insertBefore(npayInWrap, appPay.firstChild);
        else {
          var prodAction = document.querySelector('.productAction');
          if(prodAction) prodAction.appendChild(npayInWrap);
        }
      }
      oldWrap.remove();
    }
    var oldStyle = document.getElementById('mrsStyles');
    if(oldStyle) oldStyle.remove();
    window._npayMoved = false;
  }
  window._mrsOptionLoaded = true;
  window._mrsVersion = MRS_VERSION;

  var prdEl = document.querySelector('[data-prd-no]');
  var prdNo = prdEl ? prdEl.getAttribute('data-prd-no') : '';
  var urlHas30 = location.search.indexOf('product_no=30') !== -1 || location.href.indexOf('product_no=30') !== -1;
  var pathMatch30 = location.pathname.match(/\/product\/[^/]*\/(\d+)\//);
  var pathHas30 = !!(pathMatch30 && pathMatch30[1] === '30');
  if(!urlHas30 && !pathHas30 && prdNo !== '30'){ window._mrsOptionLoaded = false; return; }

  if(window.__mrsActiveMode && window.__mrsActiveMode !== 'live30') return;
  window.__mrsActiveMode = 'live30';

  var _placeholder = document.createElement('div');
  _placeholder.id = 'mrsOptionWrap';
  _placeholder.style.display = 'none';
  (document.body || document.documentElement).appendChild(_placeholder);

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
    }
  }

  function _fixDfBanner(){
    var els = document.querySelectorAll('.df-bannermanager, .ssp.df-bannermanager');
    for(var i=0;i<els.length;i++){
      var el = els[i];
      if(_isHeaderSmartBanner(el)) el.style.setProperty('pointer-events','auto','important');
      else el.style.setProperty('pointer-events','none','important');
    }
    var headerTargets = document.querySelectorAll('.top-banner, .top-banner *, [df-banner-code="top-banner"], [df-banner-code="top-banner"] *');
    for(var j=0;j<headerTargets.length;j++){
      headerTargets[j].style.setProperty('pointer-events','auto','important');
    }
    _restoreTopBanner();
  }
  try{ _fixDfBanner(); }catch(e){}
  setTimeout(function(){ try{ _fixDfBanner(); }catch(e){} }, 200);
  setTimeout(function(){ try{ _fixDfBanner(); }catch(e){} }, 1000);
  setTimeout(function(){ try{ _fixDfBanner(); }catch(e){} }, 2500);
  window.addEventListener('load', function(){ try{ _fixDfBanner(); }catch(e){} }, { once:true });

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
  #mrsOptionWrap,#mrsOptionWrap *{box-sizing:border-box}\
  #mrsOptionWrap{--bg:#F6F1E7;--card:#FFFFFF;--cream-soft:#FBF6ED;--line:#E8DFD0;--line-strong:#D9CDB8;--ink:#1C1A17;--ink-soft:#5B5349;--mute:#8A8173;--gold:#C9A96E;--gold-soft:#EFE3CA;--red:#D94A4A;--shadow:0 2px 10px rgba(28,26,23,0.06);--radius-lg:18px;--radius-md:12px;--radius-sm:8px;max-width:480px;margin:0 auto 24px;padding:20px 16px 140px;background:var(--bg);font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard",sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}\
  #mrsOptionWrap .banner{background:var(--cream-soft);border-left:3px solid #4D6B3F;padding:14px 16px;border-radius:var(--radius-sm);font-size:15px;font-weight:600;margin-bottom:16px}\
  #mrsOptionWrap .seasons{background:var(--card);border-radius:var(--radius-lg);padding:16px 12px;box-shadow:var(--shadow)}\
  #mrsOptionWrap .season-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}\
  #mrsOptionWrap .season{position:relative;border:2px solid var(--line);border-radius:var(--radius-md);padding:10px 6px 12px;text-align:center;cursor:pointer;transition:all .15s ease;background:#fff;-webkit-tap-highlight-color:transparent}\
  #mrsOptionWrap .season .badge{position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:var(--gold-soft);color:#7A5F28;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;white-space:nowrap}\
  #mrsOptionWrap .season .cover{width:100%;aspect-ratio:3/4;border-radius:4px;margin-bottom:8px;background-size:cover;background-position:center}\
  #mrsOptionWrap .s1 .cover{background:linear-gradient(135deg,#2A2A2A,#0F0F0F)}\
  #mrsOptionWrap .s2 .cover{background:linear-gradient(135deg,#B5AFA3,#8B857A)}\
  #mrsOptionWrap .s3 .cover{background:linear-gradient(135deg,#3D5542,#1F3028)}\
  #mrsOptionWrap .s4 .cover{background:linear-gradient(135deg,#2D3A56,#14203B)}\
  #mrsOptionWrap .season .name{font-size:13px;font-weight:700}\
  #mrsOptionWrap .season .color{font-size:11px;color:var(--mute);margin-top:2px}\
  #mrsOptionWrap .season.active{border-color:var(--ink);background:var(--cream-soft);transform:translateY(-1px)}\
  #mrsOptionWrap .season.active::after{content:"✓";position:absolute;top:6px;right:6px;width:20px;height:20px;border-radius:50%;background:var(--ink);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center}\
  #mrsOptionWrap .heading{text-align:center;margin:28px 0 16px}\
  #mrsOptionWrap .heading h2{margin:0 0 6px;font-size:18px;font-weight:700}\
  #mrsOptionWrap .heading p{margin:0;font-size:13px;color:var(--gold);font-weight:600}\
  #mrsOptionWrap .price-row{background:var(--cream-soft);border-radius:var(--radius-lg);padding:16px 18px;display:flex;align-items:center;gap:12px;margin-bottom:10px}\
  #mrsOptionWrap .price-row .qty-badge{width:36px;height:36px;border-radius:50%;background:var(--ink);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}\
  #mrsOptionWrap .price-row .price-main{font-size:22px;font-weight:800}\
  #mrsOptionWrap .price-row .discount{font-size:13px;color:var(--red);font-weight:700}\
  #mrsOptionWrap .price-row .unit{font-size:12px;color:var(--mute);margin-top:2px}\
  #mrsOptionWrap .price-row .chip{margin-left:auto;background:#EDE5D4;color:#7A5F28;font-size:11px;font-weight:700;padding:5px 10px;border-radius:20px;flex-shrink:0}\
  #mrsOptionWrap .note-limit{background:#F4F0E6;border-left:3px solid #8A8173;padding:10px 14px;border-radius:var(--radius-sm);font-size:12px;color:var(--ink-soft);margin-bottom:24px;display:flex;align-items:center;gap:6px}\
  #mrsOptionWrap .note-limit::before{content:"ⓘ";font-size:13px;color:var(--mute);flex-shrink:0}\
  #mrsOptionWrap .note-limit b{color:var(--ink-soft);font-weight:700}\
  #mrsOptionWrap .addon-section-label{font-size:13px;color:var(--ink);font-weight:800;letter-spacing:.1px;margin-bottom:10px;padding-left:2px;display:flex;align-items:center;gap:6px}\
  #mrsOptionWrap .addon-section-label::before{content:"✦";color:var(--red);font-size:12px}\
  #mrsOptionWrap .bundle-reason{font-size:12px;color:var(--mute);line-height:1.45;margin:-4px 0 10px 2px;letter-spacing:-.1px}\
  #mrsOptionWrap .addon{background:var(--card);border:1px solid var(--line);border-radius:var(--radius-md);padding:14px;margin-bottom:20px;transition:border-color .18s ease,background .18s ease,transform .22s cubic-bezier(0.34,1.56,0.64,1);display:flex;align-items:center;gap:12px;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none}\
  #mrsOptionWrap .addon:hover{border-color:var(--line-strong)}\
  #mrsOptionWrap .addon.selected{border-color:var(--ink);background:var(--cream-soft)}\
  #mrsOptionWrap .addon.bounce{animation:cardBounce .32s cubic-bezier(0.34,1.56,0.64,1)}\
  @keyframes cardBounce{0%{transform:scale(1)}40%{transform:scale(.975)}100%{transform:scale(1)}}\
  #mrsOptionWrap .addon-img{width:90px;flex-shrink:0;display:flex;align-items:center;justify-content:center}\
  #mrsOptionWrap .addon-img img{width:100%;height:auto;display:block}\
  #mrsOptionWrap .addon-info{flex:1;min-width:0}\
  #mrsOptionWrap .addon-title{font-size:13.5px;font-weight:700;display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-bottom:3px;line-height:1.25}\
  #mrsOptionWrap .addon-title .limit-tag{font-size:9px;font-weight:800;color:#7A5F28;border:1px solid #C9A96E;background:rgba(201,169,110,0.08);padding:2px 6px;border-radius:2px;letter-spacing:.8px;text-transform:uppercase;line-height:1.3;white-space:nowrap}\
  #mrsOptionWrap .addon-meta{font-size:11.5px;color:var(--ink-soft);line-height:1.55;margin-bottom:8px}\
  #mrsOptionWrap .addon-meta .usp{display:block;position:relative;padding-left:11px}\
  #mrsOptionWrap .addon-meta .usp::before{content:"";position:absolute;left:0;top:7px;width:4px;height:4px;border-radius:50%;background:var(--gold)}\
  #mrsOptionWrap .addon-price-line{display:flex;align-items:baseline;gap:6px;font-size:13px}\
  #mrsOptionWrap .addon-price-line .strike{color:var(--mute);text-decoration:line-through;font-size:11px;font-weight:500}\
  #mrsOptionWrap .addon-price-line .now{font-weight:800;color:var(--ink)}\
  #mrsOptionWrap .addon-price-line .save{font-size:10.5px;color:var(--red);font-weight:700}\
  #mrsOptionWrap .addon-toggle{background:#fff;color:var(--ink);border:1.5px solid var(--ink);border-radius:999px;padding:10px 16px;font-size:12px;font-weight:700;cursor:pointer;flex-shrink:0;transition:background .15s ease,color .15s ease,border-color .15s ease;display:flex;align-items:center;gap:4px;min-height:40px;-webkit-tap-highlight-color:transparent}\
  #mrsOptionWrap .addon-toggle:hover{background:var(--cream-soft)}\
  #mrsOptionWrap .addon-toggle .ico{font-size:14px;line-height:1;font-weight:400;display:inline-block;transition:transform .25s cubic-bezier(0.34,1.56,0.64,1)}\
  #mrsOptionWrap .addon.selected .addon-toggle .ico{animation:checkPop .32s cubic-bezier(0.34,1.56,0.64,1)}\
  @keyframes checkPop{0%{transform:scale(.4) rotate(-12deg)}60%{transform:scale(1.25) rotate(4deg)}100%{transform:scale(1) rotate(0)}}\
  #mrsOptionWrap .addon.selected .addon-toggle{background:var(--ink);color:#fff;border-color:var(--ink)}\
  #mrsOptionWrap .addon.selected .addon-toggle .ico::before{content:"✓"}\
  #mrsOptionWrap .addon-toggle .ico::before{content:"+"}\
  #mrsOptionWrap .addon.selected .addon-toggle .txt::before{content:"추가됨"}\
  #mrsOptionWrap .addon-toggle .txt::before{content:"담기"}\
  #mrsOptionWrap .upsell-hint{display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;color:var(--ink-soft);text-align:center;margin:-10px 0 20px;padding:10px 14px;background:#FBF6ED;border-radius:var(--radius-sm);text-decoration:none;transition:background .15s ease;letter-spacing:-.1px}\
  #mrsOptionWrap .upsell-hint:hover{background:#F4EAD3}\
  #mrsOptionWrap .upsell-hint b{color:var(--ink);font-weight:700}\
  #mrsOptionWrap .upsell-hint .arrow{color:var(--gold);font-weight:700;font-size:13px;transition:transform .15s ease}\
  #mrsOptionWrap .upsell-hint:hover .arrow{transform:translateX(2px)}\
  #mrsOptionWrap .sticky{position:fixed;left:0;right:0;bottom:0;background:#fff;border-top:1px solid var(--line);padding:12px 16px calc(18px + env(safe-area-inset-bottom,0px));box-shadow:0 -4px 16px rgba(28,26,23,0.06);z-index:50}\
  #mrsOptionWrap .sticky-inner{max-width:480px;margin:0 auto}\
  #mrsOptionWrap .total-summary{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:12px}\
  #mrsOptionWrap .total-left{flex:1;min-width:0}\
  #mrsOptionWrap .total-items{font-size:12px;color:var(--ink-soft);font-weight:600;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\
  #mrsOptionWrap .total-saving{font-size:11px;color:var(--mute);line-height:1.3}\
  #mrsOptionWrap .total-saving b{color:var(--red);font-weight:800;margin-left:2px}\
  #mrsOptionWrap .total-price{font-size:24px;font-weight:800;flex-shrink:0;line-height:1;transition:transform .25s cubic-bezier(0.34,1.56,0.64,1)}\
  #mrsOptionWrap .total-price.bumped{animation:priceBump .35s cubic-bezier(0.34,1.56,0.64,1)}\
  @keyframes priceBump{0%{transform:scale(1)}50%{transform:scale(1.08)}100%{transform:scale(1)}}\
  #mrsOptionWrap .cta-row{display:grid;grid-template-columns:1fr 2fr;gap:8px}\
  #mrsOptionWrap .btn{padding:14px;border-radius:var(--radius-sm);font-size:14px;font-weight:700;border:none;cursor:pointer;transition:all .15s ease;min-height:48px;-webkit-tap-highlight-color:transparent}\
  #mrsOptionWrap .btn-cart{background:#fff;color:var(--ink);border:1.5px solid var(--ink)}\
  #mrsOptionWrap .btn-buy{background:var(--ink);color:#fff}\
  #mrsOptionWrap .btn:active{transform:scale(.98)}\
  #mrsOptionWrap .price-loading{opacity:.7}\
  #mrsOptionWrap .price-row .discount.hidden,#mrsOptionWrap .addon-price-line .save.hidden{display:none}\
  #mrsOptionWrap .price-row .chip.hidden{display:none}\
  @media(max-width:520px){#mrsOptionWrap{padding:16px 12px 134px}#mrsOptionWrap .banner{font-size:14px}#mrsOptionWrap .heading h2{font-size:17px}#mrsOptionWrap .heading p{font-size:12px}#mrsOptionWrap .price-row{padding:14px 14px;gap:10px}#mrsOptionWrap .price-row .price-main{font-size:20px}#mrsOptionWrap .addon{padding:12px;gap:10px}#mrsOptionWrap .addon-img{width:78px}#mrsOptionWrap .addon-title{font-size:13px}#mrsOptionWrap .addon-meta{font-size:11px}#mrsOptionWrap .sticky{padding:12px 14px calc(18px + env(safe-area-inset-bottom,0px))}#mrsOptionWrap .total-price{font-size:22px}}\
  ';
  document.head.appendChild(css);

  var state = {
    currentSeason: '1',
    penAdded: false,
    lastTotal: MRS_NOTE_FALLBACK_PRICE,
    note: {
      price: MRS_NOTE_FALLBACK_PRICE,
      origin: MRS_NOTE_FALLBACK_ORIGIN,
      loaded: false
    },
    pen: {
      price: MRS_PEN_FALLBACK_PRICE,
      origin: MRS_PEN_FALLBACK_ORIGIN,
      loaded: false,
      usedFallback: true
    },
    submitting: false,
    pendingPayloadAppend: null,
    currentSelectedItemValue: null
  };

  function getPenImageCandidates(){
    var script = document.currentScript;
    var candidates = [];
    if(script && script.src) {
      var base = script.src.replace(/[^\/?#]+(?:[?#].*)?$/, '');
      candidates.push(base + 'meariset_pen_white.png');
      candidates.push(base + 'tmp_assets/meariset_pen_white.png');
    }
    candidates.push('/meariset/meariset_pen_white.png');
    candidates.push('/tmp_assets/meariset_pen_white.png');
    candidates.push('tmp_assets/meariset_pen_white.png');
    return candidates;
  }

  function renderHtml(){
    return '\
    <div id="mrsOptionWrap">\
      <div class="banner">☕ 6주 챌린지 인증 고객 전용 30% 할인</div>\
      <div class="seasons">\
        <div class="season-grid">\
          <div class="season s1 active" data-season="1">\
            <div class="badge">입문자 추천</div>\
            <div class="cover"></div>\
            <div class="name">Season 1</div>\
            <div class="color">Black</div>\
          </div>\
          <div class="season s2" data-season="2">\
            <div class="cover"></div>\
            <div class="name">Season 2</div>\
            <div class="color">Gray</div>\
          </div>\
          <div class="season s3" data-season="3">\
            <div class="cover"></div>\
            <div class="name">Season 3</div>\
            <div class="color">Olive</div>\
          </div>\
          <div class="season s4" data-season="4">\
            <div class="cover"></div>\
            <div class="name">Season 4</div>\
            <div class="color">Navy</div>\
          </div>\
        </div>\
      </div>\
      <div class="heading">\
        <h2>✍️ 적어라, 메아리 되어 돌아온다</h2>\
        <p>원하는 시즌 1권을 선택하세요</p>\
      </div>\
      <div class="price-row">\
        <div class="qty-badge">1권</div>\
        <div class="price-copy">\
          <div><span class="price-main price-loading" id="mrsNotePrice">20,300원</span> <span class="discount" id="mrsNoteDiscount">30%↓</span></div>\
          <div class="unit" id="mrsNoteUnit">(권당 20,300원)</div>\
        </div>\
        <div class="chip" id="mrsNoteChip">인증 고객 전용</div>\
      </div>\
      <div class="note-limit">원하는 시즌 <b>1권만 선택 가능</b></div>\
      <div class="addon-section-label">함께 구매하면 <span style="color:var(--red); margin-left:2px;">34% 할인</span></div>\
      <div class="bundle-reason">노트와 펜을 따로 챙기지 않아도 되는 자유</div>\
      <div class="addon" id="penAddon">\
        <div class="addon-img">\
          <img loading="lazy" decoding="async" id="mrsPenImage" src="" alt="메아리셋 클립펜 M13 Midnight Black" />\
        </div>\
        <div class="addon-info">\
          <div class="addon-title">\
            한정판 메아리 전용 클립펜\
            <span class="limit-tag">Limited Edition</span>\
          </div>\
          <div class="addon-meta">\
            <span class="usp">노트에 끼워 휴대하는 클립형</span>\
            <span class="usp">독일 0.7mm 펜촉</span>\
            <span class="usp">글로벌 3대 디자인 어워드</span>\
          </div>\
          <div class="addon-price-line">\
            <span class="strike price-loading" id="mrsPenOrigin">15,000원</span>\
            <span class="now price-loading" id="mrsPenPrice">9,900원</span>\
            <span class="save" id="mrsPenDiscount">-34%</span>\
          </div>\
        </div>\
        <button class="addon-toggle" id="penToggle" type="button">\
          <span class="ico"></span>\
          <span class="txt"></span>\
        </button>\
      </div>\
      <a class="upsell-hint" href="' + MRS_FREE_GIFT_URL + '" id="upsellLink">\
        <span><b>4권 이상 구매 시</b> 볼펜 무료 증정</span>\
        <span class="arrow">→</span>\
      </a>\
      <div class="sticky">\
        <div class="sticky-inner">\
          <div class="total-summary">\
            <div class="total-left">\
              <div class="total-items" id="totalItems">노트 Season 1 (Black)</div>\
              <div class="total-saving">\
                정가 <span id="totalOrigin">29,000</span>원 대비\
                <b>▼ <span id="totalSave">8,700</span>원 절약</b>\
              </div>\
            </div>\
            <div class="total-price" id="totalPriceWrap"><span id="totalPrice">20,300</span>원</div>\
          </div>\
          <div class="cta-row">\
            <button class="btn btn-cart" id="mrsCartBtn" type="button">장바구니</button>\
            <button class="btn btn-buy" id="mrsBuyBtn" type="button">구매하기</button>\
          </div>\
        </div>\
      </div>\
    </div>';
  }

  function insertUI(){
    var existingWrap = document.getElementById('mrsOptionWrap');
    if(existingWrap && existingWrap.querySelector('.season-grid')) return;
    if(existingWrap) existingWrap.remove();
    var optArea = document.querySelector('.productOption');
    if(!optArea){ setTimeout(insertUI, 300); return; }
    var container = document.createElement('div');
    container.innerHTML = renderHtml();
    while(container.firstChild){
      optArea.parentNode.insertBefore(container.firstChild, optArea);
    }
  }

  function getText(el){
    return ((el && (el.textContent || el.innerText)) || '').replace(/\s+/g,' ').trim();
  }

  function parsePriceValue(text){
    var matches = (text || '').match(/\d[\d,]*/g);
    if(!matches) return 0;
    for(var i=matches.length-1;i>=0;i--){
      var num = parseInt(matches[i].replace(/,/g,''), 10);
      if(num >= 1000) return num;
    }
    return 0;
  }

  function parseOriginValue(text, salePrice){
    var matches = (text || '').match(/\d[\d,]*/g);
    if(!matches) return 0;
    var best = 0;
    for(var i=0;i<matches.length;i++){
      var num = parseInt(matches[i].replace(/,/g,''), 10);
      if(num > best && (!salePrice || num >= salePrice)) best = num;
    }
    return best;
  }

  function getDiscountRate(origin, sale){
    if(!(origin > sale && sale > 0)) return '';
    return Math.round((1 - (sale / origin)) * 100) + '%↓';
  }

  function getSavingRate(origin, sale){
    if(!(origin > sale && sale > 0)) return '';
    return '-' + Math.round((1 - (sale / origin)) * 100) + '%';
  }

  function seasonSummary(){
    var season = MRS_SEASON_MAP[state.currentSeason];
    return season.label + ' (' + season.color + ')';
  }

  function selectSeason(seasonKey){
    state.currentSeason = seasonKey;
    var seasons = document.querySelectorAll('#mrsOptionWrap .season');
    for(var i=0;i<seasons.length;i++){
      seasons[i].classList.toggle('active', seasons[i].getAttribute('data-season') === seasonKey);
    }
    updateTotal(false);
    syncNativeSelection(true);
  }

  function togglePen(e){
    if(e) e.stopPropagation();
    state.penAdded = !state.penAdded;
    var card = document.getElementById('penAddon');
    if(card){
      card.classList.toggle('selected', state.penAdded);
      card.classList.remove('bounce');
      void card.offsetWidth;
      card.classList.add('bounce');
    }
    updateTotal(true);
  }

  function tweenNumber(el, from, to, duration){
    duration = duration || 280;
    var start = performance.now();
    function frame(now){
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      var v = Math.round(from + (to - from) * eased);
      el.textContent = v.toLocaleString('ko-KR');
      if(t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function updateTotal(animate){
    var notePrice = state.note.price || MRS_NOTE_FALLBACK_PRICE;
    var noteOrigin = state.note.origin || notePrice;
    var penPrice = state.pen.price || MRS_PEN_FALLBACK_PRICE;
    var penOrigin = state.pen.origin || penPrice;
    var total = notePrice + (state.penAdded ? penPrice : 0);
    var origin = noteOrigin + (state.penAdded ? penOrigin : 0);
    var save = Math.max(origin - total, 0);
    var priceEl = document.getElementById('totalPrice');
    var wrapEl = document.getElementById('totalPriceWrap');
    if(priceEl){
      if(animate && total !== state.lastTotal){
        tweenNumber(priceEl, state.lastTotal, total, 280);
        if(wrapEl){
          wrapEl.classList.remove('bumped');
          void wrapEl.offsetWidth;
          wrapEl.classList.add('bumped');
        }
      } else {
        priceEl.textContent = total.toLocaleString('ko-KR');
      }
    }
    state.lastTotal = total;
    var originEl = document.getElementById('totalOrigin');
    var saveEl = document.getElementById('totalSave');
    var itemsEl = document.getElementById('totalItems');
    if(originEl) originEl.textContent = origin.toLocaleString('ko-KR');
    if(saveEl) saveEl.textContent = save.toLocaleString('ko-KR');
    if(itemsEl) itemsEl.textContent = '노트 ' + seasonSummary() + (state.penAdded ? ' · + 볼펜' : '');
  }

  function updateStaticPrices(){
    var notePriceEl = document.getElementById('mrsNotePrice');
    var noteUnitEl = document.getElementById('mrsNoteUnit');
    var noteDiscountEl = document.getElementById('mrsNoteDiscount');
    var penPriceEl = document.getElementById('mrsPenPrice');
    var penOriginEl = document.getElementById('mrsPenOrigin');
    var penDiscountEl = document.getElementById('mrsPenDiscount');
    if(notePriceEl){
      notePriceEl.textContent = (state.note.price || MRS_NOTE_FALLBACK_PRICE).toLocaleString('ko-KR') + '원';
      notePriceEl.classList.remove('price-loading');
    }
    if(noteUnitEl){
      noteUnitEl.textContent = '(권당 ' + (state.note.price || MRS_NOTE_FALLBACK_PRICE).toLocaleString('ko-KR') + '원)';
    }
    if(noteDiscountEl){
      var noteRate = getDiscountRate(state.note.origin, state.note.price);
      noteDiscountEl.textContent = noteRate || '할인중';
      noteDiscountEl.classList.toggle('hidden', !noteRate);
    }
    if(penPriceEl){
      penPriceEl.textContent = (state.pen.price || MRS_PEN_FALLBACK_PRICE).toLocaleString('ko-KR') + '원';
      penPriceEl.classList.remove('price-loading');
    }
    if(penOriginEl){
      penOriginEl.textContent = (state.pen.origin || MRS_PEN_FALLBACK_ORIGIN).toLocaleString('ko-KR') + '원';
      penOriginEl.classList.remove('price-loading');
    }
    if(penDiscountEl){
      var penRate = getSavingRate(state.pen.origin, state.pen.price);
      penDiscountEl.textContent = penRate || '';
      penDiscountEl.classList.toggle('hidden', !penRate);
    }
    updateTotal(false);
  }

  function findPriceDataInDoc(doc){
    var sale = 0;
    var origin = 0;
    var saleCandidates = [
      '#span_product_price_sale',
      '#span_product_price_text',
      '.prd_price_sale_css',
      '.xans-product-detail .infoArea .price',
      '.xans-product-detail .infoArea .price strong'
    ];
    var originCandidates = [
      '#span_product_price_custom',
      '.prd_price_custom_css',
      '.xans-product-detail .infoArea .custom',
      '.xans-product-detail .infoArea .strike'
    ];
    for(var i=0;i<saleCandidates.length && !sale;i++){
      var saleEl = doc.querySelector(saleCandidates[i]);
      sale = parsePriceValue(getText(saleEl));
    }
    for(var j=0;j<originCandidates.length && !origin;j++){
      var originEl = doc.querySelector(originCandidates[j]);
      origin = parseOriginValue(getText(originEl), sale);
    }
    if(!(sale > 0)){
      var metaAmount = doc.querySelector('meta[property="product:price:amount"], meta[itemprop="price"]');
      sale = parsePriceValue(metaAmount && (metaAmount.getAttribute('content') || metaAmount.getAttribute('value') || metaAmount.textContent));
    }
    if(!(origin > 0)){
      var jsonLd = doc.querySelectorAll('script[type="application/ld+json"]');
      for(var k=0;k<jsonLd.length;k++){
        try {
          var data = JSON.parse(jsonLd[k].textContent);
          var offers = data && data.offers ? data.offers : null;
          var offer = Array.isArray(offers) ? offers[0] : offers;
          var price = offer && parsePriceValue(String(offer.price || ''));
          if(price && !sale) sale = price;
          var highPrice = offer && parsePriceValue(String(offer.highPrice || ''));
          if(highPrice && !origin) origin = highPrice;
        } catch(err){}
      }
    }
    if(!(origin > 0) && sale > 0) origin = sale;
    return { price: sale, origin: origin };
  }

  function fetchDocument(url){
    return fetch(url, { credentials:'include' }).then(function(res){
      if(!res.ok) throw new Error('price fetch failed');
      return res.text();
    }).then(function(html){
      var parser = new DOMParser();
      return parser.parseFromString(html, 'text/html');
    });
  }

  function currentProductUrl(productNo){
    return location.origin + '/product/detail.html?product_no=' + productNo + '&cate_no=1&display_group=2';
  }

  function fetchPricing(){
    var noteLocal = findPriceDataInDoc(document);
    if(noteLocal.price > 0){
      state.note.price = noteLocal.price;
      state.note.origin = noteLocal.origin || noteLocal.price;
      state.note.loaded = true;
    }
    updateStaticPrices();

    var notePromise = state.note.loaded ? Promise.resolve() : fetchDocument(currentProductUrl(MRS_NOTE_PRODUCT_NO)).then(function(doc){
      var data = findPriceDataInDoc(doc);
      if(data.price > 0){
        state.note.price = data.price;
        state.note.origin = data.origin || data.price;
        state.note.loaded = true;
      }
    }).catch(function(){});

    var penPromise = fetchDocument(currentProductUrl(MRS_PEN_PRODUCT_NO)).then(function(doc){
      var data = findPriceDataInDoc(doc);
      if(data.price > 0){
        state.pen.price = data.price;
        state.pen.origin = data.origin || data.price;
        state.pen.loaded = true;
        state.pen.usedFallback = false;
      }
    }).catch(function(){
      state.pen.price = MRS_PEN_FALLBACK_PRICE;
      state.pen.origin = MRS_PEN_FALLBACK_ORIGIN;
      state.pen.loaded = true;
      state.pen.usedFallback = true;
    });

    Promise.all([notePromise, penPromise]).then(function(){
      updateStaticPrices();
    });
  }

  function setPenImage(){
    var img = document.getElementById('mrsPenImage');
    if(!img) return;
    var candidates = getPenImageCandidates();
    var index = 0;
    function tryNext(){
      if(index >= candidates.length) return;
      img.src = candidates[index++];
    }
    img.addEventListener('error', tryNext);
    tryNext();
  }

  function setProductOptionVisible(visible){
    var prodOpt = document.querySelector('.productOption');
    if(!prodOpt) return;
    if(visible) {
      prodOpt.setAttribute('style','position:fixed!important;left:0!important;top:0!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0.01!important;z-index:-1!important;');
    } else {
      prodOpt.setAttribute('style','position:fixed!important;left:-99999px!important;top:-99999px!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important;');
    }
  }

  function triggerNativeChange(el){
    if(window.jQuery) window.jQuery(el).trigger('change');
    else el.dispatchEvent(new Event('change', { bubbles:true }));
  }

  function clearOptions(){
    var dels = document.querySelectorAll('#totalProducts .option_box_del, #totalProducts img[alt="삭제"]');
    for(var i=dels.length-1;i>=0;i--){
      var row = dels[i].closest('tr');
      if(row && row.classList.contains('add_product')) continue;
      var link = dels[i].closest('a') || dels[i];
      try{ link.click(); }catch(e){}
    }
    var tp = document.getElementById('totalProducts');
    if(tp){
      var tbody = tp.querySelector('tbody');
      if(tbody){
        var rows = tbody.querySelectorAll('tr');
        for(var j=rows.length-1;j>=0;j--){
          if(rows[j].classList.contains('add_product')) continue;
          if(rows[j].querySelector('th')) continue;
          rows[j].remove();
        }
      }
    }
    var sel = document.getElementById('product_option_id1');
    if(sel){
      setProductOptionVisible(true);
      sel.value = '*';
      triggerNativeChange(sel);
      setTimeout(function(){ setProductOptionVisible(false); }, 300);
    }
  }

  function selectOption(itemCode){
    var sel = document.getElementById('product_option_id1');
    if(!sel) return false;
    setProductOptionVisible(true);
    sel.value = itemCode;
    triggerNativeChange(sel);
    setTimeout(function(){ setProductOptionVisible(false); }, 300);
    return true;
  }

  function getCurrentItemCode(){
    var season = MRS_SEASON_MAP[state.currentSeason];
    return season ? season.itemCode : '';
  }

  function findSelectedItemCandidate(params){
    var keys = [];
    params.forEach(function(value, key){ keys.push(key); });
    for(var i=0;i<keys.length;i++){
      if(keys[i].indexOf('selected_item') !== -1){
        var values = params.getAll(keys[i]);
        for(var j=0;j<values.length;j++){
          if(values[j] && values[j].indexOf(getCurrentItemCode()) !== -1) return { key: keys[i], value: values[j] };
        }
      }
    }
    for(var k=0;k<keys.length;k++){
      var vals = params.getAll(keys[k]);
      for(var m=0;m<vals.length;m++){
        if(vals[m] && vals[m].indexOf(MRS_NOTE_PRODUCT_CODE) !== -1) return { key: keys[k], value: vals[m] };
      }
    }
    return null;
  }

  function cloneSelectedItemValue(value){
    var mainItemCode = getCurrentItemCode();
    if(!value) return '';
    var text = value;
    var parsed = null;
    try {
      if(text.charAt(0) === '{' || text.charAt(0) === '[') parsed = JSON.parse(text);
    } catch(err){}
    function mutate(node, key){
      if(node == null) return node;
      if(typeof node === 'string'){
        if(node === mainItemCode) return MRS_PEN_ITEM_CODE;
        if(node === MRS_NOTE_PRODUCT_CODE) return MRS_PEN_PRODUCT_CODE;
        if(key === 'product_no' && node === String(MRS_NOTE_PRODUCT_NO)) return String(MRS_PEN_PRODUCT_NO);
        return node
          .replace(new RegExp(mainItemCode, 'g'), MRS_PEN_ITEM_CODE)
          .replace(new RegExp(MRS_NOTE_PRODUCT_CODE, 'g'), MRS_PEN_PRODUCT_CODE)
          .replace(/("product_no"\s*:\s*")30(")/g, '$148$2')
          .replace(/(product_no=)30\b/g, '$148')
          .replace(/^30\|/, '48|');
      }
      if(typeof node === 'number'){
        if(key === 'product_no' && node === MRS_NOTE_PRODUCT_NO) return MRS_PEN_PRODUCT_NO;
        return node;
      }
      if(Array.isArray(node)){
        for(var i=0;i<node.length;i++) node[i] = mutate(node[i], key);
        return node;
      }
      if(typeof node === 'object'){
        for(var prop in node){
          if(Object.prototype.hasOwnProperty.call(node, prop)) node[prop] = mutate(node[prop], prop);
        }
        if(Object.prototype.hasOwnProperty.call(node, 'item_code')) node.item_code = MRS_PEN_ITEM_CODE;
        if(Object.prototype.hasOwnProperty.call(node, 'option_code')) node.option_code = MRS_PEN_ITEM_CODE;
        if(Object.prototype.hasOwnProperty.call(node, 'product_code')) node.product_code = MRS_PEN_PRODUCT_CODE;
        if(Object.prototype.hasOwnProperty.call(node, 'product_no')) node.product_no = typeof node.product_no === 'string' ? String(MRS_PEN_PRODUCT_NO) : MRS_PEN_PRODUCT_NO;
        return node;
      }
      return node;
    }
    if(parsed){
      return JSON.stringify(mutate(parsed, ''));
    }
    if(text.indexOf('|') !== -1){
      var tokens = text.split('|');
      for(var t=0;t<tokens.length;t++){
        if(tokens[t] === String(MRS_NOTE_PRODUCT_NO)) tokens[t] = String(MRS_PEN_PRODUCT_NO);
        else if(tokens[t] === mainItemCode) tokens[t] = MRS_PEN_ITEM_CODE;
        else if(tokens[t] === MRS_NOTE_PRODUCT_CODE) tokens[t] = MRS_PEN_PRODUCT_CODE;
      }
      return tokens.join('|');
    }
    return text
      .replace(new RegExp(mainItemCode, 'g'), MRS_PEN_ITEM_CODE)
      .replace(new RegExp(MRS_NOTE_PRODUCT_CODE, 'g'), MRS_PEN_PRODUCT_CODE)
      .replace(/("product_no"\s*:\s*")30(")/g, '$148$2')
      .replace(/("product_no"\s*:\s*)30\b/g, '$148')
      .replace(/(product_no=)30\b/g, '$148')
      .replace(/^30\|/, '48|');
  }

  function appendPenPayloadToParams(params){
    if(!state.penAdded) return params;
    var found = findSelectedItemCandidate(params);
    if(found){
      var cloned = cloneSelectedItemValue(found.value);
      if(cloned) params.append(found.key, cloned);
    } else {
      params.append('product_no[]', String(MRS_PEN_PRODUCT_NO));
      params.append('item_code[]', MRS_PEN_ITEM_CODE);
      params.append('quantity[]', '1');
    }
    return params;
  }

  function maybeAugmentBody(url, body){
    if(!state.pendingPayloadAppend || !state.penAdded) return body;
    if(!url || url.indexOf('/exec/front/order/basket/') === -1) return body;
    state.pendingPayloadAppend = null;
    if(typeof body === 'string'){
      var strParams = new URLSearchParams(body);
      appendPenPayloadToParams(strParams);
      return strParams.toString();
    }
    if(body instanceof URLSearchParams){
      appendPenPayloadToParams(body);
      return body;
    }
    if(typeof FormData !== 'undefined' && body instanceof FormData){
      var formParams = new URLSearchParams();
      body.forEach(function(value, key){ formParams.append(key, value); });
      appendPenPayloadToParams(formParams);
      var nextForm = new FormData();
      formParams.forEach(function(value, key){ nextForm.append(key, value); });
      return nextForm;
    }
    return body;
  }

  function installBasketInterceptor(){
    if(window.__mrsP30BasketInterceptorInstalled) return;
    window.__mrsP30BasketInterceptorInstalled = true;

    var xhrOpen = XMLHttpRequest.prototype.open;
    var xhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url){
      this.__mrsUrl = url;
      return xhrOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function(body){
      return xhrSend.call(this, maybeAugmentBody(this.__mrsUrl || '', body));
    };

    if(window.fetch){
      var nativeFetch = window.fetch;
      window.fetch = function(input, init){
        var url = typeof input === 'string' ? input : (input && input.url) || '';
        if(init && Object.prototype.hasOwnProperty.call(init, 'body')){
          init = Object.assign({}, init, { body: maybeAugmentBody(url, init.body) });
        }
        return nativeFetch.call(this, input, init);
      };
    }
  }

  function syncNativeSelection(clearFirst){
    var itemCode = getCurrentItemCode();
    if(!itemCode) return;
    if(clearFirst) clearOptions();
    setTimeout(function(){ selectOption(itemCode); }, clearFirst ? 180 : 0);
  }

  function armPayloadAppend(){
    state.pendingPayloadAppend = {
      noteProductNo: MRS_NOTE_PRODUCT_NO,
      noteItemCode: getCurrentItemCode(),
      penProductNo: MRS_PEN_PRODUCT_NO,
      penItemCode: MRS_PEN_ITEM_CODE
    };
  }

  function directSubmit(type){
    var itemCode = getCurrentItemCode();
    if(!itemCode){ alert('시즌을 먼저 선택해 주세요.'); return; }
    state.submitting = true;
    var origAlert = window.alert;
    var origConfirm = window.confirm;
    window.alert = function(msg){
      if(state.submitting && (msg.indexOf('이미 선택') !== -1 || msg.indexOf('삭제') !== -1 || msg.indexOf('필수 옵션') !== -1)) return;
      return origAlert.apply(this, arguments);
    };
    window.confirm = function(msg){
      if(state.submitting && msg.indexOf('함께 구매') !== -1) return true;
      return origConfirm.apply(this, arguments);
    };
    clearOptions();
    setTimeout(function(){
      selectOption(itemCode);
      var waitCount = 0;
      function waitForOption(){
        var tp = document.getElementById('totalProducts');
        var hasItem = tp && tp.querySelector('tbody tr, .option_box');
        if(!hasItem && waitCount < 15){
          waitCount++;
          setTimeout(waitForOption, 200);
          return;
        }
        var origCheck = window.checkOptionRequired;
        window.checkOptionRequired = function(){ return true; };
        armPayloadAppend();
        try {
          if(typeof product_submit !== 'undefined'){
            var btnEl = type === 2 ? document.querySelector('button.actionCart') : document.querySelector('a.btnSubmit.gFull');
            product_submit(type, '/exec/front/order/basket/', btnEl || null);
          }
        } catch(err){}
        setTimeout(function(){
          state.submitting = false;
          state.pendingPayloadAppend = null;
          window.alert = origAlert;
          window.confirm = origConfirm;
          if(origCheck) window.checkOptionRequired = origCheck;
          else delete window.checkOptionRequired;
        }, 3000);
      }
      setTimeout(waitForOption, 600);
    }, 200);
  }

  function installCapture(){
    document.addEventListener('click', function(e){
      var el = e.target;
      var depth = 0;
      while(el && el.tagName !== 'BODY' && depth < 6){
        var oc = el.getAttribute('onclick') || '';
        if(oc.indexOf('product_submit') !== -1){
          e.preventDefault();
          e.stopImmediatePropagation();
          var isCart = oc.indexOf('product_submit(2') !== -1;
          directSubmit(isCart ? 2 : 1);
          return;
        }
        el = el.parentElement;
        depth++;
      }
    }, true);

    document.addEventListener('click', function(e){
      var el = e.target;
      var depth = 0;
      while(el && el.tagName !== 'BODY' && depth < 6){
        var cls = (el.className || '').toString();
        if(cls.indexOf('kakao') !== -1 || cls.indexOf('kakaopay') !== -1 || cls.indexOf('naverpay') !== -1 || cls.indexOf('naver-pay') !== -1 || cls.indexOf('npay') !== -1 || cls.indexOf('checkout_btn') !== -1 || cls.indexOf('Npay') !== -1){
          e.preventDefault();
          e.stopImmediatePropagation();
          directSubmit(1);
          return;
        }
        el = el.parentElement;
        depth++;
      }
    }, true);
  }

  function guardNpay(){
    var appPay = document.querySelector('.app-pay-wrap');
    if(!appPay) return;
    var npay = document.getElementById('NaverChk_Button');
    if(npay && !appPay.contains(npay)) appPay.insertBefore(npay, appPay.firstChild);
    if(npay){
      npay.style.setProperty('display','block','important');
      npay.style.setProperty('visibility','visible','important');
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
    guard.observe(document.body, { childList:true, subtree:true });
    setTimeout(function(){ guard.disconnect(); }, 8000);
  }

  function bindUi(){
    var seasons = document.querySelectorAll('#mrsOptionWrap .season');
    for(var i=0;i<seasons.length;i++){
      seasons[i].addEventListener('click', function(){
        selectSeason(this.getAttribute('data-season'));
      });
    }
    var penCard = document.getElementById('penAddon');
    var penToggle = document.getElementById('penToggle');
    if(penCard) penCard.addEventListener('click', togglePen);
    if(penToggle) penToggle.addEventListener('click', function(e){
      e.stopPropagation();
      togglePen();
    });
    var cartBtn = document.getElementById('mrsCartBtn');
    var buyBtn = document.getElementById('mrsBuyBtn');
    if(cartBtn) cartBtn.addEventListener('click', function(){ directSubmit(2); });
    if(buyBtn) buyBtn.addEventListener('click', function(){ directSubmit(1); });
  }

  function ensureUi(){
    var readyWrap = document.querySelector('#mrsOptionWrap .season-grid');
    if(!readyWrap) insertUI();
  }

  function init(){
    insertUI();
    bindUi();
    setPenImage();
    installBasketInterceptor();
    installCapture();
    fetchPricing();
    selectSeason(state.currentSeason);
    updateStaticPrices();
    setTimeout(function(){ syncNativeSelection(true); }, 200);
    setTimeout(ensureUi, 400);
    setTimeout(ensureUi, 1200);
    setTimeout(guardNpay, 1200);
    setTimeout(guardNpay, 3500);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.addEventListener('load', ensureUi);
})();
