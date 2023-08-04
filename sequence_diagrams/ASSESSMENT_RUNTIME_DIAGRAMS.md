# Assessment Runtime Sequence Diagrams
This document envisions assessment runtime sequence diagrams focused on the different assessment runtime internal components.


### Assessment Runtime - Orchestrator

#### Publisher Workflow
```mermaid
sequenceDiagram
actor Assessment Component
participant publisher
    Assessment Component -->> publisher: "pub keepalive msg"
     activate publisher
    publisher -->> Event Hub: "CONNECT"
    Event Hub -->> publisher: "ACK"
    publisher -->> Event Hub: "PUB <msg>"
    Event Hub -->> publisher: "ACK"
    publisher -->> Event Hub: "DISCONNECT"
    Event Hub -->> publisher: "ACK"
    deactivate publisher
    publisher -->> Assessment Component: "SUCCESS"

```
#### Registry & Keepalive workflow
```mermaid
sequenceDiagram
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
    publisher -->> keepalive: "SUCCESS"
    end
```
Error on publishing or error on connecting should be handled by the keepalive component, as this might mean it was deregistered due to network failure (so a new UUID request might be needed).

#### JobManager workflow
```mermaid
sequenceDiagram
box AssessmentRuntime
    participant jobRunner
    participant jobManager
    participant configStore
    participant confSync
end
participant Configuration
    loop Every <config_sync_interval>
    confSync ->> Configuration: "GET /config/jobSpecs/diff/<uuid>"
    Configuration ->> confSync: "jobSpecs"
    confSync ->> configStore: update Job Specs
    end
    loop Every <job_run_resync_interval>
    jobManager ->> configStore: get Job Specs
    jobManager ->> jobRunner: stop changed jobs
    jobManager ->> jobRunner: async start new jobs
    jobRunner ->> jobRunner: JobRunner Workflow
    end
```

#### JobRunner workflow
```mermaid
sequenceDiagram
participant pluginStore
box AssessmentRuntime
    participant publisher
    participant jobRunner
    participant pluginExecutable
end
participant CFComponent
    jobRunner --x pluginStore: [Optional] - Download plugin
    loop Every <job_spec_interval>
    jobRunner ->> pluginExecutable: execute
    pluginExecutable --> CFComponent: Attest
    CFComponent --> pluginExecutable: AttestationResult
    pluginExecutable ->> jobRunner: AttestationResult
    jobRunner ->> publisher: Instantiates with UUID
    jobRunner -->> publisher: Publish AttestationResult
    activate publisher
    publisher -->> jobRunner: SUCCESS
    deactivate publisher
    end
```
