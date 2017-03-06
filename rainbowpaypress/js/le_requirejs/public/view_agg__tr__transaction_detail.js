/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/view_agg__tr__transaction_detail.js

  Description:    Widget 'ViewAgg_Tr_TransactionDetail'.  Renders a row inside
                  'ViewAgg_Table_TransactionDetails'.

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


define(['view_agg__tr__detail_base'], function (ViewAgg_Tr_DetailBase) {

        return ViewAgg_Tr_DetailBase.extend({

                //  @param  params.callback_format_value
                //                                  Optional value formatting callback.
                //  @param  params.model_info__details_base
                //  @param  params.field
                //  @param  params.name             The name of this detail.
                //  @param  params.text             Text to place into the value field.
                //  @param  params.text_enter       Text for the modification link when there's no
                //                                  value.
                //  @param  params.text_modify      Text for the modification link when there's a
                //                                  value.
                initialize: function(params) {

                        ViewAgg_Tr_DetailBase.prototype.initialize.apply(this, arguments);


                        this.$el.addClass('widget_view_agg__tr__transaction_detail');
                    }
            });
    });


})(_plugin_RainbowPayPress__define);
