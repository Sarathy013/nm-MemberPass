const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({ size: 'A4', margin: 50 });
const outDir = path.join(__dirname, '..', 'docs');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'PLAN.pdf');
doc.pipe(fs.createWriteStream(outPath));

const NAVY   = '#0d1526';
const INDIGO = '#4f46e5';
const PURPLE = '#7c3aed';
const GRAY   = '#475569';

// Header bar
doc.rect(0, 0, doc.page.width, 100).fill(NAVY);
doc.fontSize(26).fillColor('white').font('Helvetica-Bold').text('MemberPass', 50, 28);
doc.fontSize(11).fillColor('#a5b4fc').font('Helvetica').text('Smart Studio Membership & Access Verification System', 50, 60);
doc.rect(0, 100, doc.page.width, 4).fill(INDIGO);

let y = 125;
const pageW = doc.page.width;

function heading(title, yPos) {
  doc.fontSize(9).fillColor(INDIGO).font('Helvetica-Bold').text(title.toUpperCase(), 50, yPos, { characterSpacing: 1 });
  doc.moveTo(50, yPos + 14).lineTo(pageW - 50, yPos + 14).strokeColor('#e0e7ff').lineWidth(0.8).stroke();
  return yPos + 20;
}

function body(text, yPos, opts = {}) {
  doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(text, 50, yPos, { width: pageW - 100, lineGap: 3, ...opts });
  return yPos + doc.heightOfString(text, { width: pageW - 100, lineGap: 3 }) + 14;
}

// Problem Statement
y = heading('Problem Statement', y);
y = body('Studio owners often struggle to manage memberships manually and prevent expired or inactive members from accessing studio facilities. Paper-based or honour-system approaches lead to revenue loss, security gaps and administrative overhead.', y);

// How Might We
y = heading('How Might We?', y);
y = body('"How might we help studio owners ensure that only members with an active membership plan can securely enter their studio through a simple and reliable digital verification system?"', y, { oblique: true });

// Target Users
y = heading('Target Users', y);
['Studio owners and administrators', 'Receptionists and verification staff', 'Studio members'].forEach(u => {
  doc.circle(58, y + 4, 3).fill(INDIGO);
  doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(u, 70, y);
  y += 16;
});
y += 10;

// Five User Actions
y = heading('Five User Actions', y);
['Register a new studio member.',
 'Assign an active membership plan.',
 'Generate a digital membership card with QR code.',
 'Scan the QR code at the studio entrance.',
 'Automatically allow or deny entry based on membership validity.'].forEach((a, i) => {
  doc.rect(50, y, 18, 15).fill(INDIGO);
  doc.fontSize(9).fillColor('white').font('Helvetica-Bold').text(`${i+1}`, 50, y + 2, { width: 18, align: 'center' });
  doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(a, 76, y + 2);
  y += 20;
});
y += 8;

// Two columns
const colW = (pageW - 120) / 2;
const c2 = 50 + colW + 20;
const colY = y;

// Left — Proposed Solution
doc.fontSize(9).fillColor(INDIGO).font('Helvetica-Bold').text('PROPOSED SOLUTION', 50, y, { characterSpacing: 1 });
doc.moveTo(50, y + 14).lineTo(50 + colW, y + 14).strokeColor('#e0e7ff').lineWidth(0.8).stroke();
const solText = 'Develop a responsive web application that manages studio memberships and uses secure QR-based verification to control studio entry automatically and reliably.';
doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(solText, 50, y + 20, { width: colW, lineGap: 3 });
const leftH = y + 20 + doc.heightOfString(solText, { width: colW, lineGap: 3 });

// Right — Tech Stack
doc.fontSize(9).fillColor(INDIGO).font('Helvetica-Bold').text('TECHNOLOGY STACK', c2, y, { characterSpacing: 1 });
doc.moveTo(c2, y + 14).lineTo(c2 + colW, y + 14).strokeColor('#e0e7ff').lineWidth(0.8).stroke();
let ty = y + 20;
['React.js + Vite', 'Tailwind CSS v4', 'Node.js + Express.js', 'MongoDB + Mongoose', 'JWT Auth + bcryptjs', 'qrcode / html5-qrcode'].forEach(t => {
  doc.circle(c2 + 5, ty + 4, 2.5).fill(PURPLE);
  doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(t, c2 + 14, ty);
  ty += 15;
});

y = Math.max(leftH, ty) + 20;

// Expected Outcome
y = heading('Expected Outcome', y);
body('A functional digital membership system that reduces manual verification, prevents unauthorized entry and simplifies studio membership management for gyms and fitness studios of all sizes.', y);

// Footer
const footY = doc.page.height - 50;
doc.rect(0, footY - 10, pageW, 60).fill(NAVY);
doc.fontSize(9).fillColor('#94a3b8').font('Helvetica')
   .text('MemberPass  |  Smart Studio Access Verification  |  © 2026', 50, footY, { align: 'center', width: pageW - 100 });

doc.end();
console.log('PDF written to:', outPath);

