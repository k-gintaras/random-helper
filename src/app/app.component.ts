import { Component, Input, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  copyArrayItem,
} from '@angular/cdk/drag-drop';

import { WordsService } from './words.service';
import { interval } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl'],
})
export class AppComponent implements OnInit {
  @Input() randomizerOutput: string;
  @Input() sliderValue = 20;
  randomizerMatrix: string[][];
  inputIds = ['isWithSpaces', 'isSentensized'];
  @Input() isWithSpaces = false;
  @Input() isSentensized = false;
  @Input() isJustStart = false;
  @Input() isJustEnd = false;
  @Input() custom: string;
  @Input() panelOpenState: boolean;

  //THIS IS WHERE YOU CAN MANUALLY ADD

  wordMap = this.wordsService.getWordMap();
  wordMapOther = {
    custom: [],
    positive: this.wordsService.getPositive(),
    negative: this.wordsService.getNegative(),
    insult: this.wordsService.getInsult(),
  };
  wordMapSymbols = this.wordsService.getWordMapSymbols();
  // wordMapGrammar = this.wordsService.getWordMapGrammar();
  wordMapParts = this.wordsService.getWordMapParts();
  wordMapWords = this.wordsService.getWordMapWords();
  wordMapNames = this.wordsService.getWordMapNames();

  wordMapChoicesOther = Object.keys(this.wordMapOther);
  wordMapChoices = Object.keys(this.wordMap);
  wordMapChoicesSymbols = Object.keys(this.wordMapSymbols);
  // wordMapChoicesGrammar = Object.keys(this.wordMapGrammar);
  wordMapChoicesParts = Object.keys(this.wordMapParts);
  wordMapChoicesWords = Object.keys(this.wordMapWords);
  wordMapChoicesNames = Object.keys(this.wordMapNames);

  title = 'random-helper';
  todo = this.wordMapChoices;
  done = [];
  previousCustomInputs = ''; // to not update textarea continuously
  previousInputs = []; // to not update textarea continuously

  isExpanded = false;

  constructor(
    private wordsService: WordsService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    const updater = interval(300);
    updater.subscribe(n => this.randomGenerator());
    this.router.events.subscribe(n => {
      if (this.router.url === '/#advanced') {
        this.isExpanded = true;
      }
    });
  }

  updateUrl() {
    if (this.panelOpenState) {
      this.location.replaceState('/#advanced');
    } else {
      this.location.replaceState('/');
    }
  }

