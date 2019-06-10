import React, { Component } from 'react';
import { render } from 'react-dom';
import React from 'react';
import debounce from 'lodash/debounce';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/markdown/markdown';
import markdownTable from 'markdown-table';
import Remarkable from "remarkable";
import './style.css';

const editorOptions = {
  mode: "gfm",
  theme: 'material',
  lineNumbers: true,
};

const get2DArray = (rows, columns, initial = '') => {
  return JSON.parse(JSON.stringify((new Array(rows)).fill((new Array(columns)).fill(initial))))
}

class App extends Component {
  constructor(props) {
    super(props);
    this.table = null;
    this.code = null;
    this.state = {
      columns: 5,
      rows: 10,
      markdown: 'hello'
    };
  }

  componentDidMount() {
    const self = this;
    this.hot = new Handsontable(this.table, {
      columns: [...Array(self.state.columns)],
      data: get2DArray(self.state.rows, self.state.columns),
      afterChange(changes, source) {
        if (source === 'code' || !changes) return;
        const sourceDataArray = self.hot.getSourceDataArray();
        self.setState({ markdown: markdownTable(sourceDataArray) })
      },
      licenseKey: 'non-commercial-and-evaluation'
    });
    this.setState({ markdown: markdownTable(this.hot.getSourceDataArray()) })
  }

  getRawMarkup() {
    var md = new Remarkable();
    return { __html: md.render(this.state.markdown) };
  }
  handleInput(input, e) {
    const value = Number(e.target.value);
    if (value < 1) return;
    this.setState({ [input]: value });
  }

  render() {
    const { columns, rows, markdown } = this.state;
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <div>
            <label htmlFor="columns">columns</label>
            <input onChange={this.handleInput.bind(this, 'columns')} id="columns" value={columns} type="number" />
          </div>
          <span>x</span>
          <div>
            <label htmlFor="rows">rows</label>
            <input onChange={this.handleInput.bind(this, 'rows')} id="rows" value={rows} type="number" />
          </div>
        </div>
        <div ref={(node) => { this.table = node; }} />
        <CodeMirror
          value={markdown}
          options={editorOptions}
        />
        <div
          className="preview"
          dangerouslySetInnerHTML={this.getRawMarkup()}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
