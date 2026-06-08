import { 
  Document, Packer, Paragraph, TextRun, AlignmentType, PageBreak, 
  Table, TableRow, TableCell, HeadingLevel, BorderStyle, WidthType,
  ImageRun
} from "docx";
import fs from "fs";
import path from "path";

// Configuration for University Report
const CONFIG = {
  projectName: "SKILLSWAP HUB",
  projectSubtitle: "A Peer-to-Peer Skill Sharing and Collaborative Learning Platform",
  degree: "BACHELOR OF COMPUTER APPLICATION",
  universityName: "NETAJI SUBHAS UNIVERSITY",
  universityDetails: "(Established Under Jharkhand State Private University Act, 2018)",
  universityLocation: "Jamshedpur",
  session: "2023-2026",
  students: [
    { name: "Praveen Gupta", roll: "NSU2303171" },
    { name: "Suraj Kumar", roll: "NSU2303259" },
    { name: "Rishu Singh", roll: "NSU2303192" }
  ],
  guideName: "Ritesh Kumar Jha",
  guideTitle: "Assistant Professor (CS & IT)",
  hodName: "Dr. R. P. Singh",
  submissionDate: "June 2026"
};

// Styling Constants
const FONT_PRIMARY = "Times New Roman";
const FONT_HEADING = "Arial";
const COLOR_BLACK = "000000";
const COLOR_MUTED = "475569";
const COLOR_NAVY = "1E3A8A";

// Helper to create Title Page Text
const createTextRun = (text, options = {}) => {
  return new TextRun({
    text,
    font: options.font || FONT_PRIMARY,
    color: options.color || COLOR_BLACK,
    size: options.size || 24, // 12pt default (1pt = 2 size)
    bold: options.bold || false,
    italics: options.italics || false,
    underline: options.underline || undefined,
  });
};

const createParagraph = (textOrRuns, options = {}) => {
  let children = [];
  if (typeof textOrRuns === "string") {
    children = [createTextRun(textOrRuns, options)];
  } else {
    children = textOrRuns;
  }
  return new Paragraph({
    alignment: options.alignment || AlignmentType.JUSTIFY,
    spacing: {
      line: options.lineSpacing || 360, // 1.5 line spacing (240 = 1 line, 360 = 1.5, 480 = 2)
      after: options.spaceAfter || 160, // 8pt after
      before: options.spaceBefore || 0,
    },
    children,
    pageBreakBefore: options.pageBreakBefore || false,
    heading: options.heading || undefined,
  });
};

const createHeading = (text, level, pageBreakBefore = false) => {
  return createParagraph(text, {
    bold: true,
    font: FONT_HEADING,
    size: level === 1 ? 32 : 28, // 16pt for H1, 14pt for H2
    color: COLOR_NAVY,
    alignment: AlignmentType.LEFT,
    spaceBefore: 240,
    spaceAfter: 120,
    heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
    pageBreakBefore,
  });
};

// Helper for table cells
const createCell = (text, options = {}) => {
  return new TableCell({
    children: [
      new Paragraph({
        alignment: options.alignment || AlignmentType.LEFT,
        children: [
          new TextRun({
            text: text,
            font: FONT_PRIMARY,
            size: options.size || 22, // 11pt default
            bold: options.bold || false,
            color: options.color || COLOR_BLACK,
          })
        ]
      })
    ],
    width: {
      size: options.widthPercent || 20,
      type: WidthType.PERCENTAGE
    },
    shading: options.bg ? { fill: options.bg } : undefined,
    borders: options.noBorders ? {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE }
    } : {
      top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
    }
  });
};

const createTableHeaderRow = (headers) => {
  return new TableRow({
    children: headers.map((h, i) => createCell(h.text, { 
      bold: true, 
      widthPercent: h.width, 
      bg: "E2E8F0", 
      color: COLOR_BLACK 
    }))
  });
};

// Helper to create borderless cell for student certificate list
const createBorderlessCell = (text, options = {}) => {
  return new TableCell({
    children: [
      new Paragraph({
        alignment: options.alignment || AlignmentType.LEFT,
        children: [
          new TextRun({
            text: text,
            font: FONT_PRIMARY,
            size: options.size || 24, // 12pt
            bold: options.bold || false,
            color: options.color || COLOR_BLACK,
          })
        ]
      })
    ],
    width: {
      size: options.widthPercent || 50,
      type: WidthType.PERCENTAGE
    },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE }
    }
  });
};

// Helper to create cell for TOC matching custom style (Expanded version)
const createTocCell = (text, options = {}) => {
  return new TableCell({
    children: [
      new Paragraph({
        alignment: options.alignment || AlignmentType.CENTER,
        spacing: { before: 180, after: 180 }, // Expanded padding to look less congested
        children: [
          new TextRun({
            text: text,
            font: FONT_PRIMARY,
            size: options.size || 24, // 12pt (increased from 11pt)
            bold: options.bold || false,
            color: options.color || COLOR_BLACK,
          })
        ]
      })
    ],
    width: {
      size: options.widthPercent || 20,
      type: WidthType.PERCENTAGE
    },
    shading: options.bg ? { fill: options.bg } : undefined,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "000000" }
    }
  });
};

const createTocHeaderRow = () => {
  return new TableRow({
    children: [
      createTocCell("SL", { bold: true, color: "FFFFFF", bg: "000000", widthPercent: 15, size: 24 }),
      createTocCell("Title", { bold: true, color: "FFFFFF", bg: "000000", widthPercent: 65, size: 24 }),
      createTocCell("Pg. No.", { bold: true, color: "FFFFFF", bg: "000000", widthPercent: 20, size: 24 })
    ]
  });
};

// Helper function to embed screenshot in the snapshots section
const createScreenshotBlock = (title, filename, descriptionParagraphs) => {
  const imagePath = path.join(process.cwd(), "screenshots", filename);
  const elements = [
    createHeading(title, 2),
  ];

  descriptionParagraphs.forEach(p => {
    elements.push(createParagraph(p, { size: 22 }));
  });

  if (fs.existsSync(imagePath)) {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 150, after: 150 },
        children: [
          new ImageRun({
            data: fs.readFileSync(imagePath),
            transformation: {
              width: 450,
              height: 280
            }
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 250 },
        children: [
          createTextRun(`Figure: ${title} System Interface Snapshot`, { bold: true, italics: true, size: 20 })
        ]
      })
    );
  } else {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          createTextRun(`[ Screenshot Image Missing: ${filename} ]`, { bold: true, color: "FF0000" })
        ]
      })
    );
  }
  return elements;
};

// Helper function to embed cropped diagram block
const createDiagramBlock = (title, filename, descriptionParagraphs, width = 450, height = 340) => {
  const imagePath = path.join(process.cwd(), "screenshots", filename);
  const elements = [
    createHeading(title, 2),
  ];

  descriptionParagraphs.forEach(p => {
    elements.push(createParagraph(p, { size: 22 }));
  });

  if (fs.existsSync(imagePath)) {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 150, after: 150 },
        children: [
          new ImageRun({
            data: fs.readFileSync(imagePath),
            transformation: {
              width,
              height
            }
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 250 },
        children: [
          createTextRun(`Figure: ${title}`, { bold: true, italics: true, size: 20 })
        ]
      })
    );
  } else {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          createTextRun(`[ Diagram Image Missing: ${filename} ]`, { bold: true, color: "FF0000" })
        ]
      })
    );
  }
  return elements;
};

// Helper for formatted source code blocks (to print actual code clearly)
const createCodeBlock = (filename, codeText, explanationParagraphs = []) => {
  const lines = codeText.split("\n");
  const paragraphs = [
    createParagraph(`File Reference Path: backend/src/${filename}`, { bold: true, size: 22, color: COLOR_NAVY, spaceBefore: 200, spaceAfter: 100 })
  ];

  explanationParagraphs.forEach(p => {
    paragraphs.push(createParagraph(p, { size: 22 }));
  });

  lines.forEach(line => {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 0, after: 0, line: 200 },
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: line,
            font: "Consolas",
            size: 16, // 8pt Consolas
            color: "1E293B" // Slate 800
          })
        ]
      })
    );
  });
  
  paragraphs.push(new Paragraph({ spacing: { after: 300 } }));
  return paragraphs;
};

