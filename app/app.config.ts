export default defineAppConfig({
  ui: {
    // `warning` is remapped to the coin palette so gamification surfaces and
    // Nuxt UI's own warning states share one accent.
    colors: {
      primary: 'brand',
      neutral: 'slate',
      success: 'emerald',
      info: 'sky',
      warning: 'coin',
      error: 'rose',
    },
  },
})
