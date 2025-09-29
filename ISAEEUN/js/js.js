$(document).ready(function () {

    // ---------------------
    // 1. 시간/날짜 갱신
    // ---------------------
    function updateKoreaTime() {
        const now = new Date();
        const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
        let hours = koreaTime.getUTCHours();
        let minutes = koreaTime.getUTCMinutes();
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        $('.time span').eq(0).text(hours);
        $('.time span').eq(1).text(minutes);

        const $topBarSpans = $('.top-bar2-1 span');
        $topBarSpans.eq(0).text(hours);
        $topBarSpans.eq(1).text(minutes);
    }
    setInterval(updateKoreaTime, 1000);
    updateKoreaTime();

    function updateKoreaDate() {
        const now = new Date();
        const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
        let month = koreaTime.getUTCMonth() + 1;
        let day = koreaTime.getUTCDate();
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        let weekday = weekdays[koreaTime.getUTCDay()];
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        $('.date span').eq(0).text(month);
        $('.date span').eq(1).text(day);
        $('.date span').eq(2).text(weekday);
    }
    setInterval(updateKoreaDate, 60000);
    updateKoreaDate();




    // ---------------------
    // 2. 잠금화면 해제
    // ---------------------
    let unlocked = false;

    $('.clock').on('click', function () {
        const $lock = $(this).find('.lock');
        $lock.find('.fa-lock').css('opacity', 0);
        $lock.find('.fa-unlock').css('opacity', 1);
        $lock.find('p:nth-of-type(1)').css('opacity', 0);
        $lock.find('p:nth-of-type(2)').css('opacity', 1);

        $(this).delay(400).fadeOut(600, function () {
            $('.main').fadeIn(600);

            if (!unlocked) {
                unlocked = true;
                animate(); // 재생바 시작
            }
        });
    });


    // ---------------------
    // 3. 재생바 + li 전환
    // ---------------------
    const track = document.querySelector('.track');
    const fill = document.querySelector('.fill');
    const thumb = document.querySelector('.thumb');
    const liItems = document.querySelectorAll('.top-bar2 ul li');
    const $mainTitItems = $('.main-tit ul li');
    const $mainImgItems = $('.main-img ul li');

    let value = 0;
    let speed = 0.06;
    let isDragging = false;
    let isPaused = false; // 재생/일시정지 상태 플래그

    function updateUI(val) {
        // 재생바 위치
        fill.style.width = val + '%';
        thumb.style.left = val + '%';

        // index 계산
        const index = Math.floor(val / (100 / liItems.length));

        // top-bar2 전환
        liItems.forEach((li, i) => li.classList.toggle('on', i === index));

        // main-tit 전환
        $mainTitItems.removeClass('on').eq(index).addClass('on');

        // main-img 전환 (슬라이드 애니메이션)
        $mainImgItems.each(function (i) {
            if (i === index) {
                $(this).removeClass('exit').addClass('on');
            } else if ($(this).hasClass('on')) {
                $(this).removeClass('on').addClass('exit');
                setTimeout(() => $(this).removeClass('exit'), 600);
            } else {
                $(this).removeClass('on exit');
            }
        });

        // ---------------------
        // main-list 전환
        // ---------------------
        $('.main-list ul li').removeClass('on').eq(index).addClass('on');
    }

    // ---------------------
    // main-list 클릭 시
    // ---------------------
    $('.main-list ul li').click(function () {
        const index = $(this).index();      // 클릭한 li의 순번
        const totalItems = $('.main-list ul li').length;

        value = (index / totalItems) * 100; // 재생바 value 계산
        updateUI(value);                     // UI 업데이트
    });


    function getValueFromEvent(e) {
        const rect = track.getBoundingClientRect();
        let x = e.clientX ?? e.touches[0].clientX;
        return Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
    }

    // 드래그
    thumb.addEventListener('mousedown', () => { isDragging = true; });
    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('mousemove', e => {
        if (isDragging) {
            value = getValueFromEvent(e);
            updateUI(value);
        }
    });

    // 터치
    thumb.addEventListener('touchstart', () => { isDragging = true; });
    document.addEventListener('touchend', () => { isDragging = false; });
    document.addEventListener('touchmove', e => {
        if (isDragging) {
            value = getValueFromEvent(e);
            updateUI(value);
        }
    });

    // 자동 애니메이션
    function animate() {
        if (!isDragging && !isPaused) {
            value += speed;
            if (value > 100) value = 0;
            updateUI(value);
        }
        requestAnimationFrame(animate);
    }


    // ---------------------
    // 4. 재생/일시정지 버튼
    // ---------------------
    const playBtn = document.querySelector('.utli .play');
    const playIcon = playBtn.querySelector('.fa-play');
    const pauseIcon = playBtn.querySelector('.fa-pause');

    playIcon.style.display = 'none';        // 초기: 재생 중 → pause 보임
    pauseIcon.style.display = 'inline-block';

    playBtn.addEventListener('click', () => {
        isPaused = !isPaused;

        if (isPaused) {
            playIcon.style.display = 'inline-block'; // 멈춤 → play 보임
            pauseIcon.style.display = 'none';
        } else {
            playIcon.style.display = 'none';         // 재생 중 → pause 보임
            pauseIcon.style.display = 'inline-block';
        }
    });

    // ---------------------
    // 5. 이전/다음 버튼
    // ---------------------
    const prevBtn = document.querySelector('.utli .fa-backward-step');
    const nextBtn = document.querySelector('.utli .fa-forward-step');
    const totalItems = liItems.length;

    prevBtn.addEventListener('click', () => {
        value -= 100 / totalItems;
        if (value < 0) value = 0;
        updateUI(value);
    });

    nextBtn.addEventListener('click', () => {
        value += 100 / totalItems;
        if (value > 100) value = 100;
        updateUI(value);
    });

    // ---------------------
    // 6. 하트 클릭
    // ---------------------
    $('.utli .hert').click(function () {
        const $regular = $(this).find('.fa-regular');
        const $solid = $(this).find('.fa-solid');

        if ($regular.css('opacity') == 1) {
            $regular.css({ opacity: 0, pointerEvents: 'none' });
            $solid.css({ opacity: 1, pointerEvents: 'auto' }).addClass('heart-animate');
            setTimeout(() => $solid.removeClass('heart-animate'), 500);
        } else {
            $solid.css({ opacity: 0, pointerEvents: 'none' });
            $regular.css({ opacity: 1, pointerEvents: 'auto' }).addClass('heart-animate');
            setTimeout(() => $regular.removeClass('heart-animate'), 500);
        }
    });

    // ---------------------
    // 7. 북마크 클릭
    // ---------------------
    $('.utli .book').click(function () {
        const $regular = $(this).find('.fa-regular');
        const $solid = $(this).find('.fa-solid');

        if ($regular.css('opacity') == 1) {
            $regular.css({ opacity: 0, pointerEvents: 'none' });
            $solid.css({ opacity: 1, pointerEvents: 'auto' }).addClass('bookmark-animate');
            setTimeout(() => $solid.removeClass('bookmark-animate'), 500);
        } else {
            $solid.css({ opacity: 0, pointerEvents: 'none' });
            $regular.css({ opacity: 1, pointerEvents: 'auto' }).addClass('bookmark-animate');
            setTimeout(() => $regular.removeClass('bookmark-animate'), 500);
        }
    });

    // ---------------------
    // 8. 메뉴 설정
    // ---------------------
    const menuBtn = document.querySelector('.menu-btn');
    const menuList = document.querySelector('.manu-list');
    let menuOpen = false;

    menuBtn.addEventListener('click', () => {
        menuOpen = !menuOpen;
        menuBtn.classList.toggle('on', menuOpen);
        menuList.classList.toggle('on', menuOpen);
    });



    //서브페이지
    // 메인리스트
    // main-list view-btn 클릭 시 main-sub 나타내기
    $('.main-list ul li .view-btn, .me-btn').on('click', function (e) {
        e.preventDefault();

        $('.main-sub').addClass('on');
        $('.main-sub ul li').removeClass('on');

        if ($(this).hasClass('me-btn')) {
            // me-btn 클릭 시 → 첫 번째 li 활성화
            $('.main-sub ul li').eq(0).addClass('on');
        } else {
            // view-btn 클릭 시 → 해당 li 순번 활성화
            const liIndex = $(this).closest('li').index();
            if (liIndex >= 0) {
                $('.main-sub ul li').eq(liIndex).addClass('on');
            }
        }
    });


    //메뉴에서 서브 열기
    $('.manu-list li').on('click', function (e) {
        e.preventDefault();

        $('.main-sub').addClass('on');
        $('.main-sub ul li').removeClass('on');

        if ($(this).hasClass('me-btn')) {
            // me-btn 클릭 시 → 첫 번째 li 활성화
            $('.main-sub ul li').eq(0).addClass('on');
        } else {
            // view-btn 클릭 시 → 해당 li 순번 활성화
            const liIndex = $(this).closest('li').index();
            if (liIndex >= 0) {
                $('.main-sub ul li').eq(liIndex).addClass('on');
            }
        }

        //메뉴에서 서브 열면 메뉴 닫히기

    });


    //돋보기 효과

    $(document).ready(function () {

        // 각 .view-img 마다 돋보기 적용
        $('.view-img').each(function () {
            const $view = $(this);
            const $img = $view.find('.page');
            const $glass = $view.find('.magnifier-glass');
            const zoom = 2; // 확대 배율
            let active = false; // 돋보기 켜짐 여부

            // 클릭 토글
            $img.on('click', function () {
                active = !active;
                if (active) {
                    $glass.css({
                        display: 'block',
                        backgroundImage: `url('${$img.attr('src')}')`
                    });
                    $img.css('cursor', 'zoom-out');
                } else {
                    $glass.css('display', 'none');
                    $img.css('cursor', 'zoom-in');
                }
            });

            // 마우스/터치 이동 시 돋보기 위치 계산
            $img.add($glass).on('mousemove touchmove', function (e) {
                if (!active) return;

                e.preventDefault();
                const offset = $img.offset();
                let pageX, pageY;

                if (e.type.startsWith('touch')) {
                    pageX = e.originalEvent.touches[0].pageX;
                    pageY = e.originalEvent.touches[0].pageY;
                } else {
                    pageX = e.pageX;
                    pageY = e.pageY;
                }

                let x = pageX - offset.left;
                let y = pageY - offset.top;

                const glassW = $glass.width() / 2;
                const glassH = $glass.height() / 2;

                // 이미지 영역 밖으로 나가지 않게 제한
                x = Math.max(glassW / zoom, Math.min(x, $img.width() - glassW / zoom));
                y = Math.max(glassH / zoom, Math.min(y, $img.height() - glassH / zoom));

                $glass.css({
                    left: (x - glassW) + 'px',
                    top: (y - glassH) + 'px',
                    backgroundSize: ($img.width() * zoom) + 'px auto',
                    backgroundPosition: `-${x * zoom - glassW}px -${y * zoom - glassH}px`
                });
            });
        });

    });




    //서브페이지 닫기
    $('.top-bar3 i').on('click', function () {
        $('.main-sub').removeClass('on');

        // li 초기화는 transition 후에
        setTimeout(function () {
            $('.main-sub ul li').removeClass('on');
        }, 600);
    });








});
