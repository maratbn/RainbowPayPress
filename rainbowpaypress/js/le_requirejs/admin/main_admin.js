/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/main_admin.js

  Description:    Main JavaScript file for the internal admin pages for the
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
        'admin/collection_orig__item',
        'admin/collection_orig__transaction',
        'admin/model_orig__config',
        'admin/view_agg__button__add_new_item',
        'admin/view_agg__table__config',
        'admin/view_agg__table__items',
        'admin/view_agg__table__transactions'
    ], function($,
                model_orig__app_common,
                collection_orig__item,
                collection_orig__transaction,
                model_orig__config,
                ViewAgg_Button_AddNewItem,
                ViewAgg_Table_Config,
                ViewAgg_Table_Items,
                ViewAgg_Table_Transactions) {

        function _processSpansWithRoles(params) {

            var $snapAppConfig = $("span[data-plugin-rainbow-pay-press-role=app-config]");
            if ($snapAppConfig) {
                (new ViewAgg_Table_Config()).$el.appendTo($snapAppConfig);
            }


            var $snapAddNewItem = $("span[data-plugin-rainbow-pay-press-role=add-new-item]");
            if ($snapAddNewItem) {
                (new ViewAgg_Button_AddNewItem()).$el.appendTo($snapAddNewItem);
            }


            var $snapItems = $("span[data-plugin-rainbow-pay-press-role=items]");
            if ($snapItems) {
                collection_orig__item.fetch();
                (new ViewAgg_Table_Items()).$el.appendTo($snapItems);
            }


            function _processTransactionSpans($elSpans, params) {
                if ($elSpans.length == 0) return;

                collection_orig__transaction.fetch();

                for (var i = 0; i < $elSpans.length; i++) {
                    var $elSpan = $($elSpans[i]);
                    if (!$elSpan) continue;

                    (new ViewAgg_Table_Transactions(params)).$el.appendTo($elSpan);
                }
            }

            _processTransactionSpans(
                          $("span[data-plugin-rainbow-pay-press-role=transactions-charged]"),
                          {flag_exclude_uncharged: true});
            _processTransactionSpans(
                          $("span[data-plugin-rainbow-pay-press-role=transactions-pending]"),
                          {flag_exclude_charged: true});
        }

        function RainbowPayPressAdminClient() {

            //  @param  params.ajax_url
            //  @param  params.stripe_key_live_secret
            //  @param  params.stripe_key_live_publish
            //  @param  params.stripe_key_test_secret
            //  @param  params.stripe_key_test_publish
            this.start = function(params) {

                model_orig__app_common.set('ajax_url', params.ajax_url);

                model_orig__config.set({
                        'entity_name':              params['entity_name'],
                        'email_notifications':      params['email_notifications'],
                        'flag_enable_email_notifications':
                                                    params['flag_enable_email_notifications'],
                        'stripe_key_live_secret':   params['stripe_key_live_secret'],
                        'stripe_key_live_publish':  params['stripe_key_live_publish'],
                        'stripe_key_test_secret':   params['stripe_key_test_secret'],
                        'stripe_key_test_publish':  params['stripe_key_test_publish']
                    });

                $(document).ready(function() {

                        _processSpansWithRoles(params);

                    });
            };
        }

        var client = new RainbowPayPressAdminClient();
        return client;
    });


})(_plugin_RainbowPayPress__define, _plugin_RainbowPayPress__require);
