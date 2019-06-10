import React, { Component } from 'react';
import { render } from 'react-dom';
import React from 'react';
import debounce from 'lodash/debounce';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import markdownTable from 'markdown-table';
import Remarkable from "remarkable";
// import hljs from 'highlight.js/lib/highlight';
import 'highlight.js/styles/github.css';

const editorOptions = {
  height: '600px',
  mode: 'markdown',
  theme: 'material',
  lineNumbers: true,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.table = null;
    this.code = null;
    this.state = {
      markdown: 'hello'
    };
  }

  componentDidMount() {
    const self = this;
    this.hot = new Handsontable(this.table, {
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
    var md = new Remarkable('full', {
      html: false,        // Enable HTML tags in source
      xhtmlOut: false,        // Use '/' to close single tags (<br />)
      breaks: false,        // Convert '\n' in paragraphs into <br>
      langPrefix: 'language-',  // CSS language prefix for fenced blocks
      linkify: true,         // autoconvert URL-like texts to links
      linkTarget: '',           // set target to open link in

      // Enable some language-neutral replacements + quotes beautification
      typographer: false,

      // Double + single quotes replacement pairs, when typographer enabled,
      // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
      quotes: '“”‘’',

      // Highlighter function. Should return escaped HTML,
      // or '' if input not changed
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) { }
        }

        try {
          return hljs.highlightAuto(str).value;
        } catch (__) { }

        return ''; // use external default escaping
      }
    });
    return { __html: md.render(this.state.markdown) };
  }


  render() {
    const { markdown } = this.state;
    return (
      <div>
        <div ref={(node) => { this.table = node; }} />
        <CodeMirror
          value={markdown}
          options={editorOptions}
        />
        <div
          dangerouslySetInnerHTML={this.getRawMarkup()}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
