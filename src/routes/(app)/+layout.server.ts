export const prerender = false;
export const ssr = false;

export const load = async (event) => {
	return event.locals;
};