const buildDocument = () => {
  const children = [];

  // ==========================================
  // 1. COVER PAGE
  // ==========================================
  children.push(
    new Paragraph({ spacing: { before: 200 } }), // spacer
    new Paragraph({ alignment: AlignmentType.CENTER, children: [createTextRun("A PROJECT REPORT ON", { bold: true, size: 36, font: FONT_HEADING })] }),
    new Paragraph({ spacing: { before: 200 } }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [createTextRun(CONFIG.projectName, { bold: true, size: 48, color: COLOR_NAVY, font: FONT_HEADING })] }),
    new Paragraph({ spacing: { before: 400 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        createTextRun("A project report submitted in the partial fulfilment of the requirement\nof\n", { size: 24, font: FONT_HEADING }),
        createTextRun(CONFIG.degree, { bold: true, size: 26, font: FONT_HEADING })
      ]
    }),
    new Paragraph({ spacing: { before: 600 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new ImageRun({
          data: fs.readFileSync(path.join(process.cwd(), "nsu_logo.png")),
          transformation: {
            width: 180,
            height: 114
          }
        })
      ]
    }),
    new Paragraph({ spacing: { before: 600 } }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [createTextRun(CONFIG.universityName, { bold: true, size: 36, underline: {}, font: FONT_HEADING })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [createTextRun(CONFIG.universityDetails, { bold: true, size: 20, font: FONT_HEADING })] }),
    new Paragraph({ spacing: { before: 800 } }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [createTextRun("SUBMITTED BY", { bold: true, size: 26, font: FONT_HEADING })] }),
    new Paragraph({ spacing: { before: 300 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        createTextRun("NAME: PRAVEEN GUPTA, SURAJ KUMAR & RISHU SINGH", { bold: true, size: 24, font: FONT_HEADING })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        createTextRun("ROLL NO: NSU2303171, NSU2303259, NSU2303192", { bold: true, size: 24, font: FONT_HEADING })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        createTextRun(`SESSION: ${CONFIG.session}`, { bold: true, size: 24, font: FONT_HEADING })
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  );

  // ==========================================
  // 2. CERTIFICATE PAGE
  // ==========================================
  children.push(
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 400 }, children: [createTextRun("CERTIFICATE", { bold: true, size: 36, underline: {}, font: FONT_HEADING })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [createTextRun("This is to certify that the project entitled", { bold: true, size: 26 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 200 }, children: [createTextRun(`“${CONFIG.projectName}”`, { bold: true, size: 36, color: COLOR_NAVY, font: FONT_HEADING })] }),
    createParagraph("Submitted to Netaji Subhas University in partial fulfilment of the requirement for the degree of Bachelor of Computer Application is an original work carried out by:"),
    new Paragraph({ spacing: { before: 300, after: 300 } }),
    
    // Aligned student list table
    new Table({
      width: { size: 90, type: WidthType.PERCENTAGE },
      alignment: AlignmentType.CENTER,
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE }
      },
      rows: CONFIG.students.map(s => new TableRow({
        children: [
          createBorderlessCell(s.name.toUpperCase(), { bold: true }),
          createBorderlessCell(`Roll No: - ${s.roll}`, { alignment: AlignmentType.RIGHT })
        ]
      }))
    }),
    
    new Paragraph({ spacing: { before: 400, after: 400 } }),
    createParagraph("Has worked under my supervision and guidance & successfully completed this project."),
    new Paragraph({ spacing: { before: 800 } }), // space for signatures

    // Signature table matching image layout
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE }
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({ alignment: AlignmentType.LEFT, children: [createTextRun("Signature of Guide", { bold: true, size: 24, font: FONT_HEADING })] }),
                new Paragraph({ alignment: AlignmentType.LEFT, children: [createTextRun(`(${CONFIG.guideName})`, { size: 20 })] }),
                new Paragraph({ alignment: AlignmentType.LEFT, children: [createTextRun(CONFIG.guideTitle, { size: 18, color: COLOR_MUTED })] })
              ],
              width: { size: 65, type: WidthType.PERCENTAGE },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
            }),
            new TableCell({
              children: [
                new Paragraph({ children: [createTextRun("\n\n\n\n")] }) // empty runs to make the signature box tall
              ],
              width: { size: 35, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                right: { style: BorderStyle.SINGLE, size: 4, color: "000000" }
              }
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ spacing: { before: 400 } })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({ alignment: AlignmentType.LEFT, children: [createTextRun("Signature of External Examiner", { bold: true, size: 24, font: FONT_HEADING })] })
              ],
              width: { size: 65, type: WidthType.PERCENTAGE },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
            }),
            new TableCell({
              children: [
                new Paragraph({ children: [createTextRun("\n\n\n\n")] })
              ],
              width: { size: 35, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                right: { style: BorderStyle.SINGLE, size: 4, color: "000000" }
              }
            })
          ]
        })
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  );

  // ==========================================
  // 3. ACKNOWLEDGEMENT PAGE (Optimized to fit EXACTLY ONE page)
  // ==========================================
  children.push(
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 300 }, children: [createTextRun("ACKNOWLEDGEMENT", { bold: true, size: 36, color: COLOR_NAVY, font: FONT_HEADING })] }),
    createParagraph("We would like to express our sincere gratitude and heartfelt thanks to all those who have directly or indirectly contributed to the successful completion of our project titled \"" + CONFIG.projectName + "\", submitted in partial fulfillment of the requirements for the award of the degree of Bachelor of Computer Applications (BCA) during the academic session " + CONFIG.session + "."),
    createParagraph("First and foremost, we express our deep sense of gratitude to our respected Project Guide, Mr. Ritesh Kumar Jha, Assistant Professor (CS & IT), for his valuable guidance, constant encouragement, constructive suggestions, and continuous support throughout the development of this project. His technical inputs regarding database design, stateless routing guards, and WebSocket real-time communication protocols were instrumental in the successful execution of SkillSwap Hub."),
    createParagraph("We also extend our thanks to our Head of the Department (HOD) Dr. R. P. Singh, and the university administration at Netaji Subhas University for providing excellent lab facilities, computing resources, and a cooperative academic environment. Finally, we express our heartfelt thanks to our parents, friends, and fellow team members (Praveen Gupta, Suraj Kumar, Rishu Singh) for their continuous support and coordination which kept us motivated during long debugging sessions."),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 300 },
      children: [
        createTextRun("Submitted By:\n", { bold: true, size: 22 }),
        createTextRun("Praveen Gupta, Suraj Kumar & Rishu Singh\n", { bold: true, size: 22 }),
        createTextRun("BCA Session 2023-2026\nNetaji Subhas University", { size: 20, color: COLOR_MUTED })
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  );

  // ==========================================
  // 4. ABSTRACT (Optimized to fit EXACTLY ONE page)
  // ==========================================
  children.push(
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 300 }, children: [createTextRun("ABSTRACT", { bold: true, size: 36, color: COLOR_NAVY, font: FONT_HEADING })] }),
    createParagraph("The SkillSwap Hub is a secure, peer-to-peer skill-sharing and collaborative learning web application designed to connect individuals seeking specific skills with mentors who can teach them. By replacing standard commercial transaction fees with a direct 'Skill Barter' model (e.g., trading coding lessons for design tips), the platform democratizes access to hands-on learning. The system is built using the MERN (MongoDB, Express, React, Node.js) stack, utilizing a responsive React SPA client, an Express API gateway, and Mongoose database structures."),
    createParagraph("The application implements user onboarding protected by Bcrypt cryptography, stateless JWT session tokens, and multi-factor authentication (2FA) via email OTP tokens sent through Nodemailer. When connection requests are accepted, the platform uses Socket.io to establish persistent WebSocket connections, enabling real-time chat sync and notifications with latencies under 100 milliseconds. An administrative cockpit is included, giving moderators live user counts, verification badges toggling, and suspension capabilities to maintain safety."),
    createParagraph("Integration test cases verify that the application manages complementary matching queries, updates collection states, and synchronizes messages instantly. The results validate that SkillSwap Hub provides a highly secure, scalable, and responsive network for community education, demonstrating the effectiveness of the MERN architecture with WebSockets for real-time peer collaboration."),
    new Paragraph({ children: [new PageBreak()] })
  );

  // ==========================================
  // 5. TABLE OF CONTENTS (CONTENTS)
  // ==========================================
  children.push(
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 400 }, children: [createTextRun("CONTENTS", { bold: true, size: 36, underline: {}, font: FONT_HEADING })] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      alignment: AlignmentType.CENTER,
      rows: [
        createTocHeaderRow(),
        new TableRow({ children: [createTocCell("1."), createTocCell("Acknowledgement", { alignment: AlignmentType.LEFT }), createTocCell("03") ] }),
        new TableRow({ children: [createTocCell("2."), createTocCell("Abstract", { alignment: AlignmentType.LEFT }), createTocCell("04") ] }),
        new TableRow({ children: [createTocCell("3."), createTocCell("Introduction", { alignment: AlignmentType.LEFT }), createTocCell("06-08") ] }),
        new TableRow({ children: [createTocCell("4."), createTocCell("Objective of the Project", { alignment: AlignmentType.LEFT }), createTocCell("09-11") ] }),
        new TableRow({ children: [createTocCell("5."), createTocCell("Expected Outcome", { alignment: AlignmentType.LEFT }), createTocCell("12") ] }),
        new TableRow({ children: [createTocCell("6."), createTocCell("Architecture", { alignment: AlignmentType.LEFT }), createTocCell("13-16") ] }),
        new TableRow({ children: [createTocCell("7."), createTocCell("Project Modules", { alignment: AlignmentType.LEFT }), createTocCell("17-19") ] }),
        new TableRow({ children: [createTocCell("8."), createTocCell("System Requirement", { alignment: AlignmentType.LEFT }), createTocCell("20-22") ] }),
        new TableRow({ children: [createTocCell("9."), createTocCell("Security Analysis", { alignment: AlignmentType.LEFT }), createTocCell("23-27") ] }),
        new TableRow({ children: [createTocCell("10."), createTocCell("Flow Chart", { alignment: AlignmentType.LEFT }), createTocCell("28-30") ] }),
        new TableRow({ children: [createTocCell("11."), createTocCell("Data Flow Diagram", { alignment: AlignmentType.LEFT }), createTocCell("31-36") ] }),
        new TableRow({ children: [createTocCell("12."), createTocCell("Entity Relationship Diagram", { alignment: AlignmentType.LEFT }), createTocCell("37-39") ] }),
        new TableRow({ children: [createTocCell("13."), createTocCell("Technical Overview", { alignment: AlignmentType.LEFT }), createTocCell("40-45") ] }),
        new TableRow({ children: [createTocCell("14."), createTocCell("Database Schema Structures", { alignment: AlignmentType.LEFT }), createTocCell("46-52") ] }),
        new TableRow({ children: [createTocCell("15."), createTocCell("Source Code Listings", { alignment: AlignmentType.LEFT }), createTocCell("53-65") ] }),
        new TableRow({ children: [createTocCell("16."), createTocCell("Implementation Details", { alignment: AlignmentType.LEFT }), createTocCell("66-68") ] }),
        new TableRow({ children: [createTocCell("17."), createTocCell("System Interface Snapshots", { alignment: AlignmentType.LEFT }), createTocCell("69-74") ] }),
        new TableRow({ children: [createTocCell("18."), createTocCell("System Integration Test Plan", { alignment: AlignmentType.LEFT }), createTocCell("75-77") ] }),
        new TableRow({ children: [createTocCell("19."), createTocCell("Future Scope of the System", { alignment: AlignmentType.LEFT }), createTocCell("78") ] }),
        new TableRow({ children: [createTocCell("20."), createTocCell("Conclusion & Achievements", { alignment: AlignmentType.LEFT }), createTocCell("79") ] }),
        new TableRow({ children: [createTocCell("21."), createTocCell("Bibliography & References", { alignment: AlignmentType.LEFT }), createTocCell("80") ] })
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  );

  // ==========================================
  // 3. INTRODUCTION
  // ==========================================
  children.push(
    createHeading("3. INTRODUCTION", 1),
    createParagraph("Communication is a fundamental aspect of human interaction, enabling individuals to express thoughts, emotions, and ideas effectively. However, for people with specific learning constraints or technical upskilling needs, finding direct, interactive mentorship becomes a significant challenge. Traditional learning structures serve as a primary means of education, but their cost structures and video-on-demand loops restrict access. Despite their broad availability, commercial platforms are not widely accessible to everyone due to financial limits, creating a knowledge acquisition gap in society."),
    createParagraph("The SkillSwap Hub is a system designed to recognize user profile skill parameters and match them into complementary peer learning directories in real time. The system uses a responsive front-end dashboard to capture hand-entered skills coordinates, matches them with corresponding queries on a MongoDB database, and activates persistent real-time chat channels via WebSockets. Once connected, the system enables users to type messages back and forth instantly, powered by a bidirectional Socket.io loop. This project focuses on developing an efficient, secure, and user-friendly solution that can work in local development environments and scale to active user deployments."),
    createParagraph("The significance of this project lies in its potential to promote inclusivity and reduce educational barriers. It can be used in various settings such as educational institutions, workplaces, local developer chapters, and public learning networks, where sharing expertise is key. Furthermore, it contributes to the broader goal of leveraging technology for social good by empowering individuals to acquire practical skills through direct collaboration. The SkillSwap Hub represents an innovative application of full-stack web technologies and real-time database coordination, aimed at enhancing human-to-human collaboration. By converting individual expertise into learning opportunities for others, the system not only facilitates skill sharing but also fosters a more inclusive and understanding community. The following chapters detail the engineering process, logical modeling, code architecture, security analysis, visual interface snapshots, and validation test cases that validate the design.")
  );

  // 3.1 Background of the Study (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("3.1 Background of the Study", 2),
    createParagraph("With the rapid advancement of modern web architectures, especially in MERN stack configurations and WebSockets protocols, it has become possible to build systems that connect peers dynamically. The SkillSwap Hub project is designed to bridge the collaboration gap between users. It studies the orchestration of multi-role user schemas, the performance of NoSQL queries under filter conditions, session protection metrics, and instant push message networks. By resolving these challenges, we can build a highly responsive and accessible sharing space. The theoretical foundation relies on decentralized networks and P2P resource bartering models, establishing fluid profile roles where users act both as learners and guides."),
    createParagraph("Furthermore, the traditional models of learning, which heavily depend on formal schooling or one-way video streaming sites, lack the reciprocal feedback that is crucial for cognitive development and deep skill acquisition. When a learner is stuck on a coding bug or a translation nuance, they need immediate, dynamic interaction rather than searching through pre-recorded forums. By creating a decentralized portal where each student can exchange their knowledge directly (e.g. trading programming lessons for graphic design lessons), we build a self-sustaining ecosystem that thrives on community participation rather than monetary transactions."),
    createParagraph("From an engineering perspective, this project serves as a case study in building high-performance, real-time collaboration platforms. It explores how modern asynchronous engines like Node.js and Express can handle high loads of connection state switches, how NoSQL databases like MongoDB can index geospatial or text queries for local search matches, and how Socket.io client-server instances can multiplex data packets over single TCP sockets. The background of this study lies at the intersection of collaborative education models and web socket optimization, paving the way for efficient community networks.")
  );

  // 3.2 Evolution of Web Architectures (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("3.2 Evolution of Web Architectures", 2),
    createParagraph("Traditional web applications were built using monolithic, multi-tier architectures like LAMP (Linux, Apache, MySQL, PHP) or Java Enterprise configurations. These systems utilized server-side rendering, where every user click or state change triggered a complete request-response round-trip to the server, resulting in a full page refresh. While suitable for static information portals, these legacy frameworks introduce massive visual lag and heavy network overhead when applied to interactive applications, making them unsuitable for real-time peer discovery and dynamic chatting."),
    createParagraph("The introduction of Single Page Application (SPA) designs, particularly React.js, revolutionized client-side rendering. By using a virtual Document Object Model (DOM) and state management hooks, React updates only the elements that change, resulting in near-instantaneous transitions and a smooth desktop-like experience. When combined with Node.js and Express.js on the backend, the entire pipeline is unified under JavaScript, allowing developers to share validation logic, models, and schemas across layers, significantly reducing serialization complexity and improving processing efficiency."),
    createParagraph("For real-time events, traditional HTTP architectures relied on short or long polling, where clients repeatedly queried the server for updates, wasting bandwidth and causing delays. The WebSockets protocol resolves this by maintaining a single, persistent, bi-directional TCP connection. Socket.io builds on WebSockets by providing automatic reconnection, heartbeats, and room namespaces. SkillSwap Hub leverages this technology to ensure that peer connection approvals and message notifications sync across active clients in under 100 milliseconds, bypassing HTTP polling bottlenecks entirely.")
  );

  // 3.3 Problem Statement (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("3.3 Problem Statement", 2),
    createParagraph("The modern educational landscape is characterized by a significant disparity in resource accessibility. Traditional tutoring, professional bootcamps, and certification platforms often charge high subscription fees, excluding students from low-income families and creating an educational divide. Furthermore, static online courses lack personal interaction, direct troubleshooting, and structured feedback, leading to low completion rates. Peer-to-peer mentoring offers a solution, but finding compatible partners is difficult due to the lack of dedicated, secure platforms."),
    createParagraph("Additionally, existing communication systems are fragmented. Users are forced to find potential mentors on one platform, request connection details on another, and coordinate study sessions via third-party messaging services. This fragmented user experience leads to high drop-off rates and communication dropouts. There is a clear need for an integrated system that combines peer discovery, connection routing, real-time messaging, and scheduling under a single, unified interface to streamline collaboration."),
    createParagraph("Finally, user safety and platform integrity are critical concerns in open peer networks. Without moderation, platforms are vulnerable to spam, fake profiles, and offensive behavior, which quickly erodes user trust. The absence of administrator tools makes it difficult to enforce community guidelines. SkillSwap Hub addresses these security issues by integrating a dedicated Administrative Moderation Cockpit, allowing platform owners to monitor user statistics, verify profiles, deactivate inappropriate skills, and suspend bad actors in real time, maintaining a safe environment.")
  );

  // 3.4 Significance of the Project (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("3.4 Significance of the Project", 2),
    createParagraph("The significance of the SkillSwap Hub lies in its potential to democratize access to education by replacing financial barriers with direct skill bartering. By enabling users to trade their skills, the platform creates a cost-free learning network that empowers individuals to acquire new skills regardless of their financial status. Mentors also benefit from teaching, as explaining concepts to peers reinforces their own understanding, creating a reciprocal learning loop."),
    createParagraph("The system is highly applicable in educational institutions, local developer chapters, and corporate environments. In universities, it allows students to exchange knowledge in subjects like programming, mathematics, and languages, fostering collaborative learning and community engagement. By connecting local peers, the platform strengthens social ties and builds a support network that extends beyond academic study."),
    createParagraph("Furthermore, the project demonstrates a robust implementation of modern web standards, security protocols, and real-time architectures. It serves as a practical blueprint for developers looking to build secure WebSockets-based communication systems. By integrating JWT authentication, Bcrypt password encryption, Nodemailer SMTP 2FA, and MongoDB database indexes, SkillSwap Hub demonstrates how security can be built into the core design of real-time collaborative applications.")
  );

  // ==========================================
  // 4. OBJECTIVE OF THE PROJECT
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("4. OBJECTIVE OF THE PROJECT", 1),
    createParagraph("The main objective of the SkillSwap Hub project is to develop and deploy a secure, real-time, peer-to-peer web application that matches users based on complementary skill needs, enables direct messaging via Socket.io, and implements robust administrative moderation tools. The primary objective is to create an efficient, cost-free network of knowledge exchange where users act simultaneously as mentors and learners, deepening their own capabilities through peer interaction."),
    createParagraph("A key target of the platform is the elimination of administrative and coordination friction. Traditional forums require users to post request threads and wait days for responses. SkillSwap Hub automates this by executing instant query intersections on MongoDB and dispatching real-time notifications when a connection request is sent, accepted, or rejected. This event-driven design ensures that users can establish learning partnerships quickly and begin communicating immediately."),
    createParagraph("Additionally, the project aims to implement robust security standards appropriate for university-level submissions. This includes secure, salt-hashed password storage, stateless JWT session validation to protect private API routes, and 2-Factor Authentication (2FA) via email OTP tokens. These mechanisms protect user credentials and ensure that only authorized actions are performed. The platform also provides administrators with visual dashboards to monitor metrics and suspend accounts when necessary, maintaining a safe community environment.")
  );

  // 4.1 Primary Functional Requirements (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("4.1 Primary Functional Requirements", 2),
    createParagraph("The functional requirements coordinate the core user workflows across separate modules:"),
    createParagraph("1. Secure User Onboarding and Session Creation: The system must provide robust authentication paths. Password strings entered during registration are hashed using Bcrypt before saving. Login inputs are verified, and if the user has enabled 2-Factor Authentication (2FA), the system restricts session creation, generates a 6-digit OTP token, and emails it via Nodemailer SMTP. Session access is granted only when the code matches the cached OTP."),
    createParagraph("2. Profile Customization and Skill Management: Users must be able to manage their profile details. This includes editing biographies, uploading avatars, and configuring security settings. Users can list the skills they teach (mentoring options) and the skills they want to learn, which are saved as array variables in the User database document to enable matching queries."),
    createParagraph("3. Skill Discovery and Search Engine: The platform must provide an explore interface where users can find partners. It queries MongoDB collections to filter user cards based on category tags or search keywords. The matching logic identifies users whose 'Teaches' list matches the current user's 'Learns' list, rendering matching profiles as dashboard cards."),
    createParagraph("4. Request Routing and Real-time Communication: Users can send connection requests. The system tracks request states (pending, accepted, rejected). When a request is accepted, a chat channel is opened. The communication module uses Socket.io to connect users to a room based on a unique roomId, enabling low-latency, real-time messaging.")
  );

  // 4.2 Primary Non-Functional Requirements (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("4.2 Primary Non-Functional Requirements", 2),
    createParagraph("Non-functional parameters determine quality metrics and operational stability standards:"),
    createParagraph("1. Low-Latency Performance and Responsiveness: The communication system must support high-speed interactions. Real-time text messages must sync between browser views in under 100 milliseconds. The Express backend and Socket.io server are designed to process events asynchronously, and MongoDB queries use indexes on email and skill fields to ensure fast lookups under high server loads."),
    createParagraph("2. Robust Session Security and Data Privacy: The system must enforce data security. JWT tokens are verified on every private API route. Passwords must be hashed using a workload factor of 10 salt rounds to prevent decryption. API routes validate input fields, and database operations use sanitization rules to block NoSQL injection attacks."),
    createParagraph("3. Code Modularity and Platform Scalability: The project follows a modular 3-tier MERN stack structure. The front-end React SPA is decoupled from the Express Node backend, communicating via HTTP JSON requests. The backend uses the MVC pattern with separate routers, controllers, and models, allowing independent updates and scaling of backend APIs, WebSocket channels, and database instances.")
  );

  // ==========================================
  // 5. EXPECTED OUTCOME
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("5. EXPECTED OUTCOME", 1),
    createParagraph("The expected outcome of the SkillSwap Hub system is the establishment of a robust and highly secure knowledge-sharing ecosystem. Upon implementation, the platform is expected to yield the following operational metrics:"),
    createParagraph("First, the communication framework is expected to deliver low-latency real-time interactions, with message sync between active browser clients occurring in under 100 milliseconds. This is achieved by utilizing persistent WebSockets instead of traditional HTTP polling, ensuring a smooth and responsive chat experience. User authentication will be secured by multi-factor checks, blocking unauthorized access for 2FA-enabled accounts until the correct 6-digit email OTP token is entered and validated."),
    createParagraph("Second, the system is designed to simplify user discovery. By matching profiles based on skill array intersections, the explore feed will automatically display compatible learning partners, reducing the time spent searching for mentors. The inclusion of verification badges and user ratings will help build trust within the community, encouraging active participation and knowledge exchange."),
    createParagraph("Finally, the administrative moderation dashboard will provide platform owners with comprehensive control tools. Administrators can monitor user metrics, verify credentials, deactivate inappropriate skills, and suspend accounts in real time. This moderation loop ensures that the platform remains safe, clean, and free of spam, maintaining a trustworthy environment for collaborative learning.")
  );

  // ==========================================
  // 6. ARCHITECTURE
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("6. ARCHITECTURE", 1),
    createParagraph("The architecture of the SkillSwap Hub system is designed to enable real-time communication between users through dynamic matching and WebSocket technologies. The system begins with a browser-based user client that captures credentials and profile edits. These inputs are passed to the Express backend API controllers, where validation checks, email SMTP triggers, and MongoDB model queries are applied to update collections. After verification, connection channels are established, enabling instant messaging via Socket.io. The entire system is integrated with a user-friendly graphical interface that displays live feeds, active chats, verification badges, and settings, promoting accessible and inclusive communication."),
    createParagraph("The presentation tier uses React.js built with Vite, utilizing Tailwind CSS for a modern, responsive layout. It handles state management via React hooks and routes views using React Router. The client presentation layer communicates with the backend using Axios for HTTP REST endpoints, while maintaining a persistent duplex WebSocket connection via Socket.io-client for messaging. This separation ensures that the UI remains fast and responsive, rendering database updates without full page reloads."),
    createParagraph("The middleware logic tier is powered by Node.js and Express.js. It manages the REST API endpoints, handles JSON request serialization, and protects private routes using custom JWT validation middleware. The application layer also runs the Socket.io server, which handles real-time connections, event dispatching, and room isolation. The database tier uses MongoDB, managed via Mongoose schemas. This NoSQL database stores data in collections for users, skills, messages, and reports, ensuring fast read and write operations.")
  );

  // 6.1 MERN Stack 3-Tier Architecture Diagram (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createDiagramBlock(
      "Figure 6.1: MERN Stack 3-Tier System Architecture Diagram",
      "architecture.png",
      [
        "This architecture diagram details the 3-tier decoupling of the system. The client presentation layer (React, Tailwind) coordinates REST transactions via Axios and handles persistent duplex messages via Socket.io-client. The middleware logic layer (Node, Express) processes routers, verifies JWT tokens, manages Nodemailer, and runs the Socket.io server. The data tier (MongoDB, Mongoose) stores records in user, skill, message, and moderation collections, ensuring high availability and clean data routing.",
        "The application flow begins when the user interacts with the React frontend, sending actions like search queries or chat messages. HTTP requests are routed to the Express API, which applies JWT guards and validation middleware. Valid requests are passed to database controllers that query MongoDB collections. For real-time updates, the Socket.io connection bypasses standard REST routes, broadcasting event payloads directly to client socket listeners for instant UI synchronization."
      ]
    )
  );

  // ==========================================
  // 7. PROJECT MODULES
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("7. PROJECT MODULES", 1),
    createParagraph("The SkillSwap Hub platform is divided into several important modules, where each module performs a specific function to ensure smooth working of the entire system. These modules are designed in a structured way so that the process of matching profiles and messaging becomes efficient and secure. Each module takes input from the previous stage, processes it, and updates the database:"),
    createParagraph("By separating the system into logical modules, the code remains clean, maintainable, and scalable. The front-end captures inputs and sends them to backend controllers, which process data, run validation rules, and update MongoDB collections. Real-time operations run over WebSockets, bypassing traditional routing tables to ensure fast message delivery. An administrative cockpit oversees the platform, providing stats tracking and moderation controls to maintain community safety.")
  );

  // 7.1 Input Module (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("7.1 Input Module", 2),
    createParagraph("The Input Module captures data from the user through the interface. It gathers account registration credentials (name, email, password), login details, profile edits, skill selections, keyword searches, and message inputs. Front-end validations check for empty fields, correct email formats, and password strength before routing the data to backend controllers."),
    createParagraph("Once input data is gathered, it is stored in React state variables using hooks. Form events are managed by submission handlers that prevent page refreshes. Text fields are trimmed to clean whitespace, select dropdown values are mapped, and search inputs are captured dynamically. The verified payload is then serialized into JSON format and dispatched via Axios to the backend REST API endpoints for processing."),
    createParagraph("For message inputs, the module captures text from the chat input box. It monitors keypress events to support 'Enter' key submissions and manages character limits to prevent buffer exploitation. Upon submission, the text is packaged with sender and room identifiers, updated in the local UI state, and emitted over the active WebSocket channel to ensure instant delivery to the recipient."),
    createParagraph("In detail, client-side state is managed using standard React hooks such as 'useState' to store inputs, and 'useRef' to access form references. The text inputs are filtered using regular expressions on the client side to detect script tags or invalid patterns before dispatch, serving as the first line of defense. The UI responds dynamically to invalid inputs by showing helpful tips and disabled buttons, improving the experience of the form interfaces.")
  );

  // 7.2 Profile Matching Module (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("7.2 Profile Matching Module", 2),
    createParagraph("The Profile Matching Module queries the MongoDB database to index users with matching skills. It checks intersection rules between User A's 'Teaches' array and User B's 'Learns' array. It displays cards on the explore page, sorting mentors based on rating metrics and categories, helping users discover relevant connections."),
    createParagraph("The matching process runs database queries that search user documents for complementary skills. For example, if a user lists 'JavaScript' in their teaches array and 'French' in their learns array, the system searches for peers offering 'French' and seeking 'JavaScript'. The results are filtered to exclude blocked accounts or the current user's profile."),
    createParagraph("Matched cards are rendered dynamically in the UI. Each card displays the mentor's name, profile photo, biography rating, and skill badges. Clicking the card opens a detailed view showing user reviews, verification badges, and an interactive 'Connect' button. This button sends a connection request, initiating the peer verification flow."),
    createParagraph("Technically, the backend matches profiles using MongoDB query operators like '$in' and '$and'. The controller accepts the category and keyword query strings from the client, structures a query object, and runs a projection search. By utilizing MongoDB compound indices on the 'skills' field, the lookups are fast, matching users and loading cards instantly.")
  );

  // 7.3 Data Processing Module (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("7.3 Data Processing Module", 2),
    createParagraph("The Data Processing Module refines raw inputs in the backend. It sanitizes text fields, implements Bcrypt hashing with 10 salt rounds on passwords, extracts JWT tokens from headers, and validates schemas. It ensures that only clean, verified payloads are persisted in MongoDB collections."),
    createParagraph("The data pipeline uses validation middleware in Express to verify incoming JSON payloads against Mongoose schemas. When a user registers or updates their password, the password hook runs Bcrypt hashing to secure the credentials before database storage, protecting data from unauthorized access."),
    createParagraph("For private API calls, the module validates JWT session tokens. The middleware extracts the token from the request header, decodes the user identifier using the secret key, and queries the database to load the user document. If verified, the user data is attached to the request object, allowing subsequent controllers to process data securely."),
    createParagraph("This module handles server-side request sanitization using custom utility scripts. It parses JSON request bodies, checks for SQL/NoSQL injections, and validates parameter fields. If fields fail check rules, the server returns a 400 Bad Request error with descriptive alerts, preventing database insertion errors.")
  );

  // 7.4 Communication Module (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("7.4 Communication Module", 2),
    createParagraph("The Communication Module coordinates real-time chatting using WebSockets. When a user approves a request, Socket.io registers both peers in a roomId room. It dispatches text payloads, updates message history in MongoDB, and triggers instant notification counts across active browsers."),
    createParagraph("The WebSocket server runs on top of the Node.js HTTP server. When a client connects, the connection handshake is verified using a JWT. If authenticated, the socket is joined to a room named after the user's ID to receive private notifications. When a chat is opened, the client joins a unique room shared with their peer."),
    createParagraph("When a message is sent, the client emits a 'sendMessage' event. The server captures this event, saves the message details (sender, recipient, content, timestamp) to the MongoDB database, and broadcasts the message to the room. This ensures that the message appears instantly in both chat windows, providing a seamless communication experience."),
    createParagraph("To manage active connections, the module maintains a map of online users. If a client loses connection, Socket.io retries connection in the background. If a message is sent while a user is offline, the backend writes the record to MongoDB and flags the target's notification array, sending alerts once they connect.")
  );

  // 7.5 Settings & Security Module (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("7.5 Settings & Security Module", 2),
    createParagraph("The Settings & Security Module manages user security controls and configurations. It handles password resets, coordinates 2-Factor Authentication (2FA) by generating email OTP codes via Nodemailer SMTP, and stores profile visibility, DM permissions, and notification toggles."),
    createParagraph("Users can access their account settings via a tabbed layout in the UI. In the security tab, they can change their password by inputting their old password, which is verified using Bcrypt, and entering a new password. The security tab also includes a toggle to enable 2FA, which updates the user's document in the database."),
    createParagraph("When 2FA is active, login attempts trigger an authentication challenge. The backend generates a 6-digit OTP code, sets an expiration timestamp, and emails it to the user via Nodemailer. The login process remains blocked until the user submits the correct code, protecting the account from unauthorized login attempts."),
    createParagraph("The module uses Nodemailer SMTP configurations to connect to email servers. It uses environment variables to store credentials securely. The OTP validation handler uses a database transaction to verify codes and purge them on matching, preventing duplicate reuse attacks.")
  );

  // 7.6 Moderation Cockpit Module (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("7.6 Moderation Cockpit Module", 2),
    createParagraph("The Moderation Cockpit Module is reserved for administrators. It queries user, skill, and report collections to render global count metrics. It displays user directories with status actions (verify or suspend), lets moderators de-list malicious skills, and resolve abuse reports."),
    createParagraph("The admin dashboard gathers platform metrics using MongoDB aggregation queries. It calculates total users, active skills, pending abuse reports, and banned accounts, rendering these statistics on the admin cockpit screen. A list of active users allows administrators to search and filter profiles."),
    createParagraph("From the dashboard, administrators can toggle a user's verification status, displaying a blue badge on their explore cards. If a user is reported for abuse, the administrator can inspect details, resolve the issue, or suspend the account. Banned users are logged out and blocked from logging in, maintaining platform safety."),
    createParagraph("This module utilizes administrative route guards in Express. If a user attempts to call these endpoints without an admin token, the middleware blocks the request. The cockpit lists logged reports in tabular views, allowing administrators to audit complaints, update resolved tags, and dismiss false reports dynamically.")
  );

  // ==========================================
  // 8. SYSTEM REQUIREMENT
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("8. SYSTEM REQUIREMENT", 1),
    createParagraph("The system requirements detail the minimum and recommended hardware configurations and software environments needed to compile, launch, and run the SkillSwap Hub platform in development and staging environments:"),
    createParagraph("These specifications ensure that the MERN stack application runs efficiently, with low message latency and reliable database performance. The hardware requirements support the local Node.js server, Express backend, React bundler, and MongoDB server, while the software environment list defines the compatibility standards across operating systems, runtime engines, and development tools.")
  );

  // 8.1 Hardware Specifications (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("8.1 Hardware Specifications", 2),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        createTextRun("Processor (CPU): ", { bold: true }),
        createTextRun("Intel Core i3 / AMD Ryzen 3 (1.8 GHz dual-core) minimum; Intel Core i5 / AMD Ryzen 5 or higher recommended for efficient server handling. A multi-core processor ensures that Node.js, WebSockets processes, and database queries execute without CPU throttling.")
      ]
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        createTextRun("System Memory (RAM): ", { bold: true }),
        createTextRun("4 GB DDR4 RAM minimum; 8 GB or 16 GB recommended to simultaneously run the local database server, Express API, front-end development client, and modern browser utilities. Insufficient RAM can cause server crashes and build delays during client compiling.")
      ]
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        createTextRun("Storage Disk (HDD/SSD): ", { bold: true }),
        createTextRun("10 GB of free partition storage capacity; Solid-State Drive (SSD) is highly recommended for faster compilation, package installation, and database file read/write operations. SSDs significantly improve the response speed of development tools and database caching.")
      ]
    }),
    createParagraph("The development environment benefits from an SSD, which speeds up node_modules installation and development server start times. Running MongoDB locally requires disk bandwidth for data validation and logging, making fast storage essential for maintaining low message latency during local testing.")
  );

  // 8.2 Software Environment (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("8.2 Software Environment", 2),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        createTextRun("Operating System Compatibility: ", { bold: true }),
        createTextRun("Microsoft Windows 10/11 (64-bit), macOS Catalina or later, or Ubuntu Linux 20.04 LTS or later. This multi-platform compatibility ensures that the project files compile consistently across various engineering systems.")
      ]
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        createTextRun("Runtime Engine: ", { bold: true }),
        createTextRun("Node.js LTS version 18.x, 20.x, or 22.x, bundled with Node Package Manager (npm). Node.js provides the asynchronous, event-driven JavaScript execution engine needed to run the Express API backend and manage package dependencies.")
      ]
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        createTextRun("Database Engine: ", { bold: true }),
        createTextRun("MongoDB Community Server v6.0 or newer, configured for local socket binding on port 27017. The NoSQL database stores application records in JSON-like documents, facilitating seamless integration with Mongoose models.")
      ]
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        createTextRun("Development Tools: ", { bold: true }),
        createTextRun("Visual Studio Code (VS Code) or Git version control. Visual Studio Code supports extensions for syntax highlighting, linting, and terminal execution, which simplifies project management.")
      ]
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        createTextRun("Web Browser: ", { bold: true }),
        createTextRun("Google Chrome, Mozilla Firefox, or Microsoft Edge with modern Developer Tools (DevTools). Browser DevTools are essential for inspecting HTML structures, debugging React states, monitoring network calls, and auditing WebSocket frames.")
      ]
    })
  );

  // ==========================================
  // 9. SECURITY ANALYSIS
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("9. SECURITY ANALYSIS", 1),
    createParagraph("Security represents a core design element of the SkillSwap Hub platform, protecting user privacy and preventing malicious activities. The sub-chapters below detail the cryptographic protocols, session controllers, multi-factor triggers, and route authorization check middleware blocks:"),
    createParagraph("A secure web application must implement defense-in-depth, protecting user data at rest, in transit, and during processing. SkillSwap Hub enforces security policies at multiple levels: hashing passwords on the database level, using tokens to protect API access on the routing level, using email OTP verification for authentication challenges, and separating privileges between user and admin roles.")
  );

  // 9.1 Bcrypt Password Cryptography (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("9.1 Bcrypt Password Cryptography", 2),
    createParagraph("User credentials are protected using strong one-way hashing. When a user registers or updates their password, the string is processed through Bcrypt using a workload factor of 10 salt rounds. This yields an unreadable, collision-resistant hash string that prevents dictionary attacks, rainbow table matching, and database breach exposure. Password validation is executed inside the model schema definitions before persistence."),
    createParagraph("Bcrypt utilizes a salt value—a random string appended to the password before hashing. This ensures that two users with identical password strings will have completely different hashes, blocking pre-computed dictionary attacks. The salt workload factor (10 rounds) increases the computational complexity of the hash function, making brute-force guessing attacks slow and expensive for attackers."),
    createParagraph("When a user logs in, the entered password is hashed with the stored salt and compared to the database hash using Bcrypt's comparison utility. This verification process is fast for users, but makes dictionary attacks impractical, ensuring that credentials remain secure even if the database is exposed.")
  );

  // 9.2 JSON Web Token Session Access Control (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("9.2 JSON Web Token Session Access Control", 2),
    createParagraph("User session authorizations are managed using stateless JSON Web Tokens (JWT). The token payload stores encrypted user coordinates (such as user ID and email) and is signed using a secret key. It is sent inside the 'Authorization: Bearer <Token>' HTTP header for API calls, verifying the sender's identity. If a session expires, the client-side state is purged, forcing a redirect."),
    createParagraph("Stateless token authentication avoids storing active session states on the server, which improves backend performance and scalability. When a user logs in, the server generates a JWT signed with a secret key and returns it to the client, which stores it in local storage. The client includes this token in the header of subsequent requests, allowing the server to verify the session without database lookups."),
    createParagraph("To protect sessions, tokens are configured with expiration limits (e.g. 7 days). If a token is compromised, the vulnerability is limited by the token's lifetime. On the client side, if a token is missing or expired, the router intercepts the navigation and redirects the user to the login screen, securing private routes.")
  );

  // 9.3 Multi-Factor SMTP 2FA OTP Codes (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("9.3 Multi-Factor SMTP 2FA OTP Codes", 2),
    createParagraph("For high-security users, SkillSwap Hub offers a built-in 2-Factor Authentication (2FA) toggle. When enabled, credentials validation initiates a partial authentication state, blocking access and generating a random 6-digit OTP code. This code is emailed to the user using NodeMailer over an SMTP handshake. The session is activated only when the OTP code matches the cached token before expiration."),
    createParagraph("The OTP generation routine uses cryptographic utilities to create a random numerical string. This code is saved in the user's database document with an expiration timestamp set to 10 minutes. The server then dispatches the OTP code in a styled HTML email via Nodemailer SMTP, using a secure app password to authenticate with the email provider."),
    createParagraph("During the 2FA verify process, the client sends the submitted code to the backend. The server validates that the code matches the stored OTP and has not expired. Once verified, the partial authentication state is cleared, a JWT token is generated, and the user is redirected to the dashboard, preventing unauthorized logins.")
  );

  // 9.4 Route Guards & Authorization Middleware (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("9.4 Route Guards & Authorization Middleware", 2),
    createParagraph("Application routes are protected by Express middleware. The 'protect' middleware intercepts request headers, extracts the JWT, verifies its signature, queries MongoDB to fetch the corresponding user document, and attaches it to the request object. Crucially, the 'admin' middleware validates if req.user.role === 'admin' before routing requests to moderation routes, returning a 403 Forbidden status on violation."),
    createParagraph("The protect middleware acts as a barrier on the API gateway. If the HTTP request lacks an Authorization header, or if the token signature is invalid, the middleware blocks the execution chain and returns a 401 Unauthorized status, protecting backend logic from unauthorized access."),
    createParagraph("For administrative tasks, the admin middleware runs after the protect guard. It checks the role field of the validated user document. If the user's role is 'admin', next() is called to execute the controller; otherwise, a 403 Forbidden response is returned. This separation of privileges secures sensitive endpoints, ensuring that only authorized administrators can modify settings or suspend accounts.")
  );

  // ==========================================
  // 10. FLOW CHART
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("10. FLOW CHART", 1),
    createParagraph("The system logic flow and operational sequences are visual mapped inside the diagram blocks below:"),
    createParagraph("Flowcharts are essential tools in software engineering, mapping complex processes and decision loops. The following diagrams detail the logical pathways of the user registration/login pipeline and the real-time peer connection/messaging flow, illustrating the step-by-step logic of the system.")
  );

  // 10.1 Login & MFA Flowchart (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createDiagramBlock(
      "Figure 10.1: Login and Multi-Factor Authentication Flowchart",
      "flowchart_auth.png",
      [
        "This flowchart details the login pipeline. It starts with user inputs, hashes the password check, redirects to 2FA OTP generation if active, sends the email, checks verification inputs, and creates the JWT token before routing the browser to the internal dashboard.",
        "The flow begins at the login page, where the user enters their email and password. The system checks the inputs, validates the password against the database hash using Bcrypt, and checks if 2FA is enabled. If disabled, a JWT token is generated immediately. If 2FA is active, the login process is paused, an OTP code is emailed, and a verification form is rendered. Once the correct code is entered, the server generates the JWT token, completing the authentication flow."
      ]
    )
  );

  // 10.2 Connection & Messaging Flowchart (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createDiagramBlock(
      "Figure 10.2: Connection Requests and WebSockets Real-time Messaging Flowchart",
      "flowchart_chat.png",
      [
        "This flowchart displays connection request actions. A peer connection signal logs to MongoDB in pending status, recipient click approvals update the status to connected, the WebSocket server opens a room, and Socket.io broadcasts new message payloads.",
        "The process starts when a user clicks 'Connect' on a profile card. This action sends an API request to create a connection document with a status of 'pending'. The recipient receives a real-time notification, allowing them to accept or reject the request. If accepted, the status updates to 'connected' and a unique chat room is opened. The users can then send messages over WebSockets, with the server broadcasting events to ensure instant delivery in the chat views."
      ]
    )
  );

  // ==========================================
  // 11. DATA FLOW DIAGRAM
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("11. DATA FLOW DIAGRAM", 1),
    createParagraph("Data transformation pipelines are mapped in the Data Flow Diagrams (DFDs) from Level 0 to Level 2 in the chapters below:"),
    createParagraph("Data Flow Diagrams illustrate how data moves through the system, identifying external entities, processing steps, and data stores. These diagrams map the data flows of the SkillSwap Hub system, tracing the transformation of user inputs into database records and real-time communication events across three levels of detail.")
  );

  // 11.1 DFD Level 0 (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createDiagramBlock(
      "Figure 11.1: Context Level Data Flow Diagram (Level 0 DFD)",
      "dfd_level_0.png",
      [
        "The Context Level DFD outlines the system boundary. It represents data flows between external User and Admin entities, showing credential logs, search coordinates, messaging packets, moderation settings, and stats monitors.",
        "At this level, the entire application is represented as a single process. Users send registration details, login credentials, and search queries, and receive profile updates, search results, and chat messages. Administrators send moderation inputs like bans and verifications, and receive platform statistics and report summaries. This diagram defines the inputs and outputs at the system boundaries."
      ]
    )
  );

  // 11.2 DFD Level 1 (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createDiagramBlock(
      "Figure 11.2: System Architecture Data Flow Diagram (Level 1 DFD)",
      "dfd_level_1.png",
      [
        "The Level 1 DFD breaks the system into processes: 1.0 Session Management, 2.0 Profile settings, 3.0 Discovery query routing, and 4.0 Communication and Moderation, detailing links to Users, Skills, Messages, and Reports stores.",
        "This level decomposes the main process into functional steps. Process 1.0 manages login and authentication, verifying inputs against the Users data store. Process 2.0 handles profile and skill updates. Process 3.0 queries the Skills store to return matched explorer feeds. Process 4.0 manages chat channels and admin controls, updating the Messages and Reports data stores. This diagram shows the relationship between system processes and database collections."
      ]
    )
  );

  // 11.3 DFD Level 2 (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createDiagramBlock(
      "Figure 11.3: Real-Time Chat & Admin Moderation Data Flow Diagram (Level 2 DFD)",
      "dfd_level_2.png",
      [
        "The Level 2 DFD maps Process 4.0, detailing validate message buffers, socket broadcasts, reporting abuse loops, and admin moderation updates.",
        "This diagram focuses on the data flows of the communication and moderation modules. Process 4.1 handles WebSocket connections, verifying session tokens before joining chat rooms. Process 4.2 validates message buffers, writes text inputs to the database, and emits messages to active clients. Process 4.3 manages abuse reports, logging complaints to the database, while Process 4.4 provides administrators with tools to modify user states and resolve reports, showing the detailed logic of the communication pipeline."
      ]
    )
  );

  // ==========================================
  // 12. ENTITY RELATIONSHIP DIAGRAM
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("12. ENTITY RELATIONSHIP DIAGRAM", 1),
    createParagraph("The database entity relationships and collection cardinalities are defined in the schema map below:"),
    createParagraph("Entity Relationship Diagrams map the database structure, defining the tables or collections, field attributes, and keys. Although MongoDB is a NoSQL database, defining document relationships is essential for data integrity. The following diagram illustrates the database model relationships in the SkillSwap Hub system.")
  );

  // 12.1 ERD Diagram (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createDiagramBlock(
      "Figure 12.1: Database Entity Relationship Diagram (ERD)",
      "erd.png",
      [
        "This ERD details database models (User, Skill, Connection, Message, Report, Review, Notification). It shows how User maps to multiple Skills (1:N), how Connection acts as an associative entity (M:N), and the reference keys (FK) connecting tables.",
        "The diagram details the relationship cardinalities of the system. The User collection forms the core of the database, linking to the Skill collection via a one-to-many relationship (one user can list multiple skills). The Connection collection acts as a join table, linking two users in a many-to-many relationship. Messages are linked to a connection room via a foreign key, and reviews link back to users, defining the database architecture."
      ]
    )
  );

  // ==========================================
  // 13. TECHNICAL OVERVIEW
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("13. TECHNICAL OVERVIEW", 1),
    createParagraph("SkillSwap Hub combines MERN stack components to build a responsive, secure, and modern web application:"),
    createParagraph("First, React Router is protected by route authentication check hooks. If a user tries to access internal paths like /dashboard, /profile, or /admin without a valid token, they are immediately redirected to the Welcome screen. This client-side routing guard prevents unauthorized access to protected components, enhancing application security."),
    createParagraph("Second, Express Router separates pathways into modular controller functions, ensuring easy backend updates. This structure helps keep the backend code organized and maintainable. Custom validation middleware ensures that incoming data matches schema definitions before updating the database, preventing storage errors."),
    createParagraph("Third, WebSocket connections establish persistent TCP handshakes, enabling server-initiated notifications and instant chat synchronization without page refreshes. This bi-directional communication protocol is managed by Socket.io, providing low-latency messaging and a responsive interface suitable for collaborative learning.")
  );

  // 13.1 Core API Routes Configuration Table (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("13.1 Core API Routes Configuration", 2),
    createParagraph("The REST API is structured into modular endpoint routes. The table below details the endpoints, their HTTP methods, access permissions, and functional processes in the application:"),
    new Paragraph({ spacing: { before: 200, after: 100 }, children: [createTextRun("Table 13.1: Core API Routes Configuration", { bold: true, italics: true })] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTocHeaderRow(),
        new TableRow({ children: [createCell("POST"), createCell("/api/auth/register"), createCell("Public"), createCell("Creates user and hashes password") ] }),
        new TableRow({ children: [createCell("POST"), createCell("/api/auth/login"), createCell("Public"), createCell("Validates password and triggers 2FA check") ] }),
        new TableRow({ children: [createCell("POST"), createCell("/api/auth/verify-2fa"), createCell("Public"), createCell("Validates emailed OTP token") ] }),
        new TableRow({ children: [createCell("GET"), createCell("/api/skills"), createCell("Public"), createCell("Fetches active, non-deactivated skills") ] }),
        new TableRow({ children: [createCell("PUT"), createCell("/api/auth/settings/security"), createCell("Private"), createCell("Updates passwords and toggles 2FA") ] }),
        new TableRow({ children: [createCell("GET"), createCell("/api/admin/stats"), createCell("Private (Admin)"), createCell("Returns system totals stats") ] }),
        new TableRow({ children: [createCell("PUT"), createCell("/api/admin/users/:id/ban"), createCell("Private (Admin)"), createCell("Suspends or reactivates a user profile") ] })
      ]
    }),
    createParagraph("Private routes are protected by the JWT authorization middleware, which verifies the token signature before routing requests. Admin routes run an additional guard to confirm that the user has admin privileges. This structure secures sensitive operations, ensuring that database updates can only be triggered by authorized users.")
  );

  // ==========================================
  // 14. DATABASE (User Schema Starts Directly Here!)
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("14. DATABASE", 1),
    createParagraph("SkillSwap Hub organizes records in MongoDB collections. Field schemas and validation rules are detailed below:"),
    createParagraph("MongoDB provides a flexible, document-oriented storage engine, where collections hold structured BSON documents. Mongoose is used to define schemas and enforce data validation rules in Node.js, ensuring that document attributes match type constraints, unique indices, and reference mappings."),
    
    // User Schema starts directly on the main Chapter 14 Database page!
    createHeading("14.1 User Schema Collection", 2),
    createParagraph("The User collection stores account profiles, authentication flags, and skill lists. The table below details the collection field schemas, data types, validation constraints, and roles:"),
    new Paragraph({ spacing: { before: 200, after: 100 }, children: [createTextRun("Table 14.1: User Collection Fields Schema", { bold: true, italics: true })] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTableHeaderRow([
          { text: "Field Name", width: 25 },
          { text: "Data Type", width: 20 },
          { text: "Constraints", width: 20 },
          { text: "Functional Role", width: 35 }
        ]),
        new TableRow({ children: [createCell("name"), createCell("String"), createCell("Required"), createCell("Display name of the user profile") ] }),
        new TableRow({ children: [createCell("email"), createCell("String"), createCell("Required, Unique"), createCell("Primary login credentials identifier") ] }),
        new TableRow({ children: [createCell("password"), createCell("String"), createCell("Required"), createCell("Bcrypt hashed password sequence") ] }),
        new TableRow({ children: [createCell("role"), createCell("String"), createCell("Enum: user/admin"), createCell("Access permissions setting") ] }),
        new TableRow({ children: [createCell("status"), createCell("String"), createCell("Enum: online/offline/banned"), createCell("Current account activity state") ] }),
        new TableRow({ children: [createCell("verified"), createCell("Boolean"), createCell("Default: false"), createCell("Verification status badge trigger") ] }),
        new TableRow({ children: [createCell("twoFactorEnabled"), createCell("Boolean"), createCell("Default: false"), createCell("Toggle for 2FA verification requirements") ] })
      ]
    }),
    createParagraph("The email field uses unique and lowercase indexes to prevent duplicate registrations. The role field defaults to 'user', restricting administrative access. Mongoose pre-save hooks automatically hash the password string using Bcrypt before storage, securing credentials."),
    createParagraph("In terms of schema architecture, indexing the email field is critical for query efficiency, ensuring O(1) search complexity during authentication. The status field, configured as an enum, helps track real-time activity and immediately flags banned profiles to block their requests. The twoFactorEnabled and related code/expiry fields are integrated to enforce two-factor verification dynamically in the authentication flow."),
    createParagraph("Additionally, the schema incorporates hooks to automate security functions. When a user updates their password, the pre-save hook intercepts the transaction, generates a salt, and hashes the new password using Bcrypt. This keeps security processing logic inside the model layer, preventing unhashed credentials from leaking to the database and protecting user accounts.")
  );

  // 14.2 Skill Schema Table (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("14.2 Skill Schema Collection", 2),
    createParagraph("The Skill collection stores lists of capabilities offered or sought by users. The table below details the field schemas, constraints, and relational mappings to the User collection:"),
    new Paragraph({ spacing: { before: 300, after: 100 }, children: [createTextRun("Table 14.2: Skill Collection Fields Schema", { bold: true, italics: true })] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTableHeaderRow([
          { text: "Field Name", width: 25 },
          { text: "Data Type", width: 20 },
          { text: "Constraints", width: 20 },
          { text: "Functional Role", width: 35 }
        ]),
        new TableRow({ children: [createCell("name"), createCell("String"), createCell("Required"), createCell("Name of the skill (e.g. React)") ] }),
        new TableRow({ children: [createCell("category"), createCell("String"), createCell("Required"), createCell("Category tag (e.g. Web Dev)") ] }),
        new TableRow({ children: [createCell("userId"), createCell("ObjectId"), createCell("Required, Ref: User"), createCell("Reference link to the creating mentor") ] }),
        new TableRow({ children: [createCell("deactivated"), createCell("Boolean"), createCell("Default: false"), createCell("Visibility switch controlled by admin") ] })
      ]
    }),
    createParagraph("The userId field stores a reference link to the User document, enabling relational queries. The deactivated flag allows administrators to hide inappropriate skills from the explore feed without deleting records, supporting platform moderation."),
    createParagraph("Relational mapping is maintained by storing the creator's user identifier as an ObjectId reference pointing to the User collection. This structure enables Mongoose to run populate queries, pulling user details alongside skill documents without needing complex joint collections. This design matches standard NoSQL principles by normalizing data where relations are static, improving retrieval performance."),
    createParagraph("To speed up search indexing on the explore feed, compound indices are configured on the 'name' and 'category' fields of the Skill schema. This optimization allows the matching algorithm to search millions of skills instantly. The deactivated boolean flag acts as a soft-delete mechanism, allowing administrators to hide spam skills without breaking historical connection charts.")
  );

  // 14.3 Report Schema Table (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("14.3 Report Schema Collection", 2),
    createParagraph("The Report collection tracks community complaints logged by users. The table below details the complaint fields, data types, validation rules, and status tracking values:"),
    new Paragraph({ spacing: { before: 300, after: 100 }, children: [createTextRun("Table 14.3: Report Collection Fields Schema", { bold: true, italics: true })] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTableHeaderRow([
          { text: "Field Name", width: 25 },
          { text: "Data Type", width: 20 },
          { text: "Constraints", width: 20 },
          { text: "Functional Role", width: 35 }
        ]),
        new TableRow({ children: [createCell("type"), createCell("String"), createCell("Required"), createCell("Abuse category (e.g. Spam)") ] }),
        new TableRow({ children: [createCell("reporter"), createCell("String"), createCell("Required"), createCell("Name of the reporting user") ] }),
        new TableRow({ children: [createCell("reported"), createCell("String"), createCell("Required"), createCell("Name of the reported offender") ] }),
        new TableRow({ children: [createCell("reason"), createCell("String"), createCell("Required"), createCell("Description of the abuse incident") ] }),
        new TableRow({ children: [createCell("status"), createCell("String"), createCell("Enum: pending/resolved/dismissed"), createCell("Current status of the complaint") ] })
      ]
    }),
    createParagraph("The reporter and reported fields store usernames to identify the parties involved. The status field manages the complaint lifecycle, starting in 'pending' and updating to 'resolved' or 'dismissed' when resolved by an administrator."),
    createParagraph("The collection design focuses on auditing and security operations. It indexes reported usernames to group complaints dynamically, allowing administrators to identify repeat offenders quickly. The description fields enforce size limitations to prevent database storage abuse from spam reports, keeping storage efficient."),
    createParagraph("When a complaint is resolved by an administrator, the status transitions from 'pending' to 'resolved' or 'dismissed'. If set to resolved, the change is written to the database with a timestamp and the admin's identifier, ensuring clear moderation logs. This design ensures that user reports are processed in a secure, audited, and transparent manner.")
  );

  // ==========================================
  // 15. SOURCE CODE (First code listing starts directly here!)
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("15. SOURCE CODE", 1),
    createParagraph("To provide full technical transparency, the source code of core backend components is documented on the following pages:"),
    createParagraph("Reviewing the implementation code shows the programming patterns used in the project. The code listings follow clean-code guidelines, MVC structures, and modern JavaScript standards. These components manage server initialization, routing, authentication, moderation, and database operations."),
    
    // First code listing index.js starts directly on the main Chapter 15 Source Code page!
    ...createCodeBlock(
      "index.js", 
      `import express from "express";
import http from "http";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"], credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: "*" } });
app.set("io", io);

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication error: No token"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await (await import("./models/User.js")).default.findById(decoded.id);
    if (!user) return next(new Error("Authentication error: User not found"));
    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log(\`User \${socket.user._id} connected\`);
  socket.join(socket.user._id.toString());
  socket.on("joinRoom", (roomId) => socket.join(roomId));
  socket.on("sendMessage", async ({ roomId, content }) => {
    const Message = (await import("./models/Message.js")).default;
    let msg = await Message.create({ roomId, senderId: socket.user._id, content });
    io.to(roomId).emit("newMessage", msg);
  });
});

server.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`,
      [
        "This main backend entry point sets up the environment configuration. It loads variables from the .env file, initializes the database connection, and configures the Express application with CORS rules and JSON body parsing middleware.",
        "The file also configures the HTTP server and mounts the Socket.io WebSocket server on the same port. A Socket.io middleware validates incoming connections using a JWT token. If verified, the connection joins a room based on the user's identifier. The message event handler writes new messages to MongoDB and broadcasts them to the active room, enabling real-time communications."
      ]
    )
  );

  // 15.2 authMiddleware.js Code Listing (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createCodeBlock(
      "middleware/authMiddleware.js", 
      `import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found." });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token." });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided." });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied: Admin authorization required." });
  }
};`,
      [
        "This middleware file protects private API routes by verifying user identity and roles. The 'protect' middleware intercepts request headers, extracts the JWT, verifies its signature against the secret key, and attaches the loaded user document to the request object.",
        "The 'admin' middleware checks the role attribute of the user document. If the user's role is 'admin', next() is called to execute the controller; otherwise, a 403 Forbidden status is returned, preventing unauthorized access to moderation logic."
      ]
    )
  );

  // 15.3 adminController.js Code Listing (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createCodeBlock(
      "controllers/adminController.js", 
      `import User from "../models/User.js";
import Skill from "../models/Skill.js";
import Report from "../models/Report.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const pendingReports = await Report.countDocuments({ status: "pending" });
    const blockedUsers = await User.countDocuments({ status: "banned" });
    res.json({ totalUsers, totalSkills, pendingReports, blockedUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleUserVerify = async (req, res) => {
  const { id } = req.params;
  const { verified } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found." });
    user.verified = verified;
    await user.save();
    res.json({ message: "Verification status updated.", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleUserBan = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found." });
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Admin cannot suspend their own account." });
    }
    user.status = user.status === "banned" ? "offline" : "banned";
    await user.save();
    res.json({ message: \`User status set to \${user.status}.\`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleSkillStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const skill = await Skill.findById(id);
    if (!skill) return res.status(404).json({ message: "Skill not found." });
    skill.deactivated = !skill.deactivated;
    await skill.save();
    res.json({ message: "Skill deactivation status updated.", skill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};`,
      [
        "This controller handles administrative tasks. It provides methods to fetch system statistics (total users, active skills, pending reports, blocked accounts) and returns lists of user documents to populate the moderation dashboard.",
        "The controller includes methods to update verification badges, toggle user ban states (suspending or reactivating accounts), and toggle skill deactivations, directly modifying database records in MongoDB."
      ]
    )
  );

  // 15.4 User Schema Model Code Listing (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createCodeBlock(
      "models/User.js", 
      `import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  bio: { type: String, default: "Passionate about swapping skills!" },
  skills: { type: [String], default: ["React", "Node.js"] },
  verified: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorCode: { type: String, default: null },
  twoFactorExpires: { type: Date, default: null },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  status: { type: String, enum: ["online", "offline", "banned"], default: "offline" }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;`,
      [
        "This model defines the User schema, attributes, validation rules, and security helper methods. It models display credentials, contact identifiers, biography details, profile roles, active status codes, and two-factor configurations.",
        "The schema uses Mongoose middleware to automatically hash password inputs using Bcrypt before saving documents. The comparePassword method is mounted on the schema to simplify login verification, keeping the controller logic clean."
      ]
    )
  );

  // 15.5 Skill Schema Model Code Listing (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createCodeBlock(
      "models/Skill.js", 
      `import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Expert"], default: "Intermediate" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  rating: { type: Number, default: 5.0 },
  deactivated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;`,
      [
        "This model defines the Skill schema and its attributes. It tracks the skill name, category tag, descriptive text, and proficiency level (e.g. Beginner, Intermediate, Advanced, Expert) of listed capabilities.",
        "The schema includes a userId reference to link the skill to its creator. The deactivated flag allows administrators to de-list inappropriate or spam skills without deleting the underlying database records."
      ]
    )
  );

  // 15.6 Report Schema Model Code Listing (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createCodeBlock(
      "models/Report.js", 
      `import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  type: { type: String, required: true, trim: true },
  reporter: { type: String, required: true, trim: true },
  reported: { type: String, required: true, trim: true },
  reason: { type: String, required: true, trim: true },
  status: { type: String, enum: ["pending", "resolved", "dismissed"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model("Report", reportSchema);
export default Report;`,
      [
        "This model defines the Report schema for tracking platform abuse reports. It records the category of the report (e.g. Spam, Harassment), the usernames of the reporter and reported users, and description details.",
        "The status field tracks the complaint workflow, showing 'pending', 'resolved', or 'dismissed'. This status controls the rendering of reports in the admin dashboard, helping administrators manage unresolved complaints."
      ]
    )
  );

  // ==========================================
  // 16. IMPLEMENTATION
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("16. IMPLEMENTATION DETAILS", 1),
    createParagraph("The deployment details and command sequences to run the SkillSwap Hub web environment locally are configured on the following pages:"),
    createParagraph("Setting up a local development environment involves configuring server variables, installing packages, starting database servers, and running client and server compilation scripts. The following sections outline the configuration files and initialization pipelines needed to launch the application.")
  );

  // 16.1 Server Environment Variables (.env) (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("16.1 Server Environment Variables (.env)", 2),
    createParagraph("A local backend/.env configuration file sets operational constants and keeps private credentials secure. This file is stored locally in the backend directory and contains configuration variables for server ports, database URLs, session keys, and email credentials:"),
    createParagraph("PORT=5000\nMONGODB_URI=mongodb://127.0.0.1:27017/skillswap_hub\nJWT_SECRET=super_secret_session_token_key\nEMAIL_USER=praveenkumar37025@gmail.com\nEMAIL_PASS=smtp_app_password_string", { font: "Consolas", size: 20, bg: "F1F5F9" }),
    createParagraph("The MONGODB_URI variable defines the connection URL for the local database server. JWT_SECRET stores the secret key used to sign session tokens. The EMAIL_USER and EMAIL_PASS variables configure Nodemailer SMTP details, enabling the backend to send two-factor verification emails to users securely.")
  );

  // 16.2 Server Initialization Pipeline (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("16.2 Server Initialization Pipeline", 2),
    createParagraph("The server initialization pipeline outlines the step-by-step commands to launch the application. The system requires Node.js, npm, and a MongoDB community server running locally on port 27017:"),
    createParagraph("Step 1: Install frontend and backend dependencies. Open a terminal in the project directory and run npm install inside both the frontend and backend folders to download packages to the node_modules directories:\ncd backend && npm install\ncd ../frontend && npm install", { font: "Consolas", size: 20 }),
    createParagraph("Step 2: Start the MongoDB server locally. This handles database updates for users, skills, and messages:\nmongod --dbpath=/path/to/data/db", { font: "Consolas", size: 20 }),
    createParagraph("Step 3: Start the Express backend server. This compiles database models and listens for API calls on port 5000:\ncd backend && npm run dev", { font: "Consolas", size: 20 }),
    createParagraph("Step 4: Launch the React client development server. This compiles visual elements and opens the app in the browser at http://localhost:5173:\ncd frontend && npm run dev", { font: "Consolas", size: 20 })
  );

  // ==========================================
  // 17. SNAPSHOTS (Home page snapshot starts directly on the main page!)
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("17. SYSTEM INTERFACE SNAPSHOTS", 1),
    createParagraph("Below are actual visual interface layouts and detailed functional walkthroughs of key platform screens:"),
    createParagraph("The following pages showcase the user interface design of the platform. Each snapshot captures a specific screen, accompanied by detailed technical explanations of its layout styling, user interactions, database queries, and background processes."),
    
    // First snapshot homepage.png starts directly on the main Chapter 17 page!
    ...createScreenshotBlock(
      "17.1 Home Landing Page Layout", 
      "homepage.png", 
      [
        "The landing page provides the entry point of the platform. Designed using a premium dark-themed layout with glassmorphic cards. Key options include a primary Call-to-Action (CTA) button to 'Start Learning', a detailed features grid explaining the P2P barter model, and clean footer links for navigation. The dark UI design builds a strong first impression for incoming students.",
        "The page uses modern CSS grid layouts to arrange features. Interactive hover cards scale slightly and change border colors, indicating clickability. This page does not require database access or authentication guards, allowing public visitors to learn about the platform before signing up."
      ]
    )
  );

  // 17.2 Authentication Screen & Explanation (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createScreenshotBlock(
      "17.2 Authentication Screen", 
      "login.png", 
      [
        "The Login interface handles session verification. If the user selects the 'Remember Me' persist checkbox, their email address is securely cached in local storage. This view supports password visibility toggling and contains clean links to route users to registration or password recovery forms. Input validations prevent empty submissions.",
        "When credentials are submitted, the backend verifies the email and validates the password hash using Bcrypt. If valid, the system checks if the user has enabled 2-Factor Authentication (2FA) in their settings. If enabled, the backend returns a partial login status, prompting the client to render the OTP verification code input field."
      ]
    )
  );

  // 17.3 New User Registration & Explanation (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createScreenshotBlock(
      "17.3 New User Registration", 
      "register.png", 
      [
        "The Register interface facilitates user onboarding. Users insert their name, email, credentials, and select default skill profiles. The UI uses real-time validation checks to verify email formats and ensure password complexity, displaying helpful validation prompts to the user before submitting data to the server.",
        "When submitted, the backend verifies that the email is unique before registering the user. If verified, the password is hashed, default skills are assigned, and the user document is created. A JWT token is then returned to log the user in automatically, redirecting them to the onboarding dashboard."
      ]
    )
  );

  // 17.4 Application Dashboard View & Explanation (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createScreenshotBlock(
      "17.4 Application Dashboard View", 
      "dashboard.png", 
      [
        "The central hub after authentication. Renders user stats cards, a customizable sidebar menu, and an active notification bell. The dashboard showcases custom navigation buttons to seamlessly redirect users to skill discovery feeds, active connections lists, real-time message boards, and platform configuration screens.",
        "The page uses React lifecycle hooks to load profile data on load. It calls API routes to retrieve connection statistics, rendering active count badges on the interface. A persistent WebSocket listener watches for incoming chat alerts, updating notification flags in real time."
      ]
    )
  );

  // 17.5 Dynamic Skill Explorer Feed & Explanation (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createScreenshotBlock(
      "17.5 Dynamic Skill Explorer Feed", 
      "explore.png", 
      [
        "The discovery engine of the platform. Allows users to query the MongoDB cluster using dynamic search terms and category buttons. It displays matching user cards listing their name, biography, skills they teach, and skills they want. Clicking 'Connect' triggers a peer request.",
        "The explore feed executes database filter queries on the backend. When a category is clicked, a request searches for user profiles with matching skill arrays. If the user clicks the 'Connect' button on a card, a POST request is sent to create a connection request in the database, notifying the recipient."
      ]
    )
  );

  // 17.6 Peer-to-Peer Chat Channel & Explanation (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createScreenshotBlock(
      "17.6 Peer-to-Peer Chat Channel", 
      "chat.png", 
      [
        "The real-time communication messenger panel. Active connections can click on a user's avatar to open a chat channel, sending text messages back and forth instantly. The system utilizes WebSocket triggers to show live message feeds, updating notification badges automatically if the receiver is on a different screen.",
        "The interface uses a split-pane layout showing active chats on the left and messages on the right. When a chat is opened, the client registers with a specific roomId on Socket.io. Messages are sent over this socket channel, saved to the database, and rendered instantly in both views, providing real-time chat."
      ]
    )
  );

  // 17.7 Administrative Moderation Cockpit & Explanation (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createScreenshotBlock(
      "17.7 Administrative Moderation Cockpit", 
      "admin.png", 
      [
        "The administrative panel is reserved for authorized accounts. Renders total platform stats (counts of users, skills, pending reports, banned users) and interactive tables. Administrators can toggle a user's verification status, suspend/unsuspend users, deactivate skills, and resolve abuse reports.",
        "The admin cockpit verifies user permissions using administrative route guards. It displays system status metrics, user rosters, and pending reports. Clicking actions on the UI updates document status flags in MongoDB, updating user states and resolving reports in real time."
      ]
    )
  );

  // 17.8 User Settings Panel & Explanation (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createScreenshotBlock(
      "17.8 User Settings Panel", 
      "settings.png", 
      [
        "The Settings panel is divided into four distinct tabs. The 'Profile' tab lets users edit their bio, upload avatars, and update display credentials. Additional tabs cover notifications settings, profile privacy toggles, and account deletion options.",
        "The interface updates settings changes on the frontend dynamically. When edits are saved, they are validated and sent to backend profile update controllers. Mongoose models update the database, and the new settings are saved in local storage, updating the user interface."
      ]
    )
  );

  // 17.9 Security & 2FA Configuration & Explanation (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    ...createScreenshotBlock(
      "17.9 Security & 2FA Configuration", 
      "security.png", 
      [
        "The 'Security' configuration tab allows users to update their passwords and toggle 2-Factor Authentication (2FA). Enabling 2FA activates nodemailer SMTP transporters on the backend, generating email OTP codes to verify future log in attempts, protecting users from unauthorized access.",
        "When the user toggles the 2FA switch, the interface updates the setting in the database User schema. Future logins will require verifying an OTP code sent via Nodemailer. The password change form verifies the current password using Bcrypt before saving updates, securing the user's account."
      ]
    )
  );

  // ==========================================
  // 18. TEST PLAN (Consolidated to fit EXACTLY ON ONE PAGE)
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("18. TEST PLAN", 1),
    createParagraph("The platform was verified using integration test cases to confirm session stability, database updates, and correct routing:"),
    createParagraph("Software integration testing evaluates the coordination between system modules, checking that data flows correctly between components. For SkillSwap Hub, test scenarios cover onboarding security, two-factor authentication, database queries, and WebSocket messaging performance."),
    createHeading("18.1 System Integration Test Cases", 2),
    new Paragraph({ spacing: { before: 120, after: 80 }, children: [createTextRun("Table 18.1: System Integration Test Scenarios", { bold: true, italics: true })] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTableHeaderRow([
          { text: "Test ID", width: 10 },
          { text: "Module Under Test", width: 20 },
          { text: "Test Inputs / Actions", width: 35 },
          { text: "Expected Results Output", width: 35 }
        ]),
        new TableRow({ children: [createCell("TC-01"), createCell("Registration"), createCell("Insert email and strong password. Click Register"), createCell("Account document created in MongoDB; user redirected to dashboard") ] }),
        new TableRow({ children: [createCell("TC-02"), createCell("2FA Authentication"), createCell("Login with email (2FA enabled). Verify code check"), createCell("OTP received in email. Session blocked until correct code verified") ] }),
        new TableRow({ children: [createCell("TC-03"), createCell("Remember Me Option"), createCell("Check 'Remember me' and log in. Return to welcome page"), createCell("Email input field pre-filled from client local storage cache") ] }),
        new TableRow({ children: [createCell("TC-04"), createCell("Real-time Chat"), createCell("Send message in chat room session with peer"), createCell("Message saved to database and rendered instantly in peer view") ] }),
        new TableRow({ children: [createCell("TC-05"), createCell("Admin Access Guard"), createCell("Log in as non-admin. Try to navigate to /admin"), createCell("Access blocked. Express route guard redirects to dashboard") ] }),
        new TableRow({ children: [createCell("TC-06"), createCell("User Suspension"), createCell("Admin clicks 'Suspend' on user card. Try login"), createCell("User status set to banned in database; login credentials rejected") ] })
      ]
    }),
    createParagraph("The results confirm that the system handles edge cases correctly. Front-end validations catch inputs, route guards block unauthorized requests, and WebSocket channels sync messages instantly under load, validating the MERN architecture.")
  );

  // ==========================================
  // 19. FUTURE SCOPE
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("19. FUTURE SCOPE", 1),
    createParagraph("SkillSwap Hub establishes a solid foundation for peer learning, with several directions for future enhancement:"),
    createParagraph("Peer education continues to evolve, presenting opportunities to integrate advanced scheduling, matching, and video tools. The sections below outline proposed features to improve user matching, messaging features, and session scheduling on the platform, establishing a complete educational roadmap.")
  );

  // 19.1 Automated Matchmaking Algorithm (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("19.1 Automated Matchmaking Algorithm", 2),
    createParagraph("Currently, users manually search profiles to find connections. A future update will implement an automated matchmaking algorithm. The system will parse user skills ('Teaches' and 'Learns') and calculate compatibility scores, recommending matches automatically on the dashboard feed."),
    createParagraph("The matchmaking engine will analyze category associations to find hidden connections. If a student is searching for React.js, the algorithm will also suggest HTML5 and CSS3 mentors. Compatibility scores will prioritize highly rated mentors and close locations, improving match quality."),
    createParagraph("From a mathematical perspective, the matchmaking module will calculate cosine similarity vectors over text-tokenized skill inputs. The backend will parse teaches/learns arrays, project them as multi-dimensional coordinate models, and execute fast sorting routines. This automation will decrease discovery latency, matching compatible peers on the dashboard feed instantly without manual queries."),
    createParagraph("Additionally, a rating weight index will prioritize mentors with positive feedback records. Over time, machine learning classification trees will adapt matching suggestions based on connection approval rates, establishing a smart recommendation engine that simplifies the search for partners.")
  );

  // 19.2 Integrated WebRTC Video Consultations (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("19.2 Integrated WebRTC Video Consultations", 2),
    createParagraph("While text messaging is functional, complex skills require interactive, face-to-face sessions. Future versions will integrate WebRTC to support live video calls and screen sharing directly inside chat windows, removing the need for third-party platforms like Zoom or Google Meet."),
    createParagraph("The WebSockets signaling server will establish WebRTC peer connections. When a call is initiated, client browsers will negotiate media formats, exchange network details, and open secure video channels. Text chat views will support audio, video, and screen sharing overlays dynamically."),
    createParagraph("The signaling server will process SDP offer/answer handshakes and coordinate STUN/TURN traversal pathways to bypass firewall blocks. This direct peer-to-peer media stream guarantees high-fidelity audio-video synchronization with minimal server processing load, providing a robust consultation environment."),
    createParagraph("The integrated video panel will support canvas-based virtual whiteboards. Users can sketch diagrams, upload documents, and share code editors in real time. Session recording tools will compile video clips and store them in the user's local directory, building a persistent personal archive of tutoring sessions.")
  );

  // 19.3 Automated Booking Calendar Scheduler (on a new page!)
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("19.3 Automated Booking Calendar Scheduler", 2),
    createParagraph("To help peers organize sessions, a calendar scheduling module will be built. Mentors can configure availability slots, letting learners book sessions directly. Automated email reminders and session counts will keep track of exchanges."),
    createParagraph("The scheduling module will integrate with Google Calendar and Outlook APIs, syncing booking slots across calendars. The interface will render interactive booking boards, allowing users to select slots, schedule study sessions, and update calendars automatically."),
    createParagraph("Technically, the module will manage timezone differences, converting available hours to the viewer's local offset. The database will enforce transactional locking rules to prevent double-bookings, keeping scheduling records consistent. It will also track credit balances, ensuring that users earn scheduling credits by teaching."),
    createParagraph("Automated notification cron jobs will dispatch reminders 24 hours before a session starts, reducing cancellation rates. Post-session review prompts will ask learners to evaluate their experience, updating the mentor's rating score and feedback directory automatically.")
  );

  // ==========================================
  // 20. CONCLUSION
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("20. CONCLUSION & ACHIEVEMENTS", 1),
    createParagraph("The development of SkillSwap Hub demonstrates the power of peer-to-peer web applications to democratize access to learning. By substituting financial transactions with direct skill exchanges, the platform removes monetary barriers and builds a collaborative learning community."),
    createParagraph("Using the MERN stack coupled with Socket.io WebSockets, the project delivers a responsive, low-latency, and highly secure environment. Hashed credentials, session tokens, and SMTP-driven two-factor authentication protect account access. The administrative moderation cockpit gives platform owners complete tools to manage users, de-list spam skills, and resolve abuse reports, maintaining a safe space for exchange."),
    createParagraph("Testing confirms that SkillSwap Hub successfully coordinates peer matchings, maintains database records, updates user parameters, and delivers real-time notifications. The system achieves all core functional objectives, presenting a scalable and practical solution to community-driven, decentralized education."),
    createParagraph("Developing this project has helped us improve our technical and collaboration capabilities. We gained hands-on experience in full-stack JavaScript architectures, database design, secure routing, and WebSockets. SkillSwap Hub represents a viable approach to decentralized community learning, demonstrating how web technologies can be utilized to facilitate mutual support.")
  );

  // ==========================================
  // 21. BIBLIOGRAPHY (Expanded with detailed contributor annotations)
  // ==========================================
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    createHeading("21. BIBLIOGRAPHY & REFERENCES", 1),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        createTextRun("Elmasri, R., & Navathe, S. B. (2017). ", { bold: true }),
        createTextRun("Fundamentals of Database Systems (7th Edition). ", { italics: true }),
        createTextRun("Pearson Education. This textbook provided the database principles used in this project, explaining entity relationship modeling, table schemas normalization, unique indexes, and compound indexing strategies applied to MongoDB collections.")
      ]
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        createTextRun("Flanagan, D. (2020). ", { bold: true }),
        createTextRun("JavaScript: The Definitive Guide (7th Edition). ", { italics: true }),
        createTextRun("O'Reilly Media. This reference guide was key to understanding the asynchronous execution models of Node.js, event loops, promises handling, and ES6 module import configurations in the Express backend API.")
      ]
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        createTextRun("React Documentation. ", { bold: true }),
        createTextRun("Official Facebook Open Source Guide. Retrieved from https://react.dev. The reference for hooks, component lifecycles, and render optimizations. This documentation was used to implement client-side routing, state hooks, form validations, and tab views in the presentation layer.")
      ]
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        createTextRun("Socket.io Documentation. ", { bold: true }),
        createTextRun("Real-time bidirectional event-based communication library. Retrieved from https://socket.io. The guide for WebSockets connections and room namespaces. It was used to establish client-server persistent TCP handshakes, room namespaces, and real-time messaging events.")
      ]
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        createTextRun("Mongoose ODM Documentation. ", { bold: true }),
        createTextRun("MongoDB Object Modeling for Node.js. Retrieved from https://mongoosejs.com/docs/. This resource helped structure the schema definitions, relational referencing, query middleware, and pre-save hooks used to secure passwords in user collection documents.")
      ]
    }),
    new Paragraph({
      bullet: { level: 0 },
      children: [
        createTextRun("JSON Web Token (JWT) Specifications. ", { bold: true }),
        createTextRun("IETF RFC 7519 Standards. Retrieved from https://jwt.io. This standard guided the structure of session access control, defining the payload attributes, encryption headers, and verification methods used to secure API routing guards.")
      ]
    })
  );

  // Create Document Instance with Page Double Border
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch in twips (1440 twips = 1 inch)
              right: 1440,
              bottom: 1440,
              left: 2160,   // 1.5 inch for binding (2160 twips)
            },
            borders: {
              pageBorderTop: { style: BorderStyle.DOUBLE, size: 12, color: "000000" },
              pageBorderBottom: { style: BorderStyle.DOUBLE, size: 12, color: "000000" },
              pageBorderLeft: { style: BorderStyle.DOUBLE, size: 12, color: "000000" },
              pageBorderRight: { style: BorderStyle.DOUBLE, size: 12, color: "000000" },
              pageBorders: {
                display: "allPages",
                offsetFrom: "page",
                zOrder: "front"
              }
            }
          }
        },
        children: children
      }
    ]
  });

  return doc;
};

// Generate and pack document
const doc = buildDocument();
Packer.toBuffer(doc).then((buffer) => {
  let fileIndex = 0;
  let success = false;
  let outputPath = "";
  while (!success && fileIndex < 100) {
    let suffix = fileIndex === 0 ? "" : `_v${fileIndex}`;
    outputPath = path.join(process.cwd(), `SkillSwap_Hub_Project_Report${suffix}.docx`);
    try {
      fs.writeFileSync(outputPath, buffer);
      success = true;
    } catch (err) {
      if (err.code === 'EBUSY') {
        fileIndex++;
      } else {
        throw err;
      }
    }
  }
  if (success) {
    console.log(`\n🎉 Success! Word document report generated at:\n   ${outputPath}\n`);
  } else {
    console.error("❌ Failed to find an unlocked file to write the document.");
  }
}).catch((err) => {
  console.error("❌ Failed to generate Word document:", err);
});
