
export const plugins = {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-env': {
      stage: 1,
      features: {
        'color-function': { unresolved: 'warn' },
        'color-functional-notation': false, // Disable modern color syntax
      }
    }
};