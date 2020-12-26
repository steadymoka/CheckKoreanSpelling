
module.exports = {
  appId: 'land.moka.spellcheck',
  directories: {
    output: 'release',
  },
  files: [
    'dist/electron/**/*',
  ],
  publish: {
    provider: 's3',
    bucket: `${process.env.PUBLISH_S3_BUCKET}`,
  },
  mac: {
    type: 'distribution',
    icon: 'build/icons/icon.icns',
    category: 'public.app-category.productivity',
    darkModeSupport: false,
    extendInfo: {
      LSMultipleInstancesProhibited: true,
    },
  },
  win: {
    target: 'nsis',
    icon: 'build/icons/icon.ico',
  },
  dmg: {
    contents: [
      {
        x: 410,
        y: 220,
        type: 'link',
        path: '/Applications',
      },
      {
        x: 130,
        y: 220,
        type: 'file',
      },
    ],
  },
}
