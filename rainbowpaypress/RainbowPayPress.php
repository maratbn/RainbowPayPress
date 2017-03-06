<?php
/*
  Plugin Name: RainbowPayPress
  Description: Easy way to accept credit card payments via Stripe by embedding Stripe checkouts via shortcodes.
  Author: Marat Nepomnyashy
  Author URI: http://www.maratbn.com
  License: GPL3
  Version: 3.2.0-development_unreleased
  Text Domain: domain-plugin-RainbowPayPress
*/

/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/RainbowPayPress.php

  Description:    Main PHP file for the WordPress plugin 'RainbowPayPress'.

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

    const PLUGIN_VERSION = '3.2.0-development_unreleased';


    const IS_MODE_RELEASE = false;


    const PHP_VERSION_MIN_SUPPORTED = '5.4';

    const DOMAIN_PLUGIN_RAINBOW_PAY_PRESS = 'domain-plugin-RainbowPayPress';

    const SETTING__ENTITY_NAME           = 'plugin_RainbowPayPress__setting__entity_name';
    const SETTING__EMAIL_NOTIFICATIONS   = 'plugin_RainbowPayPress__setting__email_notifications';
    const SETTING__FLAG_ENABLE_EMAIL_NOTIFICATIONS
                            = 'plugin_RainbowPayPress__setting__flag__enable_email_notifications';
    const SETTING__STRIPE_LIVE_PUBLISH_KEY
                                     = 'plugin_RainbowPayPress__setting__stripe_live_publish_key';
    const SETTING__STRIPE_LIVE_SECRET_KEY
                                      = 'plugin_RainbowPayPress__setting__stripe_live_secret_key';
    const SETTING__STRIPE_TEST_PUBLISH_KEY
                                     = 'plugin_RainbowPayPress__setting__stripe_test_publish_key';
    const SETTING__STRIPE_TEST_SECRET_KEY
                                      = 'plugin_RainbowPayPress__setting__stripe_test_secret_key';

    const SHORTCODE__RAINBOW_PAY_PRESS = 'rainbow-pay-press';

    const SLUG_INFO_ROOT     = 'plugin_RainbowPayPress_root';
    const SLUG_ITEMS         = 'plugin_RainbowPayPress_items';
    const SLUG_SETTINGS      = 'plugin_RainbowPayPress_settings';
    const SLUG_TRANSACTIONS  = 'plugin_RainbowPayPress_transactions';

    require_once('RainbowPayPress_util.php');


    \add_action('wp_ajax_nopriv_rainbow_pay_press__submit',
                '\\plugin_RainbowPayPress\\action_wp_ajax_rainbow_pay_press__submit');
    \add_action('wp_enqueue_scripts', '\\plugin_RainbowPayPress\\action_wp_enqueue_scripts');
    \add_action('wp_print_footer_scripts',
                '\\plugin_RainbowPayPress\\action_wp_print_footer_scripts');


    \add_shortcode(SHORTCODE__RAINBOW_PAY_PRESS,
                   '\\plugin_RainbowPayPress\\shortcode_rainbow_pay_press');


    if (\is_admin()) {
        \register_activation_hook(__FILE__, '\\plugin_RainbowPayPress\\plugin_activation_hook');

        \add_action(
            'admin_enqueue_scripts',
            '\\plugin_RainbowPayPress\\action_admin_enqueue_scripts');
        \add_action(
            'admin_menu',
            '\\plugin_RainbowPayPress\\action_admin_menu');
        \add_action(
            'admin_notices',
            '\\plugin_RainbowPayPress\\action_admin_notices');
        \add_action(
            'admin_print_footer_scripts',
            '\\plugin_RainbowPayPress\\action_admin_print_footer_scripts');
        \add_action(
            'wp_ajax_rainbow_pay_press__admin__add_item',
            '\\plugin_RainbowPayPress\\action_wp_ajax_rainbow_pay_press__admin__add_item');
        \add_action(
            'wp_ajax_rainbow_pay_press__admin__charge',
            '\\plugin_RainbowPayPress\\action_wp_ajax_rainbow_pay_press__admin__charge');
        \add_action(
            'wp_ajax_rainbow_pay_press__admin__delete_item',
            '\\plugin_RainbowPayPress\\action_wp_ajax_rainbow_pay_press__admin__delete_item');
        \add_action(
            'wp_ajax_rainbow_pay_press__admin__delete_transaction',
            '\\plugin_RainbowPayPress\\action_wp_ajax_rainbow_pay_press__admin__delete_transaction');
        \add_action(
            'wp_ajax_rainbow_pay_press__admin__get_config',
            '\\plugin_RainbowPayPress\\action_wp_ajax_rainbow_pay_press__admin__get_config');
        \add_action(
            'wp_ajax_rainbow_pay_press__admin__get_items',
            '\\plugin_RainbowPayPress\\action_wp_ajax_rainbow_pay_press__admin__get_items');
        \add_action(
            'wp_ajax_rainbow_pay_press__admin__get_transactions',
            '\\plugin_RainbowPayPress\\action_wp_ajax_rainbow_pay_press__admin__get_transactions');
        \add_action(
            'wp_ajax_rainbow_pay_press__admin__modify_item',
            '\\plugin_RainbowPayPress\\action_wp_ajax_rainbow_pay_press__admin__modify_item');
        \add_action(
            'wp_ajax_rainbow_pay_press__admin__send_test_email',
            '\\plugin_RainbowPayPress\\action_wp_ajax_rainbow_pay_press__admin__send_test_email');
        \add_action(
            'wp_ajax_rainbow_pay_press__admin__update_config',
            '\\plugin_RainbowPayPress\\action_wp_ajax_rainbow_pay_press__admin__update_config');
        \add_action(
            'wp_ajax_rainbow_pay_press__submit',
            '\\plugin_RainbowPayPress\\action_wp_ajax_rainbow_pay_press__submit');

        \add_filter('plugin_action_links_' . \plugin_basename(__FILE__),
                    '\\plugin_RainbowPayPress\\filter_plugin_action_links');
    }


    function action_admin_enqueue_scripts($hook) {
        if (($hook != 'toplevel_page_' . SLUG_INFO_ROOT) &&
            ($hook != 'rainbowpaypress_page_' . SLUG_ITEMS) &&
            ($hook != 'rainbowpaypress_page_' . SLUG_TRANSACTIONS) &&
            ($hook != 'rainbowpaypress_page_' . SLUG_SETTINGS)) return;

        \wp_enqueue_style('plugin__RainbowPayPress__style_css',
                          \plugin_dir_url(__FILE__) . '/style.css',
                          null,
                          getUVArg());

        \wp_enqueue_script(
            'plugin__RainbowPayPress__requirejs',
            \plugin_dir_url(__FILE__) . (
                IS_MODE_RELEASE
                ? 'js/lib/require_js-2.1.20-src--tweaked--2016-03-18--01--namespaced--plugin_RainbowPayPress--8e39eca3d1a77552f8d1b2daf78fe382a3aa3ab3.min.js'
                : 'js/lib/require_js-2.1.20-src--tweaked--2016-03-18--01--namespaced--plugin_RainbowPayPress--8e39eca3d1a77552f8d1b2daf78fe382a3aa3ab3.js'),
            null,
            '2015-09-25--1',
            false);
    }

    function action_admin_menu() {
        \add_menu_page(
            \__('RainbowPayPress Help / Info / Settings', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
            \__('RainbowPayPress', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
            'manage_options',
            SLUG_INFO_ROOT);

        \add_submenu_page(
            SLUG_INFO_ROOT,
            \__('RainbowPayPress Help', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
            \__('Help', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
            'manage_options',
            SLUG_INFO_ROOT,
            '\\plugin_RainbowPayPress\\FragmentUtil::renderAdmin_Help');

        \add_submenu_page(
            SLUG_INFO_ROOT,
            \__('RainbowPayPress Items', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
            \__('Items', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
            'manage_options',
            SLUG_ITEMS,
            '\\plugin_RainbowPayPress\\FragmentUtil::renderAdmin_Items');

        \add_submenu_page(
            SLUG_INFO_ROOT,
            \__('RainbowPayPress Transactions', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
            \__('Transactions', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
            'manage_options',
            SLUG_TRANSACTIONS,
            '\\plugin_RainbowPayPress\\FragmentUtil::renderAdmin_Transactions');

        \add_submenu_page(
            SLUG_INFO_ROOT,
            \__('RainbowPayPress Settings', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
            \__('Settings', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
            'manage_options',
            SLUG_SETTINGS,
            '\\plugin_RainbowPayPress\\FragmentUtil::renderAdmin_Configuration');
    }

    function action_admin_notices() {
        $wp_screen = \get_current_screen();
        if (!$wp_screen || $wp_screen->parent_base != SLUG_INFO_ROOT) return;

        $_renderWarning = function($strWarning) {
                ?><div class='notice notice-warning is-dismissible'><?php
                  ?><p><?=\__('RainbowPayPress warning:', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS)
                        ?>  <?=$strWarning?></p></div><?php
            };

        if (!Util::isCurlAvailable()) {
            $_renderWarning(
                \sprintf(
                    \__('Your PHP environment is lacking cURL support, without which it cannot communicate with the Stripe servers.  This will prevent you from charging your transactions with RainbowPayPress, for which you would need to enable PHP cURL support on your server.  If your server is running Debian or Ubuntu, this can be done by installing the package \'%s\'.',
                        DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                    'php-curl'));
        }

        if (!Util::isMbStringAvailable()) {
            $_renderWarning(
                \sprintf(
                    \__('Your PHP environment is lacking multibyte string support, without which it cannot communicate with the Stripe servers.  This will prevent you from charging your transactions with RainbowPayPress, for which you would need to enable PHP multibyte support on your server.  If your server is running Debian or Ubuntu, this can be done by installing the package \'%s\'.',
                        DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                    'php-mbstring'));
        }

        if (Util::getOption(SETTING__ENTITY_NAME) == null) {
            $_renderWarning(
                \sprintf(
                    \__('Your %s is not configured, and this will prevent the RainbowPayPress shortcodes from working.  You can configure it on the %s.',
                        DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                    '<b>' . \__('site / company / organization name',
                                DOMAIN_PLUGIN_RAINBOW_PAY_PRESS) . '</b>',
                    '<a href=\''
                            . \admin_url('admin.php?page=' . SLUG_SETTINGS)
                        . '\'>' . \__('settings page', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS) . '</a>'));
        }
    }

    function action_admin_print_footer_scripts() {

        if (!\wp_script_is('plugin__RainbowPayPress__requirejs')) return;

        $strUrlBase = \plugin_dir_url(__FILE__);
    ?>
    <script type='text/javascript'>
        <?php FragmentUtil::renderJavaScriptRequireJSConfig() ?>

        _plugin_RainbowPayPress__requirejs([
                'backbone',
                'main'
            ], function(backbone, main) {

                backbone.history.start();

                main.startAdmin(<?=\json_encode(
                                        \array_merge(['ajax_url' => \admin_url('admin-ajax.php')],
                                                     Util::getConfig()))?>);
            });
    </script>
    <?php
    }

    function action_wp_ajax_rainbow_pay_press__admin__add_item() {
        /** Possible errors:
         *      error__insufficient_permissions
         *      error__duplicate_handle
         *      error__add_item
        **/

        $arrErrors = [];

        if (!\current_user_can('manage_options')) {
            \array_push($arrErrors, 'error__insufficient_permissions');
        }

        $objItemAdded = null;

        if (\count($arrErrors) == 0) {
            $arrDataDecoded  = \json_decode(\urldecode($_POST['data']), true);

            $strHandle       = $arrDataDecoded['handle'];
            $strDescription  = $arrDataDecoded['description'];
            $strCost         = $arrDataDecoded['cost'];

            if ($strHandle != null && DBUtil::tbl__items__selectSpecificForHandle($strHandle)) {
                \array_push($arrErrors, 'error__duplicate_handle');
            } else {
                $objItemAdded = DBUtil::tbl__items__add($strHandle,
                                                        $strDescription,
                                                        $strCost);
                if (!$objItemAdded) {
                    \array_push($arrErrors, 'error__add_item');
                }
            }
        }

        die(json_encode(['item'     => Util::translateItem($objItemAdded),
                         'success'  => (\count($arrErrors) == 0),
                         'errors'   => $arrErrors]));
    }

    function action_wp_ajax_rainbow_pay_press__admin__charge() {
        /** Possible errors:
         *      error__insufficient_permissions
         *      error__no_curl
         *      error__select_transaction
         *      error__create_stripe_customer
         *      error__create_stripe_charge
         *      error__update_transaction
         *      error__stripe_exception
         *      error__stripe_invalid_argument_exception
         **/

        $arrErrors = [];

        if (!\current_user_can('manage_options')) {
            \array_push($arrErrors, 'error__insufficient_permissions');
        }

        if (!Util::isCurlAvailable()) {
            \array_push($arrErrors, 'error__no_curl');
        }

        $dataTransaction = null;

        if (\count($arrErrors) == 0) {
            $id = $_POST['id'];
            $dataTransaction = DBUtil::tbl__transactions__selectSpecific($id);
            if (!$dataTransaction) {
                \array_push($arrErrors, 'error__select_transaction');
            }
        }

        $stripe = null;

        if (\count($arrErrors) == 0) {

            //  Based on:   https://stripe.com/docs/checkout/guides/php

            require_once(dirname(__FILE__) .
                               '/stripe-php-3.4.0--tweaked--2016-03-18--01--namespaced/init.php');

            $type = $dataTransaction['type'];

            if ($type == 'live') {
                $stripe = array(
                      "secret_key"       => \get_option(SETTING__STRIPE_LIVE_SECRET_KEY),
                      "publishable_key"  => \get_option(SETTING__STRIPE_LIVE_PUBLISH_KEY)
                    );
            } else if ($type == 'test') {
                $stripe = array(
                      "secret_key"       => \get_option(SETTING__STRIPE_TEST_SECRET_KEY),
                      "publishable_key"  => \get_option(SETTING__STRIPE_TEST_PUBLISH_KEY)
                    );
            }

            if (type == null) {
                \array_push($arrErrors, 'error_invalid_transaction_type');
            }
        }

        $dataRet = [];

        if (\count($arrErrors) == 0) {
            \plugin_RainbowPayPress\Stripe\Stripe::setApiKey($stripe['secret_key']);

            try {
                $customer = \plugin_RainbowPayPress\Stripe\Customer::create(array(
                        'email'        => $dataTransaction['stripe_email'],
                        'source'       => $dataTransaction['stripe_token_id'],
                        'description'  => 'Name: ' . $dataTransaction['customer_name'] . ' -- ' .
                                          'Phone: ' . $dataTransaction['customer_phone']
                    ));

                if (!$customer) {
                    \array_push($arrErrors, 'error__create_stripe_customer');
                } else {
                    $dataRet['stripe_customer_id'] = $customer->id;
                    $charge = \plugin_RainbowPayPress\Stripe\Charge::create(array(
                            'customer'  => $customer->id,
                            'amount'    => $dataTransaction['charge_amount'],
                            'currency'  => 'usd',
                            'metadata'  => array('charge_desc' => $dataTransaction
                                                                           ['charge_description'])
                        ));
                    if (!$charge) {
                        \array_push($arrErrors, 'error__create_stripe_charge');
                    } else {
                        $dataRet['stripe_charge_id'] = $charge->id;
                        $charged = DBUtil::tbl__transactions__update__charged($id,
                                                                              $customer->id,
                                                                              $charge->id);
                        if ($charged == null) {
                            \array_push($arrErrors, 'error__update_transaction');
                        } else {
                            $dataRet['charged'] = $charged;
                        }
                    }
                }
            } catch (plugin_RainbowPayPress\Stripe\Error\InvalidArgumentException
                                                                    $invalid_argument_exception) {
                \array_push($arrErrors, 'error__stripe_invalid_argument_exception');
                $dataRet['stripe_error_message'] = $invalid_argument_exception->getMessage();
            } catch (\Exception $exception) {
                \array_push($arrErrors, 'error__stripe_exception');
                $dataRet['stripe_error_message'] = $exception->getMessage();
            }
        }

        $flagSuccess = (\count($arrErrors) == 0);

        $dataRet['success']  = $flagSuccess;
        $dataRet['errors']   = $arrErrors;

        die(json_encode($dataRet));
    }

    function action_wp_ajax_rainbow_pay_press__admin__delete_item() {
        /** Possible errors:
         *      error__insufficient_permissions
         *      error__delete_item
        **/

        $arrErrors = [];

        if (!\current_user_can('manage_options')) {
            \array_push($arrErrors, 'error__insufficient_permissions');
        }

        if (\count($arrErrors) == 0) {
            $id = $_POST['id'];
            if (!DBUtil::tbl__items__delete($id)) {
                \array_push($arrErrors, 'error__delete_item');
            }
        }

        die(json_encode(['success' => (\count($arrErrors) == 0),
                         'errors' => $arrErrors]));
    }

    function action_wp_ajax_rainbow_pay_press__admin__delete_transaction() {
        /** Possible errors:
         *      error__insufficient_permissions
         *      error__delete_transaction
         **/

        $arrErrors = [];

        if (!\current_user_can('manage_options')) {
            \array_push($arrErrors, 'error__insufficient_permissions');
        }

        if (\count($arrErrors) == 0) {
            $id = $_POST['id'];
            if (!DBUtil::tbl__transactions__delete($id)) {
                \array_push($arrErrors, 'error__delete_transaction');
            }
        }

        die(json_encode(['success' => (\count($arrErrors) == 0),
                         'errors' => $arrErrors]));
    }

    function action_wp_ajax_rainbow_pay_press__admin__get_config() {
        /** Possible errors:
         *      error__insufficient_permissions
         */

        $arrErrors = [];

        if (!\current_user_can('manage_options')) {
            \array_push($arrErrors, 'error__insufficient_permissions');
        }

        $objRet = ['errors'   => $arrErrors,
                   'success'  => (\count($arrErrors) == 0)];

        if (\count($arrErrors) == 0) {
            $objRet['config'] = Util::getConfig();
        }

        die(\json_encode($objRet));
    }

    function action_wp_ajax_rainbow_pay_press__admin__get_items() {
        /** Possible errors:
         *      error__insufficient_permissions
         *      error__select_items
        **/

        $arrErrors = [];

        if (!\current_user_can('manage_options')) {
            \array_push($arrErrors, 'error__insufficient_permissions');
        }

        $arrItems = null;
        if (\count($arrErrors) == 0) {
            $arrItems = DBUtil::tbl__items__selectAll();
            if (!$arrItems) {
                \array_push($arrErrors, 'error__select_items');
            }
        }

        die(\json_encode(['success'       => (\count($arrErrors) == 0),
                          'errors'        => $arrErrors,
                          'items'         => Util::translateItems($arrItems)]));
    }

    function action_wp_ajax_rainbow_pay_press__admin__get_transactions() {
        /** Possible errors:
         *      error__insufficient_permissions
         *      error__select_transactions
         **/

        $arrErrors = [];

        if (!\current_user_can('manage_options')) {
            \array_push($arrErrors, 'error__insufficient_permissions');
        }

        $arrTransactions = null;
        if (\count($arrErrors) == 0) {
            $arrTransactions = DBUtil::tbl__transactions__selectAll();
            if (!$arrTransactions) {
                \array_push($arrErrors, 'error__select_transactions');
            }
        }

        die(\json_encode(['success'       => (\count($arrErrors) == 0),
                          'errors'        => $arrErrors,
                          'transactions'  => $arrTransactions]));
    }

    function action_wp_ajax_rainbow_pay_press__admin__modify_item() {
        /** Possible errors:
         *      error__insufficient_permissions
         *      error__duplicate_handle
         *      error__update_item
         **/

        $arrErrors = [];

        if (!\current_user_can('manage_options')) {
            \array_push($arrErrors, 'error__insufficient_permissions');
        }

        $item = null;

        if (\count($arrErrors) == 0) {
            $id              =  $_POST['id'];
            $arrDataDecoded  = \json_decode(\urldecode($_POST['data']), true);
            $handle          = getKeyValue($arrDataDecoded, 'handle');

            if ($handle != null && DBUtil::tbl__items__selectSpecificForHandle($handle)) {
                \array_push($arrErrors, 'error__duplicate_handle');
            } else if (!DBUtil::tbl__items__update($id, $arrDataDecoded)) {
                \array_push($arrErrors, 'error__update_item');
            } else {
                $item = DBUtil::tbl__items__selectSpecific($id);
            }
        }

        die(\json_encode(['success'  => (\count($arrErrors) == 0),
                          'errors'   => $arrErrors,
                          'item'     => Util::translateItem($item)]));
    }

    function action_wp_ajax_rainbow_pay_press__admin__send_test_email() {
        /** Possible errors:
         *      error__insufficient_permissions
         *      error__no_recipient
         *      error__wp_mail
         **/

        $arrErrors = [];

        if (!\current_user_can('manage_options')) {
            \array_push($arrErrors, 'error__insufficient_permissions');
        }

        if (\count($arrErrors) == 0) {
            $strRecipient  = \get_option(SETTING__EMAIL_NOTIFICATIONS);
            $strSiteURL    = \get_site_url();

            if (\strlen($strRecipient) > 0) {
                if (!\wp_mail(
                        $strRecipient,
                        \__('RainbowPayPress test email from: ' . $strSiteURL,
                            DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                        \implode([
                                \sprintf(
                                    \__('This is a test email.'),
                                        DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                                "\r\n\r\n",
                                \sprintf(
                                    \__('This address is configured to receive notifications from the RainbowPayPress plugin installed onto the WordPress website at: %s',
                                        DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                                    $strSiteURL),
                                "\r\n\r\n",
                                \sprintf(
                                    \__('The configuration settings for these notifications can be modified at: %s',
                                        DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                                    \admin_url('admin.php?page=' . SLUG_SETTINGS))
                            ])
                    )) {
                    \array_push($arrErrors, 'error__wp_mail');
                }
            } else {
                \array_push($arrErrors, 'error__no_recipient');
            }
        }

        die(\json_encode(['success'       => (\count($arrErrors) == 0),
                          'errors'        => $arrErrors]));
    }

    function action_wp_ajax_rainbow_pay_press__admin__update_config() {
        /** Possible errors:
         *      error__insufficient_permissions
         *      error__wp__update_option
         */

        $arrErrors = [];

        if (!\current_user_can('manage_options')) {
            \array_push($arrErrors, 'error__insufficient_permissions');
        }

        if (\count($arrErrors) == 0) {
            $objConfig = $_POST['config'];

            $_updateConfigFieldIfNecessary = function($strOption, $strField) use ($objConfig) {
                    if (\array_key_exists($strField, $objConfig)) {
                        \update_option($strOption,
                                       $objConfig[$strField]);
                    }
                };

            $_updateConfigFieldIfNecessary(SETTING__ENTITY_NAME,
                                           'entity_name');
            $_updateConfigFieldIfNecessary(SETTING__EMAIL_NOTIFICATIONS,
                                           'email_notifications');
            $_updateConfigFieldIfNecessary(SETTING__FLAG_ENABLE_EMAIL_NOTIFICATIONS,
                                           'flag_enable_email_notifications');
            $_updateConfigFieldIfNecessary(SETTING__STRIPE_LIVE_SECRET_KEY,
                                           'stripe_key_live_secret');
            $_updateConfigFieldIfNecessary(SETTING__STRIPE_LIVE_PUBLISH_KEY,
                                           'stripe_key_live_publish');
            $_updateConfigFieldIfNecessary(SETTING__STRIPE_TEST_SECRET_KEY,
                                           'stripe_key_test_secret');
            $_updateConfigFieldIfNecessary(SETTING__STRIPE_TEST_PUBLISH_KEY,
                                           'stripe_key_test_publish');
        }

        $objRet = ['errors'   => $arrErrors,
                   'success'  => (\count($arrErrors) == 0)];

        if (\count($arrErrors) == 0) {
            $objRet['config'] = Util::getConfig();
        }

        die(\json_encode($objRet));
    }

    function action_wp_ajax_rainbow_pay_press__submit() {
        /** Possible errors:
         *      error__item_not_found
         *      error__item_disallowed
         *      error__insert_transaction
         *      error__select_transaction
         **/

        $arrErrors = [];

        $arrDataDecoded         = \json_decode(\urldecode($_POST['data']), true);

        $strHandle              = $arrDataDecoded['handle'];

        $objItem = DBUtil::tbl__items__selectSpecificForHandle($strHandle);

        $strDisallowedReason = null;

        if ($objItem) {
            if ($objItem['is_disallowed']) {
                \array_push($arrErrors, 'error__item_disallowed');
                $strDisallowedReason = $objItem['disallowed_reason'];
            }
        } else {
            \array_push($arrErrors, 'error__item_not_found');
        }

        $objTransaction = null;

        if (\count($arrErrors) == 0) {

            $idTransaction = DBUtil::tbl__transactions__insert(
                                                            $arrDataDecoded['type'],
                                                            $objItem['description'],
                                                            $objItem['cost'],
                                                            $arrDataDecoded['stripe_token_id'],
                                                            $arrDataDecoded['stripe_email'],
                                                            $arrDataDecoded['customer_name'],
                                                            $arrDataDecoded['customer_phone'],
                                                            $arrDataDecoded['shipping_address']);

            if ($idTransaction === false) {
                \array_push($arrErrors, 'error__insert_transaction');
            } else {
                $objTransaction = DBUtil::tbl__transactions__selectSpecific($idTransaction);
                if (!$objTransaction) {
                    \array_push($arrErrors, 'error__select_transaction');
                } else if (Util::getFlagEnableEmailNotifications()) {

                    $strRecipient = \get_option(SETTING__EMAIL_NOTIFICATIONS);

                    if (\strlen($strRecipient) > 0) {

                        $strSiteURL          = \get_site_url();
                        $strSubmissionTime   = $objTransaction['created'];
                        $strShippingAddress  = $objTransaction['shipping_address'];

                        \wp_mail(
                            $strRecipient,
                            \__('RainbowPayPress new pending transaction submitted at: '
                                                                                    . $strSiteURL,
                                DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                            \implode([
                                    \sprintf(
                                        \__('New pending transaction has been submitted via the RainbowPayPress plugin installed onto the WordPress website at: %s',
                                            DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                                        $strSiteURL),
                                    "\r\n\r\n",
                                    \sprintf(
                                        \__('Submission timestamp: %s',
                                            DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                                        $strSubmissionTime ? ($strSubmissionTime .
                                                              ' ' .
                                                              \__('UTC',
                                                                  DOMAIN_PLUGIN_RAINBOW_PAY_PRESS))
                                                           : 'unknown'),
                                    "\r\n\r\n",
                                    \sprintf(
                                        \__('Stripe transaction type: %s',
                                            DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                                        $objTransaction['type']),
                                    "\r\n\r\n",
                                    \sprintf(
                                        \__('Charge: %s',
                                            DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                                        \implode([$objTransaction['charge_description'],
                                                  ' -- ',
                                                  Util::formatUSD(
                                                             $objTransaction['charge_amount'])])),
                                    "\r\n\r\n",
                                    \sprintf(
                                        \__('Customer: %s',
                                            DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                                        \implode([$objTransaction['stripe_email'],
                                                  ' -- ',
                                                  $objTransaction['customer_name'],
                                                  ' -- ',
                                                  $objTransaction['customer_phone'],
                                                  ($strShippingAddress != ""
                                                                        ? (' -- ' .
                                                                              $strShippingAddress)
                                                                        : "")])),
                                    "\r\n\r\n",
                                    \sprintf(
                                        \__('View / charge / delete this transaction at: %s',
                                            DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                                        \admin_url('admin.php?page=' . SLUG_TRANSACTIONS))
                                ]));
                    }
                }
            }
        }

        die(json_encode(['transaction'        => $objTransaction
                                               ? ['created' => $objTransaction['created']]
                                               : null,
                         'success'            => (\count($arrErrors) == 0),
                         'errors'             => $arrErrors,
                         'disallowed_reason'  => $strDisallowedReason]));
    }

    function action_wp_enqueue_scripts() {

        global $post;
        $strContent = $post->post_content;
        if (!\has_shortcode($strContent, SHORTCODE__RAINBOW_PAY_PRESS)) return;


        \wp_enqueue_style('plugin__RainbowPayPress__style_css',
                          \plugin_dir_url(__FILE__) . '/style.css',
                          null,
                          getUVArg());

        \wp_enqueue_script(
            'plugin__RainbowPayPress__requirejs',
            plugin_dir_url(__FILE__) . (
                IS_MODE_RELEASE
                ? 'js/lib/require_js-2.1.20-src--tweaked--2016-03-18--01--namespaced--plugin_RainbowPayPress--8e39eca3d1a77552f8d1b2daf78fe382a3aa3ab3.min.js'
                : 'js/lib/require_js-2.1.20-src--tweaked--2016-03-18--01--namespaced--plugin_RainbowPayPress--8e39eca3d1a77552f8d1b2daf78fe382a3aa3ab3.js'),
            null,
            '2015-09-25--1',
            false);
    }

    function action_wp_print_footer_scripts() {

        if (!\wp_script_is('plugin__RainbowPayPress__requirejs')) return;

        $strUrlBase = \plugin_dir_url(__FILE__);
    ?>
    <script type='text/javascript'>
        <?php FragmentUtil::renderJavaScriptRequireJSConfig() ?>

        _plugin_RainbowPayPress__requirejs([
                'backbone',
                'main'
            ], function(backbone, main) {

                backbone.history.start();

                main.startPublic({
                        'ajax_url':          '<?=\admin_url('admin-ajax.php')?>',
                        'publish_key_live':  '<?=\esc_attr(
                                                    \get_option(
                                                            SETTING__STRIPE_LIVE_PUBLISH_KEY))?>',
                        'publish_key_test':  '<?=\esc_attr(
                                                     \get_option(
                                                            SETTING__STRIPE_TEST_PUBLISH_KEY))?>'
                    });
            });
    </script>
    <?php
    }

    function filter_plugin_action_links($arrLinks) {
        \array_push($arrLinks,
                    '<a href=\'' . \admin_url('admin.php?page=' . SLUG_INFO_ROOT) . '\'>'
                              . \__('Help', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS) . '</a>');
        \array_push($arrLinks,
                    '<a href=\'' . \plugin_dir_url(__FILE__) . 'LICENSE\'>'
                              . \__('License', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS) . '</a>');
        return $arrLinks;
    }

    function plugin_activation_hook() {

        if (\version_compare(\strtolower(\PHP_VERSION), PHP_VERSION_MIN_SUPPORTED, '<')) {
            \wp_die(
                \sprintf(
                    \__('RainbowPayPress plugin cannot be activated because the currently active PHP version on this server is %s < %s and not supported.  PHP version >= %s is required.',
                        DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                    \PHP_VERSION,
                    PHP_VERSION_MIN_SUPPORTED,
                    PHP_VERSION_MIN_SUPPORTED));
        }

        DBUtil::tbl__items__init();
        DBUtil::tbl__transactions__init();
    }

    function shortcode_rainbow_pay_press($atts) {

        $strEntityName = Util::getOption(SETTING__ENTITY_NAME);
        if ($strEntityName == null) {
            return '<b><i>' .
                   \sprintf(
                       \__('Short-code [%s] cannot be fully processed because entity name not configured.',
                           DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                       SHORTCODE__RAINBOW_PAY_PRESS) .
                   '</i></b>';
        }

        $strItemHandle = $atts ? $atts['item'] : null;
        if ($strItemHandle == null) {
            return '<b><i>' .
                   \sprintf(
                       \__('Short-code [%s] cannot be fully processed because required parameter "%s" is not included.',
                           DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                       SHORTCODE__RAINBOW_PAY_PRESS,
                       'item') .
                   '</i></b>';
        }

        $objItem = DBUtil::tbl__items__selectSpecificForHandle($strItemHandle);
        if (!$objItem) {
            return '<b><i>' .
                   \sprintf(
                       \__('Short-code [%s] cannot be fully processed because no item with the specified handle "%s" was found.',
                           DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                       SHORTCODE__RAINBOW_PAY_PRESS,
                       $strItemHandle) .
                   '</i></b>';
        }

        return '<span data-plugin-rainbow-pay-press-role="root"' .
                    ($atts['type'] == null ? "" :
                    ' data-plugin-rainbow-pay-press-type="' . \esc_attr($atts['type']) .
                                                        '"') .
                    ' data-plugin-rainbow-pay-press-amount="' . \esc_attr($objItem['cost']) .
                                                          '"' .
                    ' data-plugin-rainbow-pay-press-name="' . \esc_attr($strEntityName) .
                                                        '"' .
                    ' data-plugin-rainbow-pay-press-desc="' . \esc_attr($objItem['description']) .
                                                        '"' .
                    ' data-plugin-rainbow-pay-press-handle="' . \esc_attr($strItemHandle) .
                                                          '"' .

                    ($atts['override_fields'] == null ? "" :
                    ' data-plugin-rainbow-pay-press-fields="' . \esc_attr($atts
                                                                            ['override_fields']) .
                                                         '"') .

                    ($atts['info'] == null ? "" :
                    ' data-plugin-rainbow-pay-press-info="' . \esc_attr($atts['info']) .
                                                        '"') .

                    ($atts['label'] == null ? "" :
                    ' data-plugin-rainbow-pay-press-label="' . \esc_attr($atts['label']) .
                                                         '"') . '>' .
               '</span>';
    }
?>
