<?php
/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        2.2.0-development_unreleased

  Module:         rainbowpaypress/RainbowPayPress_util.php

  Description:    PHP utility logic for the WordPress plugin
                  'RainbowPayPress'.

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

namespace plugin_RainbowPayPress;


function getDateTimeNow() {
    $ms = \time() * 1000 + \substr(\microtime(), 2, 3);
    return \gmdate('Y-m-d  H:i:s', $ms / 1000);
}

/**
 *  Returns unique version args to append to a resource URL to make
 *  that resource be unique in the browser cache.
 */
function getUVArg() {
    return 'uv=' . PLUGIN_VERSION . (IS_MODE_RELEASE ? "" : ('_' . time() . rand()));
}

class DBUtil {
    static function deleteTransaction($id) {
        global $wpdb;
        return $wpdb->delete(DBUtil::getTableName_Transactions(), ['id' => $id]);
    }

    static function getTableName_Transactions() {
        global $wpdb;
        return $wpdb->prefix . 'plugin_rainbow_pay_press_transactions';
    }

    static function initializeTable_Transactions() {
        $strTableName = DBUtil::getTableName_Transactions();
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
                customer_phone varchar(100) NOT NULL,
                stripe_customer_id varchar(100),
                stripe_charge_id varchar(100)
            );";
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    static function insertTransaction($strType,
                                      $strChargeDescription,
                                      $strProductCost,
                                      $strStripeTokenId,
                                      $strStripeEmail,
                                      $strCustomerName,
                                      $strCustomerPhone) {

        global $wpdb;
        if (!$wpdb->insert(DBUtil::getTableName_Transactions(), [
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

    static function selectTransaction($id) {
        $strTableName = DBUtil::getTableName_Transactions();

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

    static function selectTransactions() {
        $strTableName = DBUtil::getTableName_Transactions();

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
                                          customer_phone,
                                          stripe_customer_id,
                                          stripe_charge_id
                                     FROM $strTableName ORDER BY charged, created", ARRAY_A);
    }

    static function updateTransactionAsCharged($id, $stripe_customer_id, $stripe_charge_id) {

        $date_time = getDateTimeNow();

        global $wpdb;
        if(!$wpdb->update(DBUtil::getTableName_Transactions(),
                          ['charged'             => $date_time,
                           'stripe_customer_id'  => $stripe_customer_id,
                           'stripe_charge_id'    => $stripe_charge_id],
                          ['id' => $id])) return false;

        return $date_time;
    }
}

class FragmentUtil {
    static function renderAdmin_Configuration() {
    ?>
    <h2><?=\__('Configuration:', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS)?></h2>
    <span data-plugin-rainbow-pay-press-role='app-config'></span>
    <?php
    }

    static function renderAdmin_Root() {
        //  Based on http://codex.wordpress.org/Administration_Menus
        if (!\current_user_can('manage_options' ))  {
            \wp_die(\__('You do not have sufficient permissions to access this page.',
                        DOMAIN_PLUGIN_RAINBOW_PAY_PRESS));
        }
    ?>
    <div class="wrap">
      <?php
          FragmentUtil::renderAdmin_UsageInfo();
          FragmentUtil::renderAdmin_Configuration();
          FragmentUtil::renderAdmin_Transactions();
      ?>
    </div>
    <?php
    }

    static function renderAdmin_Transactions() {
    ?>
    <h2><?=\__('Pending Transactions:', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS)?></h2>
    <span data-plugin-rainbow-pay-press-role='transactions-pending'></span>
    <h2><?=\__('Charged Transactions:', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS)?></h2>
    <span data-plugin-rainbow-pay-press-role='transactions-charged'></span>
    <?php
    }

    static function renderAdmin_UsageInfo() {
    ?>
    <h2><?=\__('Usage Info:', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS)?></h2>
    <p>Use the shortcode
       <code>[<?=SHORTCODE__RAINBOW_PAY_PRESS?> type='<span style='color:red'>live</span>' amount=1234 name="My entity" desc="Buy this" label="Click to buy"]</code>
       to embed a Stripe payment widget on
       any page or post.
    </p>
    <p>
      <h5>Required shortcode attributes:</h5>
      <ul>
        <li>
          <code>amount</code>
          <p>The amount to charge in cents.</p>
        </li>
        <li>
          <code>name</code>
          <p>Your site / company / organization name.</p>
        </li>
        <li>
          <code>desc</code>
          <p>Description of the product / service / fee you're charging for.</p>
        </li>
      </ul>
      <h5>Optional shortcode attributes:</h5>
      <ul>
        <li>
          <code style='color:red'>type</code>
          <p>Stripe transaction type, either 'test' or 'live'.  Test by default.  Test
             transactions are for testing only, live transactions can be used to charge a real
             credit card.
             <b>This attribute is optional; however, if it is not explicitly set to
                <code style='color:red'>live</code>, then no real credit card can be charged.
             </b></p>
          <p>Credit card numbers that can be used in test mode are listed at:
            <a href='https://stripe.com/docs/testing#cards'
               target='_blank'>https://stripe.com/docs/testing#cards</a>.</p>
        </li>
        <li>
          <code>info</code>
          <p>Miscellaneous additional information for the user.</p>
        </li>
        <li>
          <code>label</code>
          <p>Stripe payment button label, otherwise defaults to "Pay with card" or similar.</p>
        </li>
      </ul>
    </p>
    <?php
    }

    static function renderJavaScriptRequireJSConfig() {
        $strUrlBase = \plugin_dir_url(__FILE__);
    ?>
    (function() {
        var strUrlRoot = '<?=$strUrlBase?>/js/le_requirejs/';

        _plugin_RainbowPayPress__requirejs.config({
                baseUrl: strUrlRoot,
                paths: {
                        'stripe_checkout': 'https://checkout.stripe.com/checkout.js?<?=\date('Y-m-d')?>',
                        'backbone': strUrlRoot
                                        + 'lib/backbone-1.2.1-src--tweaked--2016-03-18--01--require_js_namespaced--96823d9d2ce7d6fa095b5ad66040763fdbefbb20',
                        'jquery': strUrlRoot
                                        + 'lib/jquery-1.11.3--tweaked--2016-03-18--01--require_js_namespaced--086ae49754c1cf947313f980cceb37cf1bb50555',
                        'underscore': strUrlRoot
                                        + 'lib/underscore-1.8.3-src--tweaked--2016-03-18--01--require_js_namespaced--dbc6c74d82a3d827ceeab4d8ede133b375197411'
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
}

class Util {
    static function formatUSD($amountInCents) {
        $dollars  = \floor($amountInCents / 100);
        $cents    = $amountInCents % 100;

        return '$' . \number_format($dollars) . '.' . \str_pad($cents, 2, '0', \STR_PAD_LEFT);
    }

    static function getConfig() {
        return ['email_notifications'     => Util::getOption(SETTING__EMAIL_NOTIFICATIONS),
                'flag_enable_email_notifications'
                                          => Util::getFlagEnableEmailNotifications(),
                'stripe_key_live_secret'  => Util::getOption(SETTING__STRIPE_LIVE_SECRET_KEY),
                'stripe_key_live_publish' => Util::getOption(SETTING__STRIPE_LIVE_PUBLISH_KEY),
                'stripe_key_test_secret'  => Util::getOption(SETTING__STRIPE_TEST_SECRET_KEY),
                'stripe_key_test_publish' => Util::getOption(SETTING__STRIPE_TEST_PUBLISH_KEY)];
    }

    static function getFlagEnableEmailNotifications() {
        return (\get_option(SETTING__FLAG_ENABLE_EMAIL_NOTIFICATIONS) == 'true') ? true : false;
    }

    static function getOption($strName) {
        $valueRaw = \get_option($strName);
        if ($valueRaw === false) return null;
        return $valueRaw;
    }
}
?>
