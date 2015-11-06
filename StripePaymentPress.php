<?php
/*
  Plugin Name: StripePaymentPress
  Description: WordPress plugin for embedding Stripe checkouts via shortcodes.
  Author: Marat Nepomnyashy
  Author URI: http://www.maratbn.com
  License: GPL3
  Version: 0.2.0-development_unreleased
  Text Domain: domain-plugin-StripePaymentPress
*/

/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.2.0-development_unreleased

  Module:         StripePaymentPress.php

  Description:    Main PHP file for the WordPress plugin 'StripePaymentPress'.

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

namespace plugin_StripePaymentPress;

const PLUGIN_VERSION = '0.2.0-development_unreleased';
const IS_MODE_RELEASE = false;

const DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS = 'domain-plugin-StripePaymentPress';
const SETTING__STRIPE_LIVE_PUBLISH_KEY =
                                  'plugin_StripePaymentPress__setting__stripe_live_publish_key';
const SETTING__STRIPE_LIVE_SECRET_KEY =
                                   'plugin_StripePaymentPress__setting__stripe_live_secret_key';
const SETTING__STRIPE_TEST_PUBLISH_KEY =
                                  'plugin_StripePaymentPress__setting__stripe_test_publish_key';
const SETTING__STRIPE_TEST_SECRET_KEY =
                                   'plugin_StripePaymentPress__setting__stripe_test_secret_key';
const SETTINGS_FIELD__STRIPE_LIVE_PUBLISH_KEY =
                           'plugin_StripePaymentPress__settings_field__stripe_live_publish_key';
const SETTINGS_FIELD__STRIPE_LIVE_SECRET_KEY =
                            'plugin_StripePaymentPress__settings_field__stripe_live_secret_key';
const SETTINGS_FIELD__STRIPE_TEST_PUBLISH_KEY =
                           'plugin_StripePaymentPress__settings_field__stripe_test_publish_key';
const SETTINGS_FIELD__STRIPE_TEST_SECRET_KEY =
                            'plugin_StripePaymentPress__settings_field__stripe_test_secret_key';
const SETTINGS_SECTION__STRIPE_KEYS = 'plugin_StripePaymentPress__settings_group__stripe_keys';
const SLUG_INFO_SETTINGS = 'plugin_StripePaymentPress_info_settings';

require_once('StripePaymentPress_util.php');

\register_activation_hook(__FILE__, '\\plugin_StripePaymentPress\\plugin_activation_hook');

\add_action('admin_enqueue_scripts',
            '\\plugin_StripePaymentPress\\action_admin_enqueue_scripts');
\add_action('admin_init', '\\plugin_StripePaymentPress\\action_admin_init');
\add_action('admin_menu', '\\plugin_StripePaymentPress\\action_admin_menu');
\add_action('admin_print_footer_scripts',
            '\\plugin_StripePaymentPress\\action_admin_print_footer_scripts');
\add_action('wp_ajax_stripe_payment_press__charge',
            '\\plugin_StripePaymentPress\\action_wp_ajax_stripe_payment_press__charge');
\add_action('wp_ajax_stripe_payment_press__delete',
            '\\plugin_StripePaymentPress\\action_wp_ajax_stripe_payment_press__delete');
\add_action('wp_ajax_stripe_payment_press__get_transactions',
            '\\plugin_StripePaymentPress\\action_wp_ajax_stripe_payment_press__get_transactions');
\add_action('wp_ajax_stripe_payment_press__submit',
            '\\plugin_StripePaymentPress\\action_wp_ajax_stripe_payment_press__submit');
\add_action('wp_ajax_nopriv_stripe_payment_press__submit',
            '\\plugin_StripePaymentPress\\action_wp_ajax_stripe_payment_press__submit');
\add_action('wp_enqueue_scripts', '\\plugin_StripePaymentPress\\action_wp_enqueue_scripts');
\add_action('wp_print_footer_scripts',
            '\\plugin_StripePaymentPress\\action_wp_print_footer_scripts');


\add_filter('plugin_action_links_' . \plugin_basename(__FILE__),
                                     '\\plugin_StripePaymentPress\\filter_plugin_action_links');

\add_shortcode('stripe-payment-press',
               '\\plugin_StripePaymentPress\\shortcode_stripe_payment_press');

function action_admin_enqueue_scripts($hook) {
    if ($hook != 'settings_page_' . SLUG_INFO_SETTINGS) return;

    \wp_enqueue_style('plugin__StripePaymentPress__style_css',
                      plugin_dir_url(__FILE__) . '/style.css',
                      null,
                      getUVArg());

    action_wp_enqueue_scripts();
}

