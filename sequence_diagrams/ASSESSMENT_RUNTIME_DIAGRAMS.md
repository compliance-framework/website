# Assessment Runtime Sequence Diagrams
This document envisions assessment runtime sequence diagrams focused on the different assessment runtime internal components.


### Assessment Runtime - Orchestrator
#### Registry Workflow (TBC)
```mermaid
sequenceDiagram
box AssessmentRuntime
    participant publisher
    participant keepalive
end
    participant Orchestrator
    keepalive ->> Orchestrator: "Request new UUID"
    Orchestrator -->> keepalive: "UUID"
    keepalive ->> Orchestrator: "Set Keepalive timeout"
    Orchestrator -->> keepalive: "ACK"
    keepalive ->> publisher: Instantiates with UUID
```
Error on publishing or error on connecting should be handled by the keepalive component.

#### Keepalive workflow
```mermaid
sequenceDiagram
box AssessmentRuntime
    participant keepalive
    participant publisher
end
    keepalive -->> publisher: "pub keepalive msg"
     activate publisher
    publisher -->> Event Hub: "CONNECT"
    Event Hub -->> publisher: "ACK"
    publisher -->> Event Hub: "PUB <msg>"
    Event Hub -->> publisher: "ACK"
    deactivate publisher
    publisher -->> keepalive: "SUCCESS"
```
Error on publishing or error on connecting should be handled by the keepalive component.