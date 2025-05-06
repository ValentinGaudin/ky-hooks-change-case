import createTestServer from 'create-test-server';
import { Express } from "express";
import ky from 'ky';
import { describe, it, expect } from 'vitest';
import { transformResponseToCamelCase } from "../src/transformers/responses";


let server: createTestServer.TestServer & Omit<Express , "listen"> & {
  get: (url: string, response: (string | (() => string))) => void
};

describe('ky-change-case-hook', () => {
  it('ignores UUID keys in response', async () => {
    server = await createTestServer();

    const responseBody = {
      'c97891f9-3cca-4a9b-b31c-e991d9cbe67e': true,
      'boolean-item': false,
    };

    server.get('/uuid', (req, res) => {
      res.send(responseBody);
    });

    const response = await ky.get(`${server.url}/uuid`, {
      hooks: {
        afterResponse: [transformResponseToCamelCase],
      },
    });

    const body = await response.json();

    expect(body).toEqual({
      'c97891f9-3cca-4a9b-b31c-e991d9cbe67e': true,
      booleanItem: false,
    });

    await server.close();
  });
});
