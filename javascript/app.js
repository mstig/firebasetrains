$(document).ready(function () {

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

    //sending to firebase on add button click
    $("#add-train-btn").on("click", function (event) {
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

    //Populate table with firebase data
    //Pulls data on page load and every time child is added by user
    database.ref().on("child_added", function (childSnapshot) {
        var data = childSnapshot.val();
        $("#train-table").append("<tr> <td>"+data.train+"</td><td>"+data.destination+"</td><td>"+data.frequency+"</td><td>"+data.startTime+"</td><td>incoming time</td>");

    });

    //Finding next train arrival function:
    //call moment js for current time
    //function to turn HH:mm string into actual number, maybe pass straight into moment?
    //divide difference from first run and now by frequency to get total trips        
    //add (total trips + 1) * frequency to start time to get next arrival
    //find difference from now to next arrival



});