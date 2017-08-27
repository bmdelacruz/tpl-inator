# tpl-inator
[![npm version](https://badge.fury.io/js/tpl-inator.svg)](https://badge.fury.io/js/tpl-inator)

An experimental template generator that can be used with Angular to enable template static type checking. This had been made possible by the use of Typescript's `keyof` operator. 

By using this template generator, errors in the component's template, e.g. wrong spelling of property and/or function, may be reduced because the properties being accessed on the component's template are now checked during the compilation of code instead of during runtime.

## Sample usage in Angular

```typescript
import { Component } from '@angular/core';
import { Card } from './models/card.model';
import { Template, TemplateElement, TemplateGenerator } from 'tpl-inator';

class AppComponentTemplate extends Template<AppComponent> {
  getName(): string {
    return 'app.component';
  }
  getComponentPrototype(): any {
    return AppComponent.prototype;
  }
  getTemplateBody(): TemplateElement[] {
    return [
      this.tag('h1').attrs({
        
        // Accessing of property AppComponent#selectedCard
        '*ngIf': this.prop('selectedCard').str()
      
        // An incorrectly spelled property name!
        // This line will not compile because AppComponent#selectedCrd does not exist.
        // '*ngIf': this.prop('selectedCrd').str()
        //                    ^~~~~~~~~~~~~
        // Will even be highlighted if using an editor like VS Code
        
      }).els([
        
        // Just another html string
        this.str(`Selected card's rank: `),
        
        // Interpolation of the property access `AppComponent#selectedCard#rank`
        this.prop('selectedCard').prop('rank').itrpl8()
        // For now, this will only check the presence of the component's property
        // on the first call of prop method on the function call chain, i.e.
        // the `prop('rank')` function call will not check if `rank` is really a property
        // of the component's property `selectedCard` from `prop('selectedCard')`.
        
      ]).finish(),
      this.tag('ib-card-container').attrs({
      
        // Accessing of property AppComponent#cards
        '[cards]': this.prop('cards').str(), 

        // calling of function AppComponent#cardClicked
        '(cardClicked)': this.call('cardClicked').arg('$event').str(),
        // For now, the call method will throw a runtime error if the argument
        // is not of type function. Checking the declared arguments like `$event`
        // is not yet possible.

      }).finish()
    ]
  }
}

@Component({
  selector: 'app-root',
  
  // this does the magic :)
  template: TemplateGenerator.generateStringFrom(new AppComponentTemplate()),
  
  // Planning to support separate the generation of the HTML files from
  // the template so you can use this instead. Please look at the next section
  // to know more about this.
  templateUrl: './app.component.tpl.html',
  // 'app.component' is the string i returned on the `getName` function on the
  // template class so i'd just append it with '.tpl.html' and that's the template's
  // file name.
  
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  cards = [
    new Card('A', 'hearts'),
    new Card('2', 'clubs'),
    new Card('6', 'diamonds'),
    new Card('K', 'diamonds', true),
    new Card('10', 'spades')
  ];
  
  selectedCard: Card = null;
  
  cardClicked(card: Card) {
    this.selectedCard = card;
    console.log(JSON.stringify(card));
  }
}
```

The code above will generate the following HTML template.

```html
<h1 *ngIf="selectedCard">Selected card's rank: {{selectedCard.rank}}</h1>
<ib-card-container [cards]="cards" (cardClicked)="cardClicked($event)"></ib-card-container>
```

## Generating HTML files from the template class
This is not yet possible but I've already thought of this. I've thought that if the file which 
contains the template class has a lots of code in it, the file's compilation will take long. So it
is best to separate the template class from the component class. I might be wrong, so feel free to
correct me. *The more you know!*

Instead of passing the string that will be returned by the `TemplateGenerator.generateStringFrom`
to the template property of the Component decorator, simply pass the name of the template you
provided on the override of `getName` function in the `TemplateClass` extension and append it 
with an extension `.tpl.html`.

I'm thinking of adding a hook like mechanism so that after the typescript files compile, 
the next step is to generate or update the HTML files which corresponds to each template classes.
I'm not an expert in such subject but I'll try my best. Of course, anyone's help is much appreciated. :)
