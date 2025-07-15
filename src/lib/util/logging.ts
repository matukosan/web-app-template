/**
 * Safely stringify and log an object, useful for logging reactive state.
 * @param label A label for the log message
 * @param obj The object to be logged
 */
export function logObject(label: string, obj: any): void {
	console.log(`${label}:`, JSON.parse(JSON.stringify(obj)));
}
