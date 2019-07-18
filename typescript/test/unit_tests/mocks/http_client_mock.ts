export class HttpClientMock {

  private fixturesToUse: any;

  constructor(fixturesToUse?: any) {
    this.fixturesToUse = fixturesToUse || {};
  }

  public onCalledCallback = (...args): any => {};

  public post(url: string, payload: any, authHeaders: any): any {
    this.onCalledCallback(url, payload, authHeaders);
    const okResponse = {
      result: this.fixturesToUse,
      status: 200,
    };

    return okResponse;
  }

}
