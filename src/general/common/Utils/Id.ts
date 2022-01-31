"use strict";

import { ulid } from "ulid";

export class Id {
  static generate() {
    return ulid();
  }
}
