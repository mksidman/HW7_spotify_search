$(document).ready(function() {

  //create handlebars template
  var source = $("#song-template").html();
  var songTemplate = Handlebars.compile(source);

  if (window.sessionStorage.getItem("spotify_access_token") === null) {
    alert("Please login to Spotify on previous page.");
  } else {
    $.ajax({
      type: "GET",
      url: "https://api.spotify.com/v1/me/tracks",
      data: {
        limit: "50"
      },
      headers: {
        "Authorization": "Bearer " + window.sessionStorage.getItem("spotify_access_token")
      },
      success: function(results) {
        // console.log(results);
        //cache selector
        var $songContainer = $("#song-container");

        //clear out contents of HTML should there be any
        $songContainer.html("");

        //Append compiled HTML back on top level container with handlebar macros populated
        results.items.forEach(function(item) {
          $songContainer.append(songTemplate(item));
        });
      },
      error: function() {
        alert("Something went wrong.");
      }
    });
  }

  $(document).on("click", "#remove-track", function(event) {
    event.preventDefault();

    var trackId = $(this).attr("data-id");

    // console.log(trackId);

    $.ajax({
      type: "DELETE",
      url: "https://api.spotify.com/v1/me/tracks?ids=" + trackId,
      headers: {
        "Authorization": "Bearer " + window.sessionStorage.getItem("spotify_access_token"),
        "Content-Type": "application/json"
      },
      success: function() {
        alert("This track has been removed from your library.");

        $.ajax({
          type: "GET",
          url: "https://api.spotify.com/v1/me/tracks",
          data: {
            limit: "50"
          },
          headers: {
            "Authorization": "Bearer " + window.sessionStorage.getItem("spotify_access_token")
          },
          success: function(results) {
            // console.log(results);
            //cache selector
            var $songContainer = $("#song-container");

            //clear out contents of HTML should there be any
            $songContainer.html("");

            //Append compiled HTML back on top level container with handlebar macros populated
            results.items.forEach(function(item) {
              $songContainer.append(songTemplate(item));
            });
          },
          error: function() {
            alert("Something went wrong.");
          }
        });
      },
      error: function() {
        alert("Problem removing song.");
      }
    });
  });
});
