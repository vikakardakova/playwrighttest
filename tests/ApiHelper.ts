import { APIRequestContext, request, expect } from "@playwright/test";

export class ApiHelper {
  private static context = async (): Promise<APIRequestContext> =>
    await request.newContext({timeout: 5000});

  static async getToken(data: object): Promise<string> {
    const context = await this.context();
    const response = await context.post("api/auth/login", {
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(response.ok()).toBeTruthy();
    const serializedRespone = await response.json();
    expect(serializedRespone).toHaveProperty("token");
    return serializedRespone.token;
  }

  static async getCategories(token: string): Promise<object[]> {
    const context = await this.context();
    const response = await context.get("api/category", {
      headers: {
        Authorization: token,
      },
    });
    expect(response.ok()).toBeTruthy();
    const serializedRespone = await response.json();
    return serializedRespone;
  }

  static async createPosition(token: string, data: object): Promise<object> {
    const context = await this.context();
    const response = await context.post("api/position", {
      data,
      headers: {
        Authorization: token,
      },
    });
    expect(response.ok()).toBeTruthy();
    const serializedRespone = await response.json();
    return serializedRespone;
  }
}
