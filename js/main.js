import { PlayField } from './PlayField.js';

const Field = new PlayField("tbody", 70, 70, 60);
Field.CreateTable();
Field.RandomLife(30);
setTimeout(() => {
    Field.SimulateLife();
}, 1000);