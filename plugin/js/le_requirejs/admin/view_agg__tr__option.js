/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.7.0-development_unreleased

  Module:         js/le_requirejs/admin/view_agg__tr__option.js

  Description:    Widget 'ViewAgg_Tr_Option' for displaying config options.

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


define(['backbone',
        'jquery',
        'admin/model_orig__config'
    ], function(backbone,
                $,
                model_orig__config) {


        //  Widget 'ViewAgg_Tr_Option':


        return backbone.View.extend({

                tagName: 'tr',

                //  @param  params.field                The field in 'ModelOrig_Config' this widget
                //                                      is associated with.
                //
                //  @param  params.label                The label to render for the option.
                //
                //  @param  params.prompt               The prompt for the 'Change' button.
                //
                initialize: function(params) {

                        var $thButton  = $('<th>').appendTo(this.$el),
                            $thLabel   = $('<th>').attr('align', 'left')
                                                  .appendTo(this.$el),
                            $tdValue   = $('<td>').appendTo(this.$el);

                        if (params &&
                            params.field &&
                            params.prompt) {

                            var $buttonChange = $('<button>').text("Change...").click(function() {
                                    var strValNew = window.prompt(params.prompt,
                                                                  model_orig__config
                                                                                .get(params.field)
                                                                  || "");
                                    if (!strValNew) return;

                                    var objConfig = {};
                                    objConfig[params.field] = strValNew;

                                    model_orig__config.doXhrUpdate(objConfig);
                                }).appendTo($thButton);
                        }

                        if (params &&
                            params.label) {
                            $thLabel.text(params.label);
                        }

                        if (params &&
                            params.field) {
                            function _update() {
                                $tdValue.text(model_orig__config.get(params.field));
                            }
                            _update.call(this);
                            this.listenTo(model_orig__config, 'change:' + params.field, _update);
                        }
                    }
            });
    });


})(_plugin_StripePaymentPress__define);
