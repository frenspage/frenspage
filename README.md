# frens.page

gm frens

We’re building the myspace and OnlyFans of Web3: call it OnlyFrens.

Or simply: your frens page.

Why:

Big Tech sucks: We’re missing a place for real frens.
Creators > Platforms, but online economies are broken rn.
All the new Web3 stuff is pretty cool.

This project is based on Next.js using the [Moralis.io API](https://moralis.io) and the [OpenSea API](https://opensea.io).

If you want to join the dev team and help us buidl, feel free to ask for a dev role in the [frens Discord](https://discord.gg/gARsV8SH).


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
* Punify
  * [https://github.com/mathiasbynens/punycode.js](https://github.com/mathiasbynens/punycode.js)
  * to punify incoming fren urls

    
stack:
* react 17
* next.js 12
* sass
* typescript
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
} = usePopup();
```
