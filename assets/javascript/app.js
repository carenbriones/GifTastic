$(document).ready(function () {

    // Create topics array
    var topics = ["happy", "sad", "sleepy", "hungry", "scared", "surprised", "disgusted", "confused", "bored"];

    // Offset value used when user adds more gifs to page
    var gifOffset = 0;

    var queryURL;

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

        // Adds a border to the gif section
        $("#gif-section").css("border", "1px solid black");

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

                var allGifsDiv = $("#all-gifs");
                console.log(allGifsDiv.text());

                // Iterates through all results
                for (var i = 0; i < results.length; i++) {
                    var gifDiv = $("<div>").addClass("gif-item");

                    var rating = results[i].rating;
                    var p = $("<p>").text("Rating: " + rating); // Creates new paragraph with rating inside, stores reference to it in p variable

                    // New image element for gif; initially is still 
                    var topicGif = $("<img>");
                    topicGif.attr("src", results[i].images.downsized_still.url);
                    topicGif.attr("data-still", results[i].images.downsized_still.url)
                    topicGif.attr("data-animate", results[i].images.downsized.url);
                    topicGif.attr("data-state", "still");
                    topicGif.addClass("gif");

                    // Adds gif and rating to gifDiv
                    gifDiv.append(topicGif);
                    gifDiv.append(p);

                    $("#all-gifs").append(gifDiv);
                }
                // $("#gif-section").append(gifsDiv);
            });
    }

    //On click for each gif
    $("#gif-section").on("click", ".gif", function () {
        var state = $(this).attr("data-state");
        console.log(state);
        // If current state is still
        if (state === "still") {
            // Change still to an animated version of the gif
            $(this).attr("src", $(this).attr("data-animate"));
            // Change state to animate
            $(this).attr("data-state", "animate");
        } else { // Else (current state is animate)
            // Change animated gif to the still version of it
            $(this).attr("src", $(this).attr("data-still"));
            // Change state to still
            $(this).attr("data-state", "still");
        }
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
})

// BONUS
// Add metadata for each gif (title, tags, etc)
// Integrate search using additional APIs (OMDB, Bands in Town)
// Allow users to add gifs to "favorites section"
    // Div for favorites; should persist even when a new topic is searched for