$(document).ready(function() {

  //look for access token upon spotify auth and store in sessionStorage
  var tokenMatches = window.location.hash.match(/access_token=(.*)&token_type=*/);

  if (tokenMatches) {
    var accessToken = tokenMatches[1];

    window
      .sessionStorage
      .setItem("spotify_access_token", accessToken);
  }

  //create handlebars template
  var source = $("#song-template").html();
  var songTemplate = Handlebars.compile(source);

  $("#song-search-form").on("submit", function(event) {
    event.preventDefault();

    var songTitle =  $("#song-title").val();

    //return results and append to HTML if song list is returned
    $.ajax({
      type: "GET",
      url: "https://api.spotify.com/v1/search",
      data: {
        q: songTitle,
        type: "track"
      },
      success: function(results, textStatus, jqXHR) {
        // console.log(results);

        if (results.tracks.items.length > 0) {
          //cache selector
          var $songContainer = $("#song-container");

          //clear out contents of HTML should there be any
          $songContainer.html("");

          //Append compiled HTML back on top level container with handlebar macros populated
          results.tracks.items.forEach(function(item) {
            $songContainer.append(songTemplate(item));
          });
        } else {
          alert("Song not found.");
        }
      },
      error: function() {
        alert("Error retrieving song list.");
      }
    });
  });

  //save track when save button clicked
  $(document).on("click", "#save-track", function(event) {
    event.preventDefault();

    var trackId = $(this).attr("data-id");

    //save track to library
    $.ajax({
      type: "GET",
      url: "https://api.spotify.com/v1/me/tracks/contains",
      data: {
        ids: trackId
      },
      headers: {
        "Authorization": "Bearer " + window.sessionStorage.getItem("spotify_access_token")
      },
      success: function(results) {
        //check to see if track already saved, if not, add
        if (results[0]) {
          alert("Song already in your saved list.");
        } else {
          $.ajax({
            type: "PUT",
            url: "https://api.spotify.com/v1/me/tracks?ids=" + trackId,
            headers: {
              "Authorization": "Bearer " + window.sessionStorage.getItem("spotify_access_token"),
              "Content-Type": "application/json"
            },
            success: function() {
              alert("This track has been saved to your library.");
            },
            error: function() {
              alert("Problem saving song.");
            }
          });
        }
      },
      error: function() {
        alert("Something went wrong!");
      }
    });
  });
});
