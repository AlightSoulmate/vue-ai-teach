<script lang="ts" setup>
import { useThemeStore } from "@/stores/useThemeStore";

const themeStore = useThemeStore();

const toggleTheme = () => {
  themeStore.toggleTheme();
};
</script>
<!-- <input
  type="checkbox"
  class="input"
  :checked="themeStore.isDarkTheme"
  @click="toggleTheme"
/> -->

<style scoped>
/* a clone from joshwcomeau.com 
   * but this version runs on pure CSS
   */
.grid-content {
  min-height: 55px;
  line-height: 55px;
  display: flex;
  margin-top: -85px;
  transform: scale(0.6);
}

.themeToggle {
  color: #bbb;
  width: 3em;
}

.st-sunMoonThemeToggleBtn {
  position: relative;
  cursor: pointer;
}

.st-sunMoonThemeToggleBtn .themeToggleInput {
  opacity: 0;
  width: 100%;
  aspect-ratio: 1;
}

.st-sunMoonThemeToggleBtn svg {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
  transform: rotate(40deg);
}

.st-sunMoonThemeToggleBtn svg .sunMoon {
  transform-origin: center center;
  transition: inherit;
  transform: scale(1);
}

.st-sunMoonThemeToggleBtn svg .sunRay {
  transform-origin: center center;
  transform: scale(0);
}

.st-sunMoonThemeToggleBtn svg mask > circle {
  transition: transform 0.64s cubic-bezier(0.41, 0.64, 0.32, 1.575);
  transform: translate(0px, 0px);
}

.st-sunMoonThemeToggleBtn svg .sunRay2 {
  animation-delay: 0.05s !important;
}
.st-sunMoonThemeToggleBtn svg .sunRay3 {
  animation-delay: 0.1s !important;
}
.st-sunMoonThemeToggleBtn svg .sunRay4 {
  animation-delay: 0.17s !important;
}
.st-sunMoonThemeToggleBtn svg .sunRay5 {
  animation-delay: 0.25s !important;
}
.st-sunMoonThemeToggleBtn svg .sunRay5 {
  animation-delay: 0.29s !important;
}

.st-sunMoonThemeToggleBtn .themeToggleInput:checked + svg {
  transform: rotate(90deg);
}
.st-sunMoonThemeToggleBtn .themeToggleInput:checked + svg mask > circle {
  transform: translate(16px, -3px);
}
.st-sunMoonThemeToggleBtn .themeToggleInput:checked + svg .sunMoon {
  transform: scale(0.55);
}
.st-sunMoonThemeToggleBtn .themeToggleInput:checked + svg .sunRay {
  animation: showRay1832 0.4s ease 0s 1 forwards;
}

@keyframes showRay1832 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>

<template>
  <div class="grid-content">
    <label
      for="themeToggle"
      class="themeToggle st-sunMoonThemeToggleBtn"
      type="checkbox"
    >
      <input
        type="checkbox"
        :checked="!themeStore.isDarkTheme"
        @click="toggleTheme"
        id="themeToggle"
        class="themeToggleInput"
      />
      <svg
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="currentColor"
        stroke="none"
      >
        <mask id="moon-mask">
          <rect x="0" y="0" width="20" height="20" fill="white"></rect>
          <circle cx="11" cy="3" r="8" fill="black"></circle>
        </mask>
        <circle
          class="sunMoon"
          cx="10"
          cy="10"
          r="8"
          mask="url(#moon-mask)"
        ></circle>
        <g>
          <circle class="sunRay sunRay1" cx="18" cy="10" r="1.5"></circle>
          <circle class="sunRay sunRay2" cx="14" cy="16.928" r="1.5"></circle>
          <circle class="sunRay sunRay3" cx="6" cy="16.928" r="1.5"></circle>
          <circle class="sunRay sunRay4" cx="2" cy="10" r="1.5"></circle>
          <circle class="sunRay sunRay5" cx="6" cy="3.1718" r="1.5"></circle>
          <circle class="sunRay sunRay6" cx="14" cy="3.1718" r="1.5"></circle>
        </g>
      </svg>
    </label>
  </div>
</template>

<!-- <template>
  <div class="grid-content">
    <label class="switch">
      <span class="sun">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g fill="#ffd43b">
            <circle r="5" cy="12" cx="12"></circle>
            <path
              d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"
            ></path>
          </g>
        </svg>
      </span>
      <span class="moon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path
            d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"
          ></path>
        </svg>
      </span>
      <input
        type="checkbox"
        class="input"
        :checked="themeStore.isDarkTheme"
        @click="toggleTheme"
      />
      <span class="slider"></span>
    </label>
  </div>
</template>

<style scoped>
.grid-content {
  min-height: 55px;
  line-height: 55px;
  display: flex;
}

.switch {
  font-size: 17px;
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  margin: 12.5px;
  margin-top: 15px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #73c0fc;
  transition: 0.4s;
  border-radius: 30px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  border-radius: 20px;
  left: 2px;
  bottom: 2px;
  z-index: 2;
  background-color: #e8e8e8;
  transition: 0.4s;
}

.sun svg {
  position: absolute;
  top: 4px;
  left: 27px;
  z-index: 1;
  width: 19px;
  height: 19px;
}

.moon svg {
  fill: #73c0fc;
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 1;
  width: 18px;
  height: 18px;
}

/* .switch:hover */
.sun svg {
  animation: rotate 15s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* .switch:hover */
.moon svg {
  animation: tilt 5s linear infinite;
}

@keyframes tilt {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(-10deg);
  }

  75% {
    transform: rotate(10deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

.input:checked + .slider {
  background-color: #183153;
}

.input:focus + .slider {
  box-shadow: 0 0 1px #183153;
}

.input:checked + .slider:before {
  transform: translateX(24px);
}
</style> -->
