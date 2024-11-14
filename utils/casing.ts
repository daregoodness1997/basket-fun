// utils/camelCaseKeys.ts
function toCamelCase(str: string) {
    return str.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace("-", "").replace("_", "")
    );
}

export function camelCaseKeys(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map((item) => camelCaseKeys(item));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((acc: any, key: string) => {
            const camelKey = toCamelCase(key);
            acc[camelKey] = camelCaseKeys(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}
