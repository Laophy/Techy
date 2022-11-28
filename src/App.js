import "./App.css";
import React, { useState, useEffect } from "react";
import textfile from "./base.txt";

function App() {
  const [data, setData] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    Notes();
  }, []);

  function Notes() {
    fetch(textfile)
      .then((response) => response.text())
      .then((textContent) => {
        setData(textContent);
      });
    return data || "Loading...";
  }

  const submitStuff = (data) => {
    window.api.send(data);
    console.log(data);

    setLoader(true);
  };

  const loadStuff = () => {
    console.log("load stuff");
    window.api.loadScript();
  };

  var codeEditor = document.getElementById("codeEditor");
  var lineCounter = document.getElementById("lineCounter");

  if (codeEditor) {
    codeEditor.addEventListener("scroll", () => {
      lineCounter.scrollTop = codeEditor.scrollTop;
      lineCounter.scrollLeft = codeEditor.scrollLeft;
    });

    codeEditor.addEventListener("keydown", (e) => {
      let { keyCode } = e;
      let { value, selectionStart, selectionEnd } = codeEditor;
      if (keyCode === 9) {
        // TAB = 9
        e.preventDefault();
        codeEditor.value =
          value.slice(0, selectionStart) + "\t" + value.slice(selectionEnd);
        codeEditor.setSelectionRange(selectionStart + 2, selectionStart + 2);
      }
    });

    var lineCountCache = 0;
    function line_counter() {
      var lineCount = codeEditor.value.split("\n").length;
      var outarr = new Array();
      if (lineCountCache !== lineCount) {
        for (var x = 0; x < lineCount; x++) {
          outarr[x] = x + 1 + " ";
        }
        lineCounter.value = outarr.join("\n");
      }
      lineCountCache = lineCount;
    }
    codeEditor.addEventListener("input", () => {
      line_counter();
    });
  }

  return (
    <div className="App">
      <div
        className="filebar"
        style={{
          width: "100%",
          height: "45px",
          backgroundColor: "#474747",
        }}
      >
        <ul>
          <li>[TECHY]</li>
          <li>File</li>
          <li>Edit</li>
          <li
            onClick={() => {
              loadStuff();
            }}
          >
            Load
          </li>
          <li
            onClick={() => {
              submitStuff(data);
            }}
          >
            Save
          </li>
          <li>Help</li>
          <li style={{ float: "right", color: "yellow" }}>
            export/script.ps1 - {loader ? "(Saved!)" : "(Unsaved Changes)"}
          </li>
        </ul>
      </div>
      <div
        className="codepen"
        style={{ width: "100%", height: "100%", float: "left" }}
      >
        <textarea id="lineCounter" wrap="off" defaultValue={"1 "} disabled />
        <textarea
          id="codeEditor"
          wrap="off"
          cols="1"
          rows="200"
          onChange={(e) => {
            setData(e.target.value);
            setLoader(false);
          }}
          defaultValue={data}
        />
      </div>
    </div>
  );
}

export default App;
