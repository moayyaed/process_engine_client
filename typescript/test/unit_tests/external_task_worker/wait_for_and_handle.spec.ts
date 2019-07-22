/* eslint-disable dot-notation */
import * as should from 'should';

import {ExternalTaskWorker} from '../../../dist/commonjs/external_task_worker/external_task_worker';

import {ExternalTaskApiMock} from '../mocks/external_task_api_mock';

describe('ExternalTaskWorker.subscribeToExternalTasksWithTopic', (): void => {

  let externalTaskApiMock;
  let externalTaskWorker;

  const sampleIdentity = {
    token: 'abcdefg',
    userId: 'dummyuser',
  };

  beforeEach((): void => {
    externalTaskApiMock = new ExternalTaskApiMock();
    externalTaskWorker = new ExternalTaskWorker(externalTaskApiMock);

    externalTaskWorker.executeExternalTask = async (
      identity: any,
      externalTask: any,
      handleAction: Function,
    ): Promise<void> => {
      await handleAction(externalTask.payload, externalTask);
    };
  });

  afterEach((): void => {
    externalTaskWorker['pollingIsActive'] = false;
    externalTaskApiMock = undefined;
    externalTaskWorker = undefined;
  });

  it('Should poll for ExternalTasks regularly, using the given interval.', async (): Promise<void> => {

    externalTaskWorker['pollingInterval'] = 100;

    let pollsExecuted = 0;

    externalTaskWorker.fetchAndLockExternalTasks = (): Promise<Array<any>> => {
      pollsExecuted++;
      return Promise.resolve([]);
    };

    externalTaskWorker.subscribeToExternalTasksWithTopic(sampleIdentity, 'sampleTopic', 10, 10, (): void => {});

    await new Promise((resolve): any => setTimeout(resolve, 500));
    externalTaskWorker['pollingIsActive'] = false;

    should(pollsExecuted).be.equal(5);
  });

  it('Should not continue to poll for ExternalTasks while ExternalTasks are being processed.', async (): Promise<void> => {

    externalTaskWorker['pollingInterval'] = 100;

    let pollsExecuted = 0;

    externalTaskWorker.fetchAndLockExternalTasks = (): Promise<Array<any>> => {
      pollsExecuted++;
      return Promise.resolve([{}]);
    };

    const longRunningHandler = async (): Promise<void> => {
      await new Promise((resolve): any => setTimeout(resolve, 500));
    };

    externalTaskWorker.subscribeToExternalTasksWithTopic(sampleIdentity, 'sampleTopic', 10, 10, longRunningHandler);

    await new Promise((resolve): any => setTimeout(resolve, 300));
    externalTaskWorker['pollingIsActive'] = false;

    should(pollsExecuted).be.equal(1);
  });

  it('Should process all fetched ExternalTasks in parallel.', async (): Promise<void> => {

    externalTaskWorker['pollingInterval'] = 100;

    externalTaskWorker.fetchAndLockExternalTasks = (): Promise<Array<any>> => {
      return Promise.resolve([{
        id: 'ExternalTask1',
      }, {
        id: 'ExternalTask2',
      }, {
        id: 'ExternalTask3',
      }]);
    };

    let taskExecuted = 0;

    const longRunningHandler = async (): Promise<void> => {
      taskExecuted++;
      await new Promise((resolve): any => setTimeout(resolve, 300));
    };

    externalTaskWorker.subscribeToExternalTasksWithTopic(sampleIdentity, 'sampleTopic', 10, 10, longRunningHandler);
    externalTaskWorker['pollingIsActive'] = false;
    await new Promise((resolve): any => setTimeout(resolve, 100));

    should(taskExecuted).be.equal(3);
  });
});
