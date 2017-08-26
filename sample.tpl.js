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
var index_1 = require("./index");
var SampleComponent = (function () {
    function SampleComponent() {
        this.name = '';
        this.address = '';
    }
    SampleComponent.prototype.sayHello = function () {
        alert("Hello, " + this.name);
    };
    return SampleComponent;
}());
var SampleTpl = (function (_super) {
    __extends(SampleTpl, _super);
    function SampleTpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SampleTpl.prototype.getName = function () {
        return 'sample';
    };
    SampleTpl.prototype.getTemplateBody = function () {
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
    };
    return SampleTpl;
}(index_1.Template));
var template = new SampleTpl();
console.log(index_1.TemplateGenerator.makeFileNameFor(template));
console.log(index_1.TemplateGenerator.generateStringFrom(template));
