import { Variable } from './variable'

class Json2Variable {
    private ignoredPropertiesRegEx: RegExp[] = [];
    private secretPropertiesRegEx: RegExp[] = [];

    constructor(ignoredPropertiesPattern: Array<string>, secretPropertiesPattern: Array<string>) {
        ignoredPropertiesPattern.forEach(ip => 
            this.ignoredPropertiesRegEx.push(this.pattern2RegEx(ip)
        ));

        secretPropertiesPattern.forEach(ip => 
            this.secretPropertiesRegEx.push(this.pattern2RegEx(ip)
        ));
    }

    public convert(obj: any): Array<Variable> {
        let variables: Array<Variable> = [];

        this.convertInternal(obj, null, variables);

        return variables;
    }

    private convertInternal(obj: any, parent: string, variables: Array<Variable>) {
        for (let prop in obj) {
            let value = obj[prop];
            let type = this.getType(value);

            switch (type) {
                case 'array':
                    for (let i = 0; i < value.length; i++) {
                        let item = value[i];

                        this.convertInternal(item, this.formatPropertyName(parent, prop, i), variables);
                    }
                    break;
                case 'hash':
                    this.convertInternal(value, this.formatPropertyName(parent, prop, null), variables)
                    break;
                default:
                    const propName = this.formatPropertyName(parent, prop, null);
                    const shouldIgnoreProperty = this.ignoredPropertiesRegEx.some(ip => ip.test(propName));

                    if (shouldIgnoreProperty) {
                        continue;
                    }

                    const isSecret = this.secretPropertiesRegEx.some(sp => sp.test(propName));
                    let variable = new Variable(propName, value, isSecret);
                    variables.push(variable);
            }
        }
    }

    private formatPropertyName(parent: string, property: string, index: number | null) {
        let prop = index == null ? property : `${property}.${index}`;

        if (parent != null) {
            prop = `${parent}.${prop}`;
        }

        return prop;
    }

    private getType(obj: any) {
        var type = typeof obj;

        if (obj instanceof Array) {
            return 'array';
        } else if (type == 'string') {
            return 'string';
        } else if (type == 'boolean') {
            return 'boolean';
        } else if (type == 'number') {
            return 'number';
        } else if (type == 'undefined' || obj === null) {
            return 'null';
        } else {
            return 'hash';
        }
    }

    private pattern2RegEx(pattern: string) : RegExp { 
        return new RegExp( 
            "^" + 
            pattern 
                .replace(/\?/g, ".") 
                .replace(/\*/g, ".*") + 
            "$"
        );
    } 
}

export { Json2Variable }