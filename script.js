"use strict;";

function fillTable(table, width, height) {
    for (let i = 0; i < height; i++) {
        let tempRow = `<tr id='${i}'>`;
        for (let k = 0; k < width; k++) {
            tempRow += `<td id='${k.toString() + i.toString()}'></td>`;
        }
        tempRow += "</tr>";
        table.innerHTML += tempRow;
    }
}

function RandomLife(width, height) {
    let i = 0;
    while (i < 100) {
        
        let id = Math.floor(Math.random() * height).toString() + Math.floor(Math.random() * width).toString();
        let element = document.getElementById(id);
        element.classList += "alive";
        i++;
    }
}

const tableBody = document.querySelector("tbody");
fillTable(tableBody, 20, 20);
RandomLife(10, 10);