import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html, text, fallbackUrl }) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  // Fallback if no credentials exist
  if (!emailUser || !emailPass || emailUser.includes("your_email") || emailPass.includes("your_app")) {
    console.log("\n========================================================");
    console.log("📨 [DEVELOPMENT FALLBACK] PASSWORD RESET LINK GENERATED:");
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Link:    ${fallbackUrl}`);
    console.log("--------------------------------------------------------");
    console.log("💡 Configure EMAIL_USER and EMAIL_PASS in your backend/.env");
    console.log("   file to send real emails to your personal inbox.");
    console.log("========================================================\n");
    return { sent: false, fallback: true };
  }

  // Create transporter for Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass, // Google App Password (not standard account password)
    },
  });

  const mailOptions = {
    from: `"SkillSwap Hub" <${emailUser}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📨 Real Email sent to ${to}: ${info.messageId}`);
    return { sent: true, fallback: false };
  } catch (error) {
    console.error("❌ Nodemailer Send Error:", error.message);
    
    // Print fallback console log on failure
    console.log("\n========================================================");
    console.log("📨 [FALLBACK LOG] PASSWORD RESET LINK:");
    console.log(`To:      ${to}`);
    console.log(`Link:    ${fallbackUrl}`);
    console.log("========================================================\n");
    return { sent: false, fallback: true, error: error.message };
  }
};
