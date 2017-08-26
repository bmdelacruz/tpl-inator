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

const template = new SampleTpl();
console.log(TemplateGenerator.makeFileNameFor(template));
console.log(TemplateGenerator.generateStringFrom(template));
