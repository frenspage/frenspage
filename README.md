# frens.page

gm frens

We’re building the myspace and OnlyFans of Web3: call it OnlyFrens.

Or simply: your frens page.

Why:

Big Tech sucks: We’re missing a place for real frens. Creators > Platforms, but online economies are broken rn. All the
new Web3 stuff is pretty cool.

This project is based on Next.js using the [Moralis.io API](https://moralis.io) and
the [OpenSea API](https://opensea.io).

If you want to join the dev team and help us build, feel free to ask for a dev role in
the [frens Discord](https://discord.gg/gARsV8SH).

## Getting Started

```bash
npm install
npm run dev
```

## Packages

dependencies:

* react-moralis
    * [https://www.npmjs.com/package/react-moralis#update-the-user-with-setuserdata](https://www.npmjs.com/package/react-moralis#update-the-user-with-setuserdata)
    * For simpler Moralis usage, with hooks
* punycode
    * [https://github.com/mathiasbynens/punycode.js](https://github.com/mathiasbynens/punycode.js)
    * to punify incoming fren urls
* react-konva
    * [https://github.com/konvajs/react-konva](https://github.com/konvajs/react-konva)
    * react wrapper for canvas

stack:

* react 17
* next.js 12
* sass
* typescript 4.5
* prettier
* eslint

## ContextAPI

### Popup Context

Use the popup-context for popup-states/lifecycles

```js
const { 
  showEditProfilePopup, setShowEditProfilePopup,          // EditProfilePopup-component
  showEditENSPopup, setShowEditENSPopup,                  // EditENSPopup-component
  showEditProfilePicPopup, setShowEditProfilePicPopup,    // EditProfilePicPopup-component
  showFirstTimePopup, setShowFirstTimePopup,              // FirstTypePopup-component
  frenPopup, setFrenPopup,                                // FrenPopup-component
  transferPopup, setTransferPopup,                        // DonatePopup-component
  twitterAuthPopup, setTwitterAuthPopup,                  // TwitterAuthPopup-component
  editCardPopup, setEditCardPopup,                        // EditCardPopup-component
  frenCardPopup, setFrenCardPopup                         // FrenCardPopup-component
} = usePopup();
```

### User Context

The userContext holds every information&handler about the loggedin Moralis-User

```js
const {
  isAuthenticated, setIsAuthenticated,  // state to check is user is authenticated
  user, setUser,                        // state that holds all user information from Moralis
  username, setUsername,                // username state
  ensDomain, setEnsDomain,              // ensDomain / also known as username if ensDomain is set
  pfp, setPfp,                          // profile picture state
  page, setPage,                        // state that holds all page information from user from Moralis
  biography, setBiography,              // biography state
  twitter, setTwitter,                  // twittername state
  saveEnsDomain,                        // saves newly set ENS-Domain to Moralis & all states
  authenticate,                         // Moralis-authentification
  disconnect,                           // logout from Moralis and flush all user states
  hasClaimed,                           // checks if page has been claimed
  saveProfile,                          // saves all profile information (pfp, user, page) to Moralis
  deleteUser                            // deletes the user from Moralis DB
} = useUser();
```

### Page Content Context

The pageContentContext holds every information&handler about the page.

This is initialised after accessing a page (loggedin page or frens page).

```js
const {
  content,            // holds all content items and their information - fetched from Moralis
  addContent,         // add new item/card to content and save to Moralis
  deleteContent,      // deleted an item/card from Moralis
  modifyContentItem,  // modifies the content (image, caption, position, rotation, ...) of an item/card
  setFrenPage         // loads page into state
} = usePageContent();
```
