---
title: The 3 OSCAL Components
description: Comparing the different Component types in OSCAL, and what each is used for.
tags:
- oscal
---

The three components types in question, and Defined Components, System Components and Component Definitions.

First off let's talk about Component Definitions. They are not really components. 
Rather they are a way for vendors, tool builders and policy writers to put together the details
of the work in a machine readable way for others to use. 

Take for example AWS. Which tools do they provide and how would you map those to compliance with 
repeatable IDs ? What about different versions of those tools ? 

Now, what about how they support or implement controls ? For example, intrinsicly we can say IAM 
in some way implements AC-1 Access Control. But 1) how does it do that, and 2) how should we validate that
our specific usage is conforming to the specs they have put out ? 

This is where Component Definitions come in. They are a way for AWS to communicate to the wider
world how their specific tools implement specific controls, and what exactly you need to do to 
enable that compliance behaviour / settings.

Component Definitions can also have many components listed within them. AWS could have a component
for each service they provide, each with their own description of how they support controls. Each component
definition has a `components` key, which allows specifying these details. 

For the end user, a component definition is a single file published by AWS, which describes all of their
services and control implementation guidance. 

So, technically, a component definition isn't really a usable component. It's more of a source of information 
on how you could implement your own components in a compliant way. You cannot use a component definition 
in your security plan or assessment plan. It is primarily used as a mapping and communication tool 
between the implementors and users of different tools and policies. 
