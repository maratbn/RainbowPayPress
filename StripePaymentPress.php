<?php
/*
  Plugin Name: StripePaymentPress
  Description: WordPress plugin for embedding Stripe checkouts via shortcodes.
  Author: Marat Nepomnyashy
  Author URI: http://www.maratbn.com
  License: GPL3
  Version: 0.0.1-development_unreleased
  Text Domain: domain-plugin-StripePaymentPress
*/

/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.0.1-development_unreleased

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

namespace plugin_Stripe_Payment_Press;

const PLUGIN_VERSION = '0.0.1-development_unreleased';
const IS_MODE_RELEASE = false;

const DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS = 'domain-plugin-StripePaymentPress';
const SETTING__STRIPE_LIVE_PUBLISH_KEY =
                                  'plugin_Stripe_Payment_Press__setting__stripe_live_publish_key';
const SETTING__STRIPE_LIVE_SECRET_KEY =
                                   'plugin_Stripe_Payment_Press__setting__stripe_live_secret_key';
const SETTING__STRIPE_TEST_PUBLISH_KEY =
                                  'plugin_Stripe_Payment_Press__setting__stripe_test_publish_key';
const SETTING__STRIPE_TEST_SECRET_KEY =
                                   'plugin_Stripe_Payment_Press__setting__stripe_test_secret_key';
const SETTINGS_FIELD__STRIPE_LIVE_PUBLISH_KEY =
                           'plugin_Stripe_Payment_Press__settings_field__stripe_live_publish_key';
const SETTINGS_FIELD__STRIPE_LIVE_SECRET_KEY =
                            'plugin_Stripe_Payment_Press__settings_field__stripe_live_secret_key';
const SETTINGS_FIELD__STRIPE_TEST_PUBLISH_KEY =
                           'plugin_Stripe_Payment_Press__settings_field__stripe_test_publish_key';
const SETTINGS_FIELD__STRIPE_TEST_SECRET_KEY =
                            'plugin_Stripe_Payment_Press__settings_field__stripe_test_secret_key';
const SETTINGS_SECTION__STRIPE_KEYS = 'plugin_Stripe_Payment_Press__settings_group__stripe_keys';
const SLUG_INFO_SETTINGS = 'plugin_Stripe_Payment_Press_info_settings';

\register_activation_hook(__FILE__, '\\plugin_Stripe_Payment_Press\\plugin_activation_hook');

\add_action('admin_init', '\\plugin_Stripe_Payment_Press\\action_admin_init');
\add_action('admin_menu', '\\plugin_Stripe_Payment_Press\\action_admin_menu');
\add_action('wp_ajax_stripe_payment_press__charge_with_stripe',
            '\\plugin_Stripe_Payment_Press\\action_wp_ajax_stripe_payment_press__charge_with_stripe');
\add_action('wp_ajax_nopriv_stripe_payment_press__charge_with_stripe',
            '\\plugin_Stripe_Payment_Press\\action_wp_ajax_stripe_payment_press__charge_with_stripe');
\add_action('wp_ajax_stripe_payment_press__submit',
            '\\plugin_Stripe_Payment_Press\\action_wp_ajax_stripe_payment_press__submit');
\add_action('wp_ajax_nopriv_stripe_payment_press__submit',
            '\\plugin_Stripe_Payment_Press\\action_wp_ajax_stripe_payment_press__submit');
\add_action('wp_enqueue_scripts', '\\plugin_Stripe_Payment_Press\\action_wp_enqueue_scripts');
\add_action('wp_print_footer_scripts',
            '\\plugin_Stripe_Payment_Press\\action_wp_print_footer_scripts');


\add_filter('plugin_action_links_' . \plugin_basename(__FILE__),
                                     '\\plugin_Stripe_Payment_Press\\filter_plugin_action_links');

\add_shortcode('stripe-payment-press',
               '\\plugin_Stripe_Payment_Press\\shortcode_stripe_payment_press');

