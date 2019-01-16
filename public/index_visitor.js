import React from 'react';
import { render} from 'react-dom';
import MyPlugin from '../src/visitor';
const App = () => (
    <MyPlugin />
);
render(<App />, document.getElementById("root"));