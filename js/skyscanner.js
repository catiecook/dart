
$(document).ready(function(){

//RETREIVE DATA INTO VARIABLES
//jimmy-rig the origin airport code
  var $origin= $("#origin").val();
  $origin = $origin.replace(/\(|\)/g,'').split("");
  var realOrigin=[];

  for(let i=$origin.length-3; i<$origin.length; i++){
    realOrigin.push($origin[i])
  }

  realOrigin = realOrigin.join('');
  console.log(realOrigin);

//departure/return dates
  var $departureDate = $("#departureDate").val();
  console.log($departureDate);
  var $returnDate = $("#returnDate").val();
  console.log($returnDate);

  $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year
      format: 'yyyy-mm-dd'
    });

//if dates are invalid -- ***this is not funcitoning completely yet***
  if ($departureDate > $returnDate) {
    console.log("the dates are not valid");
  }

// load username to top right nav bar
  var $userName = $("#name").val();
    console.log($userName);

  $("#userName").text("Hey, " + $userName).css({"font-size": ".5em", "color": "black", "font-variant": "none"});

//Generate the booking and result links
  var $url = "https://galvanize-cors-proxy.herokuapp.com/http://partners.api.skyscanner.net/apiservices/browseroutes/v1.0/US/USD/en-GB/" + realOrigin + "/anywhere/" + $departureDate + "/" + $returnDate + "?apiKey=ga774761977863345132258418049742&format=json";

//link for the booking refferal
  var $link = "http://partners.api.skyscanner.net/apiservices/referral/v1.0/US/USD/en-GB/" + realOrigin + "/anywhere/" + $departureDate + "/" + $returnDate + "?apiKey=ga77476197786334&format=json";

//start on click
  $("#getResults").click(function(event){
  event.preventDefault();

      $.get($url).then(function(data){

        //function that sorts the objects and returns the lowest price
          data.Quotes.sort(function(a, b){
          return a.MinPrice - b.MinPrice;
          })

        //loop to return only the cheapest three
        for(var i=0; i<3; i++){

          //create new div with styles
          var $results = $("<div />", {
              "class": "row s12 m3 left",
            });
          var $destination = $("<div />", {
              "class": "row s6 m3 center"
            });

          var $minPrice = $("<div />", {
              "class": "row s12 m3 center"
            });

          var $destinationID = data.Quotes[i].OutboundLeg.DestinationId;
          var $destinationName = getIdName(data.Places, $destinationID);
          var $flightPrice = data.Quotes[i].MinPrice;

          $destination.text($destinationName).css({'class': 'desitinationName'});

          $minPrice.text("$" + $flightPrice);

          $(".image").hide();

          createFlightDivs($destination, $minPrice);

        } //end of for loop

      //user clicks onto departure date and the results clear for new ones
        $("#departureDate").focus(function(){
          $('#results').empty();
        });

      }); //end get $url
    }); //end click function

  }); //end document.ready

function getIdName(place, id){
  for(let i=0; i<place.length; i++){
    let currentPlace = place[i]
    if( currentPlace.PlaceId === id) {
      return currentPlace.Name;
    }
  }
};

function createFlightDivs(destination, price) {

  $("#results").append(destination.append(price.append(
      $("<div/>", {"class": "row s12 m3"})).append($("<a>", {
        "class": "btn waves-effect waves-effect waves-light blue-grey",
        "href": $link, "target": '_blank', "text": ">>>"}))
    )
  )
};
