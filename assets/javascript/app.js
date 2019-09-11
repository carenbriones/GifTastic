$(document).ready(function () {

    // Create topics array
    var topics = ["happy", "sad", "sleepy", "hungry", "scared", "surprised", "disgusted", "confused", "bored"];


    function generateButtons() {
        // For loop iterating through array
        for (var i = 0; i < topics.length; i++) {
            // Create button for each topic
            var button = $("<button>").text(topics[i]);
            button.addClass("topic-button");

            // Append button to div on page
            $("#buttons").append(button);
        }
    }

    generateButtons();

    // On click for topic buttons
    $("#buttons").on("click", ".topic-button", function () {

        var topic = $(this).text();
        console.log(topic);
        // creates url for query using topic variable

        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            topic + "&api_key=ospFcerASWWtUhSsEHqEw0pDrhIYBujR&limit=10";
        $.ajax({ // AJAX call that sends request to queryURL
            url: queryURL,
            method: "GET"
        })
            .then(function (response) { // Once response is obtained, run this
                var results = response.data; // Stores data obtained into results variable
                console.log(results[0]);
                // Iterates through all results
                for (var i = 0; i < results.length; i++) {
                    var gifDiv = $("<div>");

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

                    $("#gif-section").prepend(gifDiv); // Prepends gifDiv to beginning of gifs-appear-here div
                }
                
            });
    })

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

})

// BONUS
// Fully mobile responsive (media queries?)
// Allow users to request additional gifs
    // Button to add more gifs if desired?
// Add metadata for each gif (title, tags, etc)
// Integrate search using additional APIs (OMDB, Bands in Town)
// Allow users to add gifs to "favorites section"
    // Div for favorites; should persist even when a new topic is searched for