/**
 * 메아리셋 옵션 UI v7.2 — 외부 스크립트 버전
 * product_no=27 전용 (다른 상품에서는 실행 안 됨)
 * 호스팅: hyunvis.vercel.app/meariset/option-ui.js
 */
(function(){
  /* 중복 실행 방지 */
  if(window._mrsOptionLoaded) return;
  window._mrsOptionLoaded = true;

  /* product_no=27 에서만 실행 (SEO URL 대응) */
  var prdEl = document.querySelector('[data-prd-no]');
  var prdNo = prdEl ? prdEl.getAttribute('data-prd-no') : '';
  var urlHas27 = location.search.indexOf('product_no=27') !== -1 || location.href.indexOf('product_no=27') !== -1;
  if(!urlHas27 && prdNo !== '27'){ window._mrsOptionLoaded = false; return; }

  /* 이미 로드됨 */
  if(document.getElementById('mrsOptionWrap')) return;

  /* 즉시 placeholder 생성 — CDN 구버전이 중복 실행되는 것 방지 */
  var _placeholder = document.createElement('div');
  _placeholder.id = 'mrsOptionWrap';
  _placeholder.style.display = 'none';
  (document.body || document.documentElement).appendChild(_placeholder);

  /* ── CSS 주입 ── */
  var css = document.createElement('style');
  css.textContent = '\
  .productOption{position:fixed!important;left:-99999px!important;top:-99999px!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important}\
  #totalProducts,div#totalPrice,.quantity_price{position:fixed!important;left:-99999px!important;top:-99999px!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important}\
  .mrs-option-wrap{max-width:600px;margin:32px auto;font-family:Pretendard,sans-serif;color:#2D2D2D;background:#fff;border-radius:16px;padding:24px 8px}\
  .mrs-option-wrap *{box-sizing:border-box;margin:0;padding:0}\
  .mrs-title{font-size:18px;font-weight:700;margin-bottom:12px;text-align:center}\
  .mrs-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:24px}\
  @media(min-width:768px){.mrs-option-wrap{max-width:680px;padding:32px 16px}.mrs-grid{gap:14px}.mrs-card-label{font-size:15px;padding:10px 6px 12px}.mrs-title{font-size:20px;margin-bottom:16px}}\
  .mrs-card{position:relative;border:2px solid #ddd;border-radius:12px;overflow:hidden;cursor:pointer;transition:border-color .2s,box-shadow .2s,transform .2s;background:#fff;transform:scale(1)}\
  .mrs-card:hover{border-color:#aaa;transform:scale(1.02)}\
  .mrs-card.selected{border-color:#D4A853;box-shadow:0 0 0 3px rgba(212,168,83,.25);transform:scale(1.04)}\
  .mrs-start-badge{position:absolute;top:-1px;left:50%;transform:translateX(-50%);background:#D4A853;color:#fff;font-size:10px;font-weight:700;padding:6px 14px;border-radius:0 0 8px 8px;white-space:nowrap;letter-spacing:.5px;z-index:3}\
  @keyframes mrs-badge-bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-2px)}}\
  .mrs-start-badge{animation:mrs-badge-bounce 1.5s ease-in-out infinite}\
  .mrs-check{position:absolute;top:8px;right:8px;width:24px;height:24px;border-radius:50%;background:#D4A853;color:#fff;display:none;align-items:center;justify-content:center;font-size:14px;font-weight:700;z-index:2;transform:scale(0);transition:transform .2s cubic-bezier(.34,1.56,.64,1)}\
  .mrs-card.selected .mrs-check{display:flex;transform:scale(1)}\
  .mrs-card-img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;background:#f5f3ef;transition:filter .25s}\
  .mrs-card.selected .mrs-card-img{filter:brightness(1.08) saturate(1.15)}\
  .mrs-card::after{content:"";position:absolute;inset:0;background:rgba(212,168,83,0);transition:background .25s;pointer-events:none;z-index:1;border-radius:10px}\
  .mrs-card.selected::after{background:rgba(212,168,83,.12)}\
  .mrs-card-label{text-align:center;padding:10px 6px 12px;font-size:14px;font-weight:600;white-space:nowrap}\
  .mrs-info{background:#FAFAF8;border:1px solid #eee;border-radius:12px;padding:24px 28px;text-align:center;min-height:110px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;transition:all .25s}\
  .mrs-info-tag{display:inline-block;font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;margin-bottom:2px}\
  .mrs-info-tag.best{background:#E8F5E9;color:#2E7D32}\
  .mrs-info-tag.lowest{background:#FFF3E0;color:#E65100}\
  .mrs-info-price{font-size:24px;font-weight:800;color:#2D2D2D}\
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
  #mrsTagline{font-family:Pretendard,sans-serif;padding:10px 0 6px;font-size:19px;font-weight:800;color:#1A1A1A;line-height:1.4;letter-spacing:-.3px;opacity:0;transition:opacity .35s,transform .35s;transform:translateY(6px)}\
  #mrsTagline.visible{opacity:1;transform:translateY(0)}\
  #mrsTagline.hidden{opacity:0;transform:translateY(6px)}\
  #mrsTagline em{font-style:normal;color:#D4A853}\
  .mrs-sticky{position:fixed;bottom:0;left:0;right:0;z-index:99998;background:#fff;border-top:1.5px solid #eee;padding:10px 16px;display:none;align-items:center;justify-content:space-between;gap:12px;box-shadow:0 -4px 16px rgba(0,0,0,.1)}\
  .mrs-sticky.visible{display:flex}\
  .mrs-sticky-info{display:flex;flex-direction:column;gap:2px}\
  .mrs-sticky-label{font-size:12px;color:#999}\
  .mrs-sticky-price{font-size:18px;font-weight:800;color:#2D2D2D}\
  .mrs-sticky-btn{background:#D4A853;color:#fff;border:none;border-radius:10px;padding:12px 24px;font-size:15px;font-weight:700;cursor:pointer;white-space:nowrap;transition:background .2s;font-family:Pretendard,sans-serif}\
  .mrs-sticky-btn:hover{background:#c49540}\
  .mrs-sticky-btn:active{transform:scale(.97)}\
  @media(min-width:768px){.mrs-sticky{display:none!important}}\
  @media(max-width:520px){.mrs-sticky-price{font-size:16px}.mrs-sticky-btn{padding:12px 18px;font-size:14px}}\
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
    <p class="mrs-title">메아리셋 시즌 선택</p>\
    <div class="mrs-grid">\
      <div class="mrs-card" data-season="1" onclick="mrsToggle(this)">\
        <span class="mrs-start-badge">✦ 입문자 추천</span>\
        <span class="mrs-check">✓</span>\
        <img class="mrs-card-img" src="https://hyunvis.vercel.app/meariset/s1_banner.jpg" onerror="this.style.background=\'#1a1a2e\'" alt="Season 1">\
        <div class="mrs-card-label">Season 1</div>\
      </div>\
      <div class="mrs-card" data-season="2" onclick="mrsToggle(this)">\
        <span class="mrs-check">✓</span>\
        <img class="mrs-card-img" src="https://hyunvis.vercel.app/meariset/s2_banner.jpg" onerror="this.style.background=\'#3a3a3a\'" alt="Season 2">\
        <div class="mrs-card-label">Season 2</div>\
      </div>\
      <div class="mrs-card" data-season="3" onclick="mrsToggle(this)">\
        <span class="mrs-check">✓</span>\
        <img class="mrs-card-img" src="https://hyunvis.vercel.app/meariset/s3_banner.jpg" onerror="this.style.background=\'#1a3a1a\'" alt="Season 3">\
        <div class="mrs-card-label">Season 3</div>\
      </div>\
      <div class="mrs-card" data-season="4" onclick="mrsToggle(this)">\
        <span class="mrs-check">✓</span>\
        <img class="mrs-card-img" src="https://hyunvis.vercel.app/meariset/s4_banner.jpg" onerror="this.style.background=\'#0d1b3e\'" alt="Season 4">\
        <div class="mrs-card-label">Season 4</div>\
      </div>\
    </div>\
    <div class="mrs-info" id="mrsInfo">\
      <p class="mrs-info-copy">원하는 시즌을 자유롭게 골라보세요</p>\
      <p class="mrs-info-sub">어떤 조합이든 가능합니다</p>\
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
    1:'<p class="mrs-info-price"><span id="mrsPriceNum">29,000</span>원 <span style="font-size:14px;font-weight:400;color:#e65100">+ 배송비 3,000원</span></p><p class="mrs-info-hint" onclick="mrsHintAdd()">💡 1권 더 담으면 9,000원 절약</p>',
    2:'<span class="mrs-info-tag best">✅ 가장 많이 선택</span><p class="mrs-info-price"><span id="mrsPriceNum">49,000</span>원 <span style="font-size:14px;font-weight:400;color:#e65100">+ 배송비 3,000원</span></p><p class="mrs-info-hint" onclick="mrsHintAdd()">💡 1권만 더 담으면 배송비 무료</p>',
    3:'<span class="mrs-info-tag best">🚚 배송비 무료</span><p class="mrs-info-price"><span id="mrsPriceNum">69,000</span>원 <span style="font-size:14px;font-weight:400;color:#777">(권당 23,000원)</span></p><p class="mrs-info-hint" onclick="mrsHintAdd()">🎁 1권만 더 담으면 최저가 + 한정판 사은품</p>',
    4:'<span class="mrs-info-tag lowest">🏆 최저가 + 한정판 사은품</span><p class="mrs-info-price"><span id="mrsPriceNum">89,000</span>원 <span style="font-size:14px;font-weight:400;color:#777">(권당 22,250원)</span></p><p class="mrs-info-hint" style="cursor:default;animation:none">365일 메아리셋 완성 🎉</p>'
  };
  var TAGLINE={1:'"작심삼일을 <em>끝내고 싶은 분</em>"',2:'"180일, <em>습관으로 만들고 싶은 분</em>"',3:'"9개월, <em>진짜 달라지고 싶은 분</em>"',4:'"한 해 전체를 <em>내 것으로 만들고 싶은 분</em>"'};

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
    document.getElementById('mrsInfo').innerHTML=info?info:'<p class="mrs-info-copy">원하는 시즌을 자유롭게 골라보세요</p><p class="mrs-info-sub">어떤 조합이든 가능합니다</p>';
    if(info&&PRICE_BY_COUNT[count]) requestAnimationFrame(function(){mrsAnimatePrice(prevPrice,PRICE_BY_COUNT[count],350);});
    if(_prevCount<3&&count>=3&&count<4) setTimeout(function(){mrsShowToast('🎉 배송비 무료 달성!','green');},150);
    if(_prevCount<4&&count>=4) setTimeout(function(){mrsShowToast('🏆 최저가 달성!','red');},150);
    mrsUpdateTagline(count);mrsUpdateSticky(count);_prevCount=count;
  };
  window.mrsHintAdd=function(){var cards=document.querySelectorAll('.mrs-card:not(.selected)');if(cards.length)cards[0].click();};

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

  /* ── 초기화 ── */
  function mrsInit(){
    insertUI();
    mrsInstallCapture();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mrsInit);
  else mrsInit();
})();
