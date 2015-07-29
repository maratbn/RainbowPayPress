<?php

namespace plugin_Stripe_Payment_Press\Stripe\Util;

use plugin_Stripe_Payment_Press\Stripe\Object;

abstract class Util
{
    /**
     * Whether the provided array (or other) is a list rather than a dictionary.
     *
     * @param array|mixed $array
     * @return boolean True if the given object is a list.
     */
    public static function isList($array)
    {
        if (!is_array($array)) {
            return false;
        }

      // TODO: generally incorrect, but it's correct given Stripe's response
        foreach (array_keys($array) as $k) {
            if (!is_numeric($k)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Recursively converts the PHP Stripe object to an array.
     *
     * @param array $values The PHP Stripe object to convert.
     * @return array
     */
    public static function convertStripeObjectToArray($values)
    {
        $results = array();
        foreach ($values as $k => $v) {
            // FIXME: this is an encapsulation violation
            if ($k[0] == '_') {
                continue;
            }
            if ($v instanceof Object) {
                $results[$k] = $v->__toArray(true);
            } elseif (is_array($v)) {
                $results[$k] = self::convertStripeObjectToArray($v);
            } else {
                $results[$k] = $v;
            }
        }
        return $results;
    }

    /**
     * Converts a response from the Stripe API to the corresponding PHP object.
     *
     * @param array $resp The response from the Stripe API.
     * @param array $opts
     * @return Object|array
     */
    public static function convertToStripeObject($resp, $opts)
    {
        $types = array(
            'account' => 'plugin_Stripe_Payment_Press\\Stripe\\Account',
            'alipay_account' => 'plugin_Stripe_Payment_Press\\Stripe\\AlipayAccount',
            'bank_account' => 'plugin_Stripe_Payment_Press\\Stripe\\BankAccount',
            'balance_transaction' => 'plugin_Stripe_Payment_Press\\Stripe\\BalanceTransaction',
            'card' => 'plugin_Stripe_Payment_Press\\Stripe\\Card',
            'charge' => 'plugin_Stripe_Payment_Press\\Stripe\\Charge',
            'coupon' => 'plugin_Stripe_Payment_Press\\Stripe\\Coupon',
            'customer' => 'plugin_Stripe_Payment_Press\\Stripe\\Customer',
            'list' => 'plugin_Stripe_Payment_Press\\Stripe\\Collection',
            'invoice' => 'plugin_Stripe_Payment_Press\\Stripe\\Invoice',
            'invoiceitem' => 'plugin_Stripe_Payment_Press\\Stripe\\InvoiceItem',
            'event' => 'plugin_Stripe_Payment_Press\\Stripe\\Event',
            'file' => 'plugin_Stripe_Payment_Press\\Stripe\\FileUpload',
            'token' => 'plugin_Stripe_Payment_Press\\Stripe\\Token',
            'transfer' => 'plugin_Stripe_Payment_Press\\Stripe\\Transfer',
            'plan' => 'plugin_Stripe_Payment_Press\\Stripe\\Plan',
            'recipient' => 'plugin_Stripe_Payment_Press\\Stripe\\Recipient',
            'refund' => 'plugin_Stripe_Payment_Press\\Stripe\\Refund',
            'subscription' => 'plugin_Stripe_Payment_Press\\Stripe\\Subscription',
            'fee_refund' => 'plugin_Stripe_Payment_Press\\Stripe\\ApplicationFeeRefund',
            'bitcoin_receiver' => 'plugin_Stripe_Payment_Press\\Stripe\\BitcoinReceiver',
            'bitcoin_transaction' => 'plugin_Stripe_Payment_Press\\Stripe\\BitcoinTransaction',
        );
        if (self::isList($resp)) {
            $mapped = array();
            foreach ($resp as $i) {
                array_push($mapped, self::convertToStripeObject($i, $opts));
            }
            return $mapped;
        } elseif (is_array($resp)) {
            if (isset($resp['object']) && is_string($resp['object']) && isset($types[$resp['object']])) {
                $class = $types[$resp['object']];
            } else {
                $class = 'plugin_Stripe_Payment_Press\\Stripe\\Object';
            }
            return $class::constructFrom($resp, $opts);
        } else {
            return $resp;
        }
    }

    /**
     * @param string|mixed $value A string to UTF8-encode.
     *
     * @return string|mixed The UTF8-encoded string, or the object passed in if
     *    it wasn't a string.
     */
    public static function utf8($value)
    {
        if (is_string($value) && mb_detect_encoding($value, "UTF-8", true) != "UTF-8") {
            return utf8_encode($value);
        } else {
            return $value;
        }
    }
}
