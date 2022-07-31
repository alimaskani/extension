import {config, extensionIsActive} from "../everywhere/functions";

const ctx = 'youtube';

function getUrl(filepath) {
    return chrome.extension.getURL(ctx + '/' + filepath);
}

export function injector(win) {
    return {
        deleteInjects: function () {
            [
                '#lly-injected',
                '.lly-settings-toggler',
                '.lly-sidebar',
                '#lly-primary-button',
                '#lly-video-hover'
            ].forEach(s => $(s).remove());
        },

        injectScripts: function () {
            win.ready('head', function (head) {
                head.appendChild((function () {
                    const s = win.document.createElement('script');
                    s.id = 'lly-injected';
                    s.src = getUrl("injected.js");
                    s.type = "text/javascript";
                    return s;
                })());
            });
        },

        injectSettings: function () {
            win.ready('body', function (e) {
                $('#lly-settings').remove();
                $.get(getUrl('lly-settings.html'), function (data) {
                    $(e).append($.parseHTML(data));
                    $('#lly-settings').click(function (e) {
                        if (e.target == this) $(this).addClass('hidden');
                    });
                    $('.lly-modal select, .lly-modal input').each(function () {
                        $(this).val(config($(this).attr('name'), ''));
                    });
                    $(document).on('change', '.lly-modal select, .lly-modal input', function () {
                        if (!this.hasAttribute('name'))
                            return;
                        let settings = {};
                        try {
                            settings = JSON.parse(win.localStorage.getItem('lly_settings') || '{}');
                        } catch (e) {
                            settings = {};
                        }
                        settings[$(this).attr('name')] = $(this).val();
                        win.localStorage.setItem('lly_settings', JSON.stringify(settings));
                    });
                });
            });
        },

        injectSidebar: function () {
            win.ready('#secondary', function (secondary) {
                $('.lly-sidebar').remove();
                $.get(getUrl('lly-sidebar.html'), function (data) {
                    $(secondary).prepend($.parseHTML(data));
                });
            });
        },

        injectPrimaryButton: function () {
            $('#lly-primary-button').remove();
            win.ready('.ytp-right-controls', function (rc) {
                $.get(getUrl('lly-primary-button.html'), function (data) {
                    $(rc).prepend($.parseHTML(data));
                    if (extensionIsActive())
                        $('#lly-toggle-on-off').attr('aria-pressed', true);
                });
                $('.lly-settings-toggler').remove();
                $.get(getUrl('lly-settings-toggler.html'), function (data) {
                    $(rc).prepend($.parseHTML(data));
                    $(document).on('click', '.lly-settings-toggler', function () {
                        $('#lly-settings').removeClass('hidden');
                    });
                });
            });
        },

        injectVideoHover: function () {
            win.ready('#movie_player', function (mvpl) {
                $('#lly-video-hover').remove();
                $.get(getUrl('lly-video-hover.html'), function (data) {
                    $(mvpl).append($.parseHTML(data));
                });
            });
        }
    }
}