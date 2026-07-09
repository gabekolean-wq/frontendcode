"use client";

import { useEffect, useState } from "react";

const COLS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

/* A deliberately boring spreadsheet. Deterministic data so there is no
   SSR/hydration mismatch (though it only mounts once opened anyway). */
const DATA: string[][] = [
  ["Category", "Q1", "Q2", "Q3", "Q4", "FY Total", "", "", "", ""],
  ["Salaries & Wages", "412,300", "420,110", "431,880", "440,500", "1,704,790", "", "", "", ""],
  ["Payroll Taxes", "61,845", "63,016", "64,782", "66,075", "255,718", "", "", "", ""],
  ["Health Benefits", "38,200", "38,900", "39,600", "40,300", "157,000", "", "", "", ""],
  ["Office Lease", "54,000", "54,000", "54,000", "54,000", "216,000", "", "", "", ""],
  ["Software Licenses", "22,410", "23,880", "25,120", "26,000", "97,410", "", "", "", ""],
  ["Cloud Infrastructure", "18,720", "20,540", "24,905", "29,110", "93,275", "", "", "", ""],
  ["Travel & Entertainment", "9,340", "12,880", "7,220", "14,050", "43,490", "", "", "", ""],
  ["Marketing", "31,000", "28,500", "45,700", "52,300", "157,500", "", "", "", ""],
  ["Professional Services", "14,600", "9,200", "11,750", "16,400", "51,950", "", "", "", ""],
  ["Office Supplies", "2,140", "1,980", "2,305", "2,560", "8,985", "", "", "", ""],
  ["Utilities", "4,820", "4,610", "4,990", "5,240", "19,660", "", "", "", ""],
  ["Insurance", "7,500", "7,500", "7,500", "7,500", "30,000", "", "", "", ""],
  ["Depreciation", "12,300", "12,300", "12,300", "12,300", "49,200", "", "", "", ""],
  ["Miscellaneous", "3,210", "5,880", "1,940", "4,120", "15,150", "", "", "", ""],
  ["Total OpEx", "692,635", "703,296", "742,692", "770,955", "2,909,578", "", "", "", ""],
];

function FakeSpreadsheet({ onExit }: { onExit: () => void }) {
  // Pad out with blank rows so the grid fills the screen convincingly.
  const blanks = Array.from({ length: 12 }, () => COLS.map(() => ""));
  const rows = [...DATA, ...blanks];

  return (
    <div className="boss-overlay" role="dialog" aria-label="Spreadsheet">
      <div className="boss-titlebar">
        <span className="sheet-icon">⊞</span>
        <span className="boss-title">Q3_Financials_FINAL_v7 (Recovered) — Sheets</span>
      </div>

      <div className="boss-menu">
        {["File", "Edit", "View", "Insert", "Format", "Data", "Tools", "Help"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>

      <div className="boss-toolbar">
        <span>↶</span>
        <span>↷</span>
        <span>🖨</span>
        <span>%</span>
        <span>$</span>
        <span style={{ fontWeight: 700 }}>B</span>
        <span style={{ fontStyle: "italic" }}>I</span>
        <span>Σ</span>
      </div>

      <div className="boss-formula">
        <span className="boss-namebox">A1</span>
        <span className="boss-fx">fx</span>
        <span>Category</span>
      </div>

      <div className="boss-gridwrap">
        <table className="boss-grid">
          <thead>
            <tr>
              <th className="corner" />
              {COLS.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri}>
                <td className="rownum">{ri + 1}</td>
                {r.map((cell, ci) => {
                  const isHeaderRow = ri === 0;
                  const isText = ci === 0 || isHeaderRow;
                  const cls = [
                    isText ? "text" : "",
                    isHeaderRow ? "hdr" : "",
                    ri === 0 && ci === 0 ? "a1" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <td key={ci} className={cls}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="boss-status">
        <span>Sheet1</span>
        <span className="boss-esc" onClick={onExit} title="Return">
          Ready · Press Esc
        </span>
      </div>
    </div>
  );
}

export default function PanicButton() {
  const [panic, setPanic] = useState(false);

  useEffect(() => {
    if (!panic) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPanic(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panic]);

  return (
    <>
      <button
        type="button"
        className="panic-btn"
        aria-label="Panic — hide this page"
        onClick={() => setPanic(true)}
      >
        🚨 PANIC
      </button>
      {panic && <FakeSpreadsheet onExit={() => setPanic(false)} />}
    </>
  );
}
