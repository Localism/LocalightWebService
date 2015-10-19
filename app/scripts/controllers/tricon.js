'use strict';

/**
 * @ngdoc function
 * @name angularLocalightApp.controller:TriconCtrl
 * @description
 * # TriconCtrl
 * Controller of the angularLocalightApp
 */
angular.module('angularLocalightApp')
  .controller('TriconCtrl', function ($scope, $routeParams, $location, $window, $cookies, LocationById, Spend) {

    //Boolean for rotation alert to the user
    $scope.rotateAlert = false;

    //Boolean to display an error message
    $scope.errorMsg

    //Get our merchant ID from the url
    $scope.Id = $routeParams.merchantId;

    //get our session token from the cookies
    $scope.sessionToken;

    if($cookies.get("sessionToken"))
    {
        $scope.sessionToken = $cookies.get("sessionToken");
    }
    else
    {
        //Redirect them to a 404
        $location.path("#/");
    }

    //Check for device orientation
    $window.addEventListener("orientationchange", function() {
        if(!$scope.rotateAlert && ($window.orientation == -90 || $window.orientation == 90))
        {
            $scope.rotateAlert = true;
            alert("Please disable device rotation, this application is meant to be used in portrait mode. You could risk spending a giftcard incorrectly, or losing your data.");
        }
    }, false);

		//The string to diplay the *** to the users on tricon enter
		$scope.pressedTricon = "";

        //Array of entered tricons
        var triconArray = [];

        //Get our location
        $scope.getLocation = function() {

            //First set up some JSON for the session token
            var payload = {
                "id" : $scope.Id,
                "sessionToken" : $scope.sessionToken
            }

            //Send the payload to the backend
            LocationById.get(payload,
                function(data, status) {
                //Success! Save the response to our scope!
                $scope.merchantLocation = data;

                //Show(true)/Hide(false) the loading spinner
                $scope.loading = false;

            }, function(err) {

                //Error, Inform the user of the status
                if (err.status == 401) {
                   //Session is invalid! Redirect to 404
                   $location.path("/");
                } else {
                   //An unexpected error has occured, log into console
                   console.log("Status: " + err.status + " " + err.data.msg);
                }
            });
        }

		//Shuffles an array using the Fisher-Yates algorithm
		$scope.shuffle = function(array) {
		  var currentIndex = array.length, temporaryValue, randomIndex ;

		  // While there remain elements to shuffle...
		  while (0 !== currentIndex) {

		    // Pick a remaining element...
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;

		    // And swap it with the current element.
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		  }

		  return array;
		}

		//Function to handle tricon presses
		$scope.pressed = function(id){

            //reset the error text
            $scope.errorMsg = "";

            //Set the tricon to the pressed image
            var offset = '-100px';
			event.currentTarget.style.backgroundPositionY = offset;

			//And, add a star to pressed tricon
			$scope.pressedTricon = $scope.pressedTricon + "*";

            //Push the tricon onto the array
            triconArray.push($scope.images[id].code);

			//Check if it has more than 2 characters, if it does, go to the confirmation page
			if($scope.pressedTricon.length > 2)
			{

                //Send the data to the backend and make sure it's good!
                var payload = {
                    "id" : $scope.Id,
                    "sessionToken" : $scope.sessionToken,
                    "amount" : $cookies.get("igosdmbmtv"),
                    "triconKey" : triconArray[0] + "" + triconArray[1] + "" + triconArray[2]
                }

                Spend.spendGiftcard(payload,
                function (data, status) {

                        //success save the response in scope
                        $scope.spendResponse = data;

                        //Go to the confirmation page
                        $location.path("/merchants/" + $scope.Id + "/confirmation");
                },
                function(err)
                {
                    //Check for unauthorized
                    if(err.status == 401 || err.status == 500)
                    {
                        //Bad session
                        //Redirect them to a 404
                        $location.path("#/");
                    }
                    //If they enter the wrong tricon key
                    else if(err.status == 404)
                    {
                        //Reset everything
                        $scope.pressedTricon = "";
                        triconArray = [];

                        //Display the error
                        $scope.errorMsg = "Sorry, that is the incorrect tricon code, please try again.";
                    }
                    else {
                        //log the status
                        console.log("Status:" + err.status + " " + err.data.msg);
                    }
                    return;
                });
			}
		}

		//Handle when a tricon becomes unpressed
		$scope.unpressed = function(id) {
			event.currentTarget.style.backgroundPositionY = '0px';
		}

		//Holds the table layout for the dynamic ng-repeat table
		$scope.tableLayout = [
				[0,1,2],
				[3,4,5],
				[6,7,8]
		];

		//Array of the eatery tricons and their paths
		$scope.images =
		[
			{name: "tricon-coffee", pos: "600", code: "e107"},
			{name: "tricon-cupcake", pos: "0", code: "e101"},
			{name: "tricon-dinner", pos: "300", code: "e104"},
			{name: "tricon-pie", pos: "800", code: "e109"},
			{name: "tricon-sandwich", pos: "100", code: "e102"},
			{name: "tricon-sushi", pos: "200", code: "e103"},
			{name: "tricon-pho-soup", pos: "400", code: "e105"},
			{name: "tricon-sundae", pos: "700", code: "e108"},
			{name: "tricon-wine", pos: "500", code: "e106"}
		];

		//Shuffles the images array of tricons to always
		//display in different order
		$scope.images = $scope.shuffle($scope.images);

		//Get the amount we are going to send the server
		$scope.getAmount = function()
		{
			//Retrive the cookie with our amount
			var amount = $cookies.get("igosdmbmtv");
			if(!amount)
			{
				$scope.goTo("/merchants/" + $scope.Id + "/amount");
			}
			return (parseInt(amount) / 100).toFixed(2);
		}

		//Get the merchant we are going to send the server
		$scope.getMerchant = function()
		{
			//Replace this with a backend call eventually
			return "MADE In Long Beach";
		}

        //Remove the sender's id for the thank you page
        $scope.senderId = function () {
            //put the sender into cookies to retrieve later
            $cookies.remove('senderName', $scope.giftcard.fromId.name);
            $cookies.remove('senderId', $scope.giftcard.fromId._id);

            //Change locations to the merchants page
            $location.path("/giftcards");
        }

  });
