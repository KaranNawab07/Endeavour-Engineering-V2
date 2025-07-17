
import React, { useState } from "react";
import jsPDF from "jspdf";

export default function App() {
  const [entries, setEntries] = useState([]);

  const addEntry = (type) => {
    setEntries([
      ...entries,
      {
        type,
        od: "", id: "", length: "",
        l: "", w: "", t: "",
        qty: 1,
        price: 0,
        material: "",
      }
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;

    const entry = updated[index];
    if (entry.type === "tube" && entry.od && entry.id && entry.length) {
      const thickness = (parseFloat(entry.od) - parseFloat(entry.id)) / 2;
      const vol = (Math.PI / 4) * (Math.pow(entry.od, 2) - Math.pow(entry.id, 2)) * entry.length / 1000;
      const weight = vol * 1.65 / 1000;
      const price = Math.round(weight * 13900 / 100) * 100;
      entry.price = price;
      entry.material = "Carbon fiber Bi-directional 3K woven fabric + Epoxy resin as matrix.";
    }

    if (entry.type === "sheet" && entry.l && entry.w && entry.t) {
      const vol = entry.l * entry.w * entry.t;
      const weight = vol * 1.65 / 1000;
      const price = Math.round(weight * 13500 / 100) * 100;
      entry.price = price;
      entry.material = entry.t > 1.5
        ? "Carbon fiber Bi-directional 3K + 12K woven fabric + Epoxy resin as matrix."
        : "Carbon fiber Bi-directional 3K woven fabric + Epoxy resin as matrix.";
    }

    setEntries(updated);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = "/letterhead.jpg";

    img.onload = () => {
      doc.addImage(img, "JPEG", 0, 0, 210, 297);
      doc.setFontSize(7);
      let y = 60;
      doc.text("Dear Sir/Ma'am,", 15, y);
      y += 6;
      doc.text("Thank you for your inquiry. Please find below our quotation for the same. Please let us know the quantity required.", 15, y);
      y += 10;
      doc.text("QUOTE:", 15, y);
      y += 8;

      entries.forEach((entry, idx) => {
        const thickness = entry.type === "tube"
          ? ((entry.od - entry.id) / 2).toFixed(2)
          : entry.t;

        const sizeText = entry.type === "tube"
          ? `${entry.od} mm OD x ${entry.id} mm ID x ${entry.length} mm L (${thickness} mm wall thickness)`
          : `${entry.l} mm L x ${entry.w} mm W x ${thickness} mm thickness`;

        doc.text(`[${idx + 1}] Name : Carbon Fiber ${entry.type === "tube" ? "Round Tube 🔘" : "Sheet ⬛"}`, 15, y);
        y += 5;
        doc.text(`Sizes : ${sizeText}`, 15, y);
        y += 5;
        doc.text(`Finish of surface : ${entry.type === "tube" ? "Matte" : "Glossy"} finish`, 15, y);
        y += 5;
        doc.text(`Material : ${entry.material}`, 15, y);
        y += 5;
        doc.text(`Process : ${entry.type === "tube" ? "Roll wrap." : "Wet layup compression process."}`, 15, y);
        y += 5;
        doc.text(`Qty./nos. : ${entry.qty} nos.`, 15, y);
        y += 5;
        doc.setTextColor(255, 0, 0);
        doc.text(`Price/pc : Rs. ${entry.price}/-`, 15, y);
        doc.setTextColor(0, 0, 0);
        y += 8;
      });

      doc.text("Note:", 15, y);
      y += 5;
      doc.text("[1] The dimensional tolerance for Tube is : OD +/- 0.1 mm, Length + 2-5 mm.", 15, y);
      y += 10;
      doc.text("Terms & Conditions:", 15, y);
      y += 5;
      doc.text("Payment : 50% advance with the Purchase order, balance amount prior to dispatch .", 15, y);
      y += 5;
      doc.text("Taxes : 18 % GST Extra as actual", 15, y);
      y += 5;
      doc.text("Inspection : At our end", 15, y);
      y += 5;
      doc.text("Packing : Extra as actual", 15, y);
      y += 5;
      doc.text("Freight : Extra as actual.", 15, y);
      y += 5;
      doc.text("Validity : 7 days", 15, y);
      y += 10;
      doc.text("Hoping to receive your valued order at the earliest.", 15, y);
      y += 8;
      doc.text("Best Regards,", 15, y);
      y += 5;
      doc.text("Karan Nawab", 15, y);
      y += 5;
      doc.text("Endeavour Engineering", 15, y);

      doc.save("quotation.pdf");
    };

    img.onerror = () => alert("Failed to load letterhead image.");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", fontSize: "14px" }}>
      <h2>Carbon Fiber Quote Generator</h2>
      <button onClick={() => addEntry("tube")}>+ Add Tube</button>
      <button onClick={() => addEntry("sheet")} style={{ marginLeft: "10px" }}>+ Add Sheet</button>
      {entries.map((entry, index) => (
        <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
          <h4>{entry.type === "tube" ? "Tube Entry" : "Sheet Entry"} #{index + 1}</h4>
          {entry.type === "tube" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <input placeholder="OD (mm)" type="number" value={entry.od} onChange={e => handleChange(index, "od", +e.target.value)} />
              <input placeholder="ID (mm)" type="number" value={entry.id} onChange={e => handleChange(index, "id", +e.target.value)} />
              <input placeholder="Length (mm)" type="number" value={entry.length} onChange={e => handleChange(index, "length", +e.target.value)} />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <input placeholder="Length (mm)" type="number" value={entry.l} onChange={e => handleChange(index, "l", +e.target.value)} />
              <input placeholder="Width (mm)" type="number" value={entry.w} onChange={e => handleChange(index, "w", +e.target.value)} />
              <input placeholder="Thickness (mm)" type="number" value={entry.t} onChange={e => handleChange(index, "t", +e.target.value)} />
            </div>
          )}
          <input placeholder="Quantity" type="number" value={entry.qty} onChange={e => handleChange(index, "qty", +e.target.value)} />
        </div>
      ))}
      {entries.length > 0 && (
        <button style={{ marginTop: "20px" }} onClick={downloadPDF}>Download PDF</button>
      )}
    </div>
  );
}
