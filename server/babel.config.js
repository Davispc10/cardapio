module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@models': './src/app/models',
        '@controllers': './src/app/controllers',
        '@validators': './src/app/validators'
      }
    }],
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}
