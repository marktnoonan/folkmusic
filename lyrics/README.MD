# Lyrics

This is a basic lyris search feature as seen on folkmusic.com. There are are various improvments that could be made as this was written before I knew some basics about accessibility. It works by using 2 Handlebars templates in index.html:

- `lyrics-results-template` to show the full list of results, and
- `lyrics-content-template` to show the lyrics for an individual song.

## TODOs

- [x] Song titles should not be links, they should be button elements. Currently the titles are not keyboard-focusable because they are links with no hrefs!
- [x] Song titles should have cursor: pointer even after switched to buttons.
- [x] The escape key should close a song if one is open.
- [ ] The close button should not be a span, it should be a button element.
- [ ] The close button should receive focus when the lyrics are being shown.

To get this running locally, you should be able to open index.html and everything will be there. The CSS file contains practically all the CSS for the whole site just so stuff looks the same on this isolated version.

`lyricsjson.js` sets up a global variable with an array of 200+ songs

`lyrics-logic.js` is where all the stuff happens that listens for user activity. It sorts through the array and gets items that match the search term then populates the results into the `lyrics-results-template` handlebars template in `index.html`. When a lyric title is clicked on, it looks that song up in the array and populates the `lyrics-content-template` with that song, and adds listeners to handle closing the modal etc.

This is not a very good modal system - the TODO items above will make it a better system without being a whole rewrite.
