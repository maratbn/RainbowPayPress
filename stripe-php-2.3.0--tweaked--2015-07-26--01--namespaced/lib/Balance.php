<?php

namespace plugin_Stripe_Payment_Press\Stripe;

class Balance extends SingletonApiResource
{
    /**
     * @param array|string|null $opts
     *
     * @return Balance
     */
    public static function retrieve($opts = null)
    {
        return self::_singletonRetrieve($opts);
    }
}