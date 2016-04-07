/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        2.4.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/view_agg__tr__item.js

  Description:    Widget 'ViewAgg_Tr_Item'.

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
        'util',
        'admin/collection_orig__item',
        'admin/view_agg__button',
        'admin/view_agg__tr__w_header'
    ], function($,
                util,
                collection_orig__item,
                ViewAgg_Button,
                ViewAgg_Tr_WHeader) {

        function _td() {
            return $('<td>');
        }

        return ViewAgg_Tr_WHeader.extend({

                //  @param  params.flag_exclude_charged
                //  @param  params.model_orig__transaction
                initialize: function(params) {

                        ViewAgg_Tr_WHeader.prototype.initialize.apply(this, arguments);


                        var model_orig__item = params.model_orig__item;


                        var $buttonDelete = (new ViewAgg_Button).$el.text("Delete");

                        $buttonDelete.click(function() {
                                if (!window
                                       .confirm("This will delete this item.  Are you sure?")) {
                                    return;
                                }

                                collection_orig__item.doXhrDelete(model_orig__item);
                            });

                        this.get_$thHeader().append($buttonDelete);


                        var cost = model_orig__item.get('cost');

                        this.$el.append(_td().text(model_orig__item.get('handle') || ""))
                                .append(_td().text(cost ? util.formatCurrency(cost) : ""))
                                .append(_td().text(model_orig__item.get('description') || ""));
                    },

                markAsDeleted: function() {
                        this.markAs("--- Deleted ---");
                    }
            });

    });


})(_plugin_RainbowPayPress__define);
