// Initialize Firebase
var config = {
    apiKey: "AIzaSyDlAoOKufK5D3xSxUyMcNrDhp4vs5w64Fk",
    authDomain: "trains-homework.firebaseapp.com",
    databaseURL: "https://trains-homework.firebaseio.com",
    projectId: "trains-homework",
    storageBucket: "trains-homework.appspot.com",
    messagingSenderId: "874400339610"
};

firebase.initializeApp(config);

var database = firebase.database();

var train = "";
var destination = "";
var startTime = ""; //HH:mm, 24 hour time
var frequency = "" //in minutes
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
    console.log("submit button");
});

$("#all-inputs").on("submit", function (event) {
    event.preventDefault();
    train = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    startTime = $("#first-time-input").val().trim();
    frequency = $("#freq-input").val().trim();

    console.log(train, destination, startTime, frequency);

    //clear form so values dont persist on page when being moved to database
    $("#all-inputs")[0].reset();

    database.ref().push({
        train: train,
        destination: destination,
        startTime: startTime,
        frequency: frequency
    });
});
