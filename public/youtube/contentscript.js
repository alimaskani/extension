import { injector } from "./element_injects";
import { config, elementListener, checkDomReady, extensionIsActive, setSetting } from "../everywhere/functions";


(
    function () {
    if (window.location.href.indexOf('youtube.com') === -1) return false;
    if (window.location.href.indexOf('/developer/') > -1) return false;

    // یک متد به اسم ready به window اضافه میکنه که باهاش میشه فهمید یه المنت کامل لود شده یا نه
    elementListener(window);

    // کدهای html رو به DOM تزریق میکنه. مثل تنظیمات و دکمه و...
    (
        function injectAll() {
        let inject = injector(window);
        inject.injectScripts();
        inject.injectSettings();
        inject.injectPrimaryButton();
        inject.injectSidebar();
        inject.injectVideoHover();

        ready('body', function (body) {
            if (extensionIsActive())
                $(body).addClass('lly-on');
        });
    })();

    // زبان فعلی زیرنویس رو که در حال نمایش هست(زیرنویس بالایی) رو برمیگردونه
    function getPrimaryLanguageCode() {
        return $('#lly-settings .lly-primary-language').attr('data-current-code');
    }



    function getWordTranslation(word, then) {
        let delay = Math.random() * 3000
        console.log("delay", delay)
        setTimeout(() => {
            let trans = ["Translation-1", word, "Translation-3"]
            then(trans)
        }, delay)
    }
    // بررسی میکند که آیا ویدیو در حال پخش است یا خیر
    function isVideoPlaying() {
        return $('.html5-video-player.playing-mode').length;
    }

    // ویدیو را متوقف می کند
    function pauseVideo() {
        const video = $('video.html5-main-video').get(0);
        if (video)
            video.pause();
    }

    // ویدیو را اجرا می کند
    function playVideo() {
        const video = $('video.html5-main-video').get(0);
        if (video)
            video.play();
    }

    // ایونت ها رو اینجا گذاشتم که همگی باهم فراخوانی بشن
    function bindEvents() {
        let was_playing;
        // وقتی ماوس روی کلمات رفت و تنظیم شده بود که ویدیو متوقف بشه ویدیو رو متوقف میکنه
        $(document).on('mouseenter', '.lly-primary-subtitle', function () {
            if (config('stoponhover', false)) {
                was_playing = isVideoPlaying() || was_playing;
                pauseVideo();
            }
        });

        // وقتی ماوس از روی کلمات به کنار رفت و بخاطر تنظیمات پخش ویدیو متوقف شده بود، مجددا ویدیو رو پلی میکنه
        $(document).on('mouseleave', '.lly-primary-subtitle', function () {
            console.log('mouseleave');
            if (config('stoponhover', false) && was_playing) {
                playVideo();
            }
            was_playing = false;
        });


        /**
         * Displaying a list of word translations on mouse hover
         * @memberof youtube_content_script.bindEvents
         * @listens mouseenter
         * @method mouseenterForTranslation
         */
        // وقتی ماوس روی کلمه ای رفت ترجمه کلمه رو میگیره و داخل یک المنت نمایش میده
        $(document).on('mouseenter', '.lly-translatable-word', function () {
            console.log("mouseenter")
            const self = $(this);
            let srcLang = getPrimaryLanguageCode().split('-')[0];
            let dstLang = config('word-dest-lang', 'ko').split('-')[0];
            let oldRgba = config("subtitlebackgroundcolor", "rgba(0, 0, 0, 1)")
            let rgba = oldRgba.slice(4).split(',');
            var newRgba = 'rgba' + rgba[0] + ',' + parseInt(rgba[1]) + ',' + parseInt(rgba[2]) + ',' + 1 + ')';
            if (!self.find('.tt').length) {
                let word = self.text().trim().toLowerCase();
                self.append($(`<span class='tt-other'></span><span class="tt" style='color:${$("#primary-subtitle-color").val()};background-color: ${newRgba}'>Loading...</span>`));
                if (srcLang !== dstLang) {
                    getWordTranslation(word, function (translations) {
                        let labels = ['primary', 'secondary', 'third'];
                        let c = 0;
                        let counttranslations = 0
                        let random = 0
                        let llyUserPackage = config("lly-user-package", false);
                        let trList = translations.map((t) => {
                            let wordState = false;
                            let stateText = "+"
                            if (wordState)
                                stateText = "-"
                            let button = `<button class="saveWord" data-state="${wordState}" data-src="${word}" data-dst="${t}" style="display:inline-block;">${stateText}</button>`;
                            counttranslations += 1
                            random = Math.random();
                            if (counttranslations <= 1 || llyUserPackage == "gold" || llyUserPackage == "silver" || random > 0.5) {
                                return `<li class="lly-translation-item lly-${labels[c++] || 'nth'}-translation">${t}${button}</li>`
                            }
                            else {
                                return `<li class="lly-translation-item-blur lly-${labels[c++] || 'nth'}-translation">free trial  for more</li>`
                            }
                        });
                        self.find('.tt').html('<ol>' + trList.join('') + '</ol>')
                        var fontSize = $('#dest-hovered-translation').find(":selected").val()
                        $(".lly-translation-item").css({ 'cssText': `font-size:${fontSize}px !important` });
                        $(".lly-translation-item-blur").css({ 'cssText': `font-size:${fontSize}px !important;background-color: #e25e30;font-size: 25px !important;border-radius: 7px;margin-bottom: 2px;` });
                    });
                } else {
                    self.find('.tt').html("<span style='font-size: 12px;'>target language and word translation language are the same</span>");
                }

            }
        });


        /**
         * Remove translations when mouse leave word element
         * @memberof youtube_content_script.bindEvents
         * @listens mouseout
         * @method mouseoutRemoveTranslation
         */
        // وقتی ماوس از روی کلمه برداشته شد ترجمه ای که اضافه شده بود رو حذف میکنه
        $(document).on('mouseleave', '.lly-translatable-word', function (e) {
            const self = $(this);
            let word = self.text().trim().toLowerCase();
            let in_loading = word.indexOf("loading...");
            if (self.hasClass("word-clicked"))
                return
            if (in_loading >= 0) {
                self.find('.lly-translation-item').remove();
                self.find('.tt').remove();
                self.find('.tt-other').remove();
            }
            if (e.offsetY - $(window).scrollTop() < 0) {
                return;
            }
            self.find('.lly-translation-item').remove(); // این خط کد اضافه بشه
            self.find('.tt').remove();
            self.find('.tt-other').remove();
        });

        // وقتی در پنل تنظیمات وضعیت نگهداری پخش با هاور کردن تغییر پیدا میکند این کد اجرا شده و تنظیمات را ثبت میکند
        $(document).on('change', '#pauseOnWordHover', function () {
            setSetting('stoponhover', $(this).is(':checked'));
        });
    }

    // وقتی DOM آماده شد این متد اجرا میشه
    function domReady() {
        bindEvents();
    }

    checkDomReady(document, domReady);

}
)();
