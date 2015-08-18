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

    //Boolean for alert
    $scope.rotateAlert = false;

    //Error message
    $scope.errorMsg

    //Get our merchant ID
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

        //Switch overlay on
		document.getElementById('darkerOverlay').style.display = "block";

		//Our pressed tricon ***
		$scope.pressedTricon = "";

        //our array of tricons
        var triconArray = [];

		//Get our merchant ID
		$scope.Id = $routeParams.merchantId;

        //Get our location
        $scope.getLocation = function() {
            //Get our giftcards from the user
            //First set up some JSON for the session token
            var getJson = {
                "id" : $scope.Id,
                "sessionToken" : $scope.sessionToken
            }

            $scope.merchantLocation = LocationById.get(getJson, function(response){
                //Check for errors
                if(response.status)
                {
                    if(response.status == 401)
                    {
                        //Bad session
                        //Redirect them to a 404
                        $location.path("#/");
                        return;
                    }
                    else
                    {
                        console.log("Status:" + response.status + ", " + $scope.giftcards.msg);
                        return;
                    }
                }
                else {
                    //there was no error continue as normal
                    //Stop any loading bars or things here
                }
            },
            //check for a 500
            function(response)
            {
                console.log("Status:" + response.status + ", Internal Server Error");
                return;
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

		//When tricon is being pressed, this function will be launched
		$scope.pressed = function(id){

            //remove the error text
            //Error message
            $scope.errorMsg = "";

			//Add tricon code here
			//console.log("Tricon Pressed: " + $scope.images[id]);
			//
            var offset;
            if(window.innerWidth <= 320){
                offset = '-75px';
            } else {
                offset = '-100px';
            }
			event.currentTarget.style.backgroundPositionY = offset;

			//And, add a star to pressed tricon
			$scope.pressedTricon = $scope.pressedTricon + "*";

            //Push the tricon onto the array
            triconArray.push($scope.images[id].code);

			//Check if it has more than 2 characters, if it does, go to the confirmation page
			if($scope.pressedTricon.length > 2)
			{
                //Send the data to the backend and make sure it's good!
                var spendJson = {
                    "id" : $scope.Id,
                    "sessionToken" : $scope.sessionToken,
                    "amount" : $cookies.get("igosdmbmtv"),
                    "triconKey" : triconArray[0] + "" + triconArray[1] + "" + triconArray[2]
                }

                $scope.spendResponse = Spend.spendGiftcard(spendJson, function (response) {
                    //Check for errors
                    if(response.status)
                    {
                        if(response.status == 401)
                        {
                            //Bad session
                            //Redirect them to a 404
                            $location.path("#/");
                            return;
                        }
                        else
                        {
                            console.log("Status:" + response.status + ", " + $scope.giftcards.msg);
                            return;
                        }
                    }
                    else
                    {
                        //there was no error continue as normal
                        //Stop any loading bars or things here
                        //Go to the confirmation page

                        $location.path("/merchants/" + $scope.Id + "/confirmation");
                    }
                },
                //check for a 500
                function(response)
                {
                    //Check for unauthorized
                    if(response.status == 401 || response.status == 500)
                    {
                        //Bad session
                        //Redirect them to a 404
                        $location.path("#/");
                    }
                    //If they enter the wrong tricon key
                    else if(response.status == 404)
                    {
                        //reset everything

                        //Our pressed tricon ***
                        $scope.pressedTricon = "";

                        //our array of tricons
                        triconArray = [];


                        //Error message
                        $scope.errorMsg = "Sorry, that is the incorrect tricon code, please try again.";
                    }
                    else {
                        //log the status
                        console.log("Status:" + response.status);
                    }
                    return;
                });
			}
		}

		//When tricon is unpressed, this function will be launched
		$scope.unpressed = function(id){
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

        if(window.innerWidth <= 320){
            for(var i = 0; i < $scope.images.length; i++){
                $scope.images[i].pos = $scope.images[i].pos * .75;
            }
        }

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

  });
