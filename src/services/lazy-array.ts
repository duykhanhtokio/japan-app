/** Preserve Array.isArray, iteration and reflection while deferring evaluation.
 * The loader must return an ordinary array. Only the array container is copied;
 * item identities are retained. This does not split the native JS bundle.
 */
export function lazyArray<T>(load: () => T[]): T[] {
    const target: T[] = [];
    let ready = false;
    function value() {
        if (!ready) {
            const rows = load(); // Failed loads can be retried; no partial cache.
            for (const row of rows) target.push(row);
            ready = true;
        }
        return target;
    }
    return new Proxy(target, {
        get: (_target, key, receiver) => Reflect.get(value(), key, receiver),
        set: (_target, key, item) => Reflect.set(value(), key, item),
        has: (_target, key) => Reflect.has(value(), key),
        ownKeys: () => Reflect.ownKeys(value()),
        getOwnPropertyDescriptor: (_target, key) => Reflect.getOwnPropertyDescriptor(value(), key),
        defineProperty: (_target, key, descriptor) => Reflect.defineProperty(value(), key, descriptor),
        deleteProperty: (_target, key) => Reflect.deleteProperty(value(), key),
        preventExtensions: () => Reflect.preventExtensions(value()),
    });
}
