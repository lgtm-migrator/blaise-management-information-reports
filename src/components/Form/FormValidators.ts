const requiredValidator = (val: string, name: string) => {
    if (!val) {
        return [`Enter ${name.replace("_", " ")}`];
    }
    return [];
};

export {requiredValidator};
