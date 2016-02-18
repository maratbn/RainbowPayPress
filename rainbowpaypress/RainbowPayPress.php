<?php
/*
  Plugin Name: RainbowPayPress
  Description: Easy way to accept credit card payments via Stripe by embedding Stripe checkouts via shortcodes.
  Author: Marat Nepomnyashy
  Author URI: http://www.maratbn.com
  License: GPL3
  Version: 1.0.0-development_unreleased
  Text Domain: domain-plugin-RainbowPayPress
*/

/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        1.0.0-development_unreleased

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

namespace plugin_StripePaymentPress;

const PLUGIN_VERSION = '1.0.0-development_unreleased';


const IS_MODE_RELEASE = false;


const PHP_VERSION_MIN_SUPPORTED = '5.4';

const DOMAIN_PLUGIN_RAINBOW_PAY_PRESS = 'domain-plugin-RainbowPayPress';

const SETTING__EMAIL_NOTIFICATIONS = 'plugin_RainbowPayPress__setting__email_notifications';
const SETTING__FLAG_ENABLE_EMAIL_NOTIFICATIONS
                            = 'plugin_RainbowPayPress__setting__flag__enable_email_notifications';
const SETTING__STRIPE_LIVE_PUBLISH_KEY
                                     = 'plugin_RainbowPayPress__setting__stripe_live_publish_key';
const SETTING__STRIPE_LIVE_SECRET_KEY = 'plugin_RainbowPayPress__setting__stripe_live_secret_key';
const SETTING__STRIPE_TEST_PUBLISH_KEY
                                     = 'plugin_RainbowPayPress__setting__stripe_test_publish_key';
const SETTING__STRIPE_TEST_SECRET_KEY = 'plugin_RainbowPayPress__setting__stripe_test_secret_key';

const SHORTCODE__STRIPE_PAYMENT_PRESS = 'rainbow-pay-press';

const SLUG_INFO_SETTINGS = 'plugin_RainbowPayPress_admin';

require_once('RainbowPayPress_util.php');

\register_activation_hook(__FILE__, '\\plugin_StripePaymentPress\\plugin_activation_hook');

\add_action('admin_enqueue_scripts',
            '\\plugin_StripePaymentPress\\action_admin_enqueue_scripts');
\add_action('admin_print_footer_scripts',
            '\\plugin_StripePaymentPress\\action_admin_print_footer_scripts');
\add_action('wp_ajax_stripe_payment_press__submit',
            '\\plugin_StripePaymentPress\\action_wp_ajax_stripe_payment_press__submit');
\add_action('wp_ajax_nopriv_stripe_payment_press__submit',
            '\\plugin_StripePaymentPress\\action_wp_ajax_stripe_payment_press__submit');
\add_action('wp_enqueue_scripts', '\\plugin_StripePaymentPress\\action_wp_enqueue_scripts');
\add_action('wp_print_footer_scripts',
            '\\plugin_StripePaymentPress\\action_wp_print_footer_scripts');


\add_filter('plugin_action_links_' . \plugin_basename(__FILE__),
                                     '\\plugin_StripePaymentPress\\filter_plugin_action_links');

\add_shortcode(SHORTCODE__STRIPE_PAYMENT_PRESS,
               '\\plugin_StripePaymentPress\\shortcode_stripe_payment_press');


if (\is_admin()) {
    \add_action(
        'admin_menu',
        '\\plugin_StripePaymentPress\\action_admin_menu');
    \add_action(
        'wp_ajax_stripe_payment_press__admin__charge',
        '\\plugin_StripePaymentPress\\action_wp_ajax_stripe_payment_press__admin__charge');
    \add_action(
        'wp_ajax_stripe_payment_press__admin__delete',
        '\\plugin_StripePaymentPress\\action_wp_ajax_stripe_payment_press__admin__delete');
    \add_action(
        'wp_ajax_stripe_payment_press__admin__get_config',
        '\\plugin_StripePaymentPress\\action_wp_ajax_stripe_payment_press__admin__get_config');
    \add_action(
        'wp_ajax_stripe_payment_press__admin__get_transactions',
        '\\plugin_StripePaymentPress\\action_wp_ajax_stripe_payment_press__admin__get_transactions');
    \add_action(
        'wp_ajax_stripe_payment_press__admin__send_test_email',
        '\\plugin_StripePaymentPress\\action_wp_ajax_stripe_payment_press__admin__send_test_email');
    \add_action(
        'wp_ajax_stripe_payment_press__admin__update_config',
        '\\plugin_StripePaymentPress\\action_wp_ajax_stripe_payment_press__admin__update_config');
}


