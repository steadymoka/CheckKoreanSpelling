module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('postcss-nested'),
    require('postcss-custom-properties'),
    require('postcss-hexrgba'),
    require('autoprefixer'),
    require('postcss-url'),
  ],
}
