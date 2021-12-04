import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'

import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

interface Props {
    editProfilePic: any;
    editUsername: string;
    setPage: (val: any) => void;
}

/*
FirstTimePopup is the popup that opens when the user saves his page for the first time, and thus claims his domain
*/
const FirstTimePopup: React.FC<Props> = ({
    editProfilePic,
    editUsername,
    setPage

}) => {
    const router = useRouter();
    const { user, Moralis } = useMoralis();

    const { showFirstTimePopup, setShowFirstTimePopup } = usePopup();
    
    const {        
    } = usePopup();


    return (
        <div
            id="showfirsttime"
            className={"popupbg" + (!showFirstTimePopup ? " hidden" : "")}
        >
            
            <Confetti
                width={window.innerWidth}
                height={300}
                tweenDuration={10000}
            />


            <div className="popup">

                <img
                    src={
                        editProfilePic?.image_preview_url ?? "/images/punk.png"
                    }
                    className="profilepicselect myprofilepic"
                   
                    alt="Profile Picture"
                />

                <br /><br />

                <div   className="gm"                                  
                >
                    <h2>
                        gm {editUsername}
                    </h2>
                </div>

                <br /><br />

                <div   className="smallfont"                                  
                >
                   Here is your new frens page:
                </div>
                
                <div   className="gm2"                                  
                >
                     { /* <Link href={window.location.pathname} className="greyfont smallfont"
                     >
                         {window.location.pathname}
                </Link> */}
                URL

                </div>

                <br />

                <div   className="gm3"                                  
                >
                     <a href="/" class="greyfont smallfont" data-show-count="false">
                    wallet: 
                    </a>
                </div>

                <br /><br />
                
                {/*Include a Twitter share button widget*/}
                <a href="/" class="sharebutton twitter-share-button" data-show-count="false">
                Tell your Twitter frens <FontAwesomeIcon icon={["fab", "twitter"]} />
                </a>
                <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

                

                <div
                    className="savebutton cansubmit" 
                    onClick={() => setShowFirstTimePopup(false)}
                >
                    See<FontAwesomeIcon icon="arrow-right" />
                </div>
            </div>
        </div>
    );
};
export default FirstTimePopup;
