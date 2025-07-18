---
sidebar_position: 3
sidebar_label: Plugins
---

import DocCardList from '@theme/DocCardList';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';

# Compliance Plugins

The CCF Agent does not know how to verify the correctness, or even how to gather details of all the possible subsystems
that could be verified through the CCF. This is where plugins become important. 

Plugins in The CCF and responsible for gathering data about specific subsystems, and representing them as json 
objects, allowing policies to be written to verify their correctness. 

<ThemedImage
    alt="Architecture Diagram showing the Continuous Compliance Agent"
    sources={{
        light: useBaseUrl('img/CCFPluginLight.png'),
        dark: useBaseUrl('img/CCFPluginDark.png'),
    }}
/>

## Security

In order to keep the data collected by CCF Plugins secure, the CCF plugins keep all data collected in memory, and pass 
these directly to the policy engine for verification. 

Once completed, the CCF Plugins generate OSCAL-compliant results, which excludes the sensitive data collected, and sends 
these to the CCF Agent. The sensitive data is then forgotten until the next compliance checkpoint. 

This means that nothing - not even the CCF Agent - has access to any sensitive data collected by the CCF Plugins, and 
it is kept private throughout the entire compliance lifecycle.x 

## Responsibilities

The Plugin has a few responsibilities

### Gathering Relevant Data

The plugin is a specialised collector of relevant information for a specific subsystem. It knows how to gather data
about specific systems, tools, products, APIs etc. which is important for verifying compliance. 

Plugins could for example be used to gather data about specific tooling such as SSH, Kubernetes, Linux, Firewalls, 
Cloud Providers, Security Vulnerabilities, Container Vulnerabilities etc. 

### Representing the data as JSON

Once the plugin has gathered the necessary data to make assertions, it turns the collected data into a 
JSON object. This is necessary in order to write policies against the collected data, and verify that specific keys and 
values are within limits or bounds of the specific policies for the organisation, or regulations. 

### Compiling policy output into OSCAL results

Lastly, the plugin is responsible for executing the policies for each of its relevant data points, gathering 
the results, and converting these into OSCAL-compliant results which are then passed to the agent to persist to the API. 

