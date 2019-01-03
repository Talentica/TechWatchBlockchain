# ParkAssist

A blockchain based parking space sharing app. 

 - Based on EOSIO, eosjs and react
 - Used by parking provider and driver to share parking spaces
 - No intermediaries or central authority/broker


## Get Started
coming soon


## Flow

Parkassist Flow diagrams using [Mermaid](https://mermaidjs.github.io/). 

```mermaid
sequenceDiagram
Alice ->> EOSIO: Request for Parking Space PS1
Note left of EOSIO: Req for Parking Space<br/>PS1 of Bob on 05 Jan <br/>between 16:00-17:00
EOSIO-->>Bob: Request Notification!!
Bob->> EOSIO: Approved!
EOSIO-->>Alice: Approval Notification!!
Alice ->> EOSIO: Occupies PS1 on the decided time.
EOSIO-->>Bob: Parking Notification!!
Alice->>EOSIO: Parking Space PS1 Released.
EOSIO-->>Bob: PS1 Release Notification!!
Note right of EOSIO: PS1 is released and <br/>charges are deducted <br/>from Alice's account.


```