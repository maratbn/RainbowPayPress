/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        2.4.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/view_agg__table__items.js

  Description:    Widget 'ViewAgg_Table_Items'.

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
        'view_agg__table',
        'admin/view_agg__button'
    ], function($,
                ViewAgg_Table,
                ViewAgg_Button) {

        return ViewAgg_Table.extend({

                initialize: function() {

                        ViewAgg_Table.prototype.initialize.apply(this, arguments);

                        this.$el.addClass('widget_view_agg__table__items');

                        $('<tr>').append($('<th>').append((new ViewAgg_Button)
                                                              .$el
                                                              .click(
                                                                function() {
                                                                })
                                                              .text("Refresh")))
                                 .append($('<th>').text("Handle:"))
                                 .append($('<th>').text("Cost:"))
                                 .append($('<th>').text("Description:"))
                                 .appendTo($('<thead>').appendTo(this.$el));

                    }
            });

    });


})(_plugin_RainbowPayPress__define);
