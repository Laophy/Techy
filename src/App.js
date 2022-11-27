import "./App.css";
import React, { useState } from "react";

function App() {
  const [data, setData] = useState("Write-Host 'script is executed'");
  const [loader, setLoader] = useState(false);

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
          outarr[x] = x + 1 + ".";
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
      <textarea id="lineCounter" wrap="off" readonly defaultValue={"1."} />
      <textarea
        id="codeEditor"
        wrap="off"
        cols="1"
        rows="150"
        onChange={(e) => {
          setData(e.target.value);
          setLoader(false);
        }}
        defaultValue={data}
      />
      <div style={{ padding: "15px" }}>
        <p style={{ fontSize: "24px" }}>
          Current File:{" "}
          <b style={{ textDecoration: "underline" }}>
            export/script.ps1 - {loader ? "(Saved!)" : "(Unsaved Changes)"}
          </b>
        </p>
        <button
          className="button"
          id="button"
          style={{ width: "140px", height: "45px", margin: "10px" }}
          onClick={() => {
            loadStuff();
          }}
        >
          Load
        </button>
        <button
          className="button"
          id="button"
          style={{ width: "140px", height: "45px", margin: "10px" }}
          onClick={() => {
            submitStuff(data);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default App;
