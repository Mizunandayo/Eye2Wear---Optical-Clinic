
export const plugins = {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-env': {
      stage: 1,
      features: {
        'color-function': { unresolved: 'warn' }
      }
    }
};