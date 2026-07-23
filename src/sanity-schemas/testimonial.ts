export default {
  name: 'testimonial',
  title: 'Client Testimonial',
  type: 'document',
  fields: [
    {
      name: 'type',
      title: 'Badge Type Label',
      type: 'string',
      description: 'e.g. CLIENT FEEDBACK: AURORA PLATFORM',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'quote',
      title: 'Client Quote',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author Identity',
      type: 'string',
      description: 'e.g. ELENA CHEN, CEO, QUANTUM FINTECH',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'avatar',
      title: 'Author Photo Avatar',
      type: 'image',
      options: {
        hotspot: true, // enables cropping coordinates
      }
    },
    {
      name: 'project',
      title: 'Associated Project (Single Reference - ref)',
      type: 'reference',
      to: [{ type: 'project' }],
      description: 'Links this testimonial feedback directly to a portfolio project record.'
    },
    {
      name: 'accentColor',
      title: 'Accent Branding Color Hex',
      type: 'string',
      description: 'e.g. #00F2FE, #7000FF, #F539B5',
      initialValue: '#00F2FE'
    },
    {
      name: 'colorClass',
      title: 'Color Class Designation',
      type: 'string',
      description: 'e.g. brand-cyan, brand-purple, brand-pink'
    },
    {
      name: 'bgGlow',
      title: 'Card Inner Glow RGBA',
      type: 'string',
      description: 'e.g. rgba(0, 242, 254, 0.03)'
    },
    {
      name: 'borderColor',
      title: 'Card Default Border RGBA',
      type: 'string',
      description: 'e.g. rgba(0, 242, 254, 0.15)'
    },
    {
      name: 'hoverBorder',
      title: 'Card Hover Border RGBA',
      type: 'string',
      description: 'e.g. rgba(0, 242, 254, 0.4)'
    }
  ]
};
