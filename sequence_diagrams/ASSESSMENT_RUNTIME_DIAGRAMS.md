# Assessment Runtime Sequence Diagrams
This document envisions assessment runtime sequence diagrams focused on the different assessment runtime internal components.


### Assessment Runtime - Orchestrator
#### Registry & Keepalive workflow
```mermaid
sequenceDiagram
participant Event Hub
box AssessmentRuntime
    participant publisher
    participant keepalive
end
    participant Orchestrator
    keepalive ->> Orchestrator: My UUID is valid?
    Orchestrator -->> keepalive: No
    keepalive ->> Orchestrator: Request new UUID
    Orchestrator -->> keepalive: <UUID>
    keepalive ->> Orchestrator: Set Keepalive <timeout>
    Orchestrator -->> keepalive: ACK
    keepalive ->> publisher: Instantiates with <UUID>
    loop Every <timeout>
    keepalive -->> publisher: "pub keepalive msg"
     activate publisher
    publisher -->> Event Hub: "CONNECT"
    Event Hub -->> publisher: "ACK"
    publisher -->> Event Hub: "PUB <msg>"
    Event Hub -->> publisher: "ACK"
    publisher -->> Event Hub: "DISCONNECT"
    Event Hub -->> publisher: "ACK"
    deactivate publisher
    publisher -->> keepalive: "SUCCESS"
    end
```
Error on publishing or error on connecting should be handled by the keepalive component, as this might mean it was deregistered due to network failure (so a new UUID request might be needed).