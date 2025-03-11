<style scoped>
  .card {
    width: 100%;
    height: 100%;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    color: white;
    text-align: center;
  }

  .card p {
    font-size: 14px;
    color: white;
  }

  .slider {
    width: 100%;
    height: var(--height);
    overflow: hidden;
    mask-image: linear-gradient(to right, transparent, #000 10% 90%, transparent);
  }
  .slider .list {
    display: flex;
    width: 100%;
    min-width: calc(var(--width) * var(--quantity));
    position: relative;
  }
  .slider .list .item {
    width: var(--width);
    height: var(--height);
    position: absolute;
    left: 100%;
    animation: autoRun 10s linear infinite;
    transition: filter 0.5s;
    animation-delay: calc(
      (10s / var(--quantity)) * (var(--position) - 1) - 10s
    ) !important;
  }
  .slider .list .item img {
    width: 100%;
  }
  @keyframes autoRun {
    from {
      left: 100%;
    }
    to {
      left: calc(var(--width) * -1);
    }
  }
  .slider:hover .item {
    animation-play-state: paused !important;
    filter: grayscale(1);
  }
  .slider .item:hover {
    filter: grayscale(0);
  }
  .slider[reverse="true"] .item {
    animation: reversePlay 10s linear infinite;
  }
  @keyframes reversePlay {
    from {
      left: calc(var(--width) * -1);
    }
    to {
      left: 100%;
    }
  }
</style>

<template>
  <div
    class="slider"
    style="--width: 200px;
      --height: 200px;
      --quantity: 9;"
  >
    <div class="list">
      <div class="item" style="--position: 1">
        <div
          class="card"
          style="background: linear-gradient(to right, #ff7e5f, #feb47b)"
        >
          <p>HELLO THERE</p>
          <p>Am Ashwin.A</p>
        </div>
      </div>
      <div class="item" style="--position: 2">
        <div
          class="card"
          style="background: linear-gradient(to right, #6a11cb, #2575fc)"
        >
          <p>Do follow on Insta</p>
          <p>ashwin_ambar_</p>
        </div>
      </div>
      <div class="item" style="--position: 3">
        <div
          class="card"
          style="background: linear-gradient(to right, #00c6ff, #0072ff)"
        >
          <p>Replace cards with images</p>
          <p>for a image slider</p>
        </div>
      </div>
      <div class="item" style="--position: 4">
        <div
          class="card"
          style="background: linear-gradient(to right, #ff512f, #dd2476)"
        >
          <p>Html css only</p>
          <p>Hover to stop the slides</p>
        </div>
      </div>
      <div class="item" style="--position: 5">
        <div
          class="card"
          style="background: linear-gradient(to right, #ffb6c1, #ff69b4)"
        >
          <p>Card 5</p>
          <p>Content for card 5</p>
        </div>
      </div>
      <div class="item" style="--position: 6">
        <div
          class="card"
          style="background: linear-gradient(to right, #ff9a8b, #ffc3a0)"
        >
          <p>Card 6</p>
          <p>Content for card 6</p>
        </div>
      </div>
      <div class="item" style="--position: 7">
        <div
          class="card"
          style="background: linear-gradient(to right, #a1c4fd, #c2e9fb)"
        >
          <p>Card 7</p>
          <p>Modify it and use</p>
        </div>
      </div>
      <div class="item" style="--position: 8">
        <div
          class="card"
          style="background: linear-gradient(to right, #fbc2eb, #a18cd1)"
        >
          <p>Card 8</p>
          <p>Content for card 8</p>
        </div>
      </div>
      <div class="item" style="--position: 9">
        <div
          class="card"
          style="background: linear-gradient(to right, #84fab0, #8fd3f4)"
        >
          <p>card 9</p>
          <p>Content for card 9</p>
        </div>
      </div>
    </div>
  </div>
</template>
