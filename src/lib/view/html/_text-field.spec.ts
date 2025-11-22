export const _textFieldSpec = {
  elements: {
    label: { required: false },
    field: { required: true },
    description: { required: false },
    tooltip: { required: false },
    icon: { required: false },
    prefix: { required: false },
    suffix: { required: false },
  },
  attribs: {
    hidden: { type: 'boolean' },
    disabled: { type: 'boolean' },
    invalid: { type: 'boolean' },
    required: { type: 'boolean' },
  },
} as const;
