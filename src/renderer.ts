import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';

const container = document.getElementById('app');
if (container) {
  ReactDOM.render(React.createElement(App), container);
}

console.log('👋 This message is being logged by "renderer.js", included via webpack');
