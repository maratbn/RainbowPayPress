<?php

namespace plugin_Stripe_Payment_Press\Stripe\Error;

class RateLimit extends InvalidRequest
{
    public function __construct(
        $message,
        $param,
        $httpStatus = null,
        $httpBody = null,
        $jsonBody = null,
        $httpHeaders = null
    ) {
        parent::__construct($message, $httpStatus, $httpBody, $jsonBody, $httpHeaders);
    }
}
