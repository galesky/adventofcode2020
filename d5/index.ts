import * as fs from "fs";
import * as path from "path";

const source: string = fs.readFileSync(
  path.resolve(__dirname, "source.txt"),
  "utf8"
);

class Seat {
  private seatString: string;
  private rowRange: number = 128; // 0 -> 127
  private colRange: number = 8; // 0 -> 7
  private rolString: string;
  private colString: string;

  constructor(seatString: string) {
    this.seatString = seatString;
    this.rolString = this.seatString.substring(0, 7);
    this.colString = this.seatString.substring(7, 10);
  }

  // 0 -> 127
  public getRowNumber(): number {
    let ceil = this.rowRange;
    let floor = 0;
    let seatRow = -1;

    for (const char of this.rolString) {
      let padding = (ceil - floor) / 2;
      console.log(floor, " ", ceil, " ", padding);
      if (padding == 1) {
        if (char === "F") {
          seatRow = floor;
        } else {
          seatRow = ceil - 1;
        }
        continue;
      }

      if (char === "F") {
        ceil = ceil - padding;
      } else {
        floor = floor + padding;
      }
    }
    return seatRow;
  }

  public getColNumber() {
    let ceil = this.colRange;
    let floor = 0;
    let seatCol = -1;

    for (const char of this.colString) {
      let padding = (ceil - floor) / 2;
      console.log(floor, " ", ceil, " ", padding);
      if (padding == 1) {
        if (char === "L") {
          seatCol = floor;
        } else {
          seatCol = ceil - 1;
        }
        continue;
      }

      if (char === "L") {
        ceil = ceil - padding;
      } else {
        floor = floor + padding;
      }
    }
    return seatCol;
  }

  public getSeatCoords(): { row: number; col: number } {
    return {
      row: this.getRowNumber(),
      col: this.getColNumber(),
    };
  }

  public getSeatNumber(): number {
    const coords = this.getSeatCoords();
    const number = coords.row * 8 + coords.col;
    return number;
  }
}

const seats: string[] = source.split("\n");
const seatsMap = seats.map((seat) => new Seat(seat));

const seatNumbers = seatsMap.map((seat) => seat.getSeatNumber());
console.log(Math.max(...seatNumbers));
const seatNumbersSet = new Set(seatNumbers);
const missingSeats: number[] = [];

const TOTAL_SEAT_NUMBER = 128*8;

for (let i = 1; i < TOTAL_SEAT_NUMBER; i++) {
    if (!seatNumbersSet.has(i)) {
        missingSeats.push(i);
    }
}

for (let seat of missingSeats) {
    if (seat > 50) {
        console.log("My seat is : ", seat)
        break;
    }
}

/**
 * 
 Your seat wasn't at the very front or back, though; the seats with IDs +1 and -1 from yours will be in your list.
 */
