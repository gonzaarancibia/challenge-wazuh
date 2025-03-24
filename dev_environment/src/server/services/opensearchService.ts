import { CoreSetup, RequestHandlerContext } from '../../../../src/core/server';

export class OpenSearchService {
  private static instance: OpenSearchService;
  private coreSetup: CoreSetup | null = null;

  private constructor() { }

  public static getInstance(): OpenSearchService {
    if (!OpenSearchService.instance) {
      OpenSearchService.instance = new OpenSearchService();
    }
    return OpenSearchService.instance;
  }

  public initialize(coreSetup: CoreSetup): void {
    this.coreSetup = coreSetup;
  }

  public getClient(context: RequestHandlerContext) {
    if (!this.coreSetup) {
      throw new Error('OpenSearchService not initialized');
    }
    return context.core.opensearch.client.asCurrentUser;
  }
}