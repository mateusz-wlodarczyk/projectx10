import { HttpClient } from "../api";

export class BoatAroundService {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient('https://api.boataround.com');
  }

  public async getBoats<T>(params?: Record<string, any>): Promise<T> {
    return this.client.get<T>('/boats', { params });
  }
  
}
