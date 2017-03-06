/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/view_agg__tr__transaction_detail__stripe.js

  Description:    Widget 'ViewAgg_Tr_TransactionDetail_Stripe' for Stripe-specific rows.

  This file is part of RainbowPayPress.

  Licensed under the GNU General Public License Version 3.

  RainbowPayPress is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  RainbowPayPress is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with RainbowPayPress.  If not, see <http://www.gnu.org/licenses/>.
*/


(function(define) {


define(['jquery',
        'public/model_info__stripe_checkout',
        'public/view_agg__tr__transaction_detail'
    ], function($,
                model_info__stripe_checkout,
                ViewAgg_Tr_TransactionDetail) {

        return ViewAgg_Tr_TransactionDetail.extend({

                //  @param  params.model_info__transaction_details
                //  @param  params.name_seller                          Name of the seller
                initialize: function(params) {
                        ViewAgg_Tr_TransactionDetail.prototype.initialize.call(this, {
                                model_info__details_base:   params &&
                                                            params.model_info__transaction_details,
                                field:                      params &&
                                                            params.field,
                                name:                       params &&
                                                            params.name,
                                name_seller:                params &&
                                                            params.name_seller,
                                text_enter:                 params &&
                                                            params.text_enter,
                                text_modify:                params &&
                                                            params.text_modify
                            });


                        var model_info__transaction_details = params
                                                                 .model_info__transaction_details;


                        this.on('click_modify', function() {
                                model_info__stripe_checkout.doStripeCheckout(
                                                                model_info__transaction_details,
                                                                params.name_seller);
                            }, this);


                        var $aModify    = this.get$aModify(),
                            $divBottom  = this.get$divBottom();

                        var $spanStripeBlockedOnException
                                = $('<span>')
                                        .css({'display':     'none',
                                              'color':       'red'})
                                        .text("Stripe Checkout appears to be blocked by an ad or a popup blocker, or by a JavaScript security policy.  Check your configuration and reload.")
                                        .appendTo($divBottom),

                            $spanStripeBlockedOnInitialize
                                = $('<span>')
                                        .css({'display':     'none',
                                              'color':       'red'})
                                        .text("Stripe Checkout is taking too long to initialize...  It could be blocked by an ad or a popup blocker, or by a JavaScript security policy.  Check your configuration and reload.")
                                        .appendTo($divBottom),

                            $spanStripeBlockedOnOpen
                                = $('<span>')
                                        .css({'display':     'none',
                                              'color':       'red'})
                                        .text("Stripe Checkout is taking too long to open...  It could be blocked by an ad or a popup blocker, by a JavaScript security policy, or by a broken network connection.  Give it a little more time if on a very slow connection, otherwise check your configuration and reload.")
                                        .appendTo($divBottom),

                            $spanStripeLoading
                                = $('<span>')
                                        .css({'display':     'none',
                                              'color':       'red'})
                                        .text("Stripe Checkout loading.  Please wait...")
                                        .appendTo($divBottom),

                            $spanStripeInitializing
                                = $('<span>')
                                        .css({'display':     'none',
                                              'color':       'red'})
                                        .text("Stripe Checkout initializing.  Please wait...")
                                        .appendTo($divBottom),

                            $spanStripeOpening
                                = $('<span>')
                                        .css({'display':     'none',
                                              'color':       'red'})
                                        .text("Stripe Checkout opening.  Please wait...")
                                        .appendTo($divBottom),

                            $spanStripeOpened
                                = $('<span>')
                                        .css({'display':     'none'})
                                        .text("Stripe Checkout opened.")
                                        .appendTo($divBottom);

                        function _updateStatus() {
                            var flagException     = model_info__stripe_checkout
                                                                    .get('flag_stripe_exception'),
                                flagTimeout       = model_info__stripe_checkout
                                                                      .get('flag_stripe_timeout'),
                                flagLoaded        = model_info__stripe_checkout
                                                                       .get('flag_stripe_loaded'),
                                flagInitializing  = model_info__stripe_checkout
                                                                 .get('flag_stripe_initializing'),
                                flagOpening       = model_info__stripe_checkout
                                                                      .get('flag_stripe_opening'),
                                flagOpened        = model_info__stripe_checkout
                                                                       .get('flag_stripe_opened');

                            $aModify.css('display', (!flagLoaded ||
                                                     flagInitializing ||
                                                     flagOpening ||
                                                     flagOpened)
                                                    ? 'none'
                                                    : "");

                            $spanStripeLoading.css('display', flagLoaded ? 'none' : "");

                            $spanStripeBlockedOnException.css('display',
                                                              (flagLoaded && flagException
                                                                          && !flagTimeout
                                                                          && flagInitializing)
                                                              ? ""
                                                              : 'none');
                            $spanStripeBlockedOnInitialize.css('display',
                                                               (flagLoaded && !flagException
                                                                           && flagTimeout
                                                                           && flagInitializing)
                                                               ? ""
                                                               : 'none');
                            $spanStripeBlockedOnOpen.css('display',
                                                         (flagLoaded && !flagException
                                                                     && flagTimeout
                                                                     && flagOpening)
                                                         ? ""
                                                         : 'none');

                            $spanStripeInitializing.css('display',
                                                        (flagLoaded && !flagException
                                                                    && !flagTimeout
                                                                    && flagInitializing)
                                                        ? ""
                                                        : 'none');
                            $spanStripeOpening.css('display', (flagLoaded && !flagException
                                                                          && !flagTimeout
                                                                          && flagOpening)
                                                            ? ""
                                                            : 'none');
                            $spanStripeOpened.css('display', (flagLoaded && flagOpened)
                                                           ? ""
                                                           : 'none');
                        }
                        _updateStatus.call(this);
                        this.listenTo(
                            model_info__stripe_checkout,
                            'change:flag_stripe_exception change:flag_stripe_timeout change:flag_stripe_loaded change:flag_stripe_initializing change:flag_stripe_opening change:flag_stripe_opened',
                            _updateStatus);
                    }

            });

    });

})(_plugin_RainbowPayPress__define);
