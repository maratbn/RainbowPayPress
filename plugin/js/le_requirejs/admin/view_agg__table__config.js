/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.7.0-development_unreleased

  Module:         js/le_requirejs/admin/view_agg__table__config.js

  Description:    Widget 'ViewAgg_Table_Config' for configuration of
                  Stripe parameters.

  This file is part of StripePaymentPress.

  Licensed under the GNU General Public License Version 3.

  StripePaymentPress is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  StripePaymentPress is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with StripePaymentPress.  If not, see <http://www.gnu.org/licenses/>.
*/


(function(define) {


define(['jquery',
        'view_agg__table',
        'admin/model_orig__config',
        'admin/view_agg__tr__option__string'
    ], function($,
                ViewAgg_Table,
                model_orig__config,
                ViewAgg_Tr_Option_String) {

        return ViewAgg_Table.extend({

                initialize: function() {

                        var $buttonRefresh = $("<button>").addClass('button button-secondary')
                                                          .text("Refresh");

                        $buttonRefresh.click(function() {
                                model_orig__config.doXhrRefresh();
                            });

                        this.$el.append($("<tr>").append($("<th>").append($buttonRefresh)));

                        (new ViewAgg_Tr_Option_String({field:   'stripe_key_live_secret',
                                                label:   "Stripe live secret key:",
                                                prompt:  "Enter new Stripe live secret key:"
                                            })).$el
                                         .appendTo(this.$el);

                        (new ViewAgg_Tr_Option_String({field:   'stripe_key_live_publish',
                                                label:   "Stripe live publishable key:",
                                                prompt:  "Enter new Stripe live publishable key:"
                                            })).$el
                                         .appendTo(this.$el);

                        (new ViewAgg_Tr_Option_String({field:   'stripe_key_test_secret',
                                                label:   "Stripe test secret key:",
                                                prompt:  "Enter new Stripe test secret key:"
                                            })).$el
                                         .appendTo(this.$el);

                        (new ViewAgg_Tr_Option_String({field:   'stripe_key_test_publish',
                                                label:   "Stripe test publishable key:",
                                                prompt:  "Enter new Stripe test publishable key:"
                                            })).$el
                                         .appendTo(this.$el);
                    }
            });

    });


})(_plugin_StripePaymentPress__define);
