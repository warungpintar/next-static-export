const path = require('path');
const fs = require('fs');

const getFiles = (sourcePath, recursive = true) => {
  const dirents = fs.readdirSync(sourcePath, { withFileTypes: true });
  const files = dirents.map(file => {
    const resource = path.resolve(sourcePath, file.name);
    return recursive && file.isDirectory() ? getFiles(resource) : resource;
  });

  return Array.prototype
    .concat(...files)
    .map(filePath => {
      return filePath
        .replace(/.+\/src\/pages/, '')
        .replace(/\.[a-z]+$/, '')
        .replace(/\[/, ':')
        .replace(/\]/, '')
        .replace(/\/index/, '');
    })
    .sort((a, b) => (a.length > b.length ? -1 : 1));
};

const configWrapper = (config = {}, pagesDirPath) => {
  if (config.env === undefined) {
    config.env = {};
  }

  config.env.ROUTE_DEFS = getFiles(pagesDirPath);

  return config;
};

module.exports = configWrapper;
