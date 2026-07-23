export default {
  name: 'tag',
  title: 'Tech Stack Tag',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Tag Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'color',
      title: 'Badge Color Tint',
      type: 'string',
      description: 'Optional hex code or tailwind color class for personalized branding representation',
    }
  ]
};
