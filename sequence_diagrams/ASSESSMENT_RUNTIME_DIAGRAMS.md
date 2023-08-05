# Assessment Runtime Sequence Diagrams
This document envisions assessment runtime sequence diagrams focused on the different assessment runtime internal components.


### Assessment Runtime - Orchestrator

#### Publisher Workflow
```mermaid
sequenceDiagram
actor Assessment Component
participant RuntimePublisher
    Assessment Component -->> RuntimePublisher: "pub RuntimeKeepalive msg"
     activate RuntimePublisher
    RuntimePublisher -->> Event Hub: "CONNECT"
    Event Hub -->> RuntimePublisher: "ACK"
    RuntimePublisher -->> Event Hub: "PUB <msg>"
    Event Hub -->> RuntimePublisher: "ACK"
    RuntimePublisher -->> Event Hub: "DISCONNECT"
    Event Hub -->> RuntimePublisher: "ACK"
    deactivate RuntimePublisher
    RuntimePublisher -->> Assessment Component: "SUCCESS"

```
#### Registry & Keepalive workflow
```mermaid
sequenceDiagram
box AssessmentRuntime
    participant RuntimePublisher
    participant RuntimeKeepalive
end
    participant Orchestrator
    RuntimeKeepalive ->> Orchestrator: My UUID is valid?
    Orchestrator -->> RuntimeKeepalive: No
    RuntimeKeepalive ->> Orchestrator: Request new UUID
    Orchestrator -->> RuntimeKeepalive: <UUID>
    RuntimeKeepalive ->> Orchestrator: Set Keepalive <timeout>
    Orchestrator -->> RuntimeKeepalive: ACK
    RuntimeKeepalive ->> RuntimePublisher: Instantiates with <UUID>
    loop Every <timeout>
    RuntimeKeepalive -->> RuntimePublisher: "pub RuntimeKeepalive msg"
    RuntimePublisher -->> RuntimeKeepalive: "SUCCESS"
    end
```
Error on publishing or error on connecting should be handled by the RuntimeKeepalive component, as this might mean it was deregistered due to network failure (so a new UUID request might be needed).

#### JobManager workflow
```mermaid
sequenceDiagram
box AssessmentRuntime
    participant RuntimeJobRunner
    participant RuntimeJobManager
    participant RuntimeConfStore
    participant RuntimeConfSync
end
participant Configuration
    loop Every <config_sync_interval>
    RuntimeConfSync ->> Configuration: "GET /config/jobSpecs/diff/<uuid>"
    Configuration ->> RuntimeConfSync: "jobSpecs"
    RuntimeConfSync ->> RuntimeConfStore: update Job Specs
    end
    loop Every <job_run_resync_interval>
    RuntimeJobManager ->> RuntimeConfStore: get Job Specs
    RuntimeJobManager ->> RuntimeJobRunner: stop changed jobs
    RuntimeJobManager ->> RuntimeJobRunner: async start new jobs
    RuntimeJobRunner ->> RuntimeJobRunner: JobRunner Workflow
    end
```

#### JobRunner workflow
```mermaid
sequenceDiagram
participant pluginStore
box AssessmentRuntime
    participant RuntimePublisher
    participant RuntimeJobRunner
    participant pluginExecutable
end
participant CFComponent
    RuntimeJobRunner --x pluginStore: [Optional] - Download plugin
    loop Every <job_spec_interval>
    RuntimeJobRunner ->> pluginExecutable: execute
    pluginExecutable --> CFComponent: Attest
    CFComponent --> pluginExecutable: AttestationResult
    pluginExecutable ->> RuntimeJobRunner: AttestationResult
    RuntimeJobRunner ->> RuntimePublisher: Instantiates with UUID
    RuntimeJobRunner -->> RuntimePublisher: Publish AttestationResult
    activate RuntimePublisher
    RuntimePublisher -->> RuntimeJobRunner: SUCCESS
    deactivate RuntimePublisher
    end
```
