$(document).ready(function () {
    
    //Takes note of current time on page visit to compare with train arrivals
    var nowTime = moment();

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

        //Turns each train arrival time into its own moment object
        var trainTime = moment().hours(data.startTime.substring(0, 2)).minutes(data.startTime.substring(3, 5));


        //If the original start time hasn't happened yet, next arrival is set as the start time.
        //Set up the table with the idea that trains run daily and start their first trip at the same time.
        //Wasn't sure if we were supposed to take the start time and use the frequency to calculate next arrival no matter what?
        //Only uses frequency if current time is past original start time
        var diff = trainTime.diff(nowTime);
        var arrivalTime = "";
        var minutesAway = "";

        if (diff > 1) {
            arrivalTime = data.startTime;
            minutesAway = Math.round(diff / 60000); //convert milliseconds to minutes to show on table
        }

        else {
            diff = Math.round(diff / -60000); //convert ms difference to minutes, divide by -1 to make positive integer
            var cycles = Math.floor(diff / data.frequency);  //calculate how many trips train has run since start
            cycles = (cycles + 1) * data.frequency; //multiples finished cycles + 1 with frequency to get how many minutes from original start of day train will arrive
            trainTime.add(cycles, 'm'); //sets moment time to arrival of next train
            minutesAway = Math.round((trainTime.diff(nowTime)) / 60000); //recalculates difference from future arrival and now, converts to minutes

            //Couldn't find a method to have moment display only the hours:minutes of its object
            //Splits the string output by finding the colon index in the timestamp
            var timeString = trainTime.toString();
            var timeIndex = timeString.indexOf(":");
            arrivalTime = timeString.substring(timeIndex - 2, timeIndex) + ":" + timeString.substring(timeIndex + 1, timeIndex + 3);
        }

        //Updates table with firebase data values and calculations
        $("#train-table").append("<tr> <td>" + data.train + "</td><td>" + data.destination + "</td><td>" + data.frequency + "</td><td>" + arrivalTime + "</td><td>" + minutesAway + "</td>");

    });
});