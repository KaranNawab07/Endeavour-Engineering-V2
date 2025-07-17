
import React, { useState } from "react";
import jsPDF from "jspdf";
import letterhead from "/letterhead.jpg";

export default function App() {
  const [tubes, setTubes] = useState([{ od: 0, id: 0, length: 0, qty: 1 }]);

  const handleTubeChange = (index, field, value) => {
    const newTubes = [...tubes];
    newTubes[index][field] = Number(value);
    setTubes(newTubes);
  };

  const addTube = () => {
    setTubes([...tubes, { od: 0, id: 0, length: 0, qty: 1 }]);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.addImage(letterhead, "JPEG", 0, 0, pageWidth, pageHeight);

    let y = 40;
    doc.setFontSize(5);
    doc.setTextColor(0, 0, 0);
    doc.text("Thank you for your inquiry. Please find below our quotation for the same.", 10, y);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.text("QUOTE:", 10, y);
    y += 6;

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

      doc.setFont("helvetica", "bold");
      doc.text(`[${i + 1}] Name : Carbon Fiber Round Tube`, 10, y);
      y += 5;
      doc.text(`Sizes :  ${od} mm OD x ${id} mm ID x ${length} mm L [ ${thickness} mm thickness]`, 10, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.text("Finish of surface : Matte finish", 10, y);
      y += 5;
      doc.text(`Material : ${material}`, 10, y);
      y += 5;
      doc.text("Process : Roll wrap", 10, y);
      y += 5;
      doc.text(`Qty./lot required : ${qty} nos`, 10, y);
      y += 5;
      doc.setTextColor(255, 0, 0);
      doc.text(`Price/ pcs. : Rs.${price}/-`, 10, y);
      doc.setTextColor(0, 0, 0);
      y += 8;
    });

    doc.setFont("helvetica", "bold");
    doc.text("Note:", 10, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text("[1] The dimensional tolerance for Tube is : OD +/- 0.1 mm, Length + 2-5 mm.", 10, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Terms & Conditions:", 10, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    [
      "Payment : 50% advance along with the Purchase order, remaining amount to be paid prior to dispatch .",
      "Taxes : 18 % GST Extra as actual",
      "Inspection : At our end",
      "Packing : Extra as actual",
      "Freight : Extra as actual.",
      "Validity : 7 days."
    ].forEach(t => { doc.text(t, 10, y); y += 5; });

    y += 5;
    doc.text("Hoping to receive your valued order.", 10, y);
    doc.save("quotation.pdf");
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
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
}
