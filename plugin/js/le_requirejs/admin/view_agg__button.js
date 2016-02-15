/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.9.0-development_unreleased

  Module:         js/le_requirejs/admin/view_agg__button.js

  Description:    Widget 'ViewAgg_Button' for rendering <button>s on admin
                  pages.

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


define(['backbone'], function(backbone) {


        //  Widget 'ViewAgg_Button':


        return backbone.View.extend({

                tagName: 'button',

                initialize: function() {
                        this.$el.addClass('button button-secondary');


                        var me = this;

                        this.$el.click(function(dataEventClick) {
                                me.trigger('click', dataEventClick);
                            });
                    },

                setDisabled: function(flagDisabled) {
                        this.$el.prop('disabled', flagDisabled);
                    }
            });
    });


})(_plugin_StripePaymentPress__define);
