/* eslint-disable no-console */
import TimelineControl from './TimelineControl';
import TimelineDOM from './TimelineDOM';
import TimelineGEO from './TimelineGEO';
import TimelineMemory from './TimelineMemory';

/* элемент блока div в DOM */
const hw = document.querySelector('#hw');

/*
*  создание класса отвечающего за DOM
*  и присвоение ему div элемента
*/
const timelineDOM = new TimelineDOM();
timelineDOM.bindToDOM(hw);

/*
*  создание класса отвечающего за GEO
*  и присвоение ему div элемента
*/
const timelineGEO = new TimelineGEO();

/*
* создание класс управления хранилищем
*/
const storage = new TimelineMemory();

/*
* создание класса отвечающего за контрольт и инициализация класса
*/
const timelineControl = new TimelineControl(timelineDOM, timelineGEO, storage);
timelineControl.init();

console.log('app started');

// const item1 = { date: '2023-08-11', body: 'Some text 1', geo: 'Location 1' };
// const item2 = { date: '2023-08-12', body: 'Some text 2', geo: 'Location 2' };

// storage.addItem(item1);
// storage.addItem(item2);

// console.log(storage.getAllItems());

// storage.clear();

// console.log(storage.getAllItems());
