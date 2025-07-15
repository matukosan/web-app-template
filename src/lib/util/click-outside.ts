/** Dispatch event on click outside of node */
export function clickOutside(node) {
	const handleClick = (event) => {
		if (node && !node.contains(event.target) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('click_outside', node));
		}
	};

	const handleEscape = (event) => {
		if (event.key === 'Escape') {
			node.dispatchEvent(new CustomEvent('click_outside', node));
		}
	};

	document.addEventListener('click', handleClick, true);
	document.addEventListener('keydown', handleEscape, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
			document.removeEventListener('keydown', handleEscape, true);
		}
	};
}
