const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({ size: 'A4', margin: 50 });
const outPath = path.join(__dirname, '..', 'docs', 'PLAN.pdf');
doc.pipe(fs.createWriteStream(outPath));

// ── Colors ────────────────────────────────────────────────
const NAVY   = '#0d1526';
const INDIGO = '#4f46e5';
const PURPLE = '#7c3aed';
const GRAY   = '#475569';
const LIGHT  = '#f8fafc';

// ── Header bar ────────────────────────────────────────────
doc.rect(0, 0, doc.page.width, 100).fill(NAVY);

doc.fontSize(26).fillColor('white').font('Helvetica-Bold')
   .text('MemberPass', 50, 28, { align: 'left' });

doc.fontSize(11).fillColor('#a5b4fc').font('Helvetica')
   .text('Smart Studio Membership & Access Verification System', 50, 60);

// Accent bar
doc.rect(0, 100, doc.page.width, 4).fill(INDIGO);

// ── Problem Statement ─────────────────────────────────────
let y = 125;

function section(title, content, startY) {
  doc.fontSize(10).fillColor(INDIGO).font('Helvetica-Bold')
     .text(title.toUpperCase(), 50, startY, { letterSpacing: 1 });
  doc.moveTo(50, startY + 15).lineTo(doc.page.width - 50, startY + 15)
     .strokeColor('#e0e7ff').lineWidth(1).stroke();
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
     .text(content, 50, startY + 22, { width: doc.page.width - 100, lineGap: 3 });
  return startY + 22 + doc.heightOfString(content, { width: doc.page.width - 100, lineGap: 3 }) + 20;
}

y = section(
  'Problem Statement',
  'Studio owners often struggle to manage memberships manually and prevent expired or inactive members from accessing studio facilities. Paper-based or honour-system approaches lead to revenue loss, security gaps, and administrative overhead.',
  y
);

y = section(
  'How Might We?',
  '"How might we help studio owners ensure that only members with an active membership plan can securely enter their studio through a simple and reliable digital verification system?"',
  y
);

// ── Target Users ──────────────────────────────────────────
doc.fontSize(10).fillColor(INDIGO).font('Helvetica-Bold')
   .text('TARGET USERS', 50, y);
doc.moveTo(50, y + 15).lineTo(doc.page.width - 50, y + 15)
   .strokeColor('#e0e7ff').lineWidth(1).stroke();
y += 22;

const users = ['Studio owners and administrators', 'Receptionists and verification staff', 'Studio members'];
users.forEach(u => {
  doc.circle(58, y + 4, 3).fill(INDIGO);
  doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(u, 70, y);
  y += 16;
});
y += 12;

// ── Five User Actions ─────────────────────────────────────
doc.fontSize(10).fillColor(INDIGO).font('Helvetica-Bold').text('FIVE USER ACTIONS', 50, y);
doc.moveTo(50, y + 15).lineTo(doc.page.width - 50, y + 15).strokeColor('#e0e7ff').lineWidth(1).stroke();
y += 22;

const actions = [
  'Register a new studio member.',
  'Assign an active membership plan.',
  'Generate a digital membership card with QR code.',
  'Scan the QR code at the studio entrance.',
  'Automatically allow or deny entry based on membership validity.',
];
actions.forEach((a, i) => {
  doc.rect(50, y - 2, 20, 16).fill(INDIGO);
  doc.fontSize(10).fillColor('white').font('Helvetica-Bold').text(`${i + 1}`, 50, y, { width: 20, align: 'center' });
  doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(a, 78, y);
  y += 20;
});
y += 10;

// ── Two-column section ────────────────────────────────────
const colW = (doc.page.width - 120) / 2;
const col2X = 50 + colW + 20;

// Proposed Solution
doc.fontSize(10).fillColor(INDIGO).font('Helvetica-Bold').text('PROPOSED SOLUTION', 50, y);
doc.moveTo(50, y + 15).lineTo(50 + colW, y + 15).strokeColor('#e0e7ff').lineWidth(1).stroke();

// Tech Stack
doc.fontSize(10).fillColor(INDIGO).font('Helvetica-Bold').text('TECHNOLOGY STACK', col2X, y);
doc.moveTo(col2X, y + 15).lineTo(col2X + colW, y + 15).strokeColor('#e0e7ff').lineWidth(1).stroke();

y += 22;
const solText = 'Develop a responsive web application that manages studio memberships and uses secure QR-based verification to control studio entry automatically.';
doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(solText, 50, y, { width: colW, lineGap: 3 });

const tech = ['React.js + Vite', 'Tailwind CSS', 'Node.js + Express.js', 'MongoDB + Mongoose', 'JWT Authentication', 'qrcode / html5-qrcode'];
let techY = y;
tech.forEach(t => {
  doc.circle(col2X + 5, techY + 4, 2.5).fill(PURPLE);
  doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(t, col2X + 14, techY);
  techY += 15;
});

y = Math.max(y + doc.heightOfString(solText, { width: colW, lineGap: 3 }), techY) + 20;

// ── Expected Outcome ──────────────────────────────────────
y = section(
  'Expected Outcome',
  'A functional digital membership system that reduces manual verification, prevents unauthorized entry and simplifies studio membership management for gyms and fitness studios of all sizes.',
  y
);

// ── Footer ────────────────────────────────────────────────
const footerY = doc.page.height - 50;
doc.rect(0, footerY - 10, doc.page.width, 60).fill(NAVY);
doc.fontSize(9).fillColor('#94a3b8').font('Helvetica')
   .text('MemberPass  |  Smart Studio Access Verification  |  © 2026', 50, footerY, { align: 'center' });

doc.end();
console.log('PLAN.pdf generated at', outPath);

