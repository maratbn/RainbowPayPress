/*
  RainbowPayPress -- WordPress plugin for embedding Stripe checkouts via
                     shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.10.0-development_unreleased

  Module:         js/le_requirejs/admin/model_orig__transaction.js

  Description:    Model 'ModelOrig_Transaction' for caching single transaction
                  information from the server.

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


define(['backbone'], function (backbone) {

        return backbone.Model.extend({

                defaults: {
                        'id':                   null,
                        'type':                 null,
                        'created':              null,
                        'charged':              null,
                        'charge_description':   null,
                        'charge_amount':        null,
                        'stripe_token_id':      null,
                        'stripe_email':         null,
                        'customer_name':        null,
                        'customer_phone':       null,
                        'stripe_customer_id':   null,
                        'stripe_charge_id':     null
                    }

            });

    });


})(_plugin_StripePaymentPress__define);
