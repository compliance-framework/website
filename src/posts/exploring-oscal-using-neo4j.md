---
title: Exploring OSCAL Using Neo4J
description: Visualising and understanding OSCAL models with Neo4J to aid continuous compliance.
date: 2025-09-05
author: Ian Miell (Container Solutions)
tags: [oscal, neo4j, compliance, visualization]
canonicalUrl: https://blog.container-solutions.com/exploring-oscal-using-neo4j
---

# Exploring OSCAL Using Neo4J

![SSP Visualisation (example)](./img/oscal_neo4j_top.png)

This post is aimed at those interested in continuous compliance, an extension of cloud native principles to the area of software compliance, an under-developed field of software automation.

Container Solutions is working on an open source project to help automate the management and reporting of controls, and this post arose from that work.

## OSCAL?

OSCAL stands for "Open Security Controls Assessment Language".

It's a standard maintained by NIST. Like many standards, it's big and full of jargon, difficult for outsiders to grok, and obviously designed by committee, but trying to encompass an area like this across a whole set of industries is hard, and there's no other game in town.

## The OSCAL 'Schema'

OSCAL was created to be a flexible but complete standard for exchanging information about security controls.

It's designed to define machine-readable documents that represent different parts of the controls lifecycle. The idea is that participants and software within this lifecycle can exchange information using a common, machine-readable language.

For example, a regulator might publish "Control Catalogs" using OSCAL as a document format. These publications can then be read by software used by various parties involved in compliance to facilitate their work.

To give you an idea, here's an example, minimal and edited OSCAL document, from the examples repo. It represents an Assessment Plan, one of the phases in the control lifecycle:

> OSCAL document example

You can imagine how that document could be read by a desktop application which presents this information in a way that can be used by someone about to perform an assessment of controls. Note that the 'uuids' can be referenced by other documents' entities, and that there are uuids that could refer to other documents' entities. This will be relevant later.

Other entities modelled by OSCAL include:

- Catalogs (lists of controls and their details)
- Profiles (sets of controls derived from catalogs)
- Implementations (details of how control is applied)
- Assessment Plans (how the controls will be tested)
- Assessment Results (findings from the assessment process)
- Plan of Action and Milestone (corrective actions for addressing findings)

and here is a visual representation from the OSCAL site:

> OSCAL Layers and Models Visualisation

## The Problem

For someone old like me who is used to a more monolithic and relation-oriented schema, OSCAL feels odd. Different documents at different levels may or may not have elements that relate to one another, and might be completely independent. For example, a control definition that exists in one doc might be referenced in another by a UUID being the same, but there's no definition of whether such a relation needs to exist or not.

However, both in practice and in the examples given by NIST, the data 'feels' relational.

## Visualising OSCAL with Neo4J

While working on this, a colleague mentioned this talk from Alexander Koderman (slides) where he demonstrated how to use Neo4J to visualise OSCAL documents. Along the way he discovered errors in the documents and could relate, isolate, and more easily visualise parts of the documents he was looking at.

Building on this work, I set up a repo to run up a Neo4J instance in docker, after which I could play with the nodes in an interactive way. This made learning about OSCAL and the relations between the nodes a lot more fun.

Images are available here.

### System Security Plan

An OSCAL example System Security Plan (highlighted) and its related nodes. Where possible, size and colour have been used to distinguish different types of node. The type of node can be inferred from the relation described between them in the arrows, but if you click on them, the details can be reviewed.

### Catalog

> Catalog Visualisation

An OSCAL example catalog (highlighted) and its related nodes.

### Assessment Plan and Plan of Action and Milestones

> AP and AR Visualisation

This graph shows how the Plan of Action and Milestones (highlighted, large brown node) is related to the Assessment Plan (the large orange node). Tracing through, you can see that 'Assessment Plan' nodes are related to 'Assessment Result' nodes via 'Party' nodes and 'Role' nodes.

## Code

The code for running this on your own machine on Docker, along with the above images, is available here. Simply clone it and run `make full-rebuild` and you will see instructions on how to get the same views on the OSCAL examples.
