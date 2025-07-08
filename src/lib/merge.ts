export default function merge(a: Record<string, any>, b?: Record<string, any>) {
	if (b) {
		for (const k in b) {
			a[k] = b[k];
		}
	}
	return a;
}
