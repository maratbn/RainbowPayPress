<?php
/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.0.1-development_unreleased

  Module:         StripePaymentPress_util.php

  Description:    PHP utility logic for the WordPress plugin
                  'StripePaymentPress'.

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

namespace plugin_Stripe_Payment_Press;

function getDateTimeNow() {
    $ms = \time() * 1000 + \substr(\microtime(), 2, 3);
    return \gmdate('Y-m-d--H-i-s', $ms / 1000) . '--' . \sprintf('%03u', \bcmod($ms, 1000));
}

function getTableName_Transactions() {
    global $wpdb;
    return $wpdb->prefix . 'plugin_stripe_payment_press_transactions';
}

/**
 *  Returns unique version args to append to a resource URL to make
 *  that resource be unique in the browser cache.
 */
function getUVArg() {
    return 'uv=' . PLUGIN_VERSION . (IS_MODE_RELEASE ? "" : ('_' . time() . rand()));
}

function initializeTable_Transactions() {
    $strTableName = getTableName_Transactions();
    global $wpdb;
    $sql = "CREATE TABLE $strTableName (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
            type varchar(20) NOT NULL,
            created datetime NOT NULL,
            charged datetime,
            charge_description varchar(1000) NOT NULL,
            charge_amount int unsigned NOT NULL,
            currency varchar(20) NOT NULL,
            stripe_token_id varchar(100) NOT NULL,
            stripe_email varchar(200) NOT NULL,
            customer_name varchar(200) NOT NULL,
            customer_phone varchar(100) NOT NULL
        );";
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

function insertTransaction($strType,
                           $strChargeDescription,
                           $strProductCost,
                           $strStripeTokenId,
                           $strStripeEmail,
                           $strCustomerName,
                           $strCustomerPhone) {

    global $wpdb;
    if (!$wpdb->insert(getTableName_Transactions(), [
                        'type'                 => $strType,
                        'created'              => getDateTimeNow(),
                        'charge_description'   => $strChargeDescription,
                        'charge_amount'        => $strProductCost,
                        'currency'             => 'usd_x_100',
                        'stripe_token_id'      => $strStripeTokenId,
                        'stripe_email'         => $strStripeEmail,
                        'customer_name'        => $strCustomerName,
                        'customer_phone'       => $strCustomerPhone])) return false;

    return true;
}

function renderJavaScriptRequireJSConfig() {
    $strUrlBase = \plugin_dir_url(__FILE__);
?>
(function() {
    var strUrlRoot = '<?=$strUrlBase?>/js/le_requirejs/';

    _plugin_StripePaymentPress__requirejs.config({
            baseUrl: strUrlRoot,
            paths: {
                    'backbone': strUrlRoot
                                    + 'lib/backbone-1.2.1-src--tweaked--2015-09-24--01--require_js_namespaced--5decf311fc2fa509f63fda82e4bc2e465aeb5545',
                    'jquery': strUrlRoot
                                    + 'lib/jquery-1.11.3--tweaked--namespaced_require_js--fe365e109bd7110d25323a66d36fa9c5f75f322f',
                    'underscore': strUrlRoot
                                    + 'lib/underscore-1.8.3-src--tweaked--namespaced_require_js--890bb70cc43f37e243e0759c12575ac9ed6f431c'
                },
            map: {
                    '*': {
                            'backbone': 'backbone-private',
                            'jquery': 'jquery-private',
                            'underscore': 'underscore-private'
                        },
                    'backbone-private': {
                            'backbone': 'backbone'
                        },
                    'jquery-private': {
                            'jquery': 'jquery'
                        },
                    'underscore-private': {
                            'underscore': 'underscore'
                        }
                },
            urlArgs: '<?=getUVArg()?>'
        });
})();
<?php
}

function deleteTransaction($id) {
    global $wpdb;
    return $wpdb->delete(getTableName_Transactions(), ['id' => $id]);
}

function selectTransaction($id) {
    $strTableName = getTableName_Transactions();

    global $wpdb;
    $arrTransaction = $wpdb->get_results($wpdb->prepare("SELECT id,
                                                                type,
                                                                created,
                                                                charged,
                                                                charge_description,
                                                                charge_amount,
                                                                stripe_token_id,
                                                                stripe_email,
                                                                customer_name,
                                                                customer_phone
                                                           FROM $strTableName
                                                          WHERE id=%d",
                                                        $id),
                                         ARRAY_A);
    if (!$arrTransaction || count($arrTransaction) == 0) return false;

    return $arrTransaction[0];
}

function selectTransactions() {
    $strTableName = getTableName_Transactions();

    global $wpdb;
    return $wpdb->get_results("SELECT id,
                                      type,
                                      created,
                                      charged,
                                      charge_description,
                                      charge_amount,
                                      stripe_token_id,
                                      stripe_email,
                                      customer_name,
                                      customer_phone
                                 FROM $strTableName", ARRAY_A);
}

function updateTransactionAsCharged($id) {

    $date_time = getDateTimeNow();

    global $wpdb;
    if(!$wpdb->update(getTableName_Transactions(),
                      ['charged' => $date_time],
                      ['id' => $id])) return false;

    return $date_time;
}
?>
