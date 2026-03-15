import { jest } from "@jest/globals";

export const api = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  defaults: { headers: { common: {} as Record<string, string> } },
};

export const setAuthToken = jest.fn();
