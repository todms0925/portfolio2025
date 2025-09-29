$(document).ready(function () {

    // 💡 추가된 코드: 페이지 로드 시 home 섹션의 p 태그를 완전히 투명하게 설정
    $('section.home p').css('opacity', 0); // 애니메이션 시작 전까지 글자가 보이지 않도록 숨김

    // 로딩 페이지
    function initDiamondLoading() {
        const loadingOverlay = document.getElementById('diamondLoadingOverlay');
        const loadingContainer = document.getElementById('diamondLoadingContainer');
        const video = document.getElementById('myVideo'); // 동영상 요소 가져오기

        if (!loadingOverlay || !loadingContainer) return;

        // 자동으로 2.5초 후에 도형이 열리도록
        setTimeout(() => {
            loadingContainer.classList.add('diamond-loading-opened');
        }, 2500);

        // 3.8초 후에 로딩 오버레이 완전 제거
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            loadingOverlay.style.transition = 'opacity 0.5s ease-in-out';

            setTimeout(() => {
                loadingOverlay.style.display = 'none';

                // 🔥 오버레이가 완전히 사라진 후 영상 처음부터 재생
                if (video) {
                    video.currentTime = 0; // 처음으로 돌림
                    video.play().catch(err => {
                        console.log("자동재생이 막혔을 수 있어요:", err);
                    });
                }

                // 🔥 텍스트 애니메이션 시작 (로딩 완료 후 0.2초 대기)
                setTimeout(() => {
                    startTextAnimation();
                }, 200);

            }, 500);
        }, 3800);
    }

    // 🔥 텍스트 블러 페이드인 애니메이션 함수
    function startTextAnimation() {
        const $homeP = $('section.home p');
        
        if ($homeP.length === 0) return;

        // 💡 수정된 부분: 애니메이션 시작 시 p 태그를 보이게 함 (글자 공간 확보)
        $homeP.css('opacity', 1);

        // 각 p 태그의 HTML을 개별 span으로 감싸기 (br 태그 포함)
        $homeP.each(function() {
            const $p = $(this);
            const htmlContent = $p.html(); // text() 대신 html() 사용
            
            // <br> 태그를 특별한 마커로 임시 치환
            const contentWithMarkers = htmlContent.replace(/<br\s*\/?>/gi, '|||BR|||');
            
            // 마커가 포함된 텍스트를 분리
            const parts = contentWithMarkers.split('|||BR|||');
            
            // 빈 문자열로 초기화
            $p.empty();
            
            // 각 부분을 처리하고 br 태그 사이에 줄바꿈 추가
            parts.forEach((part, partIndex) => {
                // 각 부분의 글자들을 span으로 감싸기
                const chars = part.split('');
                
                chars.forEach((char, charIndex) => {
                    if (char === ' ') {
                        // 공백은 그대로 추가
                        $p.append(' ');
                    } else if (char.trim() !== '') {
                        // 빈 문자가 아닌 경우만 span 생성
                        const $span = $('<span></span>')
                            .text(char)
                            .css({
                                // opacity: 0과 blur: 10px는 이 스크립트에서 설정 (초기 상태)
                                'opacity': 0,
                                'filter': 'blur(10px)',
                                'display': 'inline-block',
                                'transition': 'opacity 1.2s ease-out, filter 1.2s ease-out' // 1.2s로 애니메이션 시간 조정
                            });
                        $p.append($span);
                    }
                });
                
                // 마지막 부분이 아니면 br 태그 추가
                if (partIndex < parts.length - 1) {
                    $p.append('<br>');
                }
            });
        });

        // 모든 span 요소들을 순차적으로 애니메이션
        const $allSpans = $('section.home p span');
        
        $allSpans.each(function(index) {
            const $span = $(this);
            
            // 각 글자마다 150ms 간격으로 딜레이를 주어 순차적으로 나타남
            setTimeout(() => {
                $span.css({
                    'opacity': 1,
                    'filter': 'blur(0px)'
                });
            }, index * 150); // 150ms 간격으로 순차 실행
        });
    }

    // 로딩 초기화
    initDiamondLoading();

    
    //스크롤 이벤트
    //브라우저 높이값
    let ht = $(window).height()
    $('section').height(ht)

    //화면 사이즈 변동 시 높이값 다시 적용
    $(window).resize(function () {
        ht = $(window).height()
        $('section').height(ht)
    })

    // 공통 함수 : 특정 index로 이동
    function moveToSection(i) {
        ht = $(window).height()
        $('html, body').stop().animate({ scrollTop: ht * i }, 800)
        $('nav ul li').removeClass('on').eq(i).addClass('on')
    }

    // 스크롤 시 nav li 활성화
    $(window).scroll(function () {
        let sc = $(window).scrollTop()
        ht = $(window).height()

        $('section').each(function (i) {
            if (sc >= ht * i && sc < ht * (i + 1)) {
                $('nav ul li').removeClass('on').eq(i).addClass('on')
            }
        })
    })

    // nav li 클릭 시
    $('nav ul li').click(function (e) {
        e.preventDefault()
        let i = $(this).index()
        moveToSection(i)
    })

    // 마우스 휠 이벤트
    let isScrolling = false; // 스크롤 중복 방지

    $('section').on('mousewheel DOMMouseScroll', function (e) {
        e.preventDefault();

        if (isScrolling) return; // 이미 스크롤 중이면 무시
        isScrolling = true;

        let delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
        let currentIndex = $('nav ul li.on').index();
        let targetIndex = currentIndex;

        if (delta < 0) {
            // 아래로 스크롤
            targetIndex = currentIndex + 1 < $('section').length ? currentIndex + 1 : currentIndex;
        } else {
            // 위로 스크롤
            targetIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : currentIndex;
        }

        moveToSection(targetIndex);

        setTimeout(function () {
            isScrolling = false; // 애니메이션 끝나면 다시 허용
        }, 900); // moveToSection 애니메이션 시간 + 100ms 여유
    });

    //재생바
    $(document).ready(function () {
        const $fill = $('.fill');
        const duration = 180000; // 3분 = 180,000ms
        let isPaused = false;

        // --- 재생바 함수 ---
        function startProgress() {
            $fill.css({
                transform: 'scaleX(0)',
                transition: 'none'
            });

            setTimeout(() => {
                $fill.css({
                    transform: 'scaleX(1)',
                    transition: `transform ${duration}ms linear`
                });
            }, 20);
        }

        $fill.on('transitionend', function () {
            if (!isPaused) startProgress();
        });

        function pauseProgress() {
            const computedStyle = window.getComputedStyle($fill[0]);
            const matrix = computedStyle.transform;
            let scaleX = 0;
            if (matrix !== 'none') {
                scaleX = parseFloat(matrix.split('(')[1].split(')')[0].split(',')[0]);
            }
            $fill.css({
                transform: `scaleX(${scaleX})`,
                transition: 'none'
            });
            isPaused = true;
        }

        function resumeProgress() {
            if (!isPaused) return;
            const computedStyle = window.getComputedStyle($fill[0]);
            const matrix = computedStyle.transform;
            let scaleX = 0;
            if (matrix !== 'none') {
                scaleX = parseFloat(matrix.split('(')[1].split(')')[0].split(',')[0]);
            }
            const remainingTime = duration * (1 - scaleX);
            $fill.css({
                transform: 'scaleX(1)',
                transition: `transform ${remainingTime}ms linear`
            });
            isPaused = false;
        }

        function resetProgress() {
            $fill.css({
                transform: 'scaleX(0)',
                transition: 'none'
            });
            isPaused = false;
        }

        // 초기 재생
        startProgress();

        // --- 리스트 클릭 ---
        $('.list ul li').click(function () {
            changeTrack($(this).index());
        });

        // --- 버튼 클릭 ---
        const $btns = $('.btn i'); // 4개 버튼
        const $listItems = $('.list ul li');

        // 2번째(재생)/3번째(일시정지) 토글
        $btns.eq(1).hide(); // 처음엔 재생 버튼 숨김

        $btns.eq(2).click(function () {
            // 일시정지 클릭
            pauseProgress();
            $(this).hide();
            $btns.eq(1).show();
        });

        $btns.eq(1).click(function () {
            // 재생 클릭
            resumeProgress();
            $(this).hide();
            $btns.eq(2).show();
        });

        // 1번째 이전 / 4번째 다음
        $btns.eq(0).click(function () {
            let index = $listItems.index($('.list ul li.on'));
            index = index > 0 ? index - 1 : $listItems.length - 1;
            changeTrack(index);
        });

        $btns.eq(3).click(function () {
            let index = $listItems.index($('.list ul li.on'));
            index = index < $listItems.length - 1 ? index + 1 : 0;
            changeTrack(index);
        });

        // --- 곡 변경 함수 ---
        function changeTrack(index) {
            const $target = $listItems.eq(index);

            // 텍스트/이미지 업데이트
            const pText = $target.find('p').text();
            const spanText = $target.find('span').text();
            const imgSrc = $target.attr('data-src');

            $('.play ul li').removeClass('on');
            setTimeout(() => {
                $('.play img').attr('src', imgSrc);
                $('.play .txt p').text(pText);
                $('.play .txt span').text(spanText);
                $('.play ul li').addClass('on');
            }, 500);

            // list li on 클래스
            $listItems.removeClass('on');
            $target.addClass('on');

            // 재생바 초기화
            resetProgress();
            startProgress();
        }
    });

    //멤버소개
    // 카드 클릭 시 프로와 팝업 활성화
    // 카드 클릭 시 카드 뽑아가는 애니메이션 + 팝업 등장
    $('.card-list li').click(function () {
        const index = $(this).index();
        const $card = $(this);

        // 카드 뽑기 애니메이션
        $card.css('transition', 'transform 0.4s ease, opacity 0.4s ease');
        $card.css({
            transform: 'translateY(-200px)',
            opacity: 0
        });

        // 팝업 활성화
        $('.pro').addClass('on');

        // 팝업 초기화 (항상 display: block)
        $('.pro-popUp li').removeClass('on').css({
            opacity: 0,
            transform: 'translate(-50%, -60%)',
            transition: 'transform 0.4s ease, opacity 0.4s ease',
            display: 'block'
        });

        const $targetLi = $('.pro-popUp li').eq(index);

        // 위에서 내려오는 애니메이션
        setTimeout(() => {
            $targetLi.addClass('on').css({
                opacity: 1,
                transform: 'translate(-50%, -50%)'
            });
        }, 20);
    });

    $('.pro .bg').click(function () {
        // 팝업 닫기 (위에서 사라지는 느낌)
        $('.pro-popUp li').removeClass('on').css({
            opacity: 0,
            transform: 'translate(-50%, -60%)',
            transition: 'transform 0.4s ease, opacity 0.4s ease'
        });

        $('.pro').removeClass('on');

        // 카드 원위치 복원
        $('.card-list li').each(function () {
            $(this).css({
                transform: '',
                opacity: '',
                transition: ''
            });
        });
    });

    //갤러리
    $(function () {
        const $container = $('.container');
        const container = $container.get(0);

        // --- 아이템 복제 (총 3세트 이상) ---
        const $originalItems = $container.find('.image-wrapper');
        for (let i = 0; i < 2; i++) {
            $container.append($originalItems.clone());
        }

        // 복제 후 모든 아이템 다시 선택
        const $items = $container.find('.image-wrapper');

        // 원본 한 세트의 너비
        const originalWidth = $originalItems.get(0).offsetWidth * $originalItems.length;

        // 초기 위치
        container.scrollLeft = 0;

        // --- 자동 스크롤 ---
        let scrollSpeed = 1.5;
        let isAuto = true;
        let rafId = null;
        let resumeTimer = null;

        function autoTick() {
            if (isAuto) {
                container.scrollLeft += scrollSpeed;

                // 너무 뒤로 가면 앞쪽으로 자연스럽게 이동
                if (container.scrollLeft >= originalWidth * 2) {
                    container.scrollLeft -= originalWidth;
                }
            }
            rafId = requestAnimationFrame(autoTick);
        }
        rafId = requestAnimationFrame(autoTick);

        // --- Wheel 이벤트 (수동 스크롤) ---
        function wheelHandler(e) {
            e.preventDefault();
            const delta = e.deltaY || e.deltaX || 0;
            const factor = 2.5;

            container.scrollLeft += delta * factor;

            // 자연 반복 처리 (뒤로 가거나 앞으로 가면 보정)
            if (container.scrollLeft >= originalWidth * 2) {
                container.scrollLeft -= originalWidth;
            } else if (container.scrollLeft <= 0) {
                container.scrollLeft += originalWidth;
            }

            // 자동 스크롤 일시 정지 후 재개
            isAuto = false;
            clearTimeout(resumeTimer);
            resumeTimer = setTimeout(() => { isAuto = true; }, 1200);
        }
        container.addEventListener('wheel', wheelHandler, { passive: false });

        // --- 중앙 이미지 활성화/비활성화 업데이트 ---
        function updateActiveImage() {
            const center = container.scrollLeft + container.clientWidth / 2;
            $items.each(function () {
                const $this = $(this);
                const itemCenter = this.offsetLeft + this.offsetWidth / 2;
                const dist = Math.abs(center - itemCenter);
                if (dist < this.offsetWidth / 2) {
                    $this.addClass('active').removeClass('inactive');
                } else {
                    $this.removeClass('active').addClass('inactive');
                }
            });
        }
        $container.on('scroll', updateActiveImage);
        updateActiveImage();

        // --- 마우스 오버 시 자동 멈춤 ---
        $container.on('mouseenter', () => { isAuto = false; });
        $container.on('mouseleave', () => { isAuto = true; });

        $(window).on('resize', updateActiveImage);
        $container.find('img').on('load', updateActiveImage);

        // --- 정리 ---
        $(window).on('beforeunload', function () {
            if (rafId) cancelAnimationFrame(rafId);
            clearTimeout(resumeTimer);
            container.removeEventListener('wheel', wheelHandler);
        });
    });

    // --- mouse1 / mouse2 제어 로직 ---
    // 1. 초기 상태: mouse2 숨기고 mouse1 보이기
    $('.mouse2').hide(); // 평소에는 mouse2 숨김

    // 2. 스크롤 이벤트 수정: mouse1/mouse2 토글 로직 추가
    $(window).scroll(function () {
        let sc = $(window).scrollTop()
        ht = $(window).height()

        $('section').each(function (i) {
            if (sc >= ht * i && sc < ht * (i + 1)) {
                // 네비게이션 활성화 로직
                $('nav ul li').removeClass('on').eq(i).addClass('on')

                // mouse1 / mouse2 토글 로직
                if ($(this).hasClass('gallery')) {
                    // 현재 섹션이 .gallery일 때
                    $('.mouse1').fadeOut(100); // mouse1 사라짐
                    $('.mouse2').fadeIn(1500);  // mouse2 나타남

                } else {
                    // .gallery가 아닐 때: mouse1 다시 나타나고 mouse2 숨김
                    $('.mouse1').fadeIn(500);
                    $('.mouse2').fadeOut(630);
                }
            }
        })
    })

    // 3. mouse2 클릭 이벤트: 맨 위로 스크롤 (index 0)
    $('.mouse2').click(function () {
        // moveToSection 함수를 사용하여 맨 위 섹션(인덱스 0)으로 이동
        moveToSection(0);
    });

})