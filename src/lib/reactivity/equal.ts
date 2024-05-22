type EqualityCheck = (a: any, b: any) => boolean;

const areIdentical: EqualityCheck = (a, b) => a === b;

export { areIdentical, EqualityCheck };
