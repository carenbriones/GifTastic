$(document).ready(function () {

    // Create topics array
    var topics = ["happy", "sad", "sleepy", "hungry", "scared", "surprised", "disgusted", "confused", "bored"];

    // Offset value used when user adds more gifs to page
    var gifOffset = 0;

    var queryURL;

    // Array for favorite gifs
    var favoriteGifs = [];

    // Current topic of gifs on the page
    var currentTopic = "";

    function generateButtons() {
        // For loop iterating through array
        for (var i = 0; i < topics.length; i++) {
            // Create button for each topic
            var button = $("<button>").text(topics[i]);
            button.addClass("topic-button btn btn-primary");

            // Append button to div on page
            $("#buttons").append(button);
        }
    }

    generateButtons();

    // On click for topic buttons
    $("#buttons").on("click", ".topic-button", function () {

        var topic = $(this).text();
        currentTopic = topic;
        gifOffset = 0;

        $("#gif-section").empty();

        // Adds a border and background color to the gif section
        $("#gif-section").css("border", "1px solid black");
        $("#gif-section").css("background-color", "white");

        // Adds instructions to the page for user guidance
        var instructions = $("<p>").text("Click on a still to animate the gif, and click on it again to make it still!");
        instructions.addClass("instructions col-12");
        $("#gif-section").append(instructions);

        // Adds button that allows user to add more gifs
        var moreGifsDiv = $("<button>").addClass("btn btn-primary btn-sm add-gifs");
        moreGifsDiv.text("Add more gifs, please!");
        $("#gif-section").append(moreGifsDiv);

        // Creates div where gifs will be placed
        var gifsDiv = $("<div>").addClass("row");
        gifsDiv.attr("id", "all-gifs");
        $("#gif-section").append(gifsDiv);

        populateGifs(topic);

    })

    // Adds gifs to gif-section div
    function populateGifs(topic) {

        // creates url for query using topic variable
        queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            topic + "&api_key=ospFcerASWWtUhSsEHqEw0pDrhIYBujR&limit=10&offset=" + gifOffset;
        $.ajax({ // AJAX call that sends request to queryURL
            url: queryURL,
            method: "GET"
        })
            .then(function (response) { // Once response is obtained, run this
                var results = response.data; // Stores data obtained into results variable
                console.log(results[0]);

                // Iterates through all results
                for (var i = 0; i < results.length; i++) {
                    var gifDiv = $("<div>").addClass("gif-item");

                    var rating = results[i].rating;
                    var p = $("<p>").text("Rating: " + rating + "  ");
                    p.addClass("rating");

                    // New image element for gif; initially is still 
                    var topicGif = $("<img>");
                    topicGif.attr("src", results[i].images.downsized_still.url);
                    topicGif.attr("data-still", results[i].images.downsized_still.url)
                    topicGif.attr("data-animate", results[i].images.downsized.url);
                    topicGif.attr("data-state", "still");
                    topicGif.attr("alt", topic + " gif");
                    topicGif.addClass("gif");

                    // New button to add gif to favorites
                    var favoriteButton = $("<button>").addClass("btn btn-outline-primary favorite");
                    favoriteButton.html("<i class=\"fa fa-heart\" aria-hidden=\"true\"></i>");

                    // Adds gif and rating to gifDiv
                    gifDiv.append(topicGif);
                    gifDiv.append(p.append(favoriteButton));
                    // gifDiv.append(favoriteButton);

                    // Prepends so user can see when additional gifs are added
                    $("#all-gifs").prepend(gifDiv);
                }
            });
    }

    // On click for each gif
    $("#gif-section").on("click", ".gif", function () {
        var state = $(this).attr("data-state");
        console.log(state);
        changeGifState(state, $(this));
    })

    // On click for add new topic button
    $("#new-topic-button").on("click", function () {
        // Variable topic for value in text field
        var topic = $("#new-topic").val();

        // If topic isn't empty, then regenerate buttons
        if (topic !== "") {
            topics.push(topic);
            // Clear buttons div (so no duplicates)
            $("#buttons").empty();
            // Add topic to topics array
            generateButtons();
        }
        // Empties the text field
        $("#new-topic").val("")
    })

    // On click for button to add more gifs
    $("#gif-section").on("click", ".add-gifs", function () {
        gifOffset += 10;

        populateGifs(currentTopic);
    })

    // On click for favorite button
    $("#gif-section").on("click", ".favorite", function(){
        
        favoriteGifs.push($(this).parent().parent().children("img")[0]);
        $(this).parent().parent().empty();
        console.log(favoriteGifs);
        populateFavorites();
    })

    // Adds gifs to favorites section
    function populateFavorites(){
        $("#favorite-gifs").empty();

        for (var i = 0; i < favoriteGifs.length; i++){
            $("#favorite-gifs").append(favoriteGifs[i]);
        }
    }

    // On click for gifs in favorites section
    $("#favorites-section").on("click", "img", function(){
        var state = $(this).attr("data-state");
        console.log(state);
        changeGifState(state, $(this));
    })

    // Changes image's state to opposite of what it currently is
    function changeGifState(state, image){
        // If current state is still
        if (state === "still") {
            // Change still to an animated version of the gif, update state
            image.attr("src", image.attr("data-animate"));
            image.attr("data-state", "animate");
        } else { // Else, current state is animate
            // Change animated gif to the still version of it, update state
            image.attr("src", image.attr("data-still"));
            image.attr("data-state", "still");
        }
    }
})

// BONUS
// Add metadata for each gif (title, tags, etc)
// Integrate search using additional APIs (OMDB, Bands in Town)
// Allow users to add gifs to "favorites section"
    // Div for favorites; should persist even when a new topic is searched for