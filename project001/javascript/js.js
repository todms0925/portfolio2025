$(function () {
  /* ---------------- 메뉴(hover) ---------------- */
  $(".sub").hide();
  $(".menu > li").hover(
    function () { $(this).find(".sub").stop(true, true).slideDown(300); },
    function () { $(this).find(".sub").stop(true, true).slideUp(300); }
  );

  /* ---------------- 슬라이더 (이미지/텍스트) ---------------- */
  (function () {
    var $imgSlides = $('.slider_img ul li');
    var $txtSlides = $('.box1-2 .slider > li');
    var $indis = $('.s_btn ul li');
    var total = $imgSlides.length;
    var current = 0;
    var timer = null;
    var interval = 4000;

    $imgSlides.hide().eq(0).show();
    $txtSlides.removeClass('on').eq(0).addClass('on');
    $indis.removeClass('on').eq(0).addClass('on');
    $('.slider_btnS a').removeClass('on').eq(0).addClass('on');

    function showSlide(index) {
      index = (index + total) % total;
      $imgSlides.stop(true, true).fadeOut(600).eq(index).fadeIn(600);
      $txtSlides.removeClass('on').eq(index).addClass('on');
      $indis.removeClass('on').eq(index).addClass('on');
      current = index;
    }
    function nextSlide() { showSlide(current + 1); }
    function prevSlide() { showSlide(current - 1); }

    $('.slider_btnR a').on('click', function (e) { e.preventDefault(); nextSlide(); resetTimer(); });
    $('.slider_btnL a').on('click', function (e) { e.preventDefault(); prevSlide(); resetTimer(); });

    $indis.on('click', function () { showSlide($(this).index()); resetTimer(); });

    function startTimer() {
      stopTimer();
      timer = setInterval(nextSlide, interval);
      $('.slider_btnS a').removeClass('on').eq(0).addClass('on');
    }
    function stopTimer() {
      if (timer) { clearInterval(timer); timer = null; }
      $('.slider_btnS a').removeClass('on').eq(1).addClass('on');
    }
    function resetTimer() { stopTimer(); startTimer(); }

    $('.slider_btnS a').on('click', function (e) {
      e.preventDefault();
      if (timer) stopTimer(); else startTimer();
    });

    startTimer();
  })();

  /* ---------------- 공지사항 텍스트 롤링 ---------------- */
  (function () {
    var $ul = $('.notice ul');
    var animTime = 600;
    var delay = 3000;
    var timer = null;

    if ($ul.length === 0) return;
    if ($ul.children('li').length <= 1) return;

    function rollOnce() {
      var $lis = $ul.children('li');
      var itemH = $lis.first().outerHeight(true);

      $lis.each(function () {
        $(this).css('transition', 'transform ' + animTime + 'ms');
        $(this).css('transform', 'translateY(-' + itemH + 'px)');
      });

      setTimeout(function () {
        $lis.css('transition', 'none');
        $ul.children('li').first().appendTo($ul);
        $ul[0].offsetHeight; // force reflow
        $ul.children('li').css('transform', 'none').css('transition', '');
      }, animTime);
    }

    function start() { if (!timer) timer = setInterval(rollOnce, delay); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    start();
  })();

  /* ---------------- 리뷰 슬라이더 (드래그 바) ---------------- */
  (function () {
    const $slider1 = $(".review_silder1");
    const $slider2 = $(".review_silder2");
    const $bar = $(".review_bar2");
    const $barTrack = $(".review_bar1");

    // 안전 체크
    if ($slider1.length === 0 || $slider2.length === 0 || $bar.length === 0 || $barTrack.length === 0) return;

    let sliderWidth = $slider1.width();
    let position = 0;
    let speed = 1;
    let barMax = Math.max(0, $barTrack.width() - $bar.width());

    let interval;
    let dragging = false;
    let startX = 0;
    let barX = 0;

    function updateUI() {
      $slider1.css("transform", "translateX(" + position + "px)");
      $slider2.css("transform", "translateX(" + (position + sliderWidth) + "px)");
      let progress = Math.abs(position % sliderWidth) / sliderWidth;
      $bar.css("transform", "translateX(" + (progress * barMax) + "px)");
    }

    function moveSlider() {
      if (!dragging) {
        position -= speed;
        if (position <= -sliderWidth) position = 0;
        updateUI();
      }
    }

    function startAuto() { if (!interval) interval = setInterval(moveSlider, 16); }
    function stopAuto() { clearInterval(interval); interval = null; }

    startAuto();
    $(".review_silder").hover(stopAuto, startAuto);

    // 바 초기 transform값 읽기 (안전하게)
    function getBarTranslateX() {
      var tf = $bar.css("transform");
      if (!tf || tf === "none") return 0;
      var m = tf.match(/matrix\((.+)\)/);
      if (!m) return 0;
      var vals = m[1].split(',');
      return parseFloat(vals[4]) || 0;
    }

    $bar.on("mousedown", function (e) {
      dragging = true;
      stopAuto();
      startX = e.pageX;
      barX = getBarTranslateX();

      $(document).on("mousemove.drag", onDrag);
      $(document).on("mouseup.drag", onStop);
    });

    function onDrag(e) {
      let dx = e.pageX - startX;
      let newX = Math.min(Math.max(barX + dx, 0), barMax);
      $bar.css("transform", "translateX(" + newX + "px)");
      let progress = newX / (barMax || 1);
      position = -(progress * sliderWidth);
      $slider1.css("transform", "translateX(" + position + "px)");
      $slider2.css("transform", "translateX(" + (position + sliderWidth) + "px)");
    }

    function onStop() {
      dragging = false;
      startAuto();
      $(document).off("mousemove.drag mouseup.drag");
    }
  })();

  /* ---------------- 예매(달력) ---------------- */
  // selectedDate: 항상 YYYY-MM-DD 형태로 유지
  var selectedDate = $.datepicker.formatDate("yy-mm-dd", new Date());

  // #calendar 초기화 (jQuery UI datepicker 사용 가정)
  $("#calendar").datepicker({
    dateFormat: "yy-mm-dd",
    defaultDate: new Date(),
    onSelect: function (dateText) {
      selectedDate = dateText; // YYYY-MM-DD
      $(".date p").html(dateText + ' <i class="fa-solid fa-calendar"></i>');
      var parts = dateText.split("-");
      // .res-date는 화면용(월/일) - 숫자만으로 표시(9/30)
      $(".res-date").text(parseInt(parts[1], 10) + "/" + parseInt(parts[2], 10));
      $("#calendar").hide();
    }
  });

  // 초기 표시
  $(".date p").html(selectedDate + ' <i class="fa-solid fa-calendar"></i>');
  $("#calendar").datepicker("setDate", new Date());
  var tParts = selectedDate.split("-");
  $(".res-date").text(parseInt(tParts[1], 10) + "/" + parseInt(tParts[2], 10));
  $("#calendar").hide();

  // .date 클릭 토글
  $(".date").on("click", function (e) {
    e.stopPropagation();
    $("#calendar").toggle();
  });
  $("#calendar").on("click", function (e) { e.stopPropagation(); });
  $(document).on("click", function () { $("#calendar").hide(); });

  /* ---------------- 예매 팝업 ---------------- */
  $(".re-popUp1, .re-popUp2, .re-popUp-bg").hide();

  // 팝업 열기: 항상 selectedDate(YYYY-MM-DD)를 사용
  $(".res_btn_big, .res_btn").on("click", function () {
    $(".re-popUp-bg").show().addClass("active");
    $(".re-popUp1").show().addClass("active").removeClass("closing");

    // 팝업에 날짜: YYYY-MM-DD
    $(".re-popUp1 .re-date").text(selectedDate);

    // 팝업에 선택된 이름 반영
    var selectText = $("#select option:selected").text() || "";
    $(".re-popUp1 .name").text(selectText);
  });

  // 팝업1 닫기 (i 또는 2번째 버튼)
  $(document).on("click", ".re-popUp1 i, .re-popBtn span:eq(1)", function () {
    $(".re-popUp1").removeClass("active").addClass("closing");
    $(".re-popUp-bg").removeClass("active");
    setTimeout(function () {
      $(".re-popUp1, .re-popUp-bg").hide().removeClass("closing");
    }, 400);
  });

  // 팝업1 -> 팝업2 (즉시 전환)
  $(document).on("click", ".re-popBtn span:eq(0)", function () {
    $(".re-popUp1").hide().removeClass("active closing");
    $(".re-popUp2").show().addClass("active").removeClass("closing");
  });

  // 팝업2 닫기 (모두 닫기)
  $(document).on("click", ".re-popUp2 span", function () {
    $(".re-popUp1, .re-popUp2").removeClass("active").addClass("closing");
    $(".re-popUp-bg").removeClass("active");
    setTimeout(function () {
      $(".re-popUp1, .re-popUp2, .re-popUp-bg").hide().removeClass("closing");
    }, 400);
  });

  /* ---------------- 전시 탭 ---------------- */
  $(".list_title ul li").on("click", function () {
    var idx = $(this).index();
    $(".list_title ul li").removeClass("on").eq(idx).addClass("on");
    $(".exh_1 li").removeClass("on").eq(idx).addClass("on");
    $(".more .list_txt li").removeClass("on").eq(idx).addClass("on");

    var bgColor = "#fee440";
    if (idx === 1) bgColor = "#FF4C4C";
    else if (idx === 2) bgColor = "#1DDDFF";
    $(".more").css("background-color", bgColor);
  });


  // top 버튼 클릭 부드럽게 스크롤
  $("a[href='#top']").on("click", function (e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, 600);
  });

}); // end $(function)





































