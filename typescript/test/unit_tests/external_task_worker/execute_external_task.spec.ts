/* eslint-disable dot-notation */
import * as should from 'should';

import {ExternalTaskWorker} from '../../../dist/commonjs/external_task_worker/external_task_worker';

import {ExternalTaskApiMock} from '../mocks/external_task_api_mock';

describe('ExternalTaskWorker.executeExternalTask', (): void => {

  const sampleIdentity = {
    token: 'abcdefg',
    userId: 'dummyuser',
  };

  const sampleExternalTask = {
    id: 'abcd',
    payload: {
      sample: 'payload',
    },
  };

  describe('Call ActionHandler', (): void => {

    const externalTaskApiMock = new ExternalTaskApiMock();
    const externalTaskWorker = new ExternalTaskWorker(externalTaskApiMock);

    externalTaskWorker.extendLocks = (): Promise<void> => Promise.resolve();

    let payloadPassedToHandler: any;
    let externalTaskPassedTohandler: any;
    let handleActionCalled = false;

    before(async (): Promise<void> => {
      const callback = (payload: any, task: any): Promise<void> => {
        handleActionCalled = true;
        payloadPassedToHandler = payload;
        externalTaskPassedTohandler = task;

        return Promise.resolve();
      };

      await externalTaskWorker.executeExternalTask(sampleIdentity, sampleExternalTask as any, callback);
    });

    it('Should call the provided ActionHandler callback.', async (): Promise<void> => {
      should(handleActionCalled).be.true();
    });

    it('Should pass the ExternalTask\'s payload as first parameter.', (): void => {
      should(payloadPassedToHandler).be.eql(sampleExternalTask.payload);
    });

    it('Should pass the full ExternalTask as second parameter.', (): void => {
      should(externalTaskPassedTohandler).be.eql(sampleExternalTask);
    });
  });

  describe('Extend locks', (): void => {

    const externalTaskApiMock = new ExternalTaskApiMock();
    const externalTaskWorker = new ExternalTaskWorker(externalTaskApiMock);

    externalTaskWorker['lockDuration'] = 6000;

    it('Should keep extending the locks while processing is active.', async (): Promise<void> => {

      let extendLocksCalledCount = 0;

      externalTaskWorker.extendLocks = (): Promise<void> => {
        extendLocksCalledCount++;
        return Promise.resolve();
      };

      const longRunningHandler = async (): Promise<void> => {
        await new Promise((resolve): any => setTimeout(resolve, 2010));
      };

      await externalTaskWorker.executeExternalTask(sampleIdentity, sampleExternalTask as any, longRunningHandler);

      should(extendLocksCalledCount).be.equal(2);
    });

    it('Should no longer extend a lock, after processing has finished.', async (): Promise<void> => {

      let extendLocksCalledCount = 0;

      externalTaskWorker.extendLocks = (): Promise<void> => {
        extendLocksCalledCount++;
        return Promise.resolve();
      };

      const longRunningHandler = async (): Promise<void> => {
        await new Promise((resolve): any => setTimeout(resolve, 1100));
      };

      await externalTaskWorker.executeExternalTask(sampleIdentity, sampleExternalTask as any, longRunningHandler);

      await new Promise((resolve): any => setTimeout(resolve, 1000));

      should(extendLocksCalledCount).be.equal(1);
    });
  });

  describe('Pass result to ExternalTaskApi', (): void => {

    const externalTaskApiMock = new ExternalTaskApiMock();

    let finishWasCalled = false;
    let errorWasCalled = false;

    externalTaskApiMock.finishExternalTask = (): Promise<void> => {
      finishWasCalled = true;
      return Promise.resolve();
    };

    externalTaskApiMock.handleServiceError = (): Promise<void> => {
      errorWasCalled = true;
      return Promise.resolve();
    };

    const externalTaskWorker = new ExternalTaskWorker(externalTaskApiMock);

    externalTaskWorker.extendLocks = (): Promise<void> => Promise.resolve();

    it('Should pass a successfully finished ExternalTask\'s result to finishExternalTask.', async (): Promise<void> => {

      finishWasCalled = false;
      errorWasCalled = false;

      const successfulHandler = async (): Promise<any> => {

        const sampleResult = {
          hello: 'world',
        };

        return Promise.resolve(sampleResult);
      };

      await externalTaskWorker.executeExternalTask(sampleIdentity, sampleExternalTask, successfulHandler);

      should(finishWasCalled).be.true();
      should(errorWasCalled).be.false();
    });

    it('Should pass a failed ExternalTask\'s error to handleServiceError.', async (): Promise<void> => {

      finishWasCalled = false;
      errorWasCalled = false;

      const failingHandler = async (): Promise<any> => {
        throw new Error('Critical error');
      };

      await externalTaskWorker.executeExternalTask(sampleIdentity, sampleExternalTask, failingHandler);

      should(finishWasCalled).be.false();
      should(errorWasCalled).be.true();
    });
  });
});
