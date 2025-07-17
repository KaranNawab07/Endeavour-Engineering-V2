
import React, { useState } from "react";
import jsPDF from "jspdf";

export default function App() {
  const [tubes, setTubes] = useState([{ od: 0, id: 0, length: 0, qty: 1 }]);
  const [quoteText, setQuoteText] = useState("");

  const handleTubeChange = (index, field, value) => {
    const newTubes = [...tubes];
    newTubes[index][field] = Number(value);
    setTubes(newTubes);
  };

  const addTube = () => {
    setTubes([...tubes, { od: 0, id: 0, length: 0, qty: 1 }]);
  };


  const generateQuote = () => {
    let output = "Dear Sir/Ma'am,\n\n";
    output += "Thank you for your inquiry. Please find below our quotation for the same. Please let us know the quantity required.\n\n";
    output += "QUOTE:\n\n";

    tubes.forEach((tube, i) => {
      const { od, id, length, qty } = tube;
      const thickness = ((od - id) / 2).toFixed(2);
      let material = "Carbon fiber Bi-directional 3K woven fabric + Epoxy resin as matrix.";
      let rate = 13900;
      if (id < 10) {
        material = "Carbon fiber Bi-directional 3K Pre-Preg.";
        rate = 16900;
      }
      const density = 1.65;
      const volume = (Math.PI / 4) * (od ** 2 - id ** 2) * length / 1000;
      const weight = volume * density / 1000;
      const price = Math.round(weight * rate);

      output += `[${i + 1}] Name : Carbon Fiber Round Tube \n\n`;
      output += `Sizes : ${od} mm OD x ${id} mm ID x ${length} mm L (${thickness} mm wall thickness)\n`;
      output += `Finish of surface : Matte finish\n`;
      output += `Material : ${material}\n`;
      output += `Process : Roll wrap.\n`;
      output += `Qty./nos. : ${qty} nos.\n`;
      output += `Price/pc : Rs. ${price}/-\n\n`;
    });

    output += "Note:\n";
    output += "[1] The dimensional tolerance for Tube is : OD +/- 0.1 mm, Length + 2-5 mm.\n\n";
    output += "Terms & Conditions:\n";
    output += "Payment : 50% advance with the Purchase order, balance amount prior to dispatch . \n";
    output += "Taxes : 18 % GST Extra as actual\n";
    output += "Inspection : At our end\n";
    output += "Packing : Extra as actual\n";
    output += "Freight : Extra as actual.\n";
    output += "Validity : 7 days\n\n";
    output += "Hoping to receive your valued order at the earliest.\n\n";
    output += "Best Regards,\nKaran Nawab\nEndeavour Engineering";

    setQuoteText(output);
  };

  const downloadPDF = () => {
    const img = new Image();
    img.src = "/letterhead.jpg";
    img.onload = () => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.addImage(img, "JPEG", 0, 0, pageWidth, pageHeight);

      doc.setFontSize(7);
      let y = 40;
      quoteText.split("\n").forEach(line => {
        if (line.trim() === "QUOTE:" || line.trim() === "Note:" || line.trim() === "Terms & Conditions:") {
          doc.setFont("helvetica", "bold");
        } else {
          doc.setFont("helvetica", "normal");
        }
        if (line.includes("Price/ pcs.")) {
          doc.setTextColor(255, 0, 0);
        } else {
          doc.setTextColor(0, 0, 0);
        }
        doc.text(line, 10, y);
        y += 5;
      });

      doc.save("quotation.pdf");
    };
    img.onerror = () => alert("Failed to load letterhead image.");
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "700px", margin: "auto" }}>
      {tubes.map((tube, i) => (
        <div key={i} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
          <h4>Tube {i + 1}</h4>
          <input type="number" placeholder="OD (mm)" onChange={e => handleTubeChange(i, "od", e.target.value)} />{" "}
          <input type="number" placeholder="ID (mm)" onChange={e => handleTubeChange(i, "id", e.target.value)} />{" "}
          <input type="number" placeholder="Length (mm)" onChange={e => handleTubeChange(i, "length", e.target.value)} />{" "}
          <input type="number" placeholder="Quantity" defaultValue={1} onChange={e => handleTubeChange(i, "qty", e.target.value)} />
        </div>
      ))}

      <button onClick={addTube} style={{ marginRight: "1rem" }}>+ Add Tube</button>
      <button onClick={generateQuote} style={{ marginRight: "1rem" }}>Generate Quote</button>
      <button onClick={downloadPDF}>Download PDF</button>

      {quoteText && (
        <pre style={{ marginTop: "2rem", whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "1rem", border: "1px solid #ccc" }}>
          {quoteText}
        </pre>
      )}
    </div>
  );
}
