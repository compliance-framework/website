## Configuration<->Assessment Sequence Diagrams
How does a Job Spec gets generated:
```mermaid
flowchart LR
    control --> component
    control --> component2
    component2 --> assessment
    component --> assessment
    assessment --> attestation
    assessment --> attestation2
    attestation --> attestationjobSpec1
    attestation2 --> attestationjobSpec2
    component -.-> attestationjobSpec1
    component -.-> attestationjobSpec2
```
How does the structure would look like - *rough example only*:
```mermaid
classDiagram
  class Component{
    +Object Properties
    +string properties.vm_id
    +string properties.plugin_type
    +string properties.resource_id
    +string name
    +string name
  }
  class Control{
    +Object Properties
    +string properties.control_id...
    +string name
  }
  class AttestationJobSpec{
    +Object ComponentProperties
    +Object ControlProperties
    +Object AssessmentProperties
    +string properties.control_id...
    +string name
  }
```

Sequence Diagram for updating the database
```mermaid
sequenceDiagram
    User ->> Configuration: update configuration (component, new control, etc)
    Configuration ->> DB: updates  
    DB ->> Configuration: updated
    jobSpec ->> DB: Queries
    jobSpec ->> jobSpec: renders job specs  
    jobSpec ->> DB: updates job specs  
    DB ->> Configuration: updated
```

Sequence Diagram for the Assessment Runtime to get more jobs
```mermaid
sequenceDiagram
    Assessment ->> Configuration: gimme X job specs
    Configuration ->> DB: get job specs where runtime_id is null limit x
    DB ->> Configuration: response
    Configuration ->> Assessment: Your Job Specs
    Configuration ->> DB: update job specs where id = [x] runtime_id = <assessment_id>
    DB ->> Configuration: response

```
Because Users can cause a change to the job specs, we need to have a specific flow for checking if the current job specs are still valid and/or changed. The proposed workflow would be something like this:
```mermaid
sequenceDiagram
    Assessment ->> Configuration: gimme my job specs
    Configuration ->> DB: get job specs where runtime_id is assessment_id
    DB ->> Configuration: response
    Configuration ->> Assessment: Your Job Specs
    Assessment ->> Assessment: delete old job spec from config

```

### Runtime orchestrator Diagrams
The Runtime Orchestrator will be in charge of checking the uptime of the assessment runtimes

```mermaid
sequenceDiagram
    Assessment Runtime ->> Runtime Orchestrator: Request new UUID
    Runtime Orchestrator ->> Configuration: Generate UUID and store in config
    Configuration ->> Runtime Orchestrator: Response
    Runtime Orchestrator ->> Assessment Runtime: Provides new UUID
    Assessment Runtime ->> Runtime Orchestrator: Set the expected runtime pulse interval
    Runtime Orchestrator ->> Configuration: Store pulse interval for runtime in config
    Configuration ->> Runtime Orchestrator: Response
    Runtime Orchestrator ->> Assessment Runtime: Response
```

```mermaid
sequenceDiagram
    Assessment Runtime ->> Event Bus: Push liveliness pule with UUID
    Runtime Orchestrator ->> Event Bus: Pull all new pulses
    Runtime Orchestrator ->> Configuration: Update entries for UUIDs with last pulse time
    Configuration ->> Runtime Orchestrator: Response
    Runtime Orchestrator ->> Configuration: Give all the assessment runtimes last pulse timeand their pulse interval
    Configuration ->> Runtime Orchestrator: Response
    Runtime Orchestrator ->> Runtime Orchestrator: Consider assessment runtimes with pulse > pulse interval to be dead

```
