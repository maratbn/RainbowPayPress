/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/view_agg__td__detail.js

  Description:    Widget 'ViewAgg_Td_Detail'.

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


define(['backbone', 'jquery'], function (backbone, $) {

        return backbone.View.extend({
                tagName: 'td',

                //  @param  params.callback_decide_color
                //                                  Optional color-deciding callback.
                //  @param  params.callback_format_value
                //                                  Optional value formatting callback.
                //  @param  params.model
                //  @param  params.field
                //  @param  params.text_modify      Text for the modification link when there's a
                //                                  value.
                initialize: function(params) {

                        this.$el.addClass('widget_view_agg__td__detail');


                        var $divValue   = $('<div>').appendTo(this.$el),
                            $divBottom  = $('<div>').appendTo(this.$el);

                        this.get$divBottom = function() {
                                return $divBottom;
                            };


                        var $aModify = params.text_modify
                                     ? $('<a>').attr('href', '#')
                                               .text(params.text_modify)
                                               .appendTo($divBottom)
                                     : null;

                        this.get$aModify = function() {
                                return $aModify;
                            };

                        if ($aModify) {
                            var me = this;

                            $aModify.click(function(event) {
                                    event.preventDefault();

                                    me.trigger('click_modify');
                                });
                        }


                        var field = params.field,
                            model = params.model;

                        function _updateValue() {
                            var value = model.get(field);

                            if (params.callback_decide_color) {
                                $divValue.css('color', params.callback_decide_color(value));
                            }

                            if (params.callback_format_value) {
                                value = params.callback_format_value(value);
                            }

                            if (value) {
                                $divValue.text(value);
                            } else {
                                $divValue.html('&nbsp;');
                            }
                        }

                        _updateValue.call(this);

                        this.listenTo(model,
                                      'change:' + field,
                                      _updateValue);
                    }
            });
    });


})(_plugin_RainbowPayPress__define);
