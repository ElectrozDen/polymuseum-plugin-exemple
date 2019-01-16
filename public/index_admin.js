import React from 'react';
import { render} from 'react-dom';
import MyPlugin from '../src/administration';
const App = () => (
    <MyPlugin />
);
render(<App />, document.getElementById("root"));