function action_admin_init() {
    //  Based on: https://kovshenin.com/2012/the-wordpress-settings-api/
    \add_settings_section(SETTINGS_SECTION__STRIPE_KEYS,
                          \__('Your Stripe Keys', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                          '\\plugin_Stripe_Payment_Press\\settings_group__stripe_keys',
                          SLUG_INFO_SETTINGS);

    \register_setting(SETTINGS_SECTION__STRIPE_KEYS, SETTING__STRIPE_TEST_SECRET_KEY);

    \add_settings_field(SETTINGS_FIELD__STRIPE_TEST_SECRET_KEY,
                        \__('Stripe Test Secret Key', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                        '\\plugin_Stripe_Payment_Press\\settings_field__stripe_test_secret_key',
                        SLUG_INFO_SETTINGS,
                        SETTINGS_SECTION__STRIPE_KEYS);


    \register_setting(SETTINGS_SECTION__STRIPE_KEYS, SETTING__STRIPE_TEST_PUBLISH_KEY);

    \add_settings_field(SETTINGS_FIELD__STRIPE_TEST_PUBLISH_KEY,
                        \__('Stripe Test Publishable Key', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                        '\\plugin_Stripe_Payment_Press\\settings_field__stripe_test_publish_key',
                        SLUG_INFO_SETTINGS,
                        SETTINGS_SECTION__STRIPE_KEYS);


    \register_setting(SETTINGS_SECTION__STRIPE_KEYS, SETTING__STRIPE_LIVE_SECRET_KEY);

    \add_settings_field(SETTINGS_FIELD__STRIPE_LIVE_SECRET_KEY,
                        \__('Stripe Live Secret Key', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                        '\\plugin_Stripe_Payment_Press\\settings_field__stripe_live_secret_key',
                        SLUG_INFO_SETTINGS,
                        SETTINGS_SECTION__STRIPE_KEYS);


    \register_setting(SETTINGS_SECTION__STRIPE_KEYS, SETTING__STRIPE_LIVE_PUBLISH_KEY);

    \add_settings_field(SETTINGS_FIELD__STRIPE_LIVE_PUBLISH_KEY,
                        \__('Stripe Live Publishable Key', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                        '\\plugin_Stripe_Payment_Press\\settings_field__stripe_live_publish_key',
                        SLUG_INFO_SETTINGS,
                        SETTINGS_SECTION__STRIPE_KEYS);
}

function action_admin_menu() {
    \add_options_page(\__('StripePaymentPress Info / Settings',
                          DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                      \__('StripePaymentPress', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                      'manage_options',
                      SLUG_INFO_SETTINGS,
                      '\\plugin_Stripe_Payment_Press\\render_info_settings');

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
         <code>[stripe-payment-press amount=1234 name="My entity" desc="Buy this" label="Click to buy"]</code>
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
    </div>
    <?php
    }
}

function action_wp_ajax_stripe_payment_press__charge_with_stripe() {
    $dataToken = $_POST['token'];

    $arrErrors = [];

    //  Based on:   https://stripe.com/docs/checkout/guides/php

    require_once(dirname(__FILE__) .
                               '/stripe-php-2.3.0--tweaked--2015-07-26--01--namespaced/init.php');

    $stripe = array(
          "secret_key"       => \get_option(SETTING__STRIPE_TEST_SECRET_KEY),
          "publishable_key"  => \get_option(SETTING__STRIPE_TEST_PUBLISH_KEY)
        );

    \plugin_Stripe_Payment_Press\Stripe\Stripe::setApiKey($stripe['secret_key']);

    $customer = \plugin_Stripe_Payment_Press\Stripe\Customer::create(array(
            'email'     => $dataToken['email'],
            'card'      => $dataToken['id'],
            'metadata'  => array('charge_desc' => $_POST['desc'])
        ));

    $charge = \plugin_Stripe_Payment_Press\Stripe\Charge::create(array(
            'customer'  => $customer->id,
            'amount'    => $_POST['amount'],
            'currency'  => 'usd'
        ));

    die(json_encode(['success' => false,
                     'errors' => $arrErrors]));
}

function action_wp_ajax_stripe_payment_press__submit() {
    $strProductDescription  = $_POST['product_description'];
    $strProductCost         = $_POST['product_cost'];
    $strStripeTokenId       = $_POST['stripe_token_id'];
    $strStripeEmail         = $_POST['stripe_email'];
    $strCustomerName        = $_POST['customer_name'];
    $strCustomerPhone       = $_POST['customer_phone'];

    die(json_encode(['success' => false]));
}

function action_wp_enqueue_scripts() {
    \wp_enqueue_script('jquery');
    \wp_enqueue_script('plugin__StripePaymentPress__stripe_checkout',
                       'https://checkout.stripe.com/checkout.js',
                       null,
                       \date('Y-m-d'));

    \wp_enqueue_script(
            'plugin_Stripe_Payment_Press__requirejs',
            plugin_dir_url(__FILE__)
                . 'js/lib/require_js-2.1.20-src--tweaked--namespaced--4264bcbdceac4240e742d16b7a7a9313fc1cd6d6.js',
            null,
            '2015-07-30--1',
            false);
}

function action_wp_print_footer_scripts() {

    if (!wp_script_is('plugin_Stripe_Payment_Press__requirejs')) return;

    $strUrlBase = \plugin_dir_url(__FILE__);
?>
<script type='text/javascript'>
    var strUrlRoot = '<?=$strUrlBase?>/js/le_requirejs/';

    _plugin_Stripe_Payment_Press__requirejs.config({
            baseUrl: strUrlRoot,
            paths: {
                    'backbone': strUrlRoot
                                    + 'lib/backbone-1.2.1-src--tweaked--namespaced_require_js--3acbb9f5418b2811cc515b3cf65f0574440d2eab',
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

    _plugin_Stripe_Payment_Press__requirejs([
            'backbone',
            'main'
        ], function(backbone, main) {

            backbone.history.start();

            main.start({'ajax_url':     '<?=\admin_url('admin-ajax.php')?>',
                        'publish_key':  '<?=\esc_attr(
                                              \get_option(SETTING__STRIPE_TEST_PUBLISH_KEY))?>'});
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

/**
 *  Returns unique version args to append to a resource URL to make
 *  that resource be unique in the browser cache.
 */
function getUVArg() {
    return 'uv=' . PLUGIN_VERSION . (IS_MODE_RELEASE ? "" : ('_' . time() . rand()));
}

function getUrlInfoSettings() {
    return \admin_url('options-general.php?page=' . SLUG_INFO_SETTINGS);
}

function plugin_activation_hook() {
    global $wpdb;
    $strTableName = $wpdb->prefix . 'plugin_stripe_payment_press_transactions';
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
                ' data-plugin-stripe-payment-press-amount="' . \esc_attr($atts['amount']) .
                                                         '"' .
                ' data-plugin-stripe-payment-press-name="' . \esc_attr($atts['name']) .
                                                       '"' .
                ' data-plugin-stripe-payment-press-desc="' . \esc_attr($atts['desc']) .
                                                       '"' .
                ($atts['label'] == null ? "" :
                ' data-plugin-stripe-payment-press-label="' . \esc_attr($atts['label']) .
                                                        '"') . '>' .
           '</span>';
}
?>
