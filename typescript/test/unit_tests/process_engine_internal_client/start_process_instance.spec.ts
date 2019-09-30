/* eslint-disable dot-notation */
import * as should from 'should';

import {ProcessEngineInternalClient} from '../../../dist/commonjs/process_engine_internal_client';
import {ProcessStartResponse} from '../../../dist/commonjs/contracts/types/process_start_response';

import {ProcessModelServiceMock} from '../mocks/process_model_service_mock';

describe('ProessEngineInternalClient.startProcessInstance', (): void => {

  describe('Payload transformation', (): void => {

    let payloadSentToProcessEngine;
    let resultReceivedFromClient;

    before(async (): Promise<void> => {
      const fixtures = {
        correlationId: 'sampleCorrelationId',
        processInstanceId: 'abdefwefsgdsdf',
        endEventId: 'endEventId',
        tokenPayload: {sample: 'payload'},
      };

      const processModelServiceMock = new ProcessModelServiceMock(fixtures);

      processModelServiceMock.onCalledCallback = (identity, processModelId, payload): void => {
        payloadSentToProcessEngine = payload;
      };
      const processEngineInternalClient = new ProcessEngineInternalClient({}, {}, {}, {}, processModelServiceMock);

      const samplePayload = {
        correlationId: '',
        parentProcessInstanceId: '',
        payload: {sample: 'requestPayload'},
      };

      resultReceivedFromClient = await processEngineInternalClient.startProcessInstance('processModelId', 'startEventId', samplePayload);
    });

    it('Should correctly transform the provided payload into the format used by the ProcessEngine.', async (): Promise<void> => {
      const expectedInputValues = {sample: 'requestPayload'};

      should(payloadSentToProcessEngine.inputValues).be.eql(expectedInputValues);
    });

    it('Should correctly parse the received response into the format employed by the client', async (): Promise<void> => {
      const expectedResult = new ProcessStartResponse(
        'sampleCorrelationId',
        'abdefwefsgdsdf',
        'endEventId',
        {sample: 'payload'},
      );

      should(resultReceivedFromClient).be.eql(expectedResult);
    });
  });

  describe('Using the dummy identity', (): void => {

    let receivedIdentity;

    const processModelServiceMock = new ProcessModelServiceMock();

    processModelServiceMock.onCalledCallback = (identity, processModelId, payload): void => {
      receivedIdentity = identity;
    };

    const processEngineInternalClient = new ProcessEngineInternalClient({}, {}, {}, {}, processModelServiceMock);

    it('Should pass the correct identity to the ProcessEngine.', async (): Promise<void> => {

      const expectedIdentity = {
        token: 'ZHVtbXlfdG9rZW4=',
        userId: 'dummy_token',
      };

      await processEngineInternalClient.startProcessInstance('processModelId', 'startEventId');

      should(receivedIdentity).be.eql(expectedIdentity);
    });
  });

  describe('Using the identity provided with the constructor arguments', (): void => {

    let receivedIdentity;

    const processModelServiceMock = new ProcessModelServiceMock();

    processModelServiceMock.onCalledCallback = (identity, processModelId, payload): void => {
      receivedIdentity = identity;
    };

    const sampleIdentity = {
      token: 'abcdefg',
      userId: 'someUser',
    };

    const processEngineInternalClient = new ProcessEngineInternalClient({}, {}, {}, {}, processModelServiceMock, {}, sampleIdentity);

    it('Should pass the correct identity to the ProcessEngine.', async (): Promise<void> => {

      await processEngineInternalClient.startProcessInstance('processModelId', 'startEventId');

      should(receivedIdentity).be.eql(sampleIdentity);
    });
  });
});
