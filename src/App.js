import React, {useEffect} from "react";
import Button from "./components/Button";




const App = () => {



    useEffect(() => {

    }, [window.location.href])


    return (
        <div className="App">
            <h1 id="appName">Language Learning with LLY</h1>

            <a id="addressBarCatLink" className="lln-youtube"
               href="#http://languagelearningwithnetflix.com/catalogue.html">
                Youtube <span id="cat-text">Catalogue</span>
            </a>

            <a id="helpLink" href="#http://www.languagelearningwithnetflix.com/youtube_instructions.html#lang=xx">
                Help
            </a>

            <a id="feedbackLink"
               href="#https://docs.google.com/forms/d/e/1FAIpQLSeLSetAa9zr1wGvmi1dqVNFKvKnbOuhC6SreC4-j6qgxDLMMw/viewform?usp=sf_link">
                Give Feedback
            </a>

            <a id="reportBugLink"
               href="#https://docs.google.com/forms/d/e/1FAIpQLSeLSetAa9zr1wGvmi1dqVNFKvKnbOuhC6SreC4-j6qgxDLMMw/viewform?usp=sf_link">
                Report bug
            </a>
        </div>
    );
}

export default App;