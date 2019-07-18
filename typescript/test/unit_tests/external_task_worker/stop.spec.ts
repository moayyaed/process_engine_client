/* eslint-disable dot-notation */
import * as should from 'should';

import {ExternalTaskWorker} from '../../../dist/commonjs/external_task_worker/external_task_worker';

import {ExternalTaskApiMock} from '../mocks/external_task_api_mock';

describe('ExternalTaskWorker.stop', (): void => {

  const externalTaskApiMock = new ExternalTaskApiMock();
  const externalTaskWorker = new ExternalTaskWorker(externalTaskApiMock);

  externalTaskWorker['pollingInterval'] = 100;

  const sampleIdentity = {
    token: 'abcdefg',
    userId: 'dummyuser',
  };

  it('Should stop polling for ExternalTasks, when "stop" is called.', async (): Promise<void> => {

    let pollsExecuted = 0;

    externalTaskWorker.fetchAndLockExternalTasks = (): Promise<Array<any>> => {
      pollsExecuted++;
      return Promise.resolve([]);
    };

    externalTaskWorker.subscribeToExternalTasksWithTopic(sampleIdentity, 'sampleTopic', 10, 10, (): void => {});

    await new Promise((resolve): any => setTimeout(resolve, 300));
    externalTaskWorker.stop();
    await new Promise((resolve): any => setTimeout(resolve, 200));

    should(pollsExecuted).be.equal(3);
  });
});
