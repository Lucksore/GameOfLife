
export class PlayField {
    constructor(TableBodySelector, Width, Height, RefreshTime, AliveCellName = 'alive', DyingCellName = 'dying', NewCellName = 'newcell') {
        this.TableBody = document.querySelector(TableBodySelector);
        this.Width = Width;
        this.Height = Height;
        this.RefreshTime = RefreshTime;
        this.AliveCellName = AliveCellName;
        this.NewCellName = NewCellName; 
        this.DyingCellName = DyingCellName;
        this.intervalID = null;
    }

    CreateTable() {
        for (let i = 0; i < this.Height; i++) {
            let tempRow = `<tr>`;
            for (let k = 0; k < this.Width; k++) {
                tempRow += `<td id='${this.GetId(i, k)}'></td>`;
            }
            tempRow += "</tr>";
            this.TableBody.innerHTML += tempRow;
        }
        for (let i = 0; i < this.Height; i++) {
            for (let k = 0; k < this.Width; k++) {
                document.getElementById(this.GetId(i, k)).addEventListener('click', e => this.MarkCell(e));
            }
        }
    }

    MarkCell(e) {
        if (e.target.classList.contains(this.AliveCellName)) e.target.classList.remove(this.AliveCellName);
        else e.target.classList.add(this.AliveCellName); 
    }

    GetId(HeightIndex, WidthIndex) {
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
            let id = this.GetId(Math.floor(Math.random() * this.Height), Math.floor(Math.random() * this.Width));
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
        for (let h = HeightIndex - 1; h <= HeightIndex + 1; h++) {
            for (let w = WidthIndex - 1; w <= WidthIndex + 1; w++) {
                tempElement = document.getElementById(`${h.toString()}-${w.toString()}`); 
                if (h == HeightIndex && w == WidthIndex) continue;
                if (tempElement != null && tempElement.classList.contains(this.AliveCellName)) lifeCount++;                
            }
        }
        return lifeCount;
    }

    SimulateLife() {
        this.intervalID = setInterval(() => {
            let iteration = new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.CheckCells();
                    resolve();
                }, this.RefreshTime)
                
            }).then(() => { setTimeout(this.CreateNewGeneration(), this.RefreshTime); }); 
        }, this.RefreshTime * 3);
    }

    CheckCells() {
        let cells = document.querySelectorAll('.' + this.AliveCellName);
        cells.forEach(cell => {
            let id = cell.id.split('-');
            for (let h = +id[0] - 1; h <= +id[0] + 1; h++) {
                for (let w = +id[1] - 1; w <= +id[1] + 1; w++) {
                    if (h == +id[0] && w == +id[1]) {
                        let n = this.CountNeighbours(+id[0], +id[1]);
                        if (n < 2 || n > 3) cell.classList.add(this.DyingCellName);    
                    }
                    else {
                        let nCell = document.getElementById(this.GetId(h, w));
                        if (nCell != null && this.CountNeighbours(h, w) == 3) nCell.classList.add(this.NewCellName);
                    }           
                }
            }
        });
    }
    
    CreateNewGeneration() {
        document.querySelectorAll('.' + this.DyingCellName).forEach(cell => {
            cell.classList.remove(this.DyingCellName);
            cell.classList.remove(this.AliveCellName);
        });
        document.querySelectorAll('.' + this.NewCellName).forEach(cell => {
            cell.classList.remove(this.NewCellName);
            cell.classList.add(this.AliveCellName);
        });
    }
}


















