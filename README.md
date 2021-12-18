# frens.page

gm fren, this repo is for your frens.

This project is based on Next.js using Moralis-API.



## Getting Started

```bash
npm install
npm run dev
```


## Packages
dependencies:
* react-moralis
  * https://www.npmjs.com/package/react-moralis#update-the-user-with-setuserdata
  * For simpler Moralis usage, with hooks
* Punify
  * https://github.com/mathiasbynens/punycode.js
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
	frenPopup, setFrenPopup                                 // FrenPopup-component
} = usePopup();
```
