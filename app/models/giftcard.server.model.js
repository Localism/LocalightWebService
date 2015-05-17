'use strict';
// I want to change gift card to CliqueCard, will do that later though.
// I can do that in a night.

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
   //  twilioService = require('../services/twilio/outgoingTwilioText.service'),
   Schema = mongoose.Schema;

/**
 * Giftcard Schema,
 * Included are the validations for the mongoose model.
 */

var GiftcardSchema = new Schema({
   /**
    * Amount, the value of which the card holds, to be spent at a merchant's busienss.
    * A postive integery in teh smallest currency unit(e.g 100 cents to charge $1.00)
    * @type {Object}
    */
   amount: {
      type: Number,
      min: 0,
      max: 50000,//equates to $500.00, 100 = $1.00, 50 = $.50
      // need to make the number validate a number not less than zero.
      required: 'Please enter an amount to purchase between 0 and 500000'
   }, // need to make sure it's always a number and never zero or a negative number.
   /**
    * [stripeOrderId Provided when the giftcard is first purchased, and used when or if we need to refund the giftcard.]
    * @type {String}
    */
   // for initial purchase.
   stripeOrderId: {
      type: String,
      required: 'You must save the order Id.'
   }, // I should only get a order once

   /**
    *  Message, the message that the user wishes for another user to see.
    *  a message doesn't need to have a string attached to it.
    */
   occasion: {
      type: String,
      default: 'A gift for you!'
   },
   //  dateLastUpdate:{
   //     type: Date,
   //     default: Date.now
   // },
   // Date card created or purchased, might want to change the number.

   created: {
      type: Date,
      default: Date.now
   },
   /**
    * This is the user who will be purchasing the gitcard for another user.
    * When this user purchases the giftcard they will be charged and sent a reciepit on
    * successfull save of the object.
    * @type {Object}
    */
   fromUser: {
      type: Schema.ObjectId,
      ref: 'User',
      required: 'Please, enter the user id who is sending the giftcard.'
   },
   /**
    * This user will be the one receiving the giftcard and will be sent a text message when
    * they receive the giftard.
    * @type {Object}
    */
   toUser: {
      type: Schema.ObjectId,
      ref: 'User',
      required: 'Please, enter the user id to send this giftcard too.'
   }
});

/**
 * Hook a pre save method to verify that the toUser and fromUser are not the
 * same user. could elborate later, and do a deep search to make sure these two
 * people are completely different and un related if we wanted too
 */
 GiftcardSchema.pre('save', function(next) {
    // Make sure that the to and from users are different people and not the
    // same. If they are the same stop, and throw an error.
    // I don't think I can make this a validation thing, I think this needs to
    // done before the giftcard reachees the save point. like the first line of defense.
    // In theory, I could do the stripe transaction stuff here too. 

});

GiftcardSchema.post('save', function(next){
   // If everything worked out send an email to the fromUser with a reciepet, a
   // and send a text message to the to user.
   // when the giftcard is saved, based on the save the users will be able to
   // the giftcard appear in there account.

});


// GiftcardSchema.pre('save', function(next) {
//
//   var smtpTransport = nodemailer.createTransport(config.mailer.options);
//   var mailOptions = {
//     to: this.emailForReceipt,
//     from: 'gift-confirm@clique.cc',
//     subject: 'Your Clique Card has been sent!',
//     text: '\n\n'+ this.fromUser.dipslayName +', your gift of $'+ this.amount + 'is on it&#39;s way to'+'! With the CLIQUE Local Gift Card you can apply your gift toward purchases at numerous locally-owned merchants in the Long Beach area'
//   };
//   smtpTransport.sendMail(mailOptions, function(error) {
//     if (!error) {
//       console.log(mailOptions);
//       // this.send({
//       //   message: 'An email has been sent to ' + this.fromUser.email + ' with further instructions.'
//       // });
//       //TODO: need to find out if there is a way to send a response from the model
//     } else {
//       console.log('got an error: ', error);
//     }
//   });
//   next();
// });
/**
 * Hook a post save method to send out emails and texts
 */
//  GiftcardSchema.post('save', function(next) {
//     twilioService.sendConfirmationText(this.toUser);
//    //  mailgunService.sendReceiptEmail(this.fromUser);
// 	next();
// });

mongoose.model('Giftcard', GiftcardSchema);
