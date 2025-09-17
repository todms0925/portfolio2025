$(document).ready(function(){
    // 처음엔 서브메뉴 숨김
    $(".sub").hide();

    // hover 시 애니메이션 효과
    $(".menu > li").hover(
        function(){ // mouseenter
            $(this).find(".sub").stop(true, true).slideDown(300);
        },
        function(){ // mouseleave
            $(this).find(".sub").stop(true, true).slideUp(300);
        }
    );



//슬라이드
$(function(){
  var $imgSlides = $('.slider_img ul li');        // 이미지 슬라이드
  var $txtSlides = $('.box1-2 .slider > li');    // 텍스트 슬라이드
  var $indis     = $('.s_btn ul li');            // s_btn 순번 버튼
  var total      = $imgSlides.length;
  var current    = 0;
  var timer      = null;
  var interval   = 4000;

  // 초기 상태
  $imgSlides.hide().eq(0).show();
  $txtSlides.removeClass('on').eq(0).addClass('on');
  $indis.removeClass('on').eq(0).addClass('on');

  // slider_btnS 초기 상태
  $('.slider_btnS a').removeClass('on').eq(0).addClass('on');

  function showSlide(index){
    index = (index + total) % total;

    // 이미지
    $imgSlides.fadeOut(600).eq(index).fadeIn(600);

    // 텍스트
    $txtSlides.removeClass('on').eq(index).addClass('on');

    // s_btn 순번
    $indis.removeClass('on').eq(index).addClass('on');

    current = index;
  }

  function nextSlide(){ showSlide(current + 1); }
  function prevSlide(){ showSlide(current - 1); }

  // 좌/우 버튼 클릭
  $('.slider_btnR a').on('click', function(e){
    e.preventDefault();
    nextSlide();
    resetTimer();
  });

  $('.slider_btnL a').on('click', function(e){
    e.preventDefault();
    prevSlide();
    resetTimer();
  });

  // s_btn 순번 클릭
  $indis.on('click', function(){
    var idx = $(this).index();
    showSlide(idx);
    resetTimer();
  });

  // 자동재생
  function startTimer(){
    stopTimer();
    timer = setInterval(nextSlide, interval);

    // 재생 중 → slider_btnS 첫번째 a
    $('.slider_btnS a').removeClass('on').eq(0).addClass('on');
  }

  function stopTimer(){
    if(timer){ clearInterval(timer); timer = null; }

    // 멈춤 중 → slider_btnS 두번째 a
    $('.slider_btnS a').removeClass('on').eq(1).addClass('on');
  }

  function resetTimer(){
    stopTimer();
    startTimer();
  }

  // slider_btnS 클릭 → 자동재생 토글
  $('.slider_btnS a').on('click', function(e){
    e.preventDefault();
    if(timer){
      stopTimer();   // 재생 중 → 멈춤
    } else {
      startTimer();  // 멈춤 중 → 재생
    }
  });

  // 자동 시작
  startTimer();
});

//___________________
// 공지사항 텍스트롤링
$(function(){
  var $ul = $('.notice ul');
  var animTime = 600;   // 애니메이션 시간(ms)
  var delay = 3000;     // 다음 항목으로 넘어가는 간격(ms)
  var timer = null;

  // 안전 체크: li가 1개 이하이면 동작 안 함
  if ($ul.length === 0) return;
  if ($ul.children('li').length <= 1) return;

  function rollOnce(){
    // 매번 최신 li 높이(마진 포함) 계산 — 반응형 대응
    var $lis = $ul.children('li');
    var itemH = $lis.first().outerHeight(true);

    // 1) 모든 li를 위로 이동시키기 (transform 적용)
    $lis.each(function(){
      // 명시적으로 transition을 설정해서 부드럽게 이동
      $(this).css('transition', 'transform ' + animTime + 'ms');
      $(this).css('transform', 'translateY(-' + itemH + 'px)');
    });

    // 2) 애니메이션 끝난 후: 첫 li를 맨 뒤로 옮기고 transform 초기화
    setTimeout(function(){
      // transition 제거(스냅해서 자리로 돌아가게)
      $lis.css('transition', 'none');

      // 첫 항목을 맨 끝으로 이동
      var $first = $ul.children('li').first();
      $first.appendTo($ul);

      // 강제 reflow (브라우저가 변화를 확실히 인지하게 함)
      // eslint-disable-next-line no-unused-expressions
      $ul[0].offsetHeight;

      // 모든 li transform 리셋 (다음 애니 때 대비)
      $ul.children('li').css('transform', 'none');
      // transition 인라인 비워두기(다음 롤에서 다시 세팅)
      $ul.children('li').css('transition', '');
    }, animTime);
  }

  function start(){
    if (!timer) timer = setInterval(rollOnce, delay);
  }
  function stop(){
    if (timer){ clearInterval(timer); timer = null; }
  }

  // 자동 시작
  start();
});

















    
});































