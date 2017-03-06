/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/model_orig__transaction.js

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


define(['backbone', 'util'], function (backbone, util) {

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
                        'shipping_address':     null,
                        'stripe_customer_id':   null,
                        'stripe_charge_id':     null
                    },

                parse: function(data) {
                        if (!data) return null;

                        return {
                                'id':                   data['id'],
                                'type':                 data['type'],
                                'created':              util.parseDate(data['created']),
                                'charged':              util.parseDate(data['charged']),
                                'charge_description':   data['charge_description'],
                                'charge_amount':        data['charge_amount'],
                                'stripe_token_id':      data['stripe_token_id'],
                                'stripe_email':         data['stripe_email'],
                                'customer_name':        data['customer_name'],
                                'customer_phone':       data['customer_phone'],
                                'shipping_address':     data['shipping_address'],
                                'stripe_customer_id':   data['stripe_customer_id'],
                                'stripe_charge_id':     data['stripe_charge_id']
                            };
                    }
            });

    });


})(_plugin_RainbowPayPress__define);
