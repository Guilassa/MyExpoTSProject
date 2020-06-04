export const Constants = {
  url: {
    production: {
      getAll: '',
      getSingle: '',
      post: '',
      update: '',
      delete: '',
    },
    development: {
      getAll: 'http://mbp-guilassa.local:3000/files',
      getSingle: 'http://mbp-guilassa.local:3000/file/',
      post: 'http://mbp-guilassa.local:3000/file/',
      update: 'http://mbp-guilassa.local:3000/file/',
      delete: 'http://mbp-guilassa.local:3000/file/',
    },
  },
  files: {
    maxFileSize: 5242880,
  },
};
