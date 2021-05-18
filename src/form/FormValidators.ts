const requiredValidator = (val: string, name: string) => {
    console.log(name);
    if (!val) {
        return [`Enter ${name.replace("_", " ")}`];
    }

    return [];
};

export {requiredValidator};
