import createTestServer from 'create-test-server';
import { Express } from "express";
import ky from 'ky';
import { describe, it, beforeAll, afterAll, expect, beforeEach, vi } from 'vitest';

import {
	transformResponseToCamelCase,
	transformResponseToKebabCase,
	transformResponseToSnakeCase
} from "../src/transformers/responses";

import {
	transformRequestToSnakeCase
} from "../src/transformers/requests";
import {createResponseTransformer} from "../src/transformers/responses/createResponseTransformer";
import snakeCase from "lodash/snakeCase";

let server: createTestServer.TestServer & Omit<Express , "listen"> & {
	get: (url: string, response: (string | (() => string))) => void
};

describe('using hook to transform response', () => {
	let exempleBody: Record<string, unknown>;

	beforeAll(async () => {
		server = await createTestServer();
	});

	afterAll(async () => {
		await server.close();
	});

	beforeEach(() => {
		exempleBody = {
			'array-item': [
				{
					STRING_ITEM: 'Hi',
					boolean_item: true,
					numberItem: 1,
				},
			],
		};
	});
	it('should transforms response to snake_case', async () => {
		server.get('/response/snake_case', (req, res) => {
			res.send(exempleBody);
		});

		const response = await ky.get(`${server.url}/response/snake_case`, {
			hooks: {
				afterResponse: [transformResponseToSnakeCase],
			},
		});

		const body = await response.json();

		expect(body).toEqual({
			'array_item': [
				{
					'boolean_item': true,
					'number_item': 1,
					'string_item': 'Hi',
				},
			],
		});
	});

	it('should transforms response to camelCase', async () => {
		server.get('/response/camelCase', (req, res) => {
			res.send(exempleBody);
		});

		const response = await ky.get(`${server.url}/response/camelCase`, {
			hooks: {
				afterResponse: [transformResponseToCamelCase],
			},
		});

		const body = await response.json();

		expect(body).toEqual({
			arrayItem: [
				{
					booleanItem: true,
					numberItem: 1,
					stringItem: 'Hi',
				},
			],
		});
	});

	it('should transforms response to kebab-case', async () => {
		server.get('/response/kebab-case', (req, res) => {
			res.send(exempleBody);
		});

		const response = await ky.get(`${server.url}/response/kebab-case`, {
			hooks: {
				afterResponse: [transformResponseToKebabCase],
			},
		});

		const body = await response.json();

		expect(body).toEqual({
			'array-item': [
				{
					'boolean-item': true,
					'number-item': 1,
					'string-item': 'Hi',
				},
			],
		});
	});

	it('should transform response keys to snake_case', async () => {
		server.post('/request', (req, res) => {
			res.send({
				arrayItem: [
					{ booleanItem: true, stringItem: 'Hello' },
				],
			});
		});

		const response = await ky.post(`${server.url}/request`, {
			json: exempleBody,
			hooks: {
				beforeRequest: [transformRequestToSnakeCase],
				afterResponse: [transformResponseToSnakeCase],
			},
		});

		const expected = {
			array_item: [
				{ boolean_item: true, string_item: 'Hello' },
			],
		};

		const body = await response.json();
		expect(body).toEqual(expected);
	});

	it('should transform response nested keys to camelCase', async () => {
		const exampleNestedBody = {
			array_item: [
				{
					nested_item: [
						{ deep_nested_item: 'deepValue' },
					],
				},
			],
		};

		server.post('/response/nested', (req, res) => {
			res.send(exampleNestedBody);
		});

		const response = ky.post(`${server.url}/response/nested`, {
			json: exampleNestedBody,
			hooks: {
				afterResponse: [
					transformResponseToCamelCase
				],
			},
		})

		const expected = {
			arrayItem: [
				{
					nestedItem: [
						{ deepNestedItem: 'deepValue' },
					],
				},
			],
		}

		const body = await response.json();
		expect(body).toEqual(expected);
	});

	it('should not transform', async () => {
		server.get('/response/no-transform', (req, res) => {
			res.send(exempleBody);
		});

		const response = await ky.get(`${server.url}/response/no-transform`);

		const body = await response.json();

		expect(body).toEqual({
			'array-item': [
				{
					STRING_ITEM: 'Hi',
					boolean_item: true,
					numberItem: 1,
				},
			],
		});
	});

	it('should return undefined if response.json throws', async () => {
		const fakeResponse = {
			clone: () => ({
				json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
			}),
			status: 500,
			statusText: 'Server Error',
			headers: new Headers(),
		} as unknown as Response;

		const transformer = createResponseTransformer(snakeCase);
		const result = await transformer(new Request('http://test'), {}, fakeResponse);

		expect(result).toBeUndefined();
	});
});
