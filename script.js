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
    #CheckNeighbours(HeightIndex, WidthIndex) {
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
    SimulateLife(WaitTime = 300) {
        this.intervalID = setInterval(() => {
            let iteration = new Promise((resolve, reject) => 
            {
                setTimeout(() => {
                    this.#FirstStep();
                    resolve(WaitTime);
                }, WaitTime)
                
            }).then(WaitTime=> 
            {
                setTimeout(() => {
                    this.#SecondStep2()
                }, WaitTime);
            }); 
        }, WaitTime * 2);
        
    }
    #FirstStep() {
        let elements = document.querySelectorAll('.' + this.AliveCellName);
        
        elements.forEach(e => {
            let id = e.id.split('-');
            let n = this.#CheckNeighbours(+id[0], +id[1]);
            if (n < 2 || n > 3) {
                e.classList.remove(this.AliveCellName);
                e.classList.add(this.DyingCellName);
            };
        });
    }

    #SecondStep() {
        let elements = document.querySelectorAll('.' + this.AliveCellName);
        
        elements.forEach(element => {
            let id = element.id.split('-');
            let h = +id[0];
            let w = +id[1];
            for (let i = h - 1; i <= h + 1; i++) {
                if (this.#CheckNeighbours(i, w - 1) == 3) {
                    let cell = document.getElementById(this.#GetId(i, w - 1))
                    if (cell != null) cell.classList.add(this.NewCellName);
                }
                if (this.#CheckNeighbours(i, w + 1) == 3) {
                    let cell = document.getElementById(this.#GetId(i, w + 1));
                    if (cell != null) cell.classList.add(this.NewCellName);
                }
                if (i != h && this.#CheckNeighbours(i, w) == 3) { 
                    let cell = document.getElementById(this.#GetId(i, w));
                    if (cell != null) document.getElementById(this.#GetId(i, w)).classList.add(this.NewCellName);
                }
            }
        }) 
        elements = document.querySelectorAll('.' + this.NewCellName);
        elements.forEach(element => {
            element.classList.add(this.AliveCellName);
            element.classList.remove(this.NewCellName);
        });
    }

    #SecondStep2() {
        let elements = document.querySelectorAll('.' + this.AliveCellName);
        elements.forEach(e => {
            let id = e.id.split('-'),
                h = +id[0],
                w = +id[1],
                cell = null,
                n = 0;

            n = this.#CheckNeighbours(h - 1, w - 1);
            if (n == 3) document.getElementById(this.#GetId(h - 1, w - 1)).classList.add(this.NewCellName);
            n = this.#CheckNeighbours(h - 1, w);
            if (n == 3) document.getElementById(this.#GetId(h - 1, w)).classList.add(this.NewCellName);
            n = this.#CheckNeighbours(h - 1, w + 1);
            if (n == 3) document.getElementById(this.#GetId(h - 1, w + 1)).classList.add(this.NewCellName);

            n = this.#CheckNeighbours(h, w - 1);
            if (n == 3) document.getElementById(this.#GetId(h, w - 1)).classList.add(this.NewCellName);
            n = this.#CheckNeighbours(h, w + 1);
            if (n == 3) document.getElementById(this.#GetId(h , w + 1)).classList.add(this.NewCellName);

            n = this.#CheckNeighbours(h + 1, w - 1);
            if (n == 3) document.getElementById(this.#GetId(h + 1, w - 1)).classList.add(this.NewCellName);
            n = this.#CheckNeighbours(h + 1, w);
            if (n == 3) document.getElementById(this.#GetId(h + 1, w)).classList.add(this.NewCellName);
            n = this.#CheckNeighbours(h + 1, w + 1);
            if (n == 3) document.getElementById(this.#GetId(h + 1, w + 1)).classList.add(this.NewCellName);
        })

        document.querySelectorAll('.' + this.NewCellName).forEach(e => {
            e.classList.add(this.AliveCellName);
            e.classList.remove(this.NewCellName);
        });

        document.querySelectorAll('.' + this.DyingCellName).forEach(e => {
            e.classList.remove(this.DyingCellName);
        });
    }
}

const Field = new PlayField("tbody", 30, 30, 35, "alive");
Field.CreateTable();
Field.RandomLife(15);
Field.SimulateLife(300);












