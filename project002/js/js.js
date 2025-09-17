$(document).ready(function () {


  // 사이드 장바구니 인/아웃
  let stor = 0

  //사이드 장바구니를 클릭시
  $('.cart_side_btn').click(function () {

    stor++;
    if (stor == 2) stor = 0;

    if (stor == 1) {
      $(this).parent('.cart_side').addClass('on')
      $('.cart_side_btn').addClass('on')
      $('.cart_side_bg').addClass('on')
    }
    else {
      $(this).parent('.cart_side').removeClass('on')
      $('.cart_side_btn').removeClass('on')
      $('.cart_side_bg').removeClass('on')
    }
  });

  //사이드 장바구니 상세설정
  // 장바구니 숫자up
  $(function () {

    // 장바구니 숫자 초기값 숨김
    $('.cart_side_btn span').hide();

    // 상품 담기
    $('.cart_s').click(function (e) {
      e.preventDefault();

      let $li = $(this).closest('li');
      let tP = $li.find('p').first().text().trim();
      let tImg = $li.find('img').attr('src');
      let tS = Number($li.find('span').text());

      $('.cart_side-less').hide();

      // 기존 상품 확인
      let $existItem = $('.cart_side_list p').filter(function () {
        return $(this).text().trim() === tP;
      }).closest('.cart_side_list');

      if ($existItem.length > 0) {
        let $numEm = $existItem.find('.num em');
        $numEm.text(Number($numEm.text()) + 1);
      } else {
        let cart_list = `
      <div class="cart_side_list">
        <ul>
          <li>
            <img src="${tImg}" alt="">
            <div class="t">
              <p>${tP}</p>
              <div class="tt">
                <div class="num">
                  <i class="fa-solid fa-caret-left"></i>
                  <em>1</em>
                  <i class="fa-solid fa-caret-right"></i>
                </div>
                <strong><em>${tS}</em>원</strong>
              </div>
            </div>
          </li>
        </ul>
      </div>`;
        $('.cart_side_lists-wrapper').append(cart_list);
      }

      updateCartSummary();
    });

    // 장바구니 내 수량 증가
    $(document).on('click', '.cart_side_list .fa-caret-right', function () {
      let $em = $(this).siblings('em');
      $em.text(Number($em.text()) + 1);
      updateCartSummary();
    });

    // 장바구니 내 수량 감소
    $(document).on('click', '.cart_side_list .fa-caret-left', function () {
      let $em = $(this).siblings('em');
      let current = Number($em.text());

      if (current > 1) {
        $em.text(current - 1);
      } else {
        $(this).closest('.cart_side_list').remove();
      }

      updateCartSummary();
    });

    // 전체 비우기 클릭
    $(document).on('click', '.cart_side_txt1 p', function () {
      $('.cart_side_list').remove();
      updateCartSummary();
    });

    // 총 수량 & 결제 예정 금액 업데이트
    function updateCartSummary() {
      let totalCount = 0;
      let totalPrice = 0;

      $('.cart_side_list').each(function () {
        let qty = Number($(this).find('.num em').text());
        let price = Number($(this).find('strong em').text());
        totalCount += qty;
        totalPrice += qty * price;
      });

      // cart_side_btn 숫자 표시/숨김
      if (totalCount > 0) {
        $('.cart_side_btn span').text(totalCount).show();

      } else {
        $('.cart_side_btn span').hide();
      }

      // 결제 예정 금액 갱신
      $('.cart_side_txt2 b em').text(totalPrice.toLocaleString());

      // 장바구니 비었으면 문구 보이기
      if (totalCount === 0) {
        $('.cart_side-less').show();
      } else {
        $('.cart_side-less').hide();
      }
    }

  });



  //________________________

  // 스토어 탭바 설정
  $('.store .st_btn1 li').click(function () {
    let b = $(this).index()

    $('.store .st_btn1 li').removeClass('on');
    $(this).addClass('on');

    $('.st_list1>div').removeClass('on')
    $('.st_list1>div').eq(b).addClass('on')
  });

  $('.store .st_btn2 li').click(function () {
    let b = $(this).index()
    $('.store .st_btn2 li').removeClass('on')
    $(this).addClass('on')
    $('.st_list2>div').removeClass('on')
    $('.st_list2>div').eq(b).addClass('on')
  });

  //스토어 장바구니
  $('.cart_btn').click(function () {
    stor = (stor + 1) % 2;

    if (stor == 1) {
      $('.cart_side').addClass('on');
      $('.cart_side_btn').addClass('on');
      $('.cart_side_bg').addClass('on');
    } else {
      $('.cart_side').removeClass('on');
      $('.cart_side_btn').removeClass('on');
      $('.cart_side_bg').removeClass('on');
    }
  });

  //장바구니가 열린 상태에서 배경을 클릭시

  $('.cart_side_bg').click(function () {
    $('.cart_side_btn').removeClass('on')
    $('.cart_side_bg').removeClass('on')
    $('.cart_side').removeClass('on')
  })


  //_______________________
  //util의 두번째 li(장바구니 아이콘)클릭 시
  $('.util li').eq(1).click(function () {
    stor = (stor + 1) % 2;

    if (stor == 1) {
      $('.cart_side').addClass('on');
      $('.cart_side_btn').addClass('on');
      $('.cart_side_bg').addClass('on');
    } else {
      $('.cart_side').removeClass('on');
      $('.cart_side_btn').removeClass('on');
      $('.cart_side_bg').removeClass('on');
    }
  });



  //_______________________

  //슬라이드
  $(function () {
    let current = 0;
    const $slides = $('.slider_main li');   // 메인 텍스트 슬라이드
    const $bars = $('.s_bar li');         // 인디케이터
    const $bgs = $('.slider_bg li');     // 배경 이미지 슬라이드

    // 처음 세팅
    $slides.hide().eq(0).show();
    $bgs.hide().eq(0).show();

    function goToSlide(index) {
      // 메인 슬라이드
      $slides.eq(current).stop(true, true).fadeOut(500);
      $slides.eq(index).stop(true, true).fadeIn(500);

      // 배경 슬라이드
      $bgs.eq(current).stop(true, true).fadeOut(500);
      $bgs.eq(index).stop(true, true).fadeIn(500);

      // 인디케이터
      $bars.removeClass('on').eq(index).addClass('on');

      current = index; // 현재 인덱스 업데이트
    }

    // 다음 버튼
    $('.s_btnR').click(function () {
      let next = (current + 1) % $slides.length;
      goToSlide(next);
    });

    // 이전 버튼
    $('.s_btnL').click(function () {
      let prev = (current - 1 + $slides.length) % $slides.length;
      goToSlide(prev);
    });
  });


  //_______________________

  //movie설정

  //moive_side의 li를 클릭 할때마다 moive_main의 li와 moive_bar의 li가 바뀜

  $('.moive_side li').click(function () {
    let movie = $(this).index()


    $('.moive_main li').removeClass('on')
    $('.moive_main li').eq(movie).addClass('on')
    $('.moive_bar li').removeClass('on')
    $('.moive_bar li').eq(movie).addClass('on')
    $('.moive_side li').removeClass('on')
    $('.moive_side li').eq(movie).addClass('on')
  })

  //_______________________
  //화면이 product를 보고 있을 때 패럴렉스스크롤링
  $(window).scroll(function () {
    let scrollPosition = $(this).scrollTop();

    let productOffset = $('.product').offset().top;
    let triggerPoint = productOffset - $(window).height() + 500;

    if (scrollPosition >= triggerPoint) {
      $('.product_list ul').addClass('on');
    } else {
      $('.product_list ul').removeClass('on');
    }
  });


  // _____________________________________________________
  // 서브페이지 설정


  //로그인 페이지
   $(document).ready(function() {

    
    // 유틸 메뉴의 첫 번째 li 요소(로그인 아이콘)를 클릭했을 때
    $('.util ul li:first-child').on('click', function(e) {
        e.preventDefault(); 
        $('#login').show();
    });

    // 사이드 장바구니에서 '구매하기' 버튼을 클릭했을 때
    $('.cart_side_txt3').on('click', function(e) {
        e.preventDefault();
        
        // 로그인 페이지를 보이게 함
        $('#login').show();
        
        // 장바구니 페이지는 숨김
        $('.cart_side').removeClass('on');
        $('.cart_side_btn').removeClass('on');
        $('.cart_side_bg').removeClass('on');
    });

    // '.fa-solid.fa-xmark' 또는 '.login_bg'를 클릭했을 때
    $('.fa-solid.fa-xmark, .login_bg').on('click', function() {
        $('#login').hide();
    });

    // 페이지 로드 시 localStorage에 아이디가 있는지 확인하고 채워 넣음
    if (localStorage.getItem('savedId')) {
        $('input[name="userName"]').val(localStorage.getItem('savedId'));
        $('#remember-check').prop('checked', true);
    }

    // 로그인 폼 제출 시
    $('#login-form').submit(function() {
        if ($('#remember-check').is(':checked')) {
            localStorage.setItem('savedId', $('input[name="userName"]').val());
        } else {
            localStorage.removeItem('savedId');
        }
    });
});


  // ------------------------
  // 슬라이드 처리 (shop1, shop2)
  // ------------------------
  $('.shop_main').each(function() {
    let $shop = $(this);
    let $imgs = $shop.find('.shop_img li');
    let $dots = $shop.find('.shop_side li');
    let current = 0;
    let total = $imgs.length;
    let interval = 3000;

    $imgs.hide().eq(current).show();
    $dots.removeClass('on').eq(current).addClass('on');

    function showSlide(next) {
      $imgs.eq(current).fadeOut(600);
      $imgs.eq(next).fadeIn(600);
      $dots.removeClass('on').eq(next).addClass('on');
      current = next;
    }

    let timer = setInterval(function() {
      let next = (current + 1) % total;
      showSlide(next);
    }, interval);
  });

  // ------------------------
  // 가격, 수량 갱신 (shop 단위)
  // ------------------------
  $('.shop_main').each(function() {
    let $shop = $(this);
    let unitPrice = Number($shop.find('.shop_price li').first().find('span').text());

    $shop.find('.shop_price .fa-plus').click(function() {
      let $qtySpan = $(this).siblings('span');
      let qty = Number($qtySpan.text()) + 1;
      $qtySpan.text(qty);
      $shop.find('.shop_price li').first().find('span').text(unitPrice * qty);
    });

    $shop.find('.shop_price .fa-minus').click(function() {
      let $qtySpan = $(this).siblings('span');
      let qty = Number($qtySpan.text());
      if(qty > 1) {
        qty--;
        $qtySpan.text(qty);
        $shop.find('.shop_price li').first().find('span').text(unitPrice * qty);
      }
    });
  });



$(function() {

  // -----------------------------
  // 기본 shop 숨김
  $('#shop_wrap [id^="shop"]').hide();

  // -----------------------------
  // 장바구니 버튼 클릭 시 li 이벤트 중첩 방지
  $(document).on('click', '.cart_s', function(e) {
    e.preventDefault();
    e.stopPropagation();
  });

  // -----------------------------
  // shop 클릭 매핑 테이블
  const shopMap = [
    { selector: '.st_list1 .milk li', startShop: 1 },      // 우유 1~5
    { selector: '.bast ul li:first', startShop: 6 },       // 베스트 첫번째 li
    { selector: '.st_list1 .f-milk li', startShop: 7 },    // 발효유 7~11
    { selector: '.st_list2 .juice li', startShop: 12 },    // 주스 12~16
    // { selector: '.st_list2 .ice li', startShop: 17 },   // 아이스크림 추가 시
  ];

  // -----------------------------
  // 각 매핑에 대해 클릭 이벤트 등록
  shopMap.forEach(function(map) {
    $(map.selector).each(function(index) {
      $(this).on('click', function() {
        // 모든 shop 숨김
        $('#shop_wrap [id^="shop"]').hide();

        // 해당 shop 보여주기
        $('#shop' + (map.startShop + index)).show();
      });
    });
  });

});












  // ------------------------
  // 리뷰 이미지 없는 경우 제거
  // ------------------------
  $('.review_list').each(function() {
    $(this).find('li').each(function() {
      let img = $(this).find('img');
      if(!img.attr('src') || img.attr('src').trim() === '') {
        $(this).addClass('no-image-review');
        img.parent('.review_listImgBox').remove();
      }
    });
  });

  // ------------------------
  // 리뷰 페이지네이션 (shop 단위)
  // ------------------------
  $('.review').each(function() {
    let $review = $(this);
    let $li = $review.find('.review_list li');
    const perPage = 6;
    const totalPages = Math.ceil($li.length / perPage);
    let currentPage = 1;

    function showPage(page) {
      $li.hide();
      $li.slice((page-1)*perPage, page*perPage).show();
      $review.find('.review_bar span').text(page);
    }

    $review.find('.review_bar .fa-angle-left').click(function() {
      if(currentPage > 1) currentPage--;
      showPage(currentPage);
    });

    $review.find('.review_bar .fa-angle-right').click(function() {
      if(currentPage < totalPages) currentPage++;
      showPage(currentPage);
    });

    showPage(currentPage);
  });

  // ------------------------
  // 추천상품 슬라이드 (shop 단위)
  // ------------------------
  $('.recommend').each(function() {
    const $shopRec = $(this);
    const $ul = $shopRec.find('.re_list > div > ul');
    const $bar = $shopRec.find('.re_bar');
    const $handle = $bar.find('div');

    const containerWidth = $shopRec.find('.re_list').width();
    const liCount = $ul.find('li').length;
    const liWidth = $ul.find('li').outerWidth(true);
    const ulWidth = liCount * liWidth;
    const maxMove = ulWidth - containerWidth;
    const barWidth = $bar.width();
    const handleWidth = $handle.width();
    const handleMax = barWidth - handleWidth;

    let isDragging = false;
    let startX = 0;
    let handleStart = 0;

    $handle.on('mousedown touchstart', function(e) {
      e.preventDefault();
      isDragging = true;
      startX = e.pageX || e.originalEvent.touches[0].pageX;
      handleStart = parseFloat($handle.css('left')) || 0;
    });

    $(document).on('mousemove touchmove', function(e) {
      if(!isDragging) return;
      const x = e.pageX || e.originalEvent.touches[0].pageX;
      let move = x - startX;
      let newLeft = handleStart + move;
      if(newLeft < 0) newLeft = 0;
      if(newLeft > handleMax) newLeft = handleMax;
      $handle.css('left', newLeft + 'px');
      const percent = newLeft / handleMax;
      const ulLeft = -maxMove * percent;
      $ul.css('transform', 'translateX(' + ulLeft + 'px)');
    });

    $(document).on('mouseup touchend', function() {
      isDragging = false;
    });
  });



});



