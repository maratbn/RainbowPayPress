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

function getTableName_Transactions() {
    global $wpdb;
    return $wpdb->prefix . 'plugin_stripe_payment_press_transactions';
}

function initializeTable_Transactions() {
    $strTableName = getTableName_Transactions();
    global $wpdb;
    $sql = "CREATE TABLE $strTableName (
            lid bigint(20) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
            created datetime NOT NULL,
            charged datetime,
            product_description varchar(1000) NOT NULL,
            product_cost int unsigned NOT NULL,
            currency varchar(20) NOT NULL,
            stripe_token_id varchar(100) NOT NULL,
            stripe_email varchar(200) NOT NULL,
            customer_name varchar(200) NOT NULL,
            customer_phone varchar(100) NOT NULL
        );";
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

function insertTransaction($strProductDescription,
                           $strProductCost,
                           $strStripeTokenId,
                           $strStripeEmail,
                           $strCustomerName,
                           $strCustomerPhone) {

    $ms = \time() * 1000 + \substr(\microtime(), 2, 3);
    $strTime = \gmdate('Y-m-d--H-i-s', $ms / 1000) . '--' . \sprintf('%03u', \bcmod($ms, 1000));

    global $wpdb;
    if (!$wpdb->insert(getTableName_Transactions(), [
                        'created'              => $strTime,
                        'product_description'  => $strProductDescription,
                        'product_cost'         => $strProductCost,
                        'currency'             => 'usd_x_100',
                        'stripe_token_id'      => $strStripeTokenId,
                        'stripe_email'         => $strStripeEmail,
                        'customer_name'        => $strCustomerName,
                        'customer_phone'       => $strCustomerPhone])) return false;

    return true;
}
?>
