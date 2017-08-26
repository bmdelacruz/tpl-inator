import { Template, TemplateElement, TemplateGenerator } from "./index";

class SampleComponent {
    name: string = '';
    address: string = '';

    sayHello() {
        alert(`Hello, ${this.name}`);
    }
}

class SampleTpl extends Template<SampleComponent> {
    getName(): string {
        return 'sample';
    }

    getTemplateBody(): TemplateElement[] {
        return [
            this.tag('h2')
                .els([
                    this.str('Hello, '),
                    this.pie('name'),
                ])
                .finish(),
            this.tag('button')
                .attr('ion-button')
                .attr('(click)', this.call('sayHello').stringify())
                .els([
                    this.str('Say hello to '),
                    this.pie('name')
                ])
                .finish()
        ];
    }
}

function getProperty<T, K extends keyof T>(o: T, name: K) {
    return o[name];
}

function getPropertyType<T, K extends keyof T>(o: T, key: K) {
    return typeof o[key];
}

function getPropertyTypeOf(a: any, key: string) {
    return getPropertyType(a.prototype, key);
}

// const component = new SampleComponent();
console.log(getPropertyTypeOf(SampleComponent, 'sayHello'));

// const template = new SampleTpl();
// console.log(TemplateGenerator.makeFileNameFor(template));
// console.log(TemplateGenerator.generateStringFrom(template));
