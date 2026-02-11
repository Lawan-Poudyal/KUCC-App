import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate a certificate PDF using Python and reportlab
 */
export async function generateCertificatePDF({
  recipientName,
  eventTitle,
  certificateType = 'Participation',
  certificateNumber,
  issueDate,
  outputPath
}) {
  try {
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Python script to generate the certificate  
    const pythonScript = `
import sys
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

def draw_certificate(c, data):
    width, height = landscape(letter)
    primary_color = HexColor('#383F78')
    gold_color = HexColor('#383F78')
    dark_blue = HexColor('#383F78')
    text_dark = HexColor('#383F78')
    
    c.setStrokeColor(primary_color)
    c.setLineWidth(3)
    c.rect(0.5*inch, 0.5*inch, width-1*inch, height-1*inch, stroke=1, fill=0)
    
    c.setStrokeColor(gold_color)
    c.setLineWidth(1)
    c.rect(0.6*inch, 0.6*inch, width-1.2*inch, height-1.2*inch, stroke=1, fill=0)
    
    header_y = height - 2*inch
    c.setFillColor(primary_color)
    c.rect(0.6*inch, header_y, width-1.2*inch, 1.3*inch, stroke=0, fill=1)
    
    c.setFillColor(HexColor('#ffffff'))
    c.setFont("Helvetica-Bold", 28)
    title_text = "CERTIFICATE OF " + data['type'].upper()
    title_width = c.stringWidth(title_text, "Helvetica-Bold", 28)
    c.drawString((width - title_width) / 2, header_y + 0.8*inch, title_text)
    
    c.setFont("Helvetica", 12)
    subtitle = "Kathmandu University Computer Club"
    subtitle_width = c.stringWidth(subtitle, "Helvetica", 12)
    c.drawString((width - subtitle_width) / 2, header_y + 0.5*inch, subtitle)
    
    c.setFont("Helvetica", 10)
    estd_text = "ESTD: 1997"
    estd_width = c.stringWidth(estd_text, "Helvetica", 10)
    c.drawString((width - estd_width) / 2, header_y + 0.3*inch, estd_text)
    
    content_y = height - 3.5*inch
    
    c.setFillColor(text_dark)
    c.setFont("Helvetica", 14)
    certify_text = "This is to certify that"
    certify_width = c.stringWidth(certify_text, "Helvetica", 14)
    c.drawString((width - certify_width) / 2, content_y, certify_text)
    
    c.setFont("Helvetica-Bold", 32)
    c.setFillColor(primary_color)
    name_width = c.stringWidth(data['name'], "Helvetica-Bold", 32)
    c.drawString((width - name_width) / 2, content_y - 0.6*inch, data['name'])
    
    line_y = content_y - 0.8*inch
    c.setStrokeColor(gold_color)
    c.setLineWidth(2)
    c.line(2*inch, line_y, width-2*inch, line_y)
    
    c.setFillColor(text_dark)
    c.setFont("Helvetica", 14)
    event_text = "has successfully participated in"
    event_width = c.stringWidth(event_text, "Helvetica", 14)
    c.drawString((width - event_width) / 2, content_y - 1.2*inch, event_text)
    
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(dark_blue)
    max_width = width - 4*inch
    words = data['event'].split()
    lines = []
    current_line = []
    
    for word in words:
        test_line = ' '.join(current_line + [word])
        if c.stringWidth(test_line, "Helvetica-Bold", 18) <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]
    if current_line:
        lines.append(' '.join(current_line))
    
    event_y = content_y - 1.6*inch
    for i, line in enumerate(lines[:2]):
        line_width = c.stringWidth(line, "Helvetica-Bold", 18)
        c.drawString((width - line_width) / 2, event_y - (i * 0.3*inch), line)
    
    c.setFillColor(text_dark)
    c.setFont("Helvetica", 13)
    achieve_y = content_y - 2.3*inch
    achievement = "demonstrating excellence and commitment"
    achieve_width = c.stringWidth(achievement, "Helvetica", 13)
    c.drawString((width - achieve_width) / 2, achieve_y, achievement)
    
    footer_y = 1.5*inch
    c.setFont("Helvetica", 11)
    date_text = "Issued on: " + data['date']
    c.drawString(1.5*inch, footer_y, date_text)
    
    cert_num_text = "Certificate No: " + data['cert_number']
    cert_num_width = c.stringWidth(cert_num_text, "Helvetica", 11)
    c.drawString(width - 1.5*inch - cert_num_width, footer_y, cert_num_text)
    
    sig_y = footer_y + 0.8*inch
    sig_left_x = 2*inch
    sig_right_x = width - 3.5*inch
    
    c.setLineWidth(1)
    c.setStrokeColor(text_dark)
    c.line(sig_left_x, sig_y, sig_left_x + 2*inch, sig_y)
    c.line(sig_right_x, sig_y, sig_right_x + 2*inch, sig_y)
    
    c.setFont("Helvetica", 10)
    c.drawString(sig_left_x + 0.3*inch, sig_y - 0.2*inch, "Event Coordinator")
    c.drawString(sig_right_x + 0.5*inch, sig_y - 0.2*inch, "President, KUCC")
    
    c.setFillColor(HexColor('#EADEDE'))
    c.setFont("Helvetica-Bold", 60)
    c.saveState()
    c.translate(width/2, height/2)
    c.rotate(45)
    watermark = "KUCC"
    wm_width = c.stringWidth(watermark, "Helvetica-Bold", 60)
    c.drawString(-wm_width/2, 0, watermark)
    c.restoreState()

if __name__ == "__main__":
    output_path = sys.argv[1]
    cert_data = {
        'name': sys.argv[2],
        'event': sys.argv[3],
        'type': sys.argv[4],
        'cert_number': sys.argv[5],
        'date': sys.argv[6]
    }
    c = canvas.Canvas(output_path, pagesize=landscape(letter))
    draw_certificate(c, cert_data)
    c.save()
    print("Certificate generated: " + output_path)
`;

    const scriptPath = path.join(outputDir, 'generate_cert.py');
    writeFileSync(scriptPath, pythonScript);

    const formattedDate = issueDate || new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const command = `python "${scriptPath}" "${outputPath}" "${recipientName}" "${eventTitle}" "${certificateType}" "${certificateNumber}" "${formattedDate}"`;
    
    execSync(command, { encoding: 'utf-8' });

    console.log(`[PDF_GENERATED] Certificate created at: ${outputPath}`);
    
    return outputPath;
  } catch (error) {
    console.error('[PDF_ERROR] Failed to generate certificate:', error.message);
    throw new Error(`Certificate generation failed: ${error.message}`);
  }
}

export function generateCertificateNumber(eventId, userId) {
  const timestamp = Date.now().toString(36).toUpperCase();
  const eventPrefix = eventId.substring(0, 4).toUpperCase();
  const userSuffix = userId.substring(0, 4).toUpperCase();
  return `KUCC-${eventPrefix}-${timestamp}-${userSuffix}`;
}