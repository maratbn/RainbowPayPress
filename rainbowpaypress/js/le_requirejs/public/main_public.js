/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/public/main_public.js

  Description:    Main JavaScript file for the public-facing pages for the
                  WordPress plugin 'RainbowPayPress'.

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


(function(define, require) {


define(['jquery',
        'model_orig__app_common',
        'public/model_orig__app_public',
        'public/view_agg__div__transaction'
    ], function($,
                model_orig__app_common,
                model_orig__app_public,
                ViewAgg_Div_Transaction) {

        function _processShortcodes() {
            function _processSpan($elSpan) {
                var label   = $elSpan.attr('data-plugin-rainbow-pay-press-label');

                var $buttonMakePayment = $('<button>').text(label || "Pay with Stripe")
                                                      .appendTo($elSpan),
                    view_agg__div__transactionCached = null;

                $buttonMakePayment.on('click', function(e) {
                        e.preventDefault();

                        if (view_agg__div__transactionCached) {
                            if (view_agg__div__transactionCached.$el.css('display') == 'none') {
                                view_agg__div__transactionCached.$el.css('display', "");
                            } else {
                                view_agg__div__transactionCached.$el.css('display', 'none');
                            }
                        } else {
                            (view_agg__div__transactionCached =
                                new ViewAgg_Div_Transaction({
                                            type:    $elSpan
                                                        .attr(
                                                          'data-plugin-rainbow-pay-press-type')
                                                      || 'test',
                                            amount:  parseInt(
                                                      $elSpan
                                                        .attr(
                                                         'data-plugin-rainbow-pay-press-amount')),
                                            name:    $elSpan
                                                        .attr(
                                                          'data-plugin-rainbow-pay-press-name'),
                                            desc:    $elSpan
                                                        .attr(
                                                          'data-plugin-rainbow-pay-press-desc'),
                                            info:    $elSpan
                                                        .attr(
                                                          'data-plugin-rainbow-pay-press-info'),
                                            fields:  $elSpan
                                                        .attr(
                                                          'data-plugin-rainbow-pay-press-fields'),
                                            handle:  $elSpan
                                                        .attr(
                                                          'data-plugin-rainbow-pay-press-handle')
                                        })).$el.appendTo($elSpan);
                        }
                    });
            }

            var $elSpans = $("span[data-plugin-rainbow-pay-press-role=root]");

            for (var i = 0; i < $elSpans.length; i++) {
                _processSpan($($elSpans[i]));
            }
        }

        function RainbowPayPressPublicClient() {

            //  @param  params.ajax_url
            //  @param  params.publish_key_live
            //  @param  params.publish_key_test
            this.start = function(params) {

                    model_orig__app_common.set('ajax_url', params.ajax_url);
                    model_orig__app_public.set({'publish_key_live': params.publish_key_live,
                                                'publish_key_test': params.publish_key_test});

                    $(document).ready(function() {

                            _processShortcodes();

                        });
                };
        }

        var client = new RainbowPayPressPublicClient();
        return client;
    });


})(_plugin_RainbowPayPress__define, _plugin_RainbowPayPress__require);
