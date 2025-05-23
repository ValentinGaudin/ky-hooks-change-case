/**
 * Check if a string is a valid UUID (including nil UUID).
 */
export const uuidValidate = (value: string): boolean => {
	const regex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
	return regex.test(value);
};