  ran(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ranPre(item: string) {
  //   let arr = this.wordMap[item];

  //   if (!arr) {
  //     if (item === 'custom') {
  //       if (this.custom) {
  //         if (this.custom.length) {
  //           if (this.custom.length > 2) {
  //             const customArray = this.custom.split(',');
  //             if (customArray.length > 2) {
  //               arr = customArray;
  //             }
  //           }
  //         }
  //       }
  //     } else {
  //       arr = this.wordMapOther[item];
  //     }
  //   }
  //   return arr[Math.floor(Math.random() * arr.length)];
  // }

  // generateRandomizedList() {
  //   let list = [];
  //   for (let i = 0; i < this.wordMapChoices.length; i++) {
  //     const arr = this.wordMapChoices[i];
  //     const ranStr = this.ran(this.wordMap[arr]);
  //     list.push(ranStr);
  //   }
  //   return list;
  // }
  drop(event: CdkDragDrop<string[]>) {
    // generate textarea each time we copy or rearrange
    // this.randomGenerator(event.container.data);
    if (event.previousContainer !== event.container) {
      if (event.previousContainer.data === this.done) {
        this.done.splice(event.previousIndex, 1);
      }
    }
    if (event.previousContainer === event.container) {
      // just rearrange
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // moving away, copy but not back to suggestions and choices
      if (
        event.container.data !== this.wordMapChoicesSymbols &&
        event.container.data !== this.wordMapChoicesParts &&
        event.container.data !== this.wordMapChoicesWords &&
        event.container.data !== this.wordMapChoicesNames
      ) {
        copyArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
      // transferArrayItem(event.previousContainer.data,
      //                   event.container.data,
      //                   event.previousIndex,
      //                   event.currentIndex);
    }
  }

  regenerate() {
    this.previousInputs = [];
  }

  //TODO allow part of word generated
  //allow example sentence, word, nickname
  refreshGenerator() {
    //this.previousInputs = [];
    let columns = [];
    if (this.randomizerMatrix) {
      for (let i = 0; i < this.randomizerMatrix.length; i++) {
        const row = this.randomizerMatrix[i];
        const tempRow = [];
        for (let j = 0; j < row.length; j++) {
          const element = row[j];
          let tempElement = this.getJustStartSorted(element);
          tempElement = this.getJustEndSorted(tempElement);
          tempRow.push(tempElement);
        }
        let edited = this.getSpacesSorted(tempRow);
        edited = this.getSentenseSorted(edited);

        columns.push(edited);
      }
      columns.sort(
        (a, b) =>
          // ASC  -> a.length - b.length
          // DESC -> b.length - a.length
          a.length - b.length
      );
      columns = Array.from(new Set(columns));
      this.randomizerOutput = columns.join('\n');
    }
  }

  titleGenerator() {
    this.previousInputs = [];
    this.done = ['verb', 'noun'];
    this.isSentensized = true;
    this.isWithSpaces = false;
  }

  nickNameOneGenerator() {
    this.previousInputs = [];
    this.done = ['prefix', 'popFeeling', 'suffix'];
    this.isSentensized = true;
    this.isWithSpaces = false;
  }

  nickNameGirlGenerator() {
    this.previousInputs = [];
    this.done = ['prefix', 'femaleName', 'suffix'];
    this.isSentensized = true;
    this.isWithSpaces = false;
  }

  nickNameBoyGenerator() {
    this.previousInputs = [];
    this.done = ['prefix', 'maleName', 'suffix'];
    this.isSentensized = true;
    this.isWithSpaces = false;
  }

  complimentGenerator() {
    this.previousInputs = [];
    this.done = ['adverb', 'adjective'];
    this.isSentensized = true;
    this.isWithSpaces = true;
  }

  questionGenerator() {
    this.previousInputs = [];
    this.done = ['interrogative', 'noun', 'verb', 'adverb', 'adjective'];
    this.isSentensized = true;
    this.isWithSpaces = true;
  }
  reset() {
    this.previousInputs = [];
    this.previousCustomInputs = '';
    this.custom = '';
    this.done = [];
    this.sliderValue = 20;
    this.randomizerOutput = '';
    this.isSentensized = false;
    this.isWithSpaces = false;
    this.isJustStart = false;
    this.isJustEnd = false;
  }

  vowelWordGenerator() {
    this.previousInputs = [];
    this.done = ['vowel', 'consonant', 'vowel', 'consonant', 'vowel'];
    this.isSentensized = true;
    this.isWithSpaces = false;
  }

  consonantWordGenerator() {
    this.previousInputs = [];
    this.done = ['consonant', 'vowel', 'consonant', 'vowel', 'consonant'];
    this.isSentensized = true;
    this.isWithSpaces = false;
  }

  showRandomExample() {
    const functions = [
      'consonantWordGenerator',
      'vowelWordGenerator',
      'questionGenerator',
      'complimentGenerator',
      'nickNameBoyGenerator',
      'nickNameGirlGenerator',
      'nickNameOneGenerator',
      'titleGenerator',
    ];
    const fun = functions[Math.floor(Math.random() * functions.length)];
    this[fun]();
  }

  randomGenerator() {
    const data = this.getRandomizerInputs();
    //check for custom input
    if (this.custom) {
      if (this.custom.length) {
        if (this.custom.length > 2) {
          const customArray = this.custom.split(',');
          if (customArray.length > 2) {
            this.wordMapOther.custom = customArray;
          }
        }
      }
    }

    //since we don't want to reiterate billion times, we edit on the go with sPAGHETTI
    //don't regenerate if it was already generated from same
    if (
      JSON.stringify(data) !== JSON.stringify(this.previousInputs) ||
      this.custom !== this.previousCustomInputs
    ) {
      if (data && data.length > 0) {
        let columns = [];
        let row = [];
        this.randomizerMatrix = [];

        for (let i = 0; i < 100; i++) {
          let randomizedString = '';
          row = [];
          for (let j = 0; j < data.length; j++) {
            const userInput = data[j];
            let wordMapArray = this.wordMap[userInput];
            //doesn't exist in main, check in other
            if (!wordMapArray) {
              wordMapArray = this.wordMapOther[userInput];
            }
            let randomPick = '';
            // is not edited word and exists in map
            if (wordMapArray) {
              randomPick = this.ran(wordMapArray);
              if (this.isJustStart) {
                randomPick = this.getJustStartSorted(randomPick);
              }
              if (this.isJustEnd) {
                randomPick = this.getJustEndSorted(randomPick);
              }
              //limit length only after slider was moved
              if (this.sliderValue !== 20) {
                let limit = 20;
                if (randomPick) {
                  if (randomPick.length) {
                    while (this.sliderValue < randomPick.length && limit > 0) {
                      randomPick = this.ran(wordMapArray);
                      limit--;
                    }
                  }
                }
              }
            } else {
              randomPick = userInput;
            }
            row.push(randomPick);
          }
          randomizedString = this.getSpacesSorted(row);
          randomizedString = this.getSentenseSorted(randomizedString);

          this.randomizerMatrix.push(row);
          columns.push(randomizedString);
        }
        columns.sort(
          (a, b) =>
            // ASC  -> a.length - b.length
            // DESC -> b.length - a.length
            a.length - b.length
        );
        columns = Array.from(new Set(columns));

        this.randomizerOutput = columns.join('\n');
      }
      this.previousInputs = data;
      this.previousCustomInputs = this.custom;
    }
  }

  getSpacesSorted(str: string[]): string {
    let spaces = '';
    if (this.isWithSpaces) {
      spaces = ' ';
    }
    return str.join(spaces);
  }

  getSentenseSorted(str: string): string {
    if (this.isSentensized) {
      str = this.getSentensized(str);
    }
    return str;
  }

  getJustStartSorted(str: string): string {
    if (this.isJustStart) {
      str = this.getChoppedSorted(str, false);
    }
    return str;
  }

  getJustEndSorted(str: string): string {
    if (this.isJustEnd) {
      str = this.getChoppedSorted(str, true);
    }
    return str;
  }

  getChoppedSorted(str: string, start: boolean): string {
    if (str.length > 6) {
      if (start) {
        str = str.substr(0, str.length - 3);
      } else {
        str = str.substr(3, str.length);
      }
    }
    return str;
  }

  getCapitalizedFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  }

  getSentensized(str: string): string {
    return this.getCapitalizedFirst(str) + '.';
  }

  getRandomizerInputs(): string[] {
    // //generated things are from inputs that can be edited
    const inputs = document.getElementsByTagName('input');
    const data = [];
    // //ignore unavoidable material checkboxes
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const val = input.value;
      if (input.type === 'text' && input.id !== 'customString') {
        data.push(val);
      }
    }
    return data;
  }

  // sentensize() {
  // const randomized=this.randomized.split(
  // for (let iconst randomized=0; i < randomiz.split(ed.length; i++) {
  //   const element = randomized[i];

  // }
  // sentense =
  //           sentense.charAt(0).toUpperCase() +
  //           sentense.substr(1).toLowerCase();
  //         sentense = sentense + '.';
  // }
}
