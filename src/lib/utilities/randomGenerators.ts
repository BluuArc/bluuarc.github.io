export function getRandomHtmlId (): string {
	return `html-id-${Date.now()}-${Math.random().toString().slice(3)}`;
}
