import { elementListener, doubleDigit, config, interceptXHR, waitFor, extensionIsActive } from "../everywhere/functions";
window.Popper = require('popper.js');
require('../../node_modules/bootstrap/dist/js/bootstrap.bundle.min');

(function () {
    const startPage = document.location.href;
    let urls = [];
    let html = '';
    let shouldUpdateSubtitleScroll = true;
    let primaryLanguageCode = 'en';
    let primarySubtitle = [];
    let secondarySubtitle = [];
    let settings = {};
    let secondary_subtitle_url = '';
    let scrollUpdates = 0;
    let player_response = {};

    // متد ready در فایل functions رو به window اضافه میکنه
    elementListener(window);

    // المنت پخش کننده ویدیو رو برمیگردونه
    function mainVideo() {
        return document.querySelector('video.html5-main-video');
    }

    // اسکرول ساید بار رو میبره روی ترجمه ای که در حال پخش هست.
    function updateSubtitleScroll(item) {
        if (scrollUpdates % 2 === 0) {
            const sidebarsubs = $('.lly-sidebar-subtitles');
            let scrollTop = sidebarsubs.scrollTop() + $(item).position().top - sidebarsubs.position().top - sidebarsubs.height() / 2 + $(item).height() / 2;
            sidebarsubs.animate({ scrollTop: Math.max(0, Math.floor(scrollTop)) }, 300);
        }
    }

    // ترجمه ای که فعال و در حال پخش هست رو در ساید بار مشخص میکنه
    function updateSidebarSubtitle(sec, forceScroll) {
        let activeItem = false;
        $('.lly-subtitle-item').each(function () {
            const start = $(this).data('start');
            const duration = $(this).data('duration');
            if (sec * 1000 >= start && sec * 1000 < start + duration) {
                activeItem = $(this);
                if (!activeItem.hasClass('playing')) {
                    activeItem.addClass('playing');
                    scrollUpdates++;
                }
            } else {
                if ($(this).hasClass('playing'))
                    $(this).removeClass('playing');
            }
        });
        if (activeItem && (shouldUpdateSubtitleScroll || forceScroll)) {
            updateSubtitleScroll(activeItem);
        }
    }

    // زیرنویس رو مقدار دهی میکنه
    function setSubtitleContent(selector, sub) {
        let segs = [];
        (sub.segs || []).forEach(seg => {
            segs.push(seg.utf8);
        });
        $(selector).html(segs.join(''));
    }

    // مقدار زیرنویس اصلی(بالایی) رو تغییر میده. کلمات رو از علایم و کلمات دیگه جدا میکنه و قابل هاور کردن میکنه و...
    function setPrimarySubtitleContent(sub) {
        let segs = [];
        (sub.segs || []).forEach(seg => {
            segs.push(seg.utf8);
        });
        let sentence = segs.join('');
        let sep = '|||||';
        let words = sentence.replace(/[.,،\/#!?؟$%\^&\*;:{}=\-_`~()]/g, " ").replace("\n", ' ').split(' ').filter(w => w.trim().length > 0).map(w => w.split("'").filter(ch => ch.length > 0).join("'")).sort(function (a, b) { return b.length - a.length });
        let counter = 0;
        words.forEach(w => {
            sentence = sentence.replace(w, sep + (counter++) + sep);
        });
        counter = 0;
        words.forEach(w => {
            sentence = sentence.replace(sep + (counter++) + sep, '<span class="lly-translatable-word">' + w + '</span>');
        });
        $('.lly-primary-subtitle').html(sentence);//'<span class="lly-translatable-word">' + segs.join('').split(' ').join('</span> <span class="lly-translatable-word">') + '</span>');
    }

    // مقدار زیرنویس دوم رو تغییر میده
    function setSecondarySubtitleContent(sub) {
        setSubtitleContent('.lly-secondary-subtitle', sub);
    }

    // چک میکنه ببینه در حال حاضر در حال پخش تبلیغات هست
    function showingAds() { return $('#movie_player.ad-showing').length; };
    // زیرنویس هارو مخفی میکنه
    function hideVideoSubtitles() { $('.lly-subtitles-container').hide(); }
    // زیرنویس هارو به نمایش در میاره
    function showVideoSubtitles() { $('.lly-subtitles-container').show(); }

    // زیرنویس فیلم رو بر حسب زمان فعلی آپدیت میکنه
    function updateVideoSubtitle(sec) {
        if (showingAds())
            return false;
        let found = false;
        primarySubtitle.forEach(sub => {
            if (sec * 1000 >= sub.tStartMs && sec * 1000 < sub.tStartMs + sub.dDurationMs) {
                setPrimarySubtitleContent(sub);
                found = true;
            }
        });
        if (!found)
            return hideVideoSubtitles();
        secondarySubtitle.forEach(sub => {
            if (sec * 1000 >= sub.tStartMs && sec * 1000 < sub.tStartMs + sub.dDurationMs) {
                setSecondarySubtitleContent(sub);
            }
        });
        showVideoSubtitles();
    }

    // وقتی زمان ویدیو تغییر میکنه این متد متدهای تغییر زیرنویس ساید بار و ویدیو رو اجرا میکنه تا آپدیت بشه
    function updateSubtitle(sec, forceScroll) {
        updateSidebarSubtitle(sec, forceScroll);
        updateVideoSubtitle(sec);
    }

    // وقتی اندازه پنجره کاربر کوچک یا بزرگ میشه بر حسب سایزی که داره فونت زیرنویس هم کوچک و بزرگ میشه
    function updateSubtitleFont(vid) {
        // اگه خواستید سایز فونت بزرگتر بشه میتونید مقدار تقسیم شده(در حال حاضر 35) رو کمتر کنید تا عدد بزرگتری بشه و در نتیجه فونت بزرگتر بشه
        $('#lly-video-hover').css({ fontSize: (($(vid).height() + 440) / 35) + 'px' });
    }

    // وقتی المنت ویدیو پلیر آماده بود این کد اجرا میشه
    ready('video.html5-main-video', function (vid) {
        vid.ontimeupdate = function (e) {
            updateSubtitle(this.currentTime);
        };
    });

    // زبان زیرنویس پیش فرض فیلم رو برمیگردونه
    function getDefaultLang() {
        if (!player_response.hasOwnProperty('captions') || !player_response.captions.hasOwnProperty('playerCaptionsTracklistRenderer'))
            return false;
        try {
            let tracklistRenderer = player_response.captions.playerCaptionsTracklistRenderer;
            let audioTracks = tracklistRenderer.audioTracks;
            let defaultAt = audioTracks[tracklistRenderer.defaultAudioTrackIndex];
            return tracklistRenderer.captionTracks[defaultAt.hasOwnProperty('defaultCaptionTrackIndex') ? defaultAt.defaultCaptionTrackIndex : defaultAt.captionTrackIndices[0]];
        } catch (e) {
            return false;
        }
    }

    // لینکی که میشه باهاش زیرنویس پیش فرض ویدیوی فعلی رو گرفت رو برمیگردونه
    function getDefaultLangUrl() {
        let defaultLang = getDefaultLang();
        return defaultLang ? defaultLang.baseUrl : false;
    }

    // وقتی نیاز به تغییر زبان زیرنویس اصلی فیلم بود این متد اجرا میشه
    function updatePrimaryLanguageDetails() {
        if (!player_response.hasOwnProperty('captions') || !player_response.captions.hasOwnProperty('playerCaptionsTracklistRenderer')) {
            $('#lly-settings .lly-primary-language').attr('data-code', 'auto').text('No Subtitle!');
            return false;
        }
        let lang = getDefaultLang();
        $('#lly-settings .lly-primary-language').attr('data-code', lang.languageCode).text(lang.name.simpleText);
    }

    // وقتی نیاز به تغییر زبان زیرنویس اصلی فیلم بود این متد اجرا میشه
    function fetchSubtitles() {
        try {
            if (!player_response || !player_response.hasOwnProperty('captions')) {
                return false;
            }
            // let captions = player_response.captions;
            // let baseUrl  = captions.playerCaptionsRenderer.baseUrl;
            let defBaseUrl = getDefaultLangUrl();
            if (!defBaseUrl)
                return false;
            $.get(defBaseUrl + '&fmt=json3');//baseUrl + '&fmt=json3&lang=' + videoLang); // response will automatically get caught and update subtitles
        } catch (e) {
            console.log('can`t load subtitles');
        }
    }

    ready('.ytp-subtitles-button', function (e) {
        // in case xhr intercept didn't catch the subtitle request
        if (extensionIsActive()) {
            $('.lly-toggle-button').attr('aria-pressed', "true");
            $('body').addClass('lly-on');
            setTimeout(fetchSubtitles, 100);
        }
    });

    // وقتی کد سایدبار نیاز به تغییر داشت اجرا میشه
    function sidebarHtmlUpdated() {
        if (html.trim().length) {
            $('body').addClass('lly-has-subtitles');
        } else {
            $('body').removeClass('lly-has-subtitles');
        }
        ready('.lly-sidebar-subtitles', function (sidebar) {
            $(sidebar).html(html);
        });
    }

    // مقادیر ساید بار رو بر حسب زیرنویس اصلی(بالایی) تغییر میده
    function setSidebarData() {
        html = '';
        primarySubtitle.forEach(ev => {
            let startMs = ev.tStartMs;
            let durationMs = ev.dDurationMs;
            let seconds = Math.floor(startMs / 1000);
            let sec = doubleDigit(seconds % 60);
            let minutes = Math.floor(seconds / 60);
            let min = doubleDigit(minutes % 60);
            let hours = Math.floor(minutes / 60);
            let hrs = doubleDigit(hours);
            let time = `${hrs}:${min}:${sec}`;
            let subtexts = '<span class="lly-subtitle-text">';
            ev.segs.forEach(seg => {
                subtexts += seg.utf8 || '';
            });
            subtexts += `</span>`;
            html += `<div class="lly-subtitle-item" data-start="${startMs}" data-duration="${durationMs}"><time>${time}</time>${subtexts}</div>`;
        });
        sidebarHtmlUpdated();
    }

    // دیتای زیرنویس دوم رو آپدیت میکنه
    function setSecondarySubtitle(data, isRTL = false) {
        secondarySubtitle = data.events || [];
        ready('body', function (body) {
            if (isRTL)
                $(body).addClass('secondary-subtitle-rtl');
            else
                $(body).removeClass('secondary-subtitle-rtl');
        });
        const vid = mainVideo();
        if (vid)
            updateVideoSubtitle(vid.currentTime);
    }

    // دیتای زیرنویس اول رو آپدیت میکنه
    function setPrimarySubtitle(data, isRTL = false) {
        primarySubtitle = data || [];
        setSidebarData();
        waitFor('body', function (body) {
            if (isRTL)
                $(body).addClass('primary-subtitle-rtl');
            else
                $(body).removeClass('primary-subtitle-rtl');
        });
        const vid = mainVideo();
        if (vid)
            updateVideoSubtitle(vid.currentTime);
        updateSubtitleFont(vid);
    }

    // چک میکنه ببینه یه زبان راست به چپ هست یا خیر
    function isRTL(code) {
        return $('select option[value=' + code + ']').data('rtl') || false;
    }

    // کد یه زبان رو با لینکی که بهش میدیم از توی پارامتر ها میگیره و برمیگردونه
    function getLangCodeFromUrl(url) {
        var params = {};
        var parser = document.createElement('a');
        parser.href = url;
        var query = parser.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        return params.hasOwnProperty('tlang') ? params.tlang : params.lang;
    }

    // متد کالبک که واسه گرفتن درخواست های ایجکس که مربوط به گرفتن زیرنویس هست
    function catchSubtitle(self) {
        let url = self.responseURL;
        if (url.indexOf('api/timedtext') > 0 && url.indexOf('nointercept') <= 0 && url.indexOf('fmt=json') > 0) {
            let result = self.response;
            if (url.indexOf('tlang') > 0) {
                url = url.replace('tlang=', '');
            }
            try {
                let result_array = JSON.parse(result);
                let events = result_array.events;
                if (url.indexOf('kind=asr') > 0) {  // &kind="asr" means subtitle is auto generated
                    events = events.filter(item => {
                        return item.hasOwnProperty('segs') && item.segs[0].utf8 !== "\n";
                    });
                    let changed_events = [];
                    for (let i = 0; i < events.length;) {
                        let couplevs = events[i++];
                        while (i < events.length && events[i].tStartMs < couplevs.tStartMs + couplevs.dDurationMs) {
                            couplevs.segs = [...couplevs.segs, { utf8: ' ' }, ...events[i++].segs];
                        }
                        changed_events.push(couplevs);
                    }
                    events = changed_events;
                }
                let plangcode = getLangCodeFromUrl(url);
                primaryLanguageCode = plangcode;
                $('#lly-settings .lly-primary-language').attr('data-current-code', plangcode);
                setPrimarySubtitle(events, isRTL(plangcode));
                let slangcode = config('destlang', 'de');
                secondary_subtitle_url = url + `&tlang=${slangcode}&nointercept=1`;
            } catch (e) {
                console.log(e);
                console.log(result);
            }
        }
    }

    // متد کالبک که واسه گرفتن درخواست های ایجکس که مربوط به تغییر ویدیوی در حال اجرا هست
    function catchVideoChange(self) {
        let url = self.responseURL;
        if (url.indexOf('watch?v=') > 0 && url.indexOf('nointercept') <= 0 && url.indexOf('&pbj=1') > 0) {
            let result = self.response;
            try {
                let result_array = JSON.parse(result);
                if (typeof result_array[3] !== "undefined" && result_array[3].hasOwnProperty('playerResponse')) {
                    html = '';
                    sidebarHtmlUpdated();
                    primarySubtitle = [];
                    secondarySubtitle = [];
                    player_response = result_array[3].playerResponse;
                    updatePrimaryLanguageDetails();
                    fetchSubtitles();
                }
            } catch (e) {
                console.log(e);
                console.log(result);
            }
        }
    }

    // جهت گرفتن نتایج ایجکس
    interceptXHR(XMLHttpRequest, function (self) {
        if (showingAds())
            return false;
        let url = self.responseURL;
        urls.push(url);
        catchSubtitle(self);
        catchVideoChange(self);
    });

    // ایونت ها اینجا قرار گرفتن
    (function bindEvents() {
        // وقتی DOM آماده بود این متد اجرا میشه
        $(document).ready(function () {
            try {
                player_response = JSON.parse(ytplayer.config.args.player_response);
                updatePrimaryLanguageDetails();
            } catch (e) {
                console.log('No Player Response Found!'); // probably there is no video player on the current page
            }

            // اگه اکستنشن فعال بود و به هر دلیلی زیرنویس اصلی گرفته نشده بود تلاش مجدد صورت میگیره
            if (extensionIsActive() && !primarySubtitle.length && getDefaultLangUrl() !== false) {
                fetchSubtitles();
            }
        });

        // وقتی صفحه کامل لود شد tooltip هارو آماده به کار میکنه
        window.onload = function () {
            // tooltips
            $(document).on('mouseenter', '[data-toggle="tooltip"]', function () {
                $(this).tooltip('show');
            });
        };

        // وقتی روی یک جای خالی از نگهدارنده زیرنویس هامون کلیک میشه، کلیک رو به لایه های زیرش انتقال میده تا ویدیو رو پخش یا متوقف کنه
        $('#lly-video-hover').click(function (e) {
            if ($(e.target).hasClass('lly-subtitles-container'))
                $('.html5-video-player').click();
        });

        // فعال یا غیرفعال کردن اکستنشن با کلیک بر روی دکمه آن
        $(document).on('click', '.lly-toggle-button', function () {
            if (extensionIsActive()) {
                localStorage.setItem('llyOn', "false");
                $('body').removeClass('lly-on');
                $(this).attr('aria-pressed', false);
            } else {
                localStorage.setItem('llyOn', "true");
                $('body').addClass('lly-on');
                $(this).attr('aria-pressed', true);
                fetchSubtitles();
            }
        });

        // وقتی ماوس روی ساید بار هست دیگه نیاز نیست اتوماتیک اسکرول بشه به موقعیت فعلی زیرنویس
        $(document).on('mouseenter', '.lly-sidebar', function () {
            shouldUpdateSubtitleScroll = false;
        });

        // وقتی ماوس از روی ساید بار میره کنار دوباره میخوایم که بصورت اتوماتیک اسکرول صورت بگیره
        $(document).on('mouseleave', '.lly-sidebar', function () {
            shouldUpdateSubtitleScroll = true;
        });

        // وقتی روی زیرنویس سایدبار کلیک میشه پخش ویدیو به اون زیرنویس میره
        $(document).on('click', '.lly-subtitle-item', function () {
            const vid = mainVideo();
            if (vid) {
                vid.currentTime = $(this).data('start') / 1000;
                scrollUpdates = 0;
                updateSubtitleScroll(this);
            }
        });

        // تغییر سایز زیرنویس با تغییر اندازه صفحه از اینجا فراخوانی میشه
        let tmout;
        $(window).resize(function () {
            const vid = mainVideo();
            if (!vid)
                return;
            if (tmout)
                clearTimeout(tmout);
            tmout = setTimeout(() => {
                updateSubtitleFont(vid);
                tmout = null;
            }, 500);
        });

        // تغییر زبان زیرنویس دوم که از تنظیمات صورت میگیره از اینجا داخل تنظیمات ذخیره میشه
        $(document).on('change', '#dest-lang', function () {
            if (!secondary_subtitle_url.length)
                return;
            secondary_subtitle_url = secondary_subtitle_url.split('&tlang=')[0] + `&tlang=${$(this).val()}&nointercept=1`;
            $('.lly-secondary-subtitle').html('Loading Translation... new');
        });
    })();

    // this code logs all the request urls sent to server every 5 seconds
    // window.onload = function(){
    //     setInterval(function(){
    //         if(urls.length)
    //             console.log(urls);
    //         urls = [];
    //     }, 5000);
    // };
})();