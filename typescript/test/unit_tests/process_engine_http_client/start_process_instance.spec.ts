/* eslint-disable dot-notation */
import * as should from 'should';

import {ProcessEngineHttpClient} from '../../../dist/commonjs/process_engine_http_client';
import {ProcessStartResponse} from '../../../dist/commonjs/contracts/types/process_start_response';

import {HttpClientMock} from '../mocks/http_client_mock';

describe('ProessEngineHttpClient.startProcessInstance', (): void => {

  const sampleUrl = 'http://localhost:666';

  describe('Payload transformation', (): void => {

    let payloadSentToConsumerApi;
    let resultReceivedFromClient;

    before(async (): Promise<void> => {
      const fixtures = {
        correlationId: 'sampleCorrelationId',
        processInstanceId: 'abdefwefsgdsdf',
        endEventId: 'endEventId',
        tokenPayload: {sample: 'payload'},
      };

      const httpClientMock = new HttpClientMock(fixtures);

      httpClientMock.onCalledCallback = (url, payload, authHeaders): void => {
        payloadSentToConsumerApi = payload;
      };
      const processEngineHttpClient = new ProcessEngineHttpClient(sampleUrl);
      processEngineHttpClient.httpClient = httpClientMock as any;

      const samplePayload = {
        correlationId: '',
        parentProcessInstanceId: '',
        payload: {sample: 'requestPayload'},
      };

      resultReceivedFromClient = await processEngineHttpClient.startProcessInstance('processModelId', 'startEventId', samplePayload);
    });

    it('Should correctly transform the provided payload into the format used by the ConsumerApi.', async (): Promise<void> => {
      const expectedInputValues = {sample: 'requestPayload'};

      should(payloadSentToConsumerApi.inputValues).be.eql(expectedInputValues);
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

    let receivedAuthHeaders;

    const httpClientMock = new HttpClientMock();

    httpClientMock.onCalledCallback = (url, payload, authHeaders): void => {
      receivedAuthHeaders = authHeaders;
    };

    const processEngineHttpClient = new ProcessEngineHttpClient(sampleUrl);
    processEngineHttpClient.httpClient = httpClientMock as any;

    it('Should pass the correct identity to the ConsumerApi.', async (): Promise<void> => {

      await processEngineHttpClient.startProcessInstance('processModelId', 'startEventId');

      const expectedAuthHeader = 'Bearer ZHVtbXlfdG9rZW4=';
      should(receivedAuthHeaders.headers.Authorization).be.equal(expectedAuthHeader);
    });
  });

  describe('Using the identity provided with the constructor arguments', (): void => {

    let receivedAuthHeaders;

    const httpClientMock = new HttpClientMock();

    httpClientMock.onCalledCallback = (url, payload, authHeaders): void => {
      receivedAuthHeaders = authHeaders;
    };

    const samplIdentity = {
      token: 'abcdefg',
      userId: 'someUser',
    }

    const processEngineHttpClient = new ProcessEngineHttpClient(sampleUrl, samplIdentity);
    processEngineHttpClient.httpClient = httpClientMock as any;

    it('Should pass the correct identity to the ConsumerApi.', async (): Promise<void> => {

      await processEngineHttpClient.startProcessInstance('processModelId', 'startEventId');

      const expectedAuthHeader = 'Bearer abcdefg';
      should(receivedAuthHeaders.headers.Authorization).be.equal(expectedAuthHeader);
    });
  });
});
