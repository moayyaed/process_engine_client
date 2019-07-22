'use strict'

const {
  ProcessEngineHttpClient,
  ProcessEngineInternalClient,
} = require('./dist/commonjs/index');

function registerInContainer(container) {

  container.register('ProcessEngineHttpClient', ProcessEngineHttpClient);

  container.register('ProcessEngineInternalClient', ProcessEngineInternalClient)
    .dependencies('ConsumerApiService', 'ExternalTaskApiService');
}

module.exports.registerInContainer = registerInContainer;
