
export interface TemplateElement {
    stringify(): string;
}

export abstract class TemplateElementBuilder<T extends TemplateElement> {
    protected templateElement: T;

    constructor() {
        this.templateElement = this.createTemplateElement();
    }

    abstract createTemplateElement(): T;

    finish(): T {
        return this.templateElement;
    }
}

export abstract class ParentTemplateElement implements TemplateElement {
    protected childElements: TemplateElement[] = [];
    protected attributes: { [key: string]: string | null } = {};

    abstract stringify(): string;

    addElement(element: TemplateElement) {
        this.childElements.push(element);
    }

    el(element: TemplateElement) {
        this.addElement(element);
    }

    addElements(element: TemplateElement[]) {
        this.childElements = this.childElements.concat(element);
    }

    els(elements: TemplateElement[]) {
        this.addElements(elements);
    }

    addAttribute(key: string, value?: string) {
        this.attributes[key] = value || null;
    }

    attr(key: string, value?: string) {
        this.addAttribute(key, value);
    }
}

export abstract class ParentTemplateElementBuilder<T extends ParentTemplateElement> extends TemplateElementBuilder<T> {
    addElement(element: TemplateElement): this {
        this.templateElement.addElement(element);
        return this;
    }

    el(element: TemplateElement): this {
        this.templateElement.el(element);
        return this;
    }

    addElements(elements: TemplateElement[]): this {
        this.templateElement.addElements(elements);
        return this;
    }

    els(elements: TemplateElement[]): this {
        this.templateElement.els(elements);
        return this;
    }

    addAttribute(key: string, value?: string): this {
        this.templateElement.addAttribute(key, value);
        return this;
    }

    attr(key: string, value?: string): this {
        this.templateElement.attr(key, value);
        return this;
    }
}

export class TagElement extends ParentTemplateElement {
    private tag: string;

    setTag(tag: string) {
        this.tag = tag;
    }

    private static SPACE_STR = ' ';
    stringify(): string {
        const innerArray: string[] = [];
        this.childElements.forEach(element => {
            innerArray.push(element.stringify());
        });
        const innerStr = innerArray.join('');

        const attributeArray: string[] = [];
        attributeArray.push(TagElement.SPACE_STR);
        for (let key in this.attributes) {
            attributeArray.push(`${key}`);

            const value = this.attributes[key];
            if (value) {
                attributeArray.push(`="${value}"`, TagElement.SPACE_STR);
            } else {
                attributeArray.push(TagElement.SPACE_STR);
            }
        }
        attributeArray.pop(); // pop the trailing SPACE_STR

        const attributeStr = attributeArray.join('');
        return `<${this.tag}${attributeStr}>${innerStr}</${this.tag}>`;
    }
}

export class TagElementBuilder extends ParentTemplateElementBuilder<TagElement> {
    setTag(tag: string): this {
        this.templateElement.setTag(tag);
        return this;
    }

    createTemplateElement(): TagElement {
        return new TagElement();
    }
}

export class StringElement implements TemplateElement {
    private str: string;

    constructor(str: string) {
        this.str = str;
    }

    stringify(): string {
        return this.str;
    }
}

export class InterpolationElement implements TemplateElement {
    private expression: string;

    constructor(expression: string) {
        this.expression = expression;
    }

    stringify(): string {
        return `{{${this.expression}}}`;
    }
}

export abstract class AccessorAppendable {
    protected previousAccesses: string[] = [];

    protected access(callOrPropertyStr: string) {
        if (this.previousAccesses.length > 0)
            this.previousAccesses.push('.');
        this.previousAccesses.push(callOrPropertyStr)
    }

    protected getPreviousAccesses(): string {
        return this.previousAccesses.join('');
    }
}

export class PropertyElement<Object> implements TemplateElement {
    private propertyKey: keyof Object;

    constructor(propertyKey: keyof Object) {
        this.propertyKey = propertyKey;
    }

    interpolate(): InterpolationElement {
        return new InterpolationElement(this.propertyKey);
    }

    stringify(): string {
        return this.propertyKey;
    }
}

// TODO: separate property access element from interpolation element
// TODO: make it possible to access property (typed or untyped) of the property
export class PropertyInterpolationElement<ForComponent> implements TemplateElement {
    private componentPropertyKey: keyof ForComponent;

    constructor(componentPropertyKey: keyof ForComponent) {
        this.componentPropertyKey = componentPropertyKey;
    }

    stringify(): string {
        return `{{${this.componentPropertyKey}}}`;
    }
}

// TODO: make it possible to add arguments to the function call
export class FunctionCallElement<ForComponent> implements TemplateElement {
    private componentPropertyKey: keyof ForComponent;

    constructor(componentPropertyKey: keyof ForComponent) {
        this.componentPropertyKey = componentPropertyKey;
    }

    stringify(): string {
        return `${this.componentPropertyKey}()`;
    }
}

export interface TemplateClass<ForComponent> {
    getName(): string;
    getTemplateBody(): TemplateElement[];
}

export abstract class Template<ForComponent> implements TemplateClass<ForComponent> {
    private elements: TemplateElement[] = [];

    abstract getName(): string;
    abstract getTemplateBody(): TemplateElement[];

    stringify(): string {
        const elementArray: string[] = [];
        this.getTemplateBody().forEach(element => {
            elementArray.push(element.stringify());
        });
        return elementArray.join('');
    }

    addElement(element: TemplateElement): Template<ForComponent> {
        this.elements.push(element);
        return this;
    }

    el(element: TemplateElement): Template<ForComponent> {
        this.addElement(element);
        return this;
    }

    addElements(element: TemplateElement[]): Template<ForComponent> {
        this.elements = this.elements.concat(element);
        return this;
    }

    els(elements: TemplateElement[]): Template<ForComponent> {
        this.addElements(elements);
        return this;
    }

    getComponentProperty<PropertyKey extends keyof ForComponent>(key: PropertyKey): string {
        return key;
    }

    prop<PropertyKey extends keyof ForComponent>(key: PropertyKey): string {
        return this.getComponentProperty(key);
    }

    interpolateProperty<PropertyKey extends keyof ForComponent>(key: PropertyKey): string {
        return `{{${key}}}`;
    }

    buildTagElement(tag: string): TagElementBuilder {
        return new TagElementBuilder().setTag(tag);
    }

    tag(tag: string): TagElementBuilder {
        return this.buildTagElement(tag);
    }

    createStringElement(str: string): StringElement {
        return new StringElement(str);
    }

    str(str: string): StringElement {
        return this.createStringElement(str);
    }

    createPropertyInterpolationElement<PropertyKey extends keyof ForComponent>(key: PropertyKey): PropertyInterpolationElement<ForComponent> {
        return new PropertyInterpolationElement(key);
    }

    pie<PropertyKey extends keyof ForComponent>(key: PropertyKey): PropertyInterpolationElement<ForComponent> {
        return this.createPropertyInterpolationElement(key);
    }

    createFunctionCallElement<PropertyKey extends keyof ForComponent>(key: PropertyKey): FunctionCallElement<ForComponent> {
        return new FunctionCallElement(key);
    }

    call<FuncKey extends keyof ForComponent>(key: FuncKey): FunctionCallElement<ForComponent> {
        return this.createFunctionCallElement(key);
    }
}

export class TemplateGenerator {
    static getNameOf<T>(template: Template<T>): string {
        return template.getName();
    }
    static makeFileNameFor<T>(template: Template<T>): string {
        return `${template.getName()}.tpl.html`;
    }
    static generateStringFrom<T>(template: Template<T>): string {
        return template.stringify();
    }
}