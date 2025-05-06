import createTestServer from 'create-test-server';
import { Express } from "express";
import ky from 'ky';
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';

import {
	transformRequestToSnakeCase,
	transformRequestToCamelCase,
	transformRequestToKebabCase,
} from '../src/transformers/requests';

let server: createTestServer.TestServer & Omit<Express , "listen"> & {
	get: (url: string, response: (string | (() => string))) => void
};

describe('it should use hook to transform request', () => {
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

	it('should transforms request to snake_case', async () => {
		server.post('/request/snake_case', (req, res) => {
			expect(req.body).toEqual({
				array_item: [
					{
						boolean_item: true,
						number_item: 1,
						string_item: 'Hi',
					},
				],
			});
			res.send(req.body);
		});

		await ky.post(`${server.url}/request/snake_case`, {
			json: exempleBody,
			hooks: {
				beforeRequest: [transformRequestToSnakeCase],
			},
		});
	});

	it('should transforms request to camelCase', async () => {
		server.post('/request/camelCase', (req, res) => {
			expect(req.body).toEqual({
				arrayItem: [
					{
						booleanItem: true,
						numberItem: 1,
						stringItem: 'Hi',
					},
				],
			});
			res.send(req.body);
		});

		await ky.post(`${server.url}/request/camelCase`, {
			json: exempleBody,
			hooks: {
				beforeRequest: [transformRequestToCamelCase],
			},
		});
	});

	it('should transforms request to kebab-case', async () => {
		server.post('/request/kebab-case', (req, res) => {
			expect(req.body).toEqual({
				'array-item': [
					{
						'boolean-item': true,
						'number-item': 1,
						'string-item': "Hi",
					},
				],
			});
			res.send(req.body);
		});

		await ky.post(`${server.url}/request/kebab-case`, {
			json: exempleBody,
			hooks: {
				beforeRequest: [transformRequestToKebabCase],
			},
		});
	});

	it('should transform request nested keys to camelCase', async () => {
		server.post('/request/nested/camelCase', (req, res) => {
			expect(req.body).toEqual(
				{
					arrayItem: [
						{
							nestedItem: [
								{ deepNestedItem: 'deepValue' },
							],
						},
					],
				},
			);
			res.send(req.body);
		});

		await ky.post(`${server.url}/request/nested/camelCase`, {
			json: {
				array_item: [
					{
						nested_item: [
							{ deep_nested_item: 'deepValue' },
						],
					},
				],
			},
			hooks: {
				beforeRequest: [
					transformRequestToCamelCase
				],
			},
		});
	});

	it('should not transform the request', () => {
		server.post('/request/no-transform', (req, res) => {
			expect(req.body).toEqual({
				'array-item': [
					{
						STRING_ITEM: 'Hi',
						boolean_item: true,
						numberItem: 1,
					},
				],
			});
			res.send(req.body);
		});

		return ky.post(`${server.url}/request/no-transform`, {
			json: exempleBody,
			hooks: {
				beforeRequest: [],
			},
		});
	});
});
