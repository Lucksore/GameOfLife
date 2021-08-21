"use strict;";

class PlayField {
    constructor(TableBodySelector, Width, Height, RefreshTime, AliveCellName, NewCellName = 'newCell') {
        this.TableBody = document.querySelector(TableBodySelector);
        this.Width = Width;
        this.Height = Height;
        this.RefreshTime = RefreshTime;
        this.AliveCellName = AliveCellName;
        this.NewCellName = NewCellName; 
        this.DyingCellName = "dying";
        this.intervalID = null;
        
    }

    CreateTable() {
        for (let i = 0; i < this.Height; i++) {
            let tempRow = `<tr>`;
            for (let k = 0; k < this.Width; k++) {
                tempRow += `<td id='${this.#GetId(i, k)}'></td>`;
            }
            tempRow += "</tr>";
            this.TableBody.innerHTML += tempRow;
        }
        for (let i = 0; i < this.Height; i++) {
            for (let k = 0; k < this.Width; k++) {
                document.getElementById(this.#GetId(i, k)).addEventListener('click', e => this.#MarkCell(e));
            }
        }
    }
    #MarkCell(e) {
        if (e.target.classList.contains(this.AliveCellName)) e.target.classList.remove(this.AliveCellName);
        else e.target.classList.add(this.AliveCellName); 
    }
    #GetId(HeightIndex, WidthIndex) {
        return HeightIndex.toString() + '-' + WidthIndex.toString();
    }

    SimulateRandomLife(FillPersentage) {
        this.intervalID = setInterval(() => {
            const P = new Promise((resolve, reject) => {
                setTimeout(() => { this.ClearCells(); resolve(); }, this.RefreshTime);
            }).then(() => {
                this.RandomLife(FillPersentage);
            });
        }, this.RefreshTime * 2);
    }
    RandomLife(FillPersentage) {
        let i = 0;
        if (FillPersentage > 100) FillPersentage = 100;
        while (i < this.Width * this.Height * FillPersentage / 100) {
            let id = this.#GetId(Math.floor(Math.random() * this.Height), Math.floor(Math.random() * this.Width));
            let element = document.getElementById(id);
            if (!element.classList.contains(this.AliveCellName))
                element.classList += this.AliveCellName;
            else 
                continue;
            i++;
        }
    }
    ClearCells() { 
        document.querySelectorAll('.' + this.AliveCellName).forEach(element => element.classList.remove(this.AliveCellName));
    }
    TerminateLife() {
        clearInterval(this.intervalID);
    }
    CountNeighbours(HeightIndex, WidthIndex) {
        let lifeCount = 0;
        let tempElement = null;


        tempElement = document.getElementById(`${(HeightIndex - 1).toString()}-${(WidthIndex - 1).toString()}`); 
        if (tempElement != null && tempElement.classList.contains(this.AliveCellName)) lifeCount++;
        tempElement = document.getElementById(`${(HeightIndex - 1).toString()}-${(WidthIndex).toString()}`);
        if (tempElement != null && tempElement.classList.contains(this.AliveCellName)) lifeCount++;
        tempElement = document.getElementById(`${(HeightIndex - 1).toString()}-${(WidthIndex + 1).toString()}`);
        if (tempElement != null && tempElement.classList.contains(this.AliveCellName)) lifeCount++;

        tempElement = document.getElementById(`${(HeightIndex).toString()}-${(WidthIndex - 1).toString()}`);
        if (tempElement != null && tempElement.classList.contains(this.AliveCellName)) lifeCount++;
        tempElement = document.getElementById(`${(HeightIndex).toString()}-${(WidthIndex + 1).toString()}`);
        if (tempElement != null && tempElement.classList.contains(this.AliveCellName)) lifeCount++;
    
        tempElement = document.getElementById(`${(HeightIndex + 1).toString()}-${(WidthIndex - 1).toString()}`);
        if (tempElement != null && tempElement.classList.contains(this.AliveCellName)) lifeCount++;
        tempElement = document.getElementById(`${(HeightIndex + 1).toString()}-${(WidthIndex).toString()}`);
        if (tempElement != null && tempElement.classList.contains(this.AliveCellName)) lifeCount++;
        tempElement = document.getElementById(`${(HeightIndex + 1).toString()}-${(WidthIndex + 1).toString()}`);
        if (tempElement != null && tempElement.classList.contains(this.AliveCellName)) lifeCount++;

        return lifeCount;
    }

    SimulateLife() {
        this.intervalID = setInterval(() => {
            let iteration = new Promise((resolve, reject) => 
            {
                setTimeout(() => {
                    this.CheckCells();
                    resolve();
                }, this.RefreshTime)
                
            }).then(() => {
                setTimeout(() => {
                    this.#CreateNewGeneration();
                    console.log("Iteration completed.");
                }, this.RefreshTime);
            }); 
        }, this.RefreshTime * 3);
    }
    
    CheckCells() {
        for (let h = 0; h < this.Height; h++) {
            for (let w = 0; w < this.Width; w++) {
                if (this.CountNeighbours(h, w) == 3) {
                    let cell = document.getElementById(this.#GetId(h, w));
                    if (!cell.classList.contains(this.AliveCellName)) cell.classList.add(this.NewCellName);
                }
            }
        }
        document.querySelectorAll('.' + this.AliveCellName).forEach(cell => {
            let id = cell.id.split('-');
            let n = this.CountNeighbours(+id[0], +id[1]); 
            if (n < 2 || n > 3) {
                cell.classList.add(this.DyingCellName);
            }
        });
    }

    #CreateNewGeneration() {
        document.querySelectorAll('.' + this.DyingCellName).forEach(c => {
            c.classList.remove(this.DyingCellName);
            c.classList.remove(this.AliveCellName);
        });
        document.querySelectorAll('.' + this.NewCellName).forEach(c => {
            c.classList.remove(this.NewCellName);
            c.classList.add(this.AliveCellName);
        });
    }
    
}

const Field = new PlayField("tbody", 20, 20, 100, "alive");
Field.CreateTable();
setTimeout(() => {
    Field.SimulateLife();
}, 8000);














