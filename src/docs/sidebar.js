export default [
  'introduction.md',
  'getting-started.md',
  'glossary.md',
  {
    text: 'OSCAL',
    collapsible: true,
    link: 'oscal/index.md',
    children: [
      'oscal/risks-findings-observations.md',
    ]
  },
  {
    text: 'Architecture',
    collapsible: true,
    link: 'architecture/index.md',
    children: [
      {
        text: 'Plugins',
        link: 'architecture/plugins.md',
      },
      {
        text: 'Policies',
        link: 'architecture/policies.md',
      },
      'architecture/agents.md',
      'architecture/external.md'
    ]
  }
];
