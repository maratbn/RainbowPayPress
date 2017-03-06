/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/public/model_info__transaction_details.js

  Description:    Model 'ModelInfo_TransactionDetails'.

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
        'model_info__details_base',
        'model_orig__app_common',
        'public/model_orig__app_public',
    ], function($,
                ModelInfo_DetailsBase,
                model_orig__app_common,
                model_orig__app_public) {

        return ModelInfo_DetailsBase.extend({

                defaults: {
                        'type':                 null,
                        'charge_description':   null,
                        'charge_amount':        null,
                        'stripe_token_id':      null,
                        'stripe_email':         null,
                        'customer_name':        null,
                        'customer_phone':       null,
                        'handle':               null,
                        'shipping_address':     null
                    },

                doXhrSubmit: function() {
                        var strURL = model_orig__app_common.get('ajax_url');

                        var $xhr = $.post
                                      (strURL, {
                                          'action':  'rainbow_pay_press__submit',
                                          'data':    window.encodeURIComponent(
                                                       window.JSON.stringify({
                                                         'type':                this.attributes
                                                                                        ['type'],
                                                         'handle':              this.attributes
                                                                                        ['handle'],
                                                         'stripe_token_id':     this.attributes
                                                                                        ['stripe_token_id'],
                                                         'stripe_email':        this.attributes
                                                                                        ['stripe_email'],
                                                         'customer_name':       this.attributes
                                                                                        ['customer_name'],
                                                         'customer_phone':      this.attributes
                                                                                        ['customer_phone'],
                                                         'shipping_address':    this.attributes
                                                                                        ['shipping_address']
                                                       }))
                                      }),
                            me = this;

                        $xhr.error(function($xhr2, strTextStatus, strErrorThrown) {
                                if (!$xhr.getAllResponseHeaders()) {
                                    var strErrorMessage = "An error has been detected, along with no response from the server.  This indicates that your transaction has not been submitted due to a communication problem with the server."

                                    if ($xhr.readyState == 0 && strURL.indexOf('https://') == 0) {
                                        strErrorMessage = "An error has occurred before this transaction could be sent.  Your browser has likely refused to trust this website's HTTPS/SSL certificate.  This website may not be using a commonly trusted HTTPS/SSL certificate, or it may have expired.";
                                    }

                                    alert(strErrorMessage);
                                }
                            });

                        $xhr.success(function(strData) {
                                var objData = JSON.parse(strData);

                                me.trigger('xhr__always__rainbow_pay_press__submit', {
                                               errors:       objData && objData['errors'],
                                               success:      objData && objData['success'],
                                               transaction:  objData && objData['transaction'],
                                               disallowed_reason:
                                                             objData && objData['disallowed_reason']
                                           });
                            });
                    },

                getPublishKey: function() {
                        var strType = this.attributes['type'];
                        if (strType == 'live') return model_orig__app_public.get('publish_key_live');
                        if (strType == 'test') return model_orig__app_public.get('publish_key_test');
                        return null;
                    }
            });

    });


})(_plugin_RainbowPayPress__define);
