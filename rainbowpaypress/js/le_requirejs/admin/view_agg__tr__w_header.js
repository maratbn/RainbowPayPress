/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/view_agg__tr__w_header.js

  Description:    Base widget 'ViewAgg_Tr_WHeader' contains generic logic for
                  <tr> with a <th> header cell.

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


define(['backbone',
        'jquery'
    ], function(backbone,
                $) {


        //  Widget 'ViewAgg_Tr_WHeader':


        return backbone.View.extend({

                tagName: 'tr',

                initialize: function(params) {

                        var $thHeader = $('<th>');

                        this.$el.attr('valign', 'top')
                                .append($thHeader);

                        this.get_$thHeader = function() {
                                return $thHeader;
                            };
                    },

                _flipToSingleCol: function() {
                        var totalCols = this.$el.children().length;

                        this.$el.empty();

                        return $('<td>').attr({'colspan':  totalCols,
                                               'style':    'text-align:center'})
                                        .appendTo(this.$el);
                    },

                markAs: function(strText) {
                        this._flipToSingleCol().text(strText);
                    }
            });
    });


})(_plugin_RainbowPayPress__define);
