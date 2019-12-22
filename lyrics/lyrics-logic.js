var context = {};

      /* the idea here will be that we pass a content type (song, results, whatever)
    and we take care of specific templates based on that. This will have a big effect on how
    and when we add listeners, but it should help to not crazy-up the dom with unused layers
    */

      function pushHandlebars(contentType, contentIndex, contentKey) {
        if (contentType === "results") {
          let source = document.querySelector("#lyrics-results-template").innerHTML;
          let template = Handlebars.compile(source);
          let html = template(context);

          document.querySelector("#lyrics-titles").innerHTML = html;
        } else if (contentType === "song") {
          console.log("pushing a song");
          let source = document.querySelector("#lyrics-content-template").innerHTML;
          let template = Handlebars.compile(source);
          let html = template(context.lyricsByFirstLetterOfTitle[contentKey][contentIndex]);

          document.querySelector("#lyrics-content").innerHTML = html;
        }
      }

      function filterSongs(searchString) {
        var numberOfSongs = lyrics.length;
        var matches = [];
        var titles = [];

        for (let i = 0; i < numberOfSongs; i++) {
          // some tidying up so case and apostophes won't cause problems.
          let titleForSearch = lyrics[i].title.replace(/['’]/g, "").toUpperCase();
          let lyricsForSearch = lyrics[i].body.replace(/['’]/g, "").toUpperCase();
          let modifiedSearchString = searchString.replace(/[’']/g, "").toUpperCase();

          //if we haven't already added this title to the list.
          if (titles.indexOf(lyrics[i].title) === -1) {
            if (
              titleForSearch.indexOf(modifiedSearchString) !== -1 ||
              lyricsForSearch.indexOf(modifiedSearchString) !== -1
            ) {
              matches.push(lyrics[i]);
              titles.push(lyrics[i].title);
            }
          }
        }

        // to get everything alphbetical might help users
        matches.sort(function(one, theOther) {
          let oneTitle = one.title.toUpperCase();
          let theOtherTitle = theOther.title.toUpperCase();

          if (oneTitle < theOtherTitle) {
            return -1;
          }
          if (oneTitle > theOtherTitle) {
            return 1;
          }
          return 0;
        });

        context.numberOfResults = matches.length;
        storeLyricsByLetter(matches);

        if (titles.length === 1) {
          context.plural = false;
        } else {
          context.plural = true;
        }

        context.searchString = searchString;
        pushHandlebars("results");
      }

      function storeLyricsByLetter(arrayOfLyricObjects) {
        let lyricsByFirstLetterOfTitle = {};

        arrayOfLyricObjects.forEach(function(lyric) {
          let letterKey = lyric.title.charAt(0);

          if (!lyricsByFirstLetterOfTitle[letterKey]) {
            lyricsByFirstLetterOfTitle[letterKey] = [];
          }

          lyricsByFirstLetterOfTitle[letterKey].push(lyric);
        });

        context.lyricsByFirstLetterOfTitle = lyricsByFirstLetterOfTitle;
      }

      function addMainEventListeners() {
        var searchBox = document.querySelector("input[name=search-box]");
        var spinnerOn = false;
        var pressedEnter = false;

        searchBox.addEventListener("keyup", function(event) {
          pressedEnter = event.keyCode == 13;

          if (searchBox.value.length > 1 || pressedEnter) {
            runSearch();
            showResults();
          } else if (searchBox.value.length >= 1) {
            if (document.querySelector(".results-found")) {
              document.querySelector(".results-found").classList.remove("show");
            }
          } else if (searchBox.value.length === 0) {
          }
        });

        document.querySelector("input[name=search-button]").addEventListener("click", function(event) {
          if (document.querySelector("input[name=search-box]").value) {
            runSearch();
          }
          showResults();
        });

        document.querySelector("input[name=show-all-button]").addEventListener("click", function(event) {
          filterSongs("");
          showResults();
        });
      }

      function showResults(delay) {
        let theDelay = delay || 700;
        document.querySelector(".results-found").classList.remove("show");
        setTimeout(function() {
          document.querySelector(".results-found").classList.add("show");
        }, theDelay);
      }

      function hideResults() {
        document.querySelector(".results-found").classList.remove("show");
      }

      function runSearch() {
        let searchString = document.querySelector("input[name=search-box]").value;
        filterSongs(searchString);
      }

      function addLyricEventListeners() {
        let closer = document.querySelector(".closer");

        closer.addEventListener("click", function(event) {
          hideSong();
        });
        console.log("added closer listener");

        let lyricModal = document.querySelector(".lyric-content");

        lyricModal.addEventListener("click", function(event) {
          event.stopPropagation();
        });

        // timeout because the browser seems to capture the event too early?
        setTimeout(function() {
          document.body.addEventListener("click", clickOutside);
        }, 200);
      }

      let clickOutside = function(event) {
        if (event.target.tagName !== "BUTTON") {
          hideSong();
        }
      };

      function hideSong() {
        let lastShownDiv = document.querySelector(".lyric-display");
        lastShownDiv.classList.remove("show");

        // we should clear this between songs so that body height returns to normal.
        document.querySelector("#lyrics-content").innerHTML = "";
        window.scrollTo(0, context.lastScrollPos);
        showResults(100);
        document.body.removeEventListener("click", clickOutside);
        document.querySelector(".bodyHide").style.display = "none";
      }

      function showSong(lyricsIndex, letterKey) {
        document.querySelector(".bodyHide").style.display = "block";
        hideResults();
        context.lastScrollPos = window.pageYOffset;
        pushHandlebars("song", lyricsIndex, letterKey);
        let songDiv = document.querySelector(".lyric-display");
        setTimeout(function() {
          songDiv.classList.add("show");
          window.scrollTo(0, 0);
        }, 100);
        addLyricEventListeners();
      }

      window.onload = addMainEventListeners;