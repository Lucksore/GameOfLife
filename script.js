"use strict;";

class PlayField {
    constructor(TableBodySelector, Width, Height, RefreshTime, MarkClassName) {
        this.TableBody = document.querySelector(TableBodySelector);
        this.Width = Width;
        this.Height = Height;
        this.RefreshTime = RefreshTime;
        this.MarkClassName = MarkClassName;
    }

    CreateTable() {
        for (let i = 0; i < this.Height; i++) {
            let tempRow = `<tr>`;
            for (let k = 0; k < this.Width; k++) {
                tempRow += `<td id='${k.toString() + '-' + i.toString()}'></td>`;
            }
            tempRow += "</tr>";
            this.TableBody.innerHTML += tempRow;
        }
    }
    SimulateRandomLife() {
        this.intervalID = setInterval(() => {
            const P = new Promise((resolve, reject) => {
                setTimeout(() => { this.ClearCells(); resolve(); }, this.RefreshTime);
            }).then(() => {
                this.RandomLife();
            });
        }, this.RefreshTime * 2);
    }
    RandomLife() {
        let i = 0;
        while (i < this.Width * this.Height * 0.2) {
            let id = Math.floor(Math.random() * this.Height).toString() + '-' + Math.floor(Math.random() * this.Width).toString();
            let element = document.getElementById(id);
            if (!element.classList.contains(this.MarkClassName))
                element.classList += this.MarkClassName;
            else 
                continue;
            i++;
        }
    }
    ClearCells() { 
        document.querySelectorAll('.' + this.MarkClassName).forEach(element => element.classList.remove(this.MarkClassName));
    }
    SimulateLife() {
        
    }
 
}


const Field = new PlayField("tbody", 20, 20, 35, "alive");
Field.CreateTable();
Field.SimulateRandomLife();






