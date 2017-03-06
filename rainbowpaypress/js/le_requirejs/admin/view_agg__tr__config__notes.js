/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/view_agg__tr__config__notes.js

  Description:    Widget 'ViewAgg_Tr_Config_Notes' for displaying config notes.

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
        'admin/view_agg__tr__w_header'
    ], function($,
                ViewAgg_Tr_WHeader) {


        //  Widget 'ViewAgg_Tr_Config_Notes':


        return ViewAgg_Tr_WHeader.extend({

                //  @param  params.content              Array of objects for content.
                initialize: function(params) {
                        ViewAgg_Tr_WHeader.prototype.initialize.apply(this, arguments);


                        var $tdNotes = $('<td>').attr('colspan', 3).appendTo(this.$el);

                        this.get_$tdNotes = function() {
                                return $tdNotes;
                            };


                        if (params && params.content) {
                            for (var i = 0; i < params.content.length; i++) {
                                $tdNotes.append(params.content[i]);
                            }
                        }
                    }
            });
    });


})(_plugin_RainbowPayPress__define);
