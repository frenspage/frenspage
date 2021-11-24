export const loadFrens = (Moralis) => {
    /* VARIABLES */

    /* INPUT THESE FROM SOMEWHERE ELSE */

    const appId = process.env.NEXT_PUBLIC_APPID;
    const serverUrl = process.env.NEXT_PUBLIC_SERVERURL;

    Moralis.start({ serverUrl, appId });

    /* EDIT THESE ALONG YOUR NEEDS */
    //Address of the smart contract you want to check for
    const secretNFTaddress = process.env.NEXT_PUBLIC_SECRETNFTADDRESS;

    const ENSCONTRACTADDRESS = process.env.NEXT_PUBLIC_ENSCONTRACTADDRESS;

    // Token Id you're looking for, can be array of multiple ID to be checked for
    // should be // if tokenID doesn't matter
    const secretTokenID = "";

    //The URL where users need to land once they've proven that they own the NFT
    const hookurl = "/secretHook.html";
    //If true, the eth address will be added as GET parameter to the URL
    //Attention: This is a custom addon, based on the content of secretHook.html and may not work everywhere
    const addethaddress = true;

    //define a default image for cases where the NFT preview image is broken or can't be read (happens quite often actually)
    const defaultimg =
        "https://neontools-prod-user-image.s3.eu-central-1.amazonaws.com/a1d2269dbe4b0473f8a3.jpg";

    //define if you want to display the wallet content or not
    const showcontent = true;
    const showwalletdata = true;

    /* -------------------------- */

    let user;
    let userAddress;
    let username;
    let userEthNFTs;
    let hassecret = false;
    let hooked = false;
    let ensusername;
    let options;
    let url;

    let firstlogin = true;

    /* BASIC LOGIN FUNCTIONS */

    //triggered when user clicks login button
    async function auth() {
        //user = initMoralis().then(processLogin,cancelLogin);

        clog("currentuser:");
        clog(user);

        if (!user) {
            try {
                user = await Moralis.authenticate({
                    signingMessage: "Hello World!",
                });
                console.log(user);
                console.log(user.get("ethAddress"));
                //setLocalStorage(user);
                processLogin();
            } catch (error) {
                cancelLogin();
            }
        }
    }

    async function initMoralis() {
        /*
        let user = Moralis.User.current();
        if (!user) {
            try {
                user = await Moralis.authenticate({ signingMessage: "gm fren." })
                setLocalStorage(user);
            return user;
          })
          .catch(function (error) {
            console(error);
            return null;
          });
       */
    }

    function cancelLogin() {
        //do nothing
    }

    function setLocalStorage(user) {
        clog("Setting localstore user:");
        clog(user);

        localStorage.setItem("user", JSON.stringify(user));
    }

    function endLoadingIn() {
        $("#loggedincontent").fadeIn(300);
    }

    function endLoadingOut() {
        $("#loading").fadeOut(300);
        $("#loggedoutcontent").fadeIn(300);
    }

    /*function getLocalStorage()
    {
        user = JSON.parse(localStorage.getItem('user'));
        clog("User:");
        clog(user);

        if(user != null)
        {
            userAddress = user.ethAddress;
            username = user.username;
        }


        return user;
    }*/

    //Trigger the login process once user signs login msg with his wallet
    async function processLogin() {
        //getLocalStorage();
        $("#loggedoutcontent").hide();

        $("#connectedwallet").html(user.get("ethAddress"));

        ensusername = user.get("ensusername");

        if (ensusername !== undefined) {
            $(".username").html(user.get("ensusername"));
        } else {
            $(".username").html(user.get("username"));
        }

        setFrontend();
        //showUserData();
        //setFrontend();
    }

    //Load all the NFTs from a wallet
    async function getNFTS() {
        options = { address: user.get("ethAddress") };
        userEthNFTs = await Moralis.Web3API.account.getNFTs(options);
    }

    //Triggered as fallback if somethings goes wrong during NFT loading
    function abortLoad() {
        console.log(
            "Error: Something went wrong while loading the NFTs. Logging out.",
        );
        //disconnect();
    }

    //In this frontend: Load the NFTS
    function setFrontend() {
        //userEthNFTs.result.forEach(loadNFT);
        loadPFP().then(showLoggedIn);

        /*
        if(!hassecret)
        {
            $("#loadingsecret").html("Sorry, but you're not eligible to continue...");
        }
        else{
            clog("Secret found! Congrats!");
        }*/
    }

    //Show the LoggedIn content
    function showLoggedIn() {
        //clog("HAS PFP?");
        //clog(hasPFP);

        if (firstlogin && !hasPFP && !hasENS) {
            //clog("Show first logged in ");
            showEditPopup();
        }

        $("#connectedwallet").html(userAddress);
        $("#walletinfo").show();
        $("#loading").fadeOut(300);

        endLoadingIn();
    }

    function showEditPopup() {
        $("#editprofile").show();
    }

    //Load a single NFT, check if it the secret and display it
    async function loadNFT(value, index, arr) {
        clog("Loading NFT");
        //checkSecretNFT(value.token_address,value.token_id);

        url = value.token_uri;

        //clog(url+":");
        //clog(value.metadata);

        $.getJSON(url, function (data) {
            var items = [];
            $.each(data, function (key, val) {
                items[key] = val;
            });

            items["token_address"] = value.token_address;
            items["token_id"] = value.token_id;
            items["amount"] = value.amount;
            items["metadata"] = value.metadata;

            //clog("ITEMS");
            //clog(items);

            showNFT(items);
        });
    }

    //Display individual NFT as images
    function showNFT(items) {
        if (showcontent) {
            var img = items["image"];
            var name = items["name"];
            var animation_url = items["animation_url"]; //not needed rn
            var token_address = items["token_address"];
            var token_id = items["token_id"];

            var token_metadata = items["token_metdata"];

            clog(token_address);

            if (token_address == ENSCONTRACTADDRESS) {
                clog("ENS FOUND;");
                clog(items);

                var d = "<div class='nftbox'>";

                d +=
                    "<div id='pfp_" +
                    token_address +
                    "_" +
                    token_id +
                    "' class='pfpselected'>V</div>";
                d +=
                    "<div class='ensbubble' id='ensbubble_" +
                    token_address +
                    "_" +
                    token_id +
                    "' onclick='selectPFP(&quot;pfp_" +
                    token_address +
                    "_" +
                    token_id +
                    "&quot;,&quot;" +
                    token_address +
                    "&quot;,&quot;" +
                    token_id +
                    "&quot;);' style='background-image:url(&quot;" +
                    img +
                    "&quot;);' >";
                d += "</div>";
                d += "<div class='nftname'>" + name + "</div>";

                d += "<a href='" + img + "'>";
                d += "<div class='nftaddress'>" + token_address + "</div>";
                d += "</a>";

                d += "</div>";

                $("#ensselect").append(d);
            } else {
                var d = "<div class='nftbox'>";

                d +=
                    "<div id='pfp_" +
                    token_address +
                    "_" +
                    token_id +
                    "' class='pfpselected'>V</div>";
                d +=
                    "<div class='nftbubble' id='nftbubble_" +
                    token_address +
                    "_" +
                    token_id +
                    "' onclick='selectPFP(&quot;pfp_" +
                    token_address +
                    "_" +
                    token_id +
                    "&quot;,&quot;" +
                    token_address +
                    "&quot;,&quot;" +
                    token_id +
                    "&quot;);' style='background-image:url(&quot;" +
                    img +
                    "&quot;);' >";
                d += "</div>";
                d += "<div class='nftname'>" + name + "</div>";

                d += "<a href='" + img + "'>";
                d += "<div class='nftaddress'>" + token_address + "</div>";
                d += "</a>";

                d += "</div>";

                $("#profilepicselect_nfts").append(d);
            }

            //$("#profilepicselect_nfts").append("<img class='nftimage' src='" + img + "' onerror='defaultImage(this)'} ><br>");
        }
    }

    let selectedPFP = [];
    let cansavepfp = false;

    function selectPFP(id, token_address, token_id) {
        if (id == selectedPFP["id"]) {
            selectedPFP = [];
            $("#" + id).removeClass("selected");
            $("#savepfp").removeClass("cansubmit");
            cansavepfp = false;
        } else {
            $("#" + selectedPFP["id"]).removeClass("selected");

            selectedPFP["id"] = id;
            selectedPFP["token_address"] = token_address;
            selectedPFP["token_id"] = token_id;

            clog(id);
            $("#" + id).addClass("selected");
            $("#savepfp").addClass("cansubmit");
            cansavepfp = true;
        }
    }

    function choosePFP() {
        cansavepfp = true;
        $(".profilepicselect").css(
            "background-image",
            $(
                "#nftbubble_" +
                    selectedPFP["token_address"] +
                    "_" +
                    selectedPFP["token_id"],
            ).css("background-image"),
        );
        closeProfilePicSelect();
    }

    async function savePFP() {
        if (cansavepfp) {
            let PFP = Moralis.Object.extend("ProfilePic");
            let pfp = new PFP();

            pfp.set("owner", user);
            pfp.set("token_address", selectedPFP["token_address"]);
            pfp.set("token_id", selectedPFP["token_id"]);

            pfp.save().then(
                (pfp) => {
                    image = $(
                        "#nftbubble_" +
                            selectedPFP["token_address"] +
                            "_" +
                            selectedPFP["token_id"],
                    ).css("background-image");
                    setPFPs(image);

                    closeProfilePicSelect();
                },
                (error) => {
                    // Execute any logic that should take place if the save fails.
                    // error is a Moralis.Error with an error code and message.
                    alert(
                        "Failed to create new object, with error code: " +
                            error.message,
                    );
                },
            );
        }
    }

    function setPFPs(image) {
        let myprofilepics = $(".myprofilepic");
        myprofilepics.each(function (i, e) {
            $(e).css("background-image", image);
        });
    }

    let hasPFP = false;

    //currently we're ignoring the case where the user can actually delete his pfp. TBD how we're gonna do it.
    async function loadPFP() {
        const PFP = Moralis.Object.extend("ProfilePic");
        const query = new Moralis.Query(PFP);
        query.equalTo("owner", user);
        query.descending("createdAt");
        const object = await query.first();

        if (object !== undefined && object.isDataAvailable()) {
            let ta = object.get("token_address");
            let ti = object.get("token_id");

            const options = { address: ta, token_id: ti };
            const metaData = await Moralis.Web3API.token.getTokenIdMetadata(
                options,
            );

            let jimage = JSON.parse(metaData.metadata);
            let image = jimage.image;
            setPFPs("url(" + image + ")");

            //clog(metaData);
            hasPFP = true;
        } else {
            clog("No PFP yet");
        }
    }

    let selectedENS = [];
    let cansaveens = false;

    function selectENS(id, token_address, token_id) {
        //Unselect
        if (id == selectedENS["id"]) {
            selectedENS = [];
            $("#" + id).removeClass("selected");
            $("#saveens").removeClass("cansubmit");
            cansaveens = false;
        } else {
            $("#" + selectedENS["id"]).removeClass("selected");

            selectedENS["id"] = id;
            selectedENS["token_address"] = token_address;
            selectedENS["token_id"] = token_id;

            clog(id);
            $("#" + id).addClass("selected");
            $("#saveens").addClass("cansubmit");
            cansaveens = true;
        }
    }

    let newusername;

    function chooseENS() {
        newusername = $(
            "#ensname_" +
                selectedENS["token_address"] +
                "_" +
                selectedENS["token_id"],
        ).html();
        cansaveens = true;
        $(".username").html(newusername);
        closeENSSelect();
    }

    function saveENS() {
        if (cansaveens) {
            user.set("ensusername", newusername);

            user.save().then(
                (ens) => {
                    // Execute any logic that should take place after the object is saved.
                    $(".username").html(newusername);
                    closeENSSelect();
                },
                (error) => {
                    // Execute any logic that should take place if the save fails.
                    // error is a Moralis.Error with an error code and message.
                    alert(
                        "Failed to create new object, with error code: " +
                            error.message,
                    );
                },
            );
        }
    }

    let hasENS = false;

    //currently we're ignoring the case where the user can actually delete his name. TBD how we're gonna do it.
    async function loadENS() {
        const PFP = Moralis.Object.extend("ENS");
        const query = new Moralis.Query(ENS);
        query.equalTo("owner", user);
        query.descending("createdAt");
        const object = await query.first();

        if (object.isDataAvailable()) {
            let ta = object.get("token_address");
            let ti = object.get("token_id");

            const options = { address: ta, token_id: ti };
            const metaData = await Moralis.Web3API.token.getTokenIdMetadata(
                options,
            );

            let myprofilepics = $(".myprofilepic");
            let jimage = JSON.parse(metaData.metadata);

            myprofilepics.each(function () {
                $(this).html("ENS");
            });

            //clog(metaData);
            hasENS = true;
        } else {
            clog("No ENS yet");
        }
    }

    //Check if the user actually owns the predefined NFT
    function checkSecretNFT(contractaddress, tokenid) {
        if (tokenid === "undefined" || tokenid === "") var tokenid = "";

        if (secretTokenID == "") {
            if (
                contractaddress.toLowerCase() == secretNFTaddress.toLowerCase()
            ) {
                hasSecret();
            }
        } else if (Array.isArray(secretTokenID)) {
            $.each(secretTokenID, function (index, val) {
                if (
                    contractaddress.toLowerCase() ==
                        secretNFTaddress.toLowerCase() &&
                    val == tokenid
                ) {
                    hasSecret();
                }
            });
        } else {
            if (
                contractaddress.toLowerCase() ==
                    secretNFTaddress.toLowerCase() &&
                tokenid == secretTokenID
            ) {
                hasSecret();
            }
        }
    }

    //Trigger if user has the secret
    function hasSecret() {
        hassecret = true;
        triggerSecretHook(hookurl);
    }

    //Fire this if the hook was found for bling bling
    function triggerSecretHook(hookurl) {
        if (!hooked) {
            $("#loadingsecret").hide();

            $.ajax({
                url: hookurl,
                cache: false,
            }).done(function (data) {
                $("#secret").html(data);

                //Attention: This is a custom addon, based on the content of secretHook.html and may not work everywhere
                if (addethaddress) {
                    let link = $("#nextbutton").attr("href");
                    $("#nextbutton").attr(
                        "href",
                        link + "?ethaddress=" + user.ethAddress,
                    );
                }

                $("#secret").fadeIn(1000);
            });

            hooked = true;
        }
    }

    function openProfilePicSelect() {
        $("#profilepicselect_nfts").html("");
        $("#profilepicselect_nfts_loading").show();
        $("#profilepicselect_popup").show();

        getNFTS().then(function () {
            userEthNFTs.result.forEach(loadNFT);
            $("#profilepicselect_nfts_loading").hide();
        });
    }

    function closeProfilePicSelect() {
        $("#profilepicselect_popup").hide();
    }

    function openENSSelect() {
        $("#ensselect_nfts_loading").show();
        $("#ensselect").html("");

        //getENS();
        //userEthNFTs.result.forEach(loadNFT);

        //BECAUSE OF BUG:

        token_address = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";
        token_id =
            "25222095590874728349755125166335892413298380980240991954037623438333759328804";
        ensname = "Mitchoz.eth";
        img =
            "https://lh3.googleusercontent.com/OsUWP7Pe9nzHknJfMbXSaTJiIZE7qMvJ1MwwJMZ_Qm26k9_hkk9FJ7YYvh6up0NXDoFiPvOIdUuo0qOHW95aUpnmSFxa1k70iQsJ=w600";

        var d = "<div class='nftbox'>";

        d +=
            "<div id='ens_" +
            token_address +
            "_" +
            token_id +
            "' class='ensselected'>V</div>";
        d +=
            "<div class='ensbubble' id='ensbubble_" +
            token_address +
            "_" +
            token_id +
            "' onclick='selectENS(&quot;ens_" +
            token_address +
            "_" +
            token_id +
            "&quot;,&quot;" +
            token_address +
            "&quot;,&quot;" +
            token_id +
            "&quot;);' style='background-image:url(&quot;" +
            img +
            "&quot;);' >";
        d += "</div>";
        d +=
            "<div class='ensname' id='ensname_" +
            token_address +
            "_" +
            token_id +
            "'>" +
            ensname +
            "</div>";

        d += "<a href='" + img + "'>";
        d += "<div class='ensaddress'>" + token_address + "</div>";
        d += "</a>";

        d += "</div>";

        $("#ensselect").html(d);

        $("#ensselect_popup").show();
        $("#ensselect_nfts_loading").hide();
    }

    function closeENSSelect() {
        $("#ensselect_popup").hide();
    }

    function saveProfile() {
        if (cansavepfp) savePFP();

        if (cansaveens) saveENS();

        cansavepfp = false;
        cansaveens = false;

        closeEditProfile();
    }

    function closeEditProfile() {
        $("#editprofile").hide();
    }

    //Disconnect the user's wallet and reset UI
    async function disconnect() {
        localStorage.clear();
        user = null;
        Moralis.User.logOut().then(function () {
            window.location.reload();
        });
    }

    //Set a defualt image for broken imgs
    function defaultImage(img) {
        img.onerror = "";
        img.src = defaultimg;
    }

    //Load this somewhere on frontend to trigger App start
    $(document).ready(function () {
        //is the user already logged in
        //user = getLocalStorage();

        user = Moralis.User.current();
        console.log(user);

        if (!user) {
            console.log("user is logged out");
            endLoadingOut();
        } else {
            console.log("user is logged in");
            processLogin();
        }

        $("#connectedwallet").on("mouseenter", function () {
            $("#connectedwallet").html("Disconnect");
        });

        $("#connectedwallet").on("mouseleave", function () {
            if (user != null) {
                $("#connectedwallet").html(user.get("ethAddress"));
            }
        });
    });

    //---------------------------------------
    // Helper Functions

    function clog(text) {
        console.log(text);
    }

    function jlog(text) {
        let output = "";
        for (let property in text) {
            output += property + ": " + text[property] + "; ";
        }

        clog(text);
    }
};
