export const anyValue = (value: any) => {
	return (typeof value === 'function' ? value() : value);
};
