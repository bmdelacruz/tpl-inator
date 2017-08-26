"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var TemplateElementBuilder = (function () {
    function TemplateElementBuilder() {
        this.templateElement = this.createTemplateElement();
    }
    TemplateElementBuilder.prototype.finish = function () {
        return this.templateElement;
    };
    return TemplateElementBuilder;
}());
exports.TemplateElementBuilder = TemplateElementBuilder;
var ParentTemplateElement = (function () {
    function ParentTemplateElement() {
        this.childElements = [];
        this.attributes = {};
    }
    ParentTemplateElement.prototype.addElement = function (element) {
        this.childElements.push(element);
    };
    ParentTemplateElement.prototype.el = function (element) {
        this.addElement(element);
    };
    ParentTemplateElement.prototype.addElements = function (element) {
        this.childElements = this.childElements.concat(element);
    };
    ParentTemplateElement.prototype.els = function (elements) {
        this.addElements(elements);
    };
    ParentTemplateElement.prototype.addAttribute = function (key, value) {
        this.attributes[key] = value || null;
    };
    ParentTemplateElement.prototype.attr = function (key, value) {
        this.addAttribute(key, value);
    };
    return ParentTemplateElement;
}());
exports.ParentTemplateElement = ParentTemplateElement;
var ParentTemplateElementBuilder = (function (_super) {
    __extends(ParentTemplateElementBuilder, _super);
    function ParentTemplateElementBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ParentTemplateElementBuilder.prototype.addElement = function (element) {
        this.templateElement.addElement(element);
        return this;
    };
    ParentTemplateElementBuilder.prototype.el = function (element) {
        this.templateElement.el(element);
        return this;
    };
    ParentTemplateElementBuilder.prototype.addElements = function (elements) {
        this.templateElement.addElements(elements);
        return this;
    };
    ParentTemplateElementBuilder.prototype.els = function (elements) {
        this.templateElement.els(elements);
        return this;
    };
    ParentTemplateElementBuilder.prototype.addAttribute = function (key, value) {
        this.templateElement.addAttribute(key, value);
        return this;
    };
    ParentTemplateElementBuilder.prototype.attr = function (key, value) {
        this.templateElement.attr(key, value);
        return this;
    };
    return ParentTemplateElementBuilder;
}(TemplateElementBuilder));
exports.ParentTemplateElementBuilder = ParentTemplateElementBuilder;
var TagElement = (function (_super) {
    __extends(TagElement, _super);
    function TagElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TagElement.prototype.setTag = function (tag) {
        this.tag = tag;
    };
    TagElement.prototype.stringify = function () {
        var innerArray = [];
        this.childElements.forEach(function (element) {
            innerArray.push(element.stringify());
        });
        var innerStr = innerArray.join('');
        var attributeArray = [];
        attributeArray.push(TagElement.SPACE_STR);
        for (var key in this.attributes) {
            attributeArray.push("" + key);
            var value = this.attributes[key];
            if (value) {
                attributeArray.push("=\"" + value + "\"", TagElement.SPACE_STR);
            }
            else {
                attributeArray.push(TagElement.SPACE_STR);
            }
        }
        attributeArray.pop(); // pop the trailing SPACE_STR
        var attributeStr = attributeArray.join('');
        return "<" + this.tag + attributeStr + ">" + innerStr + "</" + this.tag + ">";
    };
    TagElement.SPACE_STR = ' ';
    return TagElement;
}(ParentTemplateElement));
exports.TagElement = TagElement;
var TagElementBuilder = (function (_super) {
    __extends(TagElementBuilder, _super);
    function TagElementBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TagElementBuilder.prototype.setTag = function (tag) {
        this.templateElement.setTag(tag);
        return this;
    };
    TagElementBuilder.prototype.createTemplateElement = function () {
        return new TagElement();
    };
    return TagElementBuilder;
}(ParentTemplateElementBuilder));
exports.TagElementBuilder = TagElementBuilder;
var StringElement = (function () {
    function StringElement(str) {
        this.str = str;
    }
    StringElement.prototype.stringify = function () {
        return this.str;
    };
    return StringElement;
}());
exports.StringElement = StringElement;
var InterpolationElement = (function () {
    function InterpolationElement(expression) {
        this.expression = expression;
    }
    InterpolationElement.prototype.stringify = function () {
        return "{{" + this.expression + "}}";
    };
    return InterpolationElement;
}());
exports.InterpolationElement = InterpolationElement;
var AccessorAppendable = (function () {
    function AccessorAppendable() {
        this.previousAccesses = [];
    }
    AccessorAppendable.prototype.access = function (callOrPropertyStr) {
        if (this.previousAccesses.length > 0)
            this.previousAccesses.push('.');
        this.previousAccesses.push(callOrPropertyStr);
    };
    AccessorAppendable.prototype.getPreviousAccesses = function () {
        return this.previousAccesses.join('');
    };
    return AccessorAppendable;
}());
exports.AccessorAppendable = AccessorAppendable;
var PropertyElement = (function (_super) {
    __extends(PropertyElement, _super);
    function PropertyElement(propertyKey) {
        var _this = _super.call(this) || this;
        _this.access(propertyKey);
        return _this;
    }
    PropertyElement.prototype.interpolate = function () {
        return new InterpolationElement(this.getPreviousAccesses());
    };
    PropertyElement.prototype.stringify = function () {
        return this.getPreviousAccesses();
    };
    PropertyElement.prototype.setCurrentType = function (propertyKey) {
        // this.currentType = Object[propertyKey];
    };
    return PropertyElement;
}(AccessorAppendable));
exports.PropertyElement = PropertyElement;
// TODO: separate property access element from interpolation element
// TODO: make it possible to access property (typed or untyped) of the property
var PropertyInterpolationElement = (function () {
    function PropertyInterpolationElement(componentPropertyKey) {
        this.componentPropertyKey = componentPropertyKey;
    }
    PropertyInterpolationElement.prototype.stringify = function () {
        return "{{" + this.componentPropertyKey + "}}";
    };
    return PropertyInterpolationElement;
}());
exports.PropertyInterpolationElement = PropertyInterpolationElement;
// TODO: make it possible to add arguments to the function call
var FunctionCallElement = (function () {
    function FunctionCallElement(componentPropertyKey) {
        this.componentPropertyKey = componentPropertyKey;
    }
    FunctionCallElement.prototype.stringify = function () {
        return this.componentPropertyKey + "()";
    };
    return FunctionCallElement;
}());
exports.FunctionCallElement = FunctionCallElement;
var Template = (function () {
    function Template() {
        this.elements = [];
    }
    Template.prototype.stringify = function () {
        var elementArray = [];
        this.getTemplateBody().forEach(function (element) {
            elementArray.push(element.stringify());
        });
        return elementArray.join('');
    };
    Template.prototype.addElement = function (element) {
        this.elements.push(element);
        return this;
    };
    Template.prototype.el = function (element) {
        this.addElement(element);
        return this;
    };
    Template.prototype.addElements = function (element) {
        this.elements = this.elements.concat(element);
        return this;
    };
    Template.prototype.els = function (elements) {
        this.addElements(elements);
        return this;
    };
    Template.prototype.getComponentProperty = function (key) {
        return key;
    };
    Template.prototype.prop = function (key) {
        return this.getComponentProperty(key);
    };
    Template.prototype.interpolateProperty = function (key) {
        return "{{" + key + "}}";
    };
    Template.prototype.buildTagElement = function (tag) {
        return new TagElementBuilder().setTag(tag);
    };
    Template.prototype.tag = function (tag) {
        return this.buildTagElement(tag);
    };
    Template.prototype.createStringElement = function (str) {
        return new StringElement(str);
    };
    Template.prototype.str = function (str) {
        return this.createStringElement(str);
    };
    Template.prototype.createPropertyInterpolationElement = function (key) {
        return new PropertyInterpolationElement(key);
    };
    Template.prototype.pie = function (key) {
        return this.createPropertyInterpolationElement(key);
    };
    Template.prototype.createFunctionCallElement = function (key) {
        return new FunctionCallElement(key);
    };
    Template.prototype.call = function (key) {
        return this.createFunctionCallElement(key);
    };
    return Template;
}());
exports.Template = Template;
var TemplateGenerator = (function () {
    function TemplateGenerator() {
    }
    TemplateGenerator.getNameOf = function (template) {
        return template.getName();
    };
    TemplateGenerator.makeFileNameFor = function (template) {
        return template.getName() + ".tpl.html";
    };
    TemplateGenerator.generateStringFrom = function (template) {
        return template.stringify();
    };
    return TemplateGenerator;
}());
exports.TemplateGenerator = TemplateGenerator;
