"use strict";

const { v4: uuidv4 } = require("uuid");

export class Uuid {
  static generate() {
    return uuidv4();
  }
}
