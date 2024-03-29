class Elm {
  constructor(c) {
    this.val = c;
    this.dom = document.createElement('div');
    this.dom.className = 'box';
    this.dom.innerText = c;
  }
}

class AnimateQueue {
  constructor(speed = 500) {
    this.q = [];

    this.speed = speed;

    this._loop();
    this.timer = null;
  }

  _loop() {
    this.timer = setInterval(() => {
      const fn = this.q.shift();
      fn && fn();
      if (this.q.length === 0) {
        this.stop();
      }
    }, this.speed);
  }

  nextTick(fn) {
    this.q.push(fn);
  }

  stop() {
    this._clearallTimers();
    this.timer = null;
  }

  _clearallTimers() {
    let endTid = setTimeout(function () {});
    for (let i = 0; i <= endTid; i++) {
      clearTimeout(i);
      clearInterval(i);
    }
  }
}

class Elimination {
  constructor(k, selector, speed) {
    this.stack = [];
    this.limit = k;

    this.animateQueue = new AnimateQueue(speed);
    this.containerDom = document.querySelector(selector);
  }

  insert(c) {
    const elm = new Elm(c);

    this.stack.push(elm);
    this.insertAnimate(elm);

    this.checkToRemove();
  }

  checkToRemove() {
    if (this.stack.length < this.limit) {
      return;
    }

    const lastIndex = this.stack.length - 1;
    const shrinkIndex = lastIndex + 1 - this.limit;
    for (let i = lastIndex; i > shrinkIndex; i--) {
      if (this.stack[i].val !== this.stack[i - 1].val) {
        return;
      }
    }

    const list = [];
    for (let m = this.limit; m > 0; m--) {
      list.push(this.stack.pop());
    }
    this.removeAnimate(list);
  }

  insertAnimate(elm) {
    this.animateQueue.nextTick(() => {
      this.containerDom.appendChild(elm.dom);
      console.log('insert ', elm.val || elm);
    });
  }

  removeAnimate(list) {
    this.animateQueue.nextTick(() => {
      list.forEach((elm) => (elm.dom.className += ' remove'));
    });
    list.forEach((elm) =>
      this.animateQueue.nextTick(() => {
        this.containerDom.removeChild(elm.dom);
        console.log('remove ', elm.val || elm);
      })
    );
  }

  finish() {
    this.animateQueue.nextTick(() => {
      const finishedBox = document.createElement('div');
      finishedBox.innerText = '✅';
      finishedBox.style = 'margin-left: 0.5em;';
      this.containerDom.appendChild(finishedBox);
      console.log('finished');
    });
  }
}
