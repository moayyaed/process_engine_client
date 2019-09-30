'use strict'

const {
  ProcessEngineHttpClient,
  ProcessEngineInternalClient,
} = require('./dist/commonjs/index');

function registerInContainer(container) {

  container.register('ProcessEngineHttpClient', ProcessEngineHttpClient);

  container.register('ProcessEngineInternalClient', ProcessEngineInternalClient)
    .dependencies(
      'ConsumerApiEmptyActivityService',
      'ConsumerApiEventService',
      'ConsumerApiExternalTaskService',
      'ConsumerApiManualTaskService',
      'ConsumerApiNotificationService',
      'ConsumerApiProcessModelService',
      'ConsumerApiUserTaskService',
      'ConsumerApiFlowNodeInstanceService',
    );
}

module.exports.registerInContainer = registerInContainer;
