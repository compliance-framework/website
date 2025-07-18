# Architecture of The Continuous Compliance Framework

CCF collects compliance information from a wide range of sources, and compiles them into a single, holistic compliance view. 
CCF is designed with the express purpose of being distributed, to avoid the need for centralised and elevated access,
keeping it as secure as possible.

![High Level Architecture Diagram of the Continuous Compliance Framework](/img/CCFHighLevelLight.png#light)
![High Level Architecture Diagram of the Continuous Compliance Framework](/img/CCFHighLevelDark.png#dark)

Small agents and collectors, responsible for continuously verifying the compliance of specific components within a system, feed compliance information into the
central reporting API. Compliance information can then be inspected through the CCF UI,
and ultimately exported to an OSCAL document, which can be sent to auditors as compliance documentation.

::: important Custom Title

An important container with customized title.

:::

The CCF API is open-to-extension, and can therefore accept additional compliance information from external sources to 
compliment the overall compliance report, and generate a more complete view of compliance across the business. 

CCF aims to be as extensible as possible, allowing compliance information and verification to be sent from 
wherever it is applicable.

## API

The CCF API conforms to the OSCAL schema, allowing a standardised way of sending additional compliance information, 
in a format that is defined by auditors and regulatory assessors. 

CCF adds a few additional fields and values to the OSCAL schema, to make it more automatable and accessible to automation engineers.

## Plugins

The plugin system is designed to make CCF as extensible as possible. Plugins are responsible for gathering information about 
specific systems and configurations, and making this information available to the policy engine for verification. 

A simple example of this is ensuring everybody in an organisation has 2-factor authentication enabled. 

The plugin is responsible for collecting the configuration from an authentication provider like Google or SSO. It has 
specialised knowledge of how specific systems function, and how to collect the relevant information from them.

## Policies

Policies verify that the information gathered by plugins, are compliant. Policies are written in the CNCF-Graduated 
Open Policy Agent language, Rego and soon the CNCF-Incubating Kyverno-JSON Policy Engine.  

Once information has been collected by the plugin for the system under test, the policies verify that the information 
is correct and compliant according to company policies. 

In our example, ensuring that `2fa-enabled` is set to `true` for all users. 

The plugin then sends the compliance information to the reporting API for inspection. 

## Agents

The CCF Agent is a lightweight orchestrator, updater and scheduler of plugins.

When running an agent, you specify which plugins and policies should be run, and how often. 
The agent will ensure that the plugins and policies are run according to that schedule. 

The agent is also responsible for updating plugins and policies when new versions become available. Plugins and Policies
are distributed using OCI-compatible registries, making it easy to roll out different versions and tiers to agents 
without needing to update the agent configuration. 

The agent can also limit the capabilities which plugins are allowed to use (similar to containers) to further increase security. 

The architecture of the CCF agent means it's access can be limited to very specific systems, and the CCF doesn't need 
elevated access to an entire system for compliance checks. Our agent is also capable of being deployed on smaller devices like
sensors, IOT devices, and unreliably connected hardware, and will continue to verify compliance, and report to the API once a connection 
is established.

The CCF Agent was designed to limit its access to specific systems, to avoid needing wide-sweeping elevated access to 
multiple systems. Small, least-privilege installations is what the agent was designed for.    

## API SDK

The CCF API is open-to-extension. Any external system is capable of sending compliance information to the reporting API, 
as long as it conforms to the API structure and has been authorized and authenticated. 

CCF publishes a Golang SDK to make this integration as simple as possible. 

## Main Components
