import { writable } from 'svelte/store';

type FormErrors = Record<string, string>;
type FormValues = Record<string, any>;
type ValidationFunction = (values: FormValues) => FormErrors;

interface UseFormOptions {
	initialValues: FormValues;
	validate?: ValidationFunction;
}

interface UseFormReturn {
	form: ReturnType<typeof writable<FormValues>>;
	errors: ReturnType<typeof writable<FormErrors>>;
	handleSubmit: (callback: (values: FormValues) => void) => (event: Event) => void;
}

export function useForm({ initialValues, validate }: UseFormOptions): UseFormReturn {
	const form = writable<FormValues>(initialValues);
	const errors = writable<FormErrors>({});

	const handleSubmit = (callback: (values: FormValues) => void) => {
		return (event: Event) => {
			event.preventDefault();
			let currentValues: FormValues = {};

			form.subscribe((values) => {
				currentValues = values;
			})();

			if (validate) {
				const validationErrors = validate(currentValues);
				errors.set(validationErrors);

				if (Object.keys(validationErrors).length > 0) {
					return;
				}
			}

			callback(currentValues);
		};
	};

	return {
		form,
		errors,
		handleSubmit
	};
}
