export default {
  name: 'project',
  title: 'Portfolio Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category / Specialization',
      type: 'string',
      description: 'e.g., WEB EXPERIENCE / FINTECH',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'client',
      title: 'Client Partner (Single Reference - ref)',
      type: 'reference',
      to: [{ type: 'client' }],
      description: 'Reference to the single client partner associated with this project.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'year',
      title: 'Year of Launch',
      type: 'string',
      initialValue: '2026',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'tags',
      title: 'Tech Stack Tags (Multi Reference - multi ref)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      description: 'Link multiple technology tags to this project.',
    },
    {
      name: 'mockStats',
      title: 'Performance Metrics & Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'metric',
          title: 'Metric Stat',
          fields: [
            { name: 'label', title: 'Metric Label (e.g. TRANSACTION LATENCY)', type: 'string' },
            { name: 'value', title: 'Metric Value (e.g. < 0.8ms)', type: 'string' }
          ]
        }
      ]
    }
  ]
};
