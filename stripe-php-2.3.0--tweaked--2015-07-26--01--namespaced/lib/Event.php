<?php

namespace plugin_Stripe_Payment_Press\Stripe;

class Event extends ApiResource
{
    /**
     * @param string $id The ID of the event to retrieve.
     * @param array|string|null $opts
     *
     * @return Event
     */
    public static function retrieve($id, $opts = null)
    {
        return self::_retrieve($id, $opts);
    }

    /**
     * @param array|null $params
     * @param array|string|null $opts
     *
     * @return Event[]
     */
    public static function all($params = null, $opts = null)
    {
        return self::_all($params, $opts);
    }
}