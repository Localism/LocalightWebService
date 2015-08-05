'use strict';

/**
 * @ngdoc function
 * @name angularLocalightApp.controller:ThankyouCtrl
 * @description
 * # ThankyouCtrl
 * Controller of the angularLocalightApp
 */
angular.module('angularLocalightApp')
  .controller('ThankyouCtrl', function ($scope, $routeParams, $cookies, $location, $window, Giftcards, LocationById) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Boolean for alert
    $scope.rotateAlert = false;

    //Check for device orientation
    $window.addEventListener("orientationchange", function() {
        if(!$scope.rotateAlert && ($window.orientation == -90 || $window.orientation == 90))
        {
            $scope.rotateAlert = true;
            alert("Please disable device rotation, this application is meant to be used in portrait mode. You could risk spending a giftcard incorrectly, or losing your data.");
        }
    }, false);

        //Switch overlay off
      	document.getElementById('darkerOverlay').style.display = "none";


          //get our session token from the cookies
          $scope.sessionToken = $cookies.get("sessionToken");

		//Initialize scope.giftcards
		$scope.giftcards = null;

		//Our character count for the text area
		$scope.charCount;

		//Total purcahse value
		$scope.purchaseValue;

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

            $scope.merchantLocation = LocationById.get(getJson, function(){
                //Check for errors
                if($scope.merchantLocation.errorid)
                {
                    console.log("Error #" + $scope.giftcard.errorid + ": " + $scope.giftcard.msg);
                    return;
                }
                else {
                    //there was no error continue as normal
                    //Stop any loading bars or things here
                }
            });

        }

		//Retrive the cookie with our amount
		var amount = $cookies.get("igosdmbmtv");
		if(!amount)
		{
			amount = 0;
		}
		$cookies.remove("igosdmbmtv");
		$scope.purchaseValue = (parseInt(amount) / 100).toFixed(2);


		//Prepare our text area
		$scope.setTextArea = function ()
		{
			//Set the default value of our text area
			document.getElementById("thankYouNote").value = $scope.giftcards[0].from + ", I used the Local Giftcard at "
			+ $scope.merchantLocation.name + " to get...";
		}

		//Count our text area characters
		$scope.countCharacters = function()
		{
			$scope.charCount = 160 - document.getElementById("thankYouNote").value.length;
		}

        // Find a list of Giftcards
		$scope.getGiftcards = function() {
			//Get our giftcards from the user
            //First set up some JSON for the session token
            var getJson = {
                "sessionToken" : $scope.sessionToken
            }

            //Query the backend using out session token
            $scope.giftcards = Giftcards.get(getJson, function()
            {
                //Check for errors
                if($scope.giftcards.errorid)
                {
                    console.log("Error #" + $scope.giftcards.errorid + ": " + $scope.giftcards.msg);
                    return;
                }
                else {
                    //there was no error continue as normal
                    //Stop any loading bars or things here
                }
            });
		}

		$scope.totalValue = function()
		{
			//Get the total value of all the giftcards
			var total = 0;
			for(var i = 0; i < $scope.giftcards.length; ++i)
			{
				total = total + parseInt($scope.giftcards[i].amt, 10);
			}

			//Return the total value as a formatted string
			return (parseInt(total) / 100).toFixed(2);
		}

		//Function to go back to selecting merchants
		$scope.goTo = function(place) {
			//Send the user to another page!

			$location.path(place);
		}

		//Array of occasion Icons, simply a link to their icon
		$scope.icons =
		[
			//Anniversary
			"../images/occasion-anniversary-icon-wht.png",
			//Baby
			"../images/occasion-baby-icon-wht.png",
			//Birthday
			"../images/occasion-birthday-icon-wht.png",
			//Congrats
			"../images/occasion-congrats-icon-wht.png",
			//Present (Custom Icon)
			"../images/occasion-custom-icon-wht.png",
			//Get Well Soon
			"../images/occasion-getwell-icon-wht.png",
			//Love
			"../images/occasion-love-icon-wht.png",
			//Sympathy
			"../images/occasion-sympathy-icon-wht.png",
			//Thank You
			"../images/occasion-thankyou-icon-wht.png",
			//Wedding
			"../images/occasion-wedding-icon-wht.png"
		]


  });
