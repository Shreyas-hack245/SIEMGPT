from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def create_pdf_report(query: str, summary: str, findings: list[dict]) -> BytesIO:
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    pdf.setTitle("SIEMGPT Threat Report")

    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(40, 750, "SIEMGPT Threat Report")

    pdf.setFont("Helvetica", 11)
    pdf.drawString(40, 720, f"Query: {query}")
    pdf.drawString(40, 700, f"Executive Summary: {summary}")

    y = 660
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(40, y, "Key Findings")
    pdf.setFont("Helvetica", 10)
    y -= 24

    for item in findings:
        if y < 80:
            pdf.showPage()
            y = 740
            pdf.setFont("Helvetica", 10)
        pdf.drawString(50, y, f"- {item.get('title', item.get('stage', 'Unknown'))}: {item.get('detail', item.get('description', 'No details.'))}")
        y -= 20

    pdf.showPage()
    pdf.save()
    buffer.seek(0)
    return buffer
