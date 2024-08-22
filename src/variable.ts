class Variable {
    name: string;
    value: any;
    secret: boolean;

    constructor(name: string, value: any, secret: boolean) {
        this.name = name;
        this.value = value;
        this.secret = secret;
    }
}

export { Variable }