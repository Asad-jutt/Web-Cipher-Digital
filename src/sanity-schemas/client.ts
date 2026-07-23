export default {
  name: 'client',
  title: 'Client Partner',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Client Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'industry',
      title: 'Industry Vertical',
      type: 'string',
    },
    {
      name: 'website',
      title: 'Client Website',
      type: 'url',
    }
  ]
};
