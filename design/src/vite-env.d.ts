/// <reference types="vite/client" />

import type Router from "./router/Router";

declare global {
  interface Window {
    $router: Router;
  }
}