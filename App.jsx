import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./App.css";

const App = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [color, setColor] = useState("#000000");
  const [font, setFont] = useState("");


  const colors = ["#FF5733", "#3357FF","#33FF57", "#FF33A1","#8fbc8f"];
  const fonts  = ["Arial", "Courier New", "Georgia", "Times New Roman", "Verdana"];
  
  const handleFontChange = (event) => {
    setFont(event.target.value);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await fetch("https://quotes-api-self.vercel.app/quote");
      const data = await response.json();
      setQuote(data.quote);
      setAuthor(data.author);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };
  const downloadAsImage = () => {
    const element = document.getElementById("quote-container");
    html2canvas(element).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "quote.png";
      link.click();
    });
  };
  const downloadAsPDF = () => {
    const element = document.getElementById("quote-container"); 
    const pdf = new jsPDF();
    pdf.html(element, {
      callback: function (doc) {
        doc.save("quote.pdf"); 
      },
      x: 10,
      y: 10,
      width: 180,
      windowWidth: 500,
    });
  };
  
  return (
    <div className="App">
      <div className="main">
      <select
  value={font}
  onChange={handleFontChange}
  style={{ fontFamily: font }} >
        {fonts.map((f, index) => (
          <option style={{ fontFamily: f }} key={index}  value={f}>
            {f}
          </option>
        ))}
      </select>
      <div id="color">
        {colors.map((c, index) => (
          <button className="color" key={index} style={{ backgroundColor: c}} onClick={() => setColor(c)}>
            {c}
          </button>
        ))}
      </div>
      </div>
      <div
        id="quote-container"
        style={{ color: color, padding: "10px", border: "1px solid #ccc" }}
      >
        <p>"{quote}"</p>
        <p>- {author}</p>
        
      </div>
      <div>
      <button onClick={fetchQuote} >Generate</button>
      <button onClick={downloadAsImage} >Download as Image</button>
      <button onClick={downloadAsPDF} >Download as PDF</button>
      </div>
    </div>
  );
};

export default App;