function action_admin_init() {
    //  Based on: https://kovshenin.com/2012/the-wordpress-settings-api/
    \add_settings_section(SETTINGS_SECTION__STRIPE_KEYS,
                          \__('Your Stripe Keys', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                          '\\plugin_StripePaymentPress\\settings_group__stripe_keys',
                          SLUG_INFO_SETTINGS);

    \register_setting(SETTINGS_SECTION__STRIPE_KEYS, SETTING__STRIPE_TEST_SECRET_KEY);

    \add_settings_field(SETTINGS_FIELD__STRIPE_TEST_SECRET_KEY,
                        \__('Stripe Test Secret Key', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                        '\\plugin_StripePaymentPress\\settings_field__stripe_test_secret_key',
                        SLUG_INFO_SETTINGS,
                        SETTINGS_SECTION__STRIPE_KEYS);


    \register_setting(SETTINGS_SECTION__STRIPE_KEYS, SETTING__STRIPE_TEST_PUBLISH_KEY);

    \add_settings_field(SETTINGS_FIELD__STRIPE_TEST_PUBLISH_KEY,
                        \__('Stripe Test Publishable Key', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                        '\\plugin_StripePaymentPress\\settings_field__stripe_test_publish_key',
                        SLUG_INFO_SETTINGS,
                        SETTINGS_SECTION__STRIPE_KEYS);


    \register_setting(SETTINGS_SECTION__STRIPE_KEYS, SETTING__STRIPE_LIVE_SECRET_KEY);

    \add_settings_field(SETTINGS_FIELD__STRIPE_LIVE_SECRET_KEY,
                        \__('Stripe Live Secret Key', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                        '\\plugin_StripePaymentPress\\settings_field__stripe_live_secret_key',
                        SLUG_INFO_SETTINGS,
                        SETTINGS_SECTION__STRIPE_KEYS);


    \register_setting(SETTINGS_SECTION__STRIPE_KEYS, SETTING__STRIPE_LIVE_PUBLISH_KEY);

    \add_settings_field(SETTINGS_FIELD__STRIPE_LIVE_PUBLISH_KEY,
                        \__('Stripe Live Publishable Key', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                        '\\plugin_StripePaymentPress\\settings_field__stripe_live_publish_key',
                        SLUG_INFO_SETTINGS,
                        SETTINGS_SECTION__STRIPE_KEYS);
}

function action_admin_menu() {
    \add_options_page(\__('StripePaymentPress Info / Settings',
                          DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                      \__('StripePaymentPress', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                      'manage_options',
                      SLUG_INFO_SETTINGS,
                      '\\plugin_StripePaymentPress\\render_info_settings');

    function render_info_settings() {
        //  Based on http://codex.wordpress.org/Administration_Menus
        if (!\current_user_can('manage_options' ))  {
            \wp_die(__('You do not have sufficient permissions to access this page.',
                       DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS));
        }
    ?>
    <div class="wrap">
      <h2>Usage Info:</h2>
      <p>Use the shortcode
         <code>[stripe-payment-press type='<span style='color:red'>live</span>' amount=1234 name="My entity" desc="Buy this" label="Click to buy"]</code>
         to embed a Stripe payment widget on
         any page or post.</p>
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
      <h2>Configuration:</h2>
      <form method="post" action="options.php">
        <?php //  Based on: https://kovshenin.com/2012/the-wordpress-settings-api/
            \settings_fields(SETTINGS_SECTION__STRIPE_KEYS);
            \do_settings_sections(SLUG_INFO_SETTINGS);
            \submit_button();
        ?>
      </form>
      <h2>Pending Transactions:</h2>
      <span data-plugin-stripe-payment-press-role='transactions-pending'></span>
      <h2>Charged Transactions:</h2>
      <span data-plugin-stripe-payment-press-role='transactions-charged'></span>
    </div>
    <?php
    }
}

function action_admin_print_footer_scripts() {

    if (!wp_script_is('plugin_StripePaymentPress__requirejs')) return;

    $strUrlBase = \plugin_dir_url(__FILE__);
?>
<script type='text/javascript'>
    <?php renderJavaScriptRequireJSConfig() ?>

    _plugin_StripePaymentPress__requirejs([
            'backbone',
            'admin/main_admin'
        ], function(backbone, main_admin) {

            backbone.history.start();

            main_admin.start({
                    'ajax_url': '<?=\admin_url('admin-ajax.php')?>'
                });
        });
</script>
<?php
}

function action_wp_ajax_stripe_payment_press__charge() {
    /** Available errors:
     *      error_select_transaction
     *      error_create_stripe_customer
     *      error_create_stripe_charge
     *      error_update_transaction
     **/

    $arrErrors = [];

    $id = $_POST['id'];
    $dataTransaction = selectTransaction($id);
    if (!$dataTransaction) {
        \array_push($arrErrors, 'error_select_transaction');
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
                \array_push($arrErrors, 'error_create_stripe_customer');
            } else {
                $charge = \plugin_StripePaymentPress\Stripe\Charge::create(array(
                        'customer'  => $customer->id,
                        'amount'    => $dataTransaction['charge_amount'],
                        'currency'  => 'usd',
                        'metadata'  => array('charge_desc' => $dataTransaction['charge_description'])
                    ));
                if (!$charge) {
                    \array_push($arrErrors, 'error_create_stripe_charge');
                } else {
                    $charged = updateTransactionAsCharged($id, $customer->id, $charge->id);
                    if ($charged == null) {
                        \array_push($arrErrors, 'error_update_transaction');
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

function action_wp_ajax_stripe_payment_press__delete() {
    /** Available errors:
     *      error_delete_transaction
     **/

    $arrErrors = [];

    $id = $_POST['id'];
    if (!deleteTransaction($id)) {
        \array_push($arrErrors, 'error_delete_transaction');
    }

    die(json_encode(['success' => (count($arrErrors) == 0),
                     'errors' => $arrErrors]));
}

function action_wp_ajax_stripe_payment_press__get_transactions() {
    /** Available errors:
     *      error_select_transactions
     **/

    $arrErrors = [];

    $arrTransactions = selectTransactions();
    if (!$arrTransactions) {
        \array_push($arrErrors, 'error_select_transactions');
    }

    die(\json_encode(['success'       => (count($arrErrors) == 0),
                      'errors'        => $arrErrors,
                      'transactions'  => $arrTransactions]));
}

function action_wp_ajax_stripe_payment_press__submit() {
    $strType                = $_POST['type'];
    $strChargeDescription   = $_POST['charge_description'];
    $strProductCost         = $_POST['charge_amount'];
    $strStripeTokenId       = $_POST['stripe_token_id'];
    $strStripeEmail         = $_POST['stripe_email'];
    $strCustomerName        = $_POST['customer_name'];
    $strCustomerPhone       = $_POST['customer_phone'];

    die(json_encode(['success' => insertTransaction($strType,
                                                    $strChargeDescription,
                                                    $strProductCost,
                                                    $strStripeTokenId,
                                                    $strStripeEmail,
                                                    $strCustomerName,
                                                    $strCustomerPhone)]));
}

function action_wp_enqueue_scripts() {

    global $post;
    if ($post instanceof \WP_Post &&
        \has_shortcode($post->post_content, 'stripe-payment-press')) {
        \wp_enqueue_script('plugin__StripePaymentPress__stripe_checkout',
                           'https://checkout.stripe.com/checkout.js',
                           null,
                           \date('Y-m-d'));
    }

    \wp_enqueue_script('jquery');

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

function action_wp_print_footer_scripts() {

    if (!wp_script_is('plugin_StripePaymentPress__requirejs')) return;

    $strUrlBase = \plugin_dir_url(__FILE__);
?>
<script type='text/javascript'>
    <?php renderJavaScriptRequireJSConfig() ?>

    _plugin_StripePaymentPress__requirejs([
            'backbone',
            'public/main_public'
        ], function(backbone, main_public) {

            backbone.history.start();

            main_public.start({
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
                          . \__('Info / Settings', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS) . '</a>');
    return $arrLinks;
}

function getUrlInfoSettings() {
    return \admin_url('options-general.php?page=' . SLUG_INFO_SETTINGS);
}

function plugin_activation_hook() {
    initializeTable_Transactions();
}

function settings_field__stripe_live_publish_key() {
    //  Based on: https://kovshenin.com/2012/the-wordpress-settings-api/
    ?>
    <input type='text'
           name='<?=SETTING__STRIPE_LIVE_PUBLISH_KEY?>'
           size='40'
           value='<?=\esc_attr(\get_option(SETTING__STRIPE_LIVE_PUBLISH_KEY))?>' />
    <?php
}

function settings_field__stripe_live_secret_key() {
    //  Based on: https://kovshenin.com/2012/the-wordpress-settings-api/
    ?>
    <input type='text'
           name='<?=SETTING__STRIPE_LIVE_SECRET_KEY?>'
           size='40'
           value='<?=\esc_attr(\get_option(SETTING__STRIPE_LIVE_SECRET_KEY))?>' />
    <?php
}

function settings_field__stripe_test_publish_key() {
    //  Based on: https://kovshenin.com/2012/the-wordpress-settings-api/
    ?>
    <input type='text'
           name='<?=SETTING__STRIPE_TEST_PUBLISH_KEY?>'
           size='40'
           value='<?=\esc_attr(\get_option(SETTING__STRIPE_TEST_PUBLISH_KEY))?>' />
    <?php
}

function settings_field__stripe_test_secret_key() {
    //  Based on: https://kovshenin.com/2012/the-wordpress-settings-api/
    ?>
    <input type='text'
           name='<?=SETTING__STRIPE_TEST_SECRET_KEY?>'
           size='40'
           value='<?=\esc_attr(\get_option(SETTING__STRIPE_TEST_SECRET_KEY))?>' />
    <?php
}

function settings_group__stripe_keys() {
}

function shortcode_stripe_payment_press($atts) {
    if ($atts == null ||
        $atts['amount'] == null ||
        $atts['desc'] == null ||
        $atts['name'] == null) {
        return '<b><i>Short-code [stripe-payment-press] missconfigured.</i></b>';
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
