/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/view_agg__tr__config__option.js

  Description:    Base widget 'ViewAgg_Tr_Config_Option' for displaying config
                  options.

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
        'admin/model_orig__config',
        'admin/view_agg__tr__w_header'
    ], function($,
                model_orig__config,
                ViewAgg_Tr_WHeader) {


        //  Widget 'ViewAgg_Tr_Config_Option':


        return ViewAgg_Tr_WHeader.extend({

                //  @param  params.field                The field in 'ModelOrig_Config' this widget
                //                                      is associated with.
                //
                //  @param  params.label                The label to render for the option.
                //
                initialize: function(params) {

                        ViewAgg_Tr_WHeader.prototype.initialize.apply(this, arguments);


                        var $thButton  = this.get_$thHeader(),
                            $thLabel   = $('<th>').attr('align', 'left')
                                                  .appendTo(this.$el),
                            $tdValue   = $('<td>').appendTo(this.$el);


                        if (params &&
                            params.label) {
                            $thLabel.text(params.label);
                        }

                        if (params &&
                            params.field) {
                            function _update() {
                                var strValue = model_orig__config.get(params.field);
                                $tdValue.text(this._translateValue
                                                ? this._translateValue.call(this, strValue)
                                                : strValue);
                            }
                            _update.call(this);
                            this.listenTo(model_orig__config, 'change:' + params.field, _update);
                        }


                        this.get_$thButton = function() {
                                return $thButton;
                            };
                    },

                _translateValue: null
            });
    });


})(_plugin_RainbowPayPress__define);
