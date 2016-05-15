@startuml

Actor "Payer (Shopper) Browser" as Payer
Participant "Payee (Merchant) Site" as Payee
Participant "Taler Exchange" as Exchange

note over Payer, Payee: Tor/HTTPS
note over Payee, Exchange: HTTP/HTTPS

title Taler (Payment)

== Establish Contract ==

opt
Payer->Payer: Select Taler payment method (skippable with auto-detection)
end

Payer->Payee: Choose goods

Payee->Payer: Send signed digital contract proposal

== Execute Payment ==

opt
Payer->Payer: Affirm contract
end

Payer->Payee: Send payment

Payee->Exchange: Forward payment

Exchange->Payee: Confirm payment

== Fulfilment ==

Payee->Payer: Confirm payment

opt
Payer->Payee: Request fulfillment (if Web article)

Payee->Payer: Provide product resource
end

@enduml