import React, { Component } from "react";
import { render } from "react-dom";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/markdown/markdown";
import markdownTable from "markdown-table";
import Remarkable from "remarkable";
import "./index.css";

const initialColmuns = 7;
const initialRows = 6;
const getInitialData = () => [
  ["", "Tesla", "Nissan", "Toyota", "Honda", "Mazda", "Ford"],
  ["2017", 10, 11, 12, 13, 15, 16],
  ["2018", 10, 11, 12, 13, 15, 16],
  ["2019", 10, 11, 12, 13, 15, 16],
  ["2020", 10, 11, 12, 13, 15, 16],
  ["2021", 10, 11, 12, 13, 15, 16]
];

const editorOptions = {
  mode: "gfm",
  theme: "material",
  lineNumbers: true
};

const get2DArray = (rows, columns, initial = "") => {
  return JSON.parse(
    JSON.stringify(new Array(rows).fill(new Array(columns).fill(initial)))
  );
};

const Line = () => (
  <div
    style={{ marginTop: "2rem", width: "100%", borderBottom: "1px solid #999" }}
  />
);

class App extends Component {
  constructor(props) {
    super(props);
    this.table = null;
    this.code = null;
    this.state = {
      columns: initialColmuns,
      rows: initialRows,
      preview: "md",
      markdown: ""
    };
  }

  componentDidMount() {
    const self = this;
    this.hot = new Handsontable(this.table, {
      stretchH: "all",
      columns: [...Array(self.state.columns)],
      data: get2DArray(self.state.rows, self.state.columns),
      afterChange(changes, source) {
        if (source === "code" || !changes) return;
        const sourceDataArray = self.hot.getSourceDataArray();
        self.setState({ markdown: markdownTable(sourceDataArray) });
      },
      licenseKey: "non-commercial-and-evaluation"
    });
    this.setState({ markdown: markdownTable(this.hot.getSourceDataArray()) });
  }

  getRawMarkup() {
    var md = new Remarkable();
    return { __html: md.render(this.state.markdown) };
  }
  handleTableSetting(input, e) {
    const value = Number(e.target.value);
    if (value < 1) return;
    const columns = input === "columns" ? value : this.state.columns;
    const rows = input === "rows" ? value : this.state.rows;
    this.hot.updateSettings({
      columns: [...Array(columns)],
      data: get2DArray(rows, columns)
    });
    this.forceUpdate(() => {
      const sourceDataArray = this.hot.getSourceDataArray();
      this.setState({
        [input]: value,
        markdown: markdownTable(sourceDataArray)
      });
    });
  }

  handlePreview(e) {
    this.setState({ preview: e.target.value });
  }

  loadSampleData() {
    this.setState({
      columns: initialColmuns,
      rows: initialRows
    });
    this.hot.updateSettings({
      columns: [...Array(initialColmuns)],
      data: getInitialData()
    });
    this.setState({ markdown: markdownTable(getInitialData()) });
  }

  render() {
    const { columns, rows, preview, markdown } = this.state;
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h1>📝 table2md</h1>
          <iframe
            title="Star hand-dot/table2md on GitHub"
            src="https://ghbtns.com/github-btn.html?user=hand-dot&repo=table2md&type=star&count=true&size=small"
            width="80"
            height="20"
            frameBorder="0"
            scrolling="0"
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          <span style={{ borderBottom: "1px solid" }}>
            Click right button.{" "}
          </span>
          <span>👉</span>
          <button onClick={this.loadSampleData.bind(this)}>
            Load Sample Data
          </button>
          <p style={{ marginLeft: "1rem" }}>
            Convert from Excel-like table to markdown table.
          </p>
        </div>

        <Line />
        <p>
          ●You can edit like Excel!{" "}
          <span>(Paste from Google Sheets or MS Excel also works.)</span>
        </p>
        <div
          style={{
            display: "flex",
            marginBottom: "1rem"
          }}
        >
          <div>
            <label style={{ marginRight: "0.5rem" }} htmlFor="columns">
              columns
            </label>
            <input
              onChange={this.handleTableSetting.bind(this, "columns")}
              id="columns"
              value={columns}
              type="number"
            />
          </div>
          <span style={{ margin: "0 2rem" }}>x</span>
          <div>
            <label style={{ marginRight: "0.5rem" }} htmlFor="rows">
              rows
            </label>
            <input
              onChange={this.handleTableSetting.bind(this, "rows")}
              id="rows"
              value={rows}
              type="number"
            />
          </div>
        </div>
        <div
          ref={node => {
            this.table = node;
          }}
        />
        <Line />
        <p>
          ●Preview <span>(Copy from the MarkDown editor below.)</span>
        </p>
        <div
          style={{
            display: "flex",
            marginBottom: "1rem"
          }}
        >
          <div>
            <label style={{ marginRight: "0.5rem" }} htmlFor="preview-md">
              MarkDown
            </label>
            <input
              id="preview-md"
              checked={preview === "md"}
              onChange={this.handlePreview.bind(this)}
              type="radio"
              value="md"
            />
          </div>
          <span style={{ margin: "0 2rem" }}>/</span>
          <div>
            <label style={{ marginRight: "0.5rem" }} htmlFor="preview-html">
              HTML
            </label>
            <input
              id="preview-html"
              checked={preview === "html"}
              onChange={this.handlePreview.bind(this)}
              type="radio"
              value="html"
            />
          </div>
        </div>
        {preview === "md" ? (
          <CodeMirror value={markdown} options={editorOptions} />
        ) : (
          <div
            className="preview"
            dangerouslySetInnerHTML={this.getRawMarkup()}
          />
        )}
        <Line />
        <div style={{ marginTop: "2rem" }}>
          <a
            style={{ textDecoration: "none", padding: "0 .6em" }}
            href="https://github.com/hand-dot/table2md"
          >
            View the code
          </a>
          <a
            style={{
              textDecoration: "none",
              borderLeft: "1px solid #000",
              padding: "0 .6em"
            }}
            href="https://github.com/hand-dot/table2md/issues"
          >
            Report a bug
          </a>
          <a
            style={{
              textDecoration: "none",
              borderLeft: "1px solid #000",
              padding: "0 .6em"
            }}
            href="https://github.com/hand-dot/table2md/blob/master/package.json"
          >
            Thanks for the OSS library!
          </a>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
