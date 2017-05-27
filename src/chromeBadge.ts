/*
 This file is part of TALER
 (C) 2016 INRIA

 TALER is free software; you can redistribute it and/or modify it under the
 terms of the GNU General Public License as published by the Free Software
 Foundation; either version 3, or (at your option) any later version.

 TALER is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with
 TALER; see the file COPYING.  If not, see <http://www.gnu.org/licenses/>
 */

import {
  Badge,
} from "./wallet";


/**
 * Polyfill for requestAnimationFrame, which
 * doesn't work from a background page.
 */
function rAF(cb: (ts: number) => void) {
  window.setTimeout(() => {
    cb(performance.now());
  }, 100 /* 100 ms delay between frames */);
}


export class ChromeBadge implements Badge {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  /**
   * True if animation running.  The animation
   * might still be running even if we're not busy anymore,
   * just to transition to the "normal" state in a animated way.
   */
  animationRunning: boolean = false;

  /**
   * Is the wallet still busy? Note that we do not stop the
   * animation immediately when the wallet goes idle, but
   * instead slowly close the gap.
   */
  isBusy: boolean = false;

  /**
   * Current rotation angle, ranges from 0 to rotationAngleMax.
   */
  rotationAngle: number = 0;

  /**
   * While animating, how wide is the current gap in the circle?
   * Ranges from 0 to openMax.
   */
  gapWidth: number = 0;

  /**
   * Maximum value for our rotationAngle, corresponds to 2 Pi.
   */
  static rotationAngleMax = 1000;

  /**
   * How fast do we rotate?  Given in rotation angle (relative to rotationAngleMax) per millisecond.
   */
  static rotationSpeed = 0.5;

  /**
   * How fast to we open?  Given in rotation angle (relative to rotationAngleMax) per millisecond.
   */
  static openSpeed = 0.15;

  /**
   * How fast to we close?  Given as a multiplication factor per frame update.
   */
  static closeSpeed = 0.7;

  /**
   * How far do we open? Given relative to rotationAngleMax.
   */
  static openMax = 100;

  constructor(window?: Window) {
    // Allow injecting another window for testing
    const bg = window || chrome.extension.getBackgroundPage();
    if (!bg) {
      throw Error("no window available");
    }
    this.canvas = bg.document.createElement("canvas");
    // Note: changing the width here means changing the font
    // size in draw() as well!
    this.canvas.width = 32;
    this.canvas.height = 32;
    this.ctx = this.canvas.getContext("2d")!;
    this.draw();
  }

  /**
   * Draw the badge based on the current state.
   */
  private draw() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.canvas.width / 2 - 2, 0, 2 * Math.PI);
    this.ctx.fillStyle = "white";
    this.ctx.fill();

    // move into the center, off by 2 for aligning the "T" with the bottom
    // of the circle.
    this.ctx.translate(0, 2);

    // pick sans-serif font; note: 14px is based on the 32px width above!
    this.ctx.font = "bold 24px sans-serif";
    // draw the "T" perfectly centered (x and y) to the current position
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("T", 0, 0);
    // now move really into the center
    this.ctx.translate(0, -2);
    // start drawing the (possibly open) circle
    this.ctx.beginPath();
    this.ctx.lineWidth = 2.5;
    if (this.animationRunning) {
      /* Draw circle around the "T" with an opening of this.gapWidth */
      const aMax = ChromeBadge.rotationAngleMax;
      const startAngle = this.rotationAngle / aMax * Math.PI * 2;
      const stopAngle = ((this.rotationAngle + aMax - this.gapWidth) / aMax) * Math.PI * 2;
      this.ctx.arc(0, 0, this.canvas.width / 2 - 2, /* radius */ startAngle, stopAngle, false);
    } else {
      /* Draw full circle */
      this.ctx.arc(0, 0,
                   this.canvas.width / 2 - 2, /* radius */
                   0,
                   Math.PI * 2,
                   false);
    }
    this.ctx.stroke();
    // go back to the origin
    this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);

    // Allow running outside the extension for testing
    // tslint:disable-next-line:no-string-literal
    if (window["chrome"] && window.chrome["browserAction"]) {
      try {
        const imageData = this.ctx.getImageData(0,
                                                0,
                                                this.canvas.width,
                                                this.canvas.height);
        chrome.browserAction.setIcon({imageData});
      } catch (e) {
        // Might fail if browser has over-eager canvas fingerprinting countermeasures.
        // There's nothing we can do then ...
      }
    }
  }

  private animate() {
    if (this.animationRunning) {
      return;
    }
    this.animationRunning = true;
    let start: number|undefined;
    const step = (timestamp: number) => {
      if (!this.animationRunning) {
        return;
      }
      if (!start) {
        start = timestamp;
      }
      if (!this.isBusy && 0 === this.gapWidth) {
        // stop if we're close enough to origin
        this.rotationAngle = 0;
      } else {
        this.rotationAngle = (this.rotationAngle + (timestamp - start) *
                              ChromeBadge.rotationSpeed) % ChromeBadge.rotationAngleMax;
      }
      if (this.isBusy) {
        if (this.gapWidth < ChromeBadge.openMax) {
          this.gapWidth += ChromeBadge.openSpeed * (timestamp - start);
        }
        if (this.gapWidth > ChromeBadge.openMax) {
          this.gapWidth = ChromeBadge.openMax;
        }
      } else {
        if (this.gapWidth > 0) {
          this.gapWidth--;
          this.gapWidth *= ChromeBadge.closeSpeed;
        }
      }

      if (this.isBusy || this.gapWidth > 0) {
        start = timestamp;
        rAF(step);
      } else {
        this.animationRunning = false;
      }
      this.draw();
    };
    rAF(step);
  }

  setText(s: string) {
    chrome.browserAction.setBadgeText({text: s});
  }

  setColor(c: string) {
    chrome.browserAction.setBadgeBackgroundColor({color: c});
  }

  startBusy() {
    if (this.isBusy) {
      return;
    }
    this.isBusy = true;
    this.animate();
  }

  stopBusy() {
    this.isBusy = false;
  }
}