function action_admin_enqueue_scripts($hook) {
    if ($hook != 'plugins_page_' . SLUG_INFO_SETTINGS) return;

    \wp_enqueue_style('plugin__StripePaymentPress__style_css',
                      plugin_dir_url(__FILE__) . '/style.css',
                      null,
                      getUVArg());

    \wp_enqueue_script(
        'plugin_StripePaymentPress__requirejs',
        plugin_dir_url(__FILE__) . (
            IS_MODE_RELEASE
            ? 'js/lib/require_js-2.1.20-src--tweaked--2015-09-24--01--namespaced--plugin_StripePaymentPress--45576dbca1a4f9ff7385a89c3c1f6db4917fe2c1.min.js'
            : 'js/lib/require_js-2.1.20-src--tweaked--2015-09-24--01--namespaced--plugin_StripePaymentPress--45576dbca1a4f9ff7385a89c3c1f6db4917fe2c1.js'),
        null,
        '2015-09-25--1',
        false);
}

function action_admin_menu() {
    \add_plugins_page(
        \__('RainbowPayPress Info / Settings', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
        \__('RainbowPayPress', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
        'manage_options',
        SLUG_INFO_SETTINGS,
        '\\plugin_StripePaymentPress\\FragmentUtil::renderAdmin_Root');
}

function action_admin_print_footer_scripts() {

    if (!wp_script_is('plugin_StripePaymentPress__requirejs')) return;

    $strUrlBase = \plugin_dir_url(__FILE__);
?>
<script type='text/javascript'>
    <?php FragmentUtil::renderJavaScriptRequireJSConfig() ?>

    _plugin_StripePaymentPress__requirejs([
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

function action_wp_ajax_stripe_payment_press__admin__charge() {
    /** Possible errors:
     *      error__insufficient_permissions
     *      error__select_transaction
     *      error__create_stripe_customer
     *      error__create_stripe_charge
     *      error__update_transaction
     **/

    $arrErrors = [];

    if (!\current_user_can('manage_options')) {
        \array_push($arrErrors, 'error__insufficient_permissions');
    }

    $dataTransaction = null;

    if (count($arrErrors) == 0) {
        $id = $_POST['id'];
        $dataTransaction = DBUtil::selectTransaction($id);
        if (!$dataTransaction) {
            \array_push($arrErrors, 'error__select_transaction');
        }
    }

    $stripe = null;

    if (count($arrErrors) == 0) {

        //  Based on:   https://stripe.com/docs/checkout/guides/php

        require_once(dirname(__FILE__) .
                               '/stripe-php-3.4.0--tweaked--2015-11-05--01--namespaced/init.php');

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

    if (count($arrErrors) == 0) {
        \plugin_StripePaymentPress\Stripe\Stripe::setApiKey($stripe['secret_key']);

        try {
            $customer = \plugin_StripePaymentPress\Stripe\Customer::create(array(
                    'email'        => $dataTransaction['stripe_email'],
                    'source'       => $dataTransaction['stripe_token_id'],
                    'description'  => 'Name: ' . $dataTransaction['customer_name'] . ' -- ' .
                                      'Phone: ' . $dataTransaction['customer_phone']
                ));

            if (!$customer) {
                \array_push($arrErrors, 'error__create_stripe_customer');
            } else {
                $dataRet['stripe_customer_id'] = $customer->id;
                $charge = \plugin_StripePaymentPress\Stripe\Charge::create(array(
                        'customer'  => $customer->id,
                        'amount'    => $dataTransaction['charge_amount'],
                        'currency'  => 'usd',
                        'metadata'  => array('charge_desc' => $dataTransaction['charge_description'])
                    ));
                if (!$charge) {
                    \array_push($arrErrors, 'error__create_stripe_charge');
                } else {
                    $dataRet['stripe_charge_id'] = $charge->id;
                    $charged = DBUtil::updateTransactionAsCharged($id, $customer->id, $charge->id);
                    if ($charged == null) {
                        \array_push($arrErrors, 'error__update_transaction');
                    } else {
                        $dataRet['charged'] = $charged;
                    }
                }
            }
        } catch (plugin_StripePaymentPress\Stripe\Error\InvalidArgumentException
                                                                    $invalid_argument_exception) {
            \array_push($arrErrors, 'error_stripe_invalid_argument_exception');
        } catch (\Exception $exception) {
            \array_push($arrErrors, 'error_stripe_exception');
        }
    }

    $flagSuccess = (count($arrErrors) == 0);

    $dataRet['success']  = $flagSuccess;
    $dataRet['errors']   = $arrErrors;

    die(json_encode($dataRet));
}

function action_wp_ajax_stripe_payment_press__admin__delete() {
    /** Possible errors:
     *      error__insufficient_permissions
     *      error__delete_transaction
     **/

    $arrErrors = [];

    if (!\current_user_can('manage_options')) {
        \array_push($arrErrors, 'error__insufficient_permissions');
    }

    if (count($arrErrors) == 0) {
        $id = $_POST['id'];
        if (!DBUtil::deleteTransaction($id)) {
            \array_push($arrErrors, 'error__delete_transaction');
        }
    }

    die(json_encode(['success' => (count($arrErrors) == 0),
                     'errors' => $arrErrors]));
}

function action_wp_ajax_stripe_payment_press__admin__get_config() {
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

function action_wp_ajax_stripe_payment_press__admin__get_transactions() {
    /** Possible errors:
     *      error__insufficient_permissions
     *      error__select_transactions
     **/

    $arrErrors = [];

    if (!\current_user_can('manage_options')) {
        \array_push($arrErrors, 'error__insufficient_permissions');
    }

    $arrTransactions = null;
    if (count($arrErrors) == 0) {
        $arrTransactions = DBUtil::selectTransactions();
        if (!$arrTransactions) {
            \array_push($arrErrors, 'error__select_transactions');
        }
    }

    die(\json_encode(['success'       => (count($arrErrors) == 0),
                      'errors'        => $arrErrors,
                      'transactions'  => $arrTransactions]));
}

function action_wp_ajax_stripe_payment_press__admin__send_test_email() {
    /** Possible errors:
     *      error__insufficient_permissions
     *      error__no_recipient
     *      error__wp_mail
     **/

    $arrErrors = [];

    if (!\current_user_can('manage_options')) {
        \array_push($arrErrors, 'error__insufficient_permissions');
    }

    if (count($arrErrors) == 0) {
        $strRecipient = \get_option(SETTING__EMAIL_NOTIFICATIONS);
        if (\strlen($strRecipient) > 0) {
            if (!\wp_mail(
                    $strRecipient,
                    \__('RainbowPayPress test email',
                        DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                    \sprintf(
                        \__('This is a test email.  This address is configured to receive notifications from the RainbowPayPress plugin installed onto WordPress website %s',
                            DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                        \get_site_url()))) {
                \array_push($arrErrors, 'error__wp_mail');
            }
        } else {
            \array_push($arrErrors, 'error__no_recipient');
        }
    }

    die(\json_encode(['success'       => (count($arrErrors) == 0),
                      'errors'        => $arrErrors]));
}

function action_wp_ajax_stripe_payment_press__admin__update_config() {
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

        if (array_key_exists('email_notifications', $objConfig)) {
            \update_option(SETTING__EMAIL_NOTIFICATIONS,
                           $objConfig['email_notifications']);
        }

        if (array_key_exists('flag_enable_email_notifications', $objConfig)) {
            \update_option(SETTING__FLAG_ENABLE_EMAIL_NOTIFICATIONS,
                           $objConfig['flag_enable_email_notifications']);
        }

        if (array_key_exists('stripe_key_live_secret', $objConfig)) {
            \update_option(SETTING__STRIPE_LIVE_SECRET_KEY, $objConfig['stripe_key_live_secret']);
        }
        if (array_key_exists('stripe_key_live_publish', $objConfig)) {
            \update_option(SETTING__STRIPE_LIVE_PUBLISH_KEY,
                           $objConfig['stripe_key_live_publish']);
        }

        if (array_key_exists('stripe_key_test_secret', $objConfig)) {
            \update_option(SETTING__STRIPE_TEST_SECRET_KEY, $objConfig['stripe_key_test_secret']);
        }
        if (array_key_exists('stripe_key_test_publish', $objConfig)) {
            \update_option(SETTING__STRIPE_TEST_PUBLISH_KEY,
                           $objConfig['stripe_key_test_publish']);
        }
    }

    $objRet = ['errors'   => $arrErrors,
               'success'  => (\count($arrErrors) == 0)];

    if (\count($arrErrors) == 0) {
        $objRet['config'] = Util::getConfig();
    }

    die(\json_encode($objRet));
}

function action_wp_ajax_stripe_payment_press__submit() {
    /** Possible errors:
     *      error__insert_transaction
     **/

    $arrErrors = [];

    $strType                = $_POST['type'];
    $strChargeDescription   = $_POST['charge_description'];
    $strProductCost         = $_POST['charge_amount'];
    $strStripeTokenId       = $_POST['stripe_token_id'];
    $strStripeEmail         = $_POST['stripe_email'];
    $strCustomerName        = $_POST['customer_name'];
    $strCustomerPhone       = $_POST['customer_phone'];

    if (!DBUtil::insertTransaction($strType,
                                   $strChargeDescription,
                                   $strProductCost,
                                   $strStripeTokenId,
                                   $strStripeEmail,
                                   $strCustomerName,
                                   $strCustomerPhone)) {
        \array_push($arrErrors, 'error__insert_transaction');
    }

    if (count($arrErrors) == 0 && Util::getFlagEnableEmailNotifications()) {
        $strRecipient = \get_option(SETTING__EMAIL_NOTIFICATIONS);
        if (\strlen($strRecipient) > 0) {
            \wp_mail(
                $strRecipient,
                \__('RainbowPayPress new pending transaction submitted',
                    DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                \sprintf(
                    \__('New pending transaction has been submitted via the RainbowPayPress plugin installed onto WordPress website %s',
                        DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                    \get_site_url())
                .
                "\r\n"
                .
                "\r\n"
                .
                \__('Stripe transaction type:',
                    DOMAIN_PLUGIN_RAINBOW_PAY_PRESS)
                .
                "\r\n"
                .
                $strType
                .
                "\r\n"
                .
                "\r\n"
                .
                \__('Charge:',
                    DOMAIN_PLUGIN_RAINBOW_PAY_PRESS)
                .
                "\r\n"
                .
                $strChargeDescription
                .
                ' -- '
                .
                Util::formatUSD($strProductCost)
                .
                "\r\n"
                .
                "\r\n"
                .
                \__('Customer:',
                    DOMAIN_PLUGIN_RAINBOW_PAY_PRESS)
                .
                "\r\n"
                .
                $strStripeEmail
                .
                ' -- '
                .
                $strCustomerName
                .
                ' -- '
                .
                $strCustomerPhone
                .
                "\r\n"
                .
                "\r\n"
                .
                \sprintf(
                    \__('View / charge / delete this transaction at %s',
                        DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                    getUrlInfoSettings()));
        }
    }

    die(json_encode(['success'  => (count($arrErrors) == 0),
                     'errors'   => $arrErrors]));
}

function action_wp_enqueue_scripts() {

    global $post;
    if ($post instanceof \WP_Post &&
        \has_shortcode($post->post_content, SHORTCODE__STRIPE_PAYMENT_PRESS)) {
        \wp_enqueue_script('plugin__StripePaymentPress__stripe_checkout',
                           'https://checkout.stripe.com/checkout.js',
                           null,
                           \date('Y-m-d'));

        \wp_enqueue_script(
                'plugin_StripePaymentPress__requirejs',
                plugin_dir_url(__FILE__) . (
                    IS_MODE_RELEASE
                    ? 'js/lib/require_js-2.1.20-src--tweaked--2015-09-24--01--namespaced--plugin_StripePaymentPress--45576dbca1a4f9ff7385a89c3c1f6db4917fe2c1.min.js'
                    : 'js/lib/require_js-2.1.20-src--tweaked--2015-09-24--01--namespaced--plugin_StripePaymentPress--45576dbca1a4f9ff7385a89c3c1f6db4917fe2c1.js'),
                null,
                '2015-09-25--1',
                false);
    }
}

function action_wp_print_footer_scripts() {

    if (!wp_script_is('plugin_StripePaymentPress__requirejs')) return;

    $strUrlBase = \plugin_dir_url(__FILE__);
?>
<script type='text/javascript'>
    <?php FragmentUtil::renderJavaScriptRequireJSConfig() ?>

    _plugin_StripePaymentPress__requirejs([
            'backbone',
            'main'
        ], function(backbone, main) {

            backbone.history.start();

            main.startPublic({
                    'ajax_url':          '<?=\admin_url('admin-ajax.php')?>',
                    'publish_key_live':  '<?=\esc_attr(
                                                \get_option(SETTING__STRIPE_LIVE_PUBLISH_KEY))?>',
                    'publish_key_test':  '<?=\esc_attr(
                                                 \get_option(SETTING__STRIPE_TEST_PUBLISH_KEY))?>'
                });
        });
</script>
<?php
}

function filter_plugin_action_links($arrLinks) {
    \array_push($arrLinks,
                '<a href=\'' . getUrlInfoSettings() . '\'>'
                          . \__('Info / Settings', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS) . '</a>');
    \array_push($arrLinks,
                '<a href=\'' . \plugin_dir_url(__FILE__) . 'LICENSE\'>'
                          . \__('License', DOMAIN_PLUGIN_RAINBOW_PAY_PRESS) . '</a>');
    return $arrLinks;
}

function getUrlInfoSettings() {
    return \admin_url('plugins.php?page=' . SLUG_INFO_SETTINGS);
}

function plugin_activation_hook() {

    if (\version_compare(\strtolower(PHP_VERSION), PHP_VERSION_MIN_SUPPORTED, '<')) {
        \wp_die(
            \sprintf(
                \__('RainbowPayPress plugin cannot be activated because the currently active PHP version on this server is %s < %s and not supported.  PHP version >= %s is required.',
                    DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                PHP_VERSION,
                PHP_VERSION_MIN_SUPPORTED,
                PHP_VERSION_MIN_SUPPORTED));
    }

    DBUtil::initializeTable_Transactions();
}

function shortcode_stripe_payment_press($atts) {
    if ($atts == null ||
        $atts['amount'] == null ||
        $atts['desc'] == null ||
        $atts['name'] == null) {
        return '<b><i>' .
               \sprintf(
                   \__('Short-code [%s] missconfigured.',
                       DOMAIN_PLUGIN_RAINBOW_PAY_PRESS),
                   SHORTCODE__STRIPE_PAYMENT_PRESS) .
               '</i></b>';
    }

    return '<span data-plugin-stripe-payment-press-role="root"' .
                ($atts['type'] == null ? "" :
                ' data-plugin-stripe-payment-press-type="' . \esc_attr($atts['type']) .
                                                       '"') .
                ' data-plugin-stripe-payment-press-amount="' . \esc_attr($atts['amount']) .
                                                         '"' .
                ' data-plugin-stripe-payment-press-name="' . \esc_attr($atts['name']) .
                                                       '"' .
                ' data-plugin-stripe-payment-press-desc="' . \esc_attr($atts['desc']) .
                                                       '"' .
                ($atts['info'] == null ? "" :
                ' data-plugin-stripe-payment-press-info="' . \esc_attr($atts['info']) .
                                                        '"') .

                ($atts['label'] == null ? "" :
                ' data-plugin-stripe-payment-press-label="' . \esc_attr($atts['label']) .
                                                        '"') . '>' .
           '</span>';
}
?>