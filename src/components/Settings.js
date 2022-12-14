import React from "react";

const Settings = () => {
    return (
        <div className="lly-modal hidden" id="lly-settings">
            <div className="lly-modal-content lly-options" style="padding-bottom: 0;">
                <div className="lly-modal-title">
                    LLY - Settings
                </div>
                <a href="javascript: document.querySelector('#lly-settings').classList.add('hidden');"
                   className="lly-close-modal lly-close-modal-btn"></a>
                <div className="lly-options-scroller">
                    <div className="lly-options-wrap">
                        <div className="lly-options-left">
                            <div className="lly-options-title">
                                <a className="catalogue lly-hide-on-nf lly-youtube" onClick="return false;"
                                   href="javascript:alert('Next Versions Functionality!');console.log('http://languagelearningwithnetflix.com/youtube_catalogue.html#language=English');">
                                    <span className="lly-capt">Youtube Catalogue</span>
                                    <span className="lly-info-btn" data-toggle="tooltip"
                                          title="Find movies and series suitable for use with LLN." tabIndex="0">
                                <span className="lly-svg-span lly-svg-info-tooltip"></span>
                                </span>
                                </a>

                                <a className="lly-hide-on-nf"
                                   href="javascript:alert('Next Versions Functionality!');console.log('https://docs.google.com/forms/d/e/1FAIpQLSeLSetAa9zr1wGvmi1dqVNFKvKnbOuhC6SreC4-j6qgxDLMMw/viewform?usp=sf_link');">
                                    <span className="lly-capt">Report bug</span>
                                    <span data-toggle="tooltip" className="lly-info-btn"
                                          title="Something wrong? Feature Request?" tabIndex="0">
                                    <span className="lly-svg-span lly-svg-info-tooltip"></span>
                                </span>
                                </a>

                                <a className="instructions lly-hide-on-nf"
                                   href="javascript:alert('Next Versions Functionality!');console.log('http://www.languagelearningwithnetflix.com/youtube_instructions.html');">
                                    <span className="lly-capt">Help</span>
                                    <span data-toggle="tooltip" className="lly-info-btn"
                                          title="Instructions for use, tips." tabIndex="0">
                                 <span className="lly-svg-span lly-svg-info-tooltip"></span>
                                </span>
                                </a>

                            </div>
                            <div style="text-align: left; padding: 10px 25px 10px 15px; opacity: .5">
                                <div style="margin-bottom: 15px; font-weight: bold;     text-align: right;"
                                     className="lly-options-subtitle">Keyboard shortcuts(demo):
                                </div>

                                <ul className="lly-keyboard-shortcuts-list">
                                    <li>
                                        <span className="lly-desc">Previous</span>
                                        <span className="lly-key">A</span>
                                        <span className="lly-if-override-arrow-keys">
                                    <span className="lly-key-or">or</span>
                                    <span className="lly-key">???</span>
                                </span>
                                    </li>
                                    <li>
                                        <span className="lly-desc">Repeat</span>
                                        <span className="lly-key">S</span>
                                        <span className="lly-if-override-arrow-keys">
                                    <span className="lly-key-or">or</span>
                                    <span className="lly-key">???</span>
                                </span>
                                    </li>
                                    <li>
                                        <span className="lly-desc">Next</span>
                                        <span className="lly-key">D</span>
                                        <span className="lly-if-override-arrow-keys">
                                    <span className="lly-key-or">or</span>
                                    <span className="lly-key">???</span>
                                </span>
                                    </li>
                                    <li>
                                        <span className="lly-desc">Play / Pause</span>
                                        <span className="lly-key">Space</span>
                                    </li>
                                    <li>
                                        <span className="lly-desc">Toggle auto-pause</span>
                                        <span className="lly-key">Q</span>
                                    </li>
                                    <li>
                                        <span className="lly-desc">Save current subtitle</span>
                                        <span className="lly-key">R</span>
                                    </li>
                                    <li className="lly-hide-on-yt">
                                        <span className="lly-desc">Slow down playback</span>
                                        <span className="lly-key">1</span>
                                    </li>
                                    <li className="lly-hide-on-yt">
                                        <span className="lly-desc">Speed up playback</span>
                                        <span className="lly-key">2</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="lly-options-right">
                            <div>
                                <label>
                                    <span className="lly-label-text">Subtitle language:</span>
                                    <label className="lly-primary-language" data-code="en">English</label>
                                </label>
                            </div>
                            <hr/>
                            <div>
                                <label>
                                    <span className="lly-label-text">Translation language:</span>
                                    <select id="dest-lang" name="destlang" style="width: 220px;">
                                        <option disabled>Translation Language</option>
                                        <option value="af">Afrikaans</option>
                                        <option value="ar" data-rtl="true">Arabic (??????????????)</option>
                                        <option value="bn">Bengali (???????????????)</option>
                                        <option value="bs">Bosnian (bosanski)</option>
                                        <option value="bg">Bulgarian (??????????????????)</option>
                                        <option value="ca">Catalan (catal??)</option>
                                        <option value="zh-CN">Chinese Simplified (????????????)</option>
                                        <option value="zh-TW">Chinese Traditional (????????????)</option>
                                        <option value="hr">Croatian (Hrvatski)</option>
                                        <option value="cs">Czech (??e??tina)</option>
                                        <option value="da">Danish (dansk)</option>
                                        <option value="nl">Dutch (Nederlands)</option>
                                        <option value="en">English</option>
                                        <option value="et">Estonian (eesti keel)</option>
                                        <option value="tl">Filipino</option>
                                        <option value="fi">Finnish (suomi)</option>
                                        <option value="fr">French (fran??ais)</option>
                                        <option value="de">German (Deutsch)</option>
                                        <option value="el">Greek (????????????????)</option>
                                        <option value="ht">Haitian Creole (Krey??l ayisyen)</option>
                                        <option value="iw" data-rtl="true">Hebrew (??????????)</option>
                                        <option value="hi">Hindi (??????????????????)</option>
                                        <option value="hmn">Hmong</option>
                                        <option value="hu">Hungarian (magyar)</option>
                                        <option value="is">Icelandic (??slenska)</option>
                                        <option value="id">Indonesian (Bahasa)</option>
                                        <option value="it">Italian (italiano)</option>
                                        <option value="ja">Japanese (?????????)</option>
                                        <option value="ko">Korean (?????????)</option>
                                        <option value="lv">Latvian (latvie??u valoda)</option>
                                        <option value="lt">Lithuanian (lietuvi?? kalba)</option>
                                        <option value="mg">Malagasy (Fiteny Malagasy)</option>
                                        <option value="ms">Malay (Bahasa melayu)</option>
                                        <option value="mt">Maltese (Malti)</option>
                                        <option value="no">Norwegian (Norsk)</option>
                                        <option value="fa" data-rtl="true">Persian (??????????)</option>
                                        <option value="pl">Polish (polski)</option>
                                        <option value="pt">Portuguese (portugu??s)</option>
                                        <option value="ro">Romanian (limba rom??n??)</option>
                                        <option value="ru">Russian (??????????????)</option>
                                        <option value="sr">Serbian (????????????)</option>
                                        <option value="sk">Slovak (sloven??ina)</option>
                                        <option value="sl">Slovenian (sloven????ina)</option>
                                        <option value="es">Spanish (espa??ol)</option>
                                        <option value="sw">Swahili (Kiswahili)</option>
                                        <option value="sv">Swedish (Svenska)</option>
                                        <option value="ta">Tamil (???????????????)</option>
                                        <option value="te">Telugu (??????????????????)</option>
                                        <option value="th">Thai (?????????????????????)</option>
                                        <option value="tr">Turkish (T??rk??e)</option>
                                        <option value="uk">Ukrainian (????????????????????)</option>
                                        <option value="ur" data-rtl="true">Urdu (????????)</option>
                                        <option value="vi">Vietnamese (ti???ng vi???t)</option>
                                        <option value="cy">Welsh (Cymraeg)</option>
                                    </select>
                                    <span data-toggle="tooltip" className="lly-info-btn"
                                          title="This is the language of the translation(s). Set this to your native language."
                                          tabIndex="0">
                                    <span className="lly-svg-span lly-svg-info-tooltip"> </span>
                                </span>

                                </label>
                            </div>

                            <hr/>

                            <div>
                                <label>
                                    <span className="lly-label-text">Pause on mouse hover(demo)</span>

                                    <input type="checkbox" id="pauseOnWordHover" className="lly-toggle"/>

                                    <span data-toggle="tooltip" className="lly-info-btn"
                                          title="Automatically pause when the mouse is over subtitles" tabIndex="0">
                                <span className="lly-svg-span lly-svg-info-tooltip"> </span>
                            </span>

                                </label>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="lly-modal-buttons clearfix"
                     style="padding: 7px 0; height: 52px; box-sizing: border-box;">
                    <a href="javascript: document.querySelector('#lly-settings').classList.add('hidden');"
                       className="lly-btn" id="lly-options-save-btn"
                       style="margin-right: 12px; padding: 0 26px; line-height: 36px;">
                        Close
                    </a>

                </div>
            </div>
        </div>
    )
}


export default Settings