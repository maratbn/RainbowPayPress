<?php

namespace plugin_Stripe_Payment_Press\Stripe\Error;

class Card extends Base
{
    public function __construct(
        $message,
        $param,
        $code,
        $httpStatus,
        $httpBody,
        $jsonBody,
        $httpHeaders = null
    ) {
        parent::__construct($message, $httpStatus, $httpBody, $jsonBody, $httpHeaders);
        $this->param = $param;
        $this->code = $code;
    }
}
