"""Insert the generated diagrams and live screenshots into the project report.

Reads the ORIGINAL report (never modified) and writes a new DOCX with:
  - every existing figure caption receiving its image ABOVE the caption,
  - existing captions renumbered to the final figure plan,
  - a new Heading 2 "3.5 DATA FLOW DIAGRAMS" (figures 3.12-3.14),
  - schema figure 3.11 inside section 3.4,
  - UML figures 3.5-3.9 inside section 3.3,
  - new Heading 2 "4.6 Machine Learning Methodology and Workflow Diagrams"
    with figures 4.1-4.4.
Existing screenshots are only renumbered/renamed - never removed or replaced.
"""
import copy
import os
import docx
from docx.shared import Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

SRC = r"C:\Users\TUF\Downloads\Smart_Grocery_Demand_Forecasting_Project_Report.docx"
DST = r"C:\Users\TUF\Downloads\Smart_Grocery_Demand_Forecasting_Project_Report_Final.docx"

DIAG = r"D:\Major Project(Demand Forecast)\docs\diagrams\out"
SHOT = r"D:\Major Project(Demand Forecast)\docs\screenshots"


def find_par(doc, text):
    for p in doc.paragraphs:
        if p.text.strip() == text:
            return p
    raise LookupError(f"paragraph not found: {text!r}")


def rename(par, new_text):
    """Replace the visible text of a paragraph, keeping its style/format."""
    if par.runs:
        par.runs[0].text = new_text
        for r in par.runs[1:]:
            r._element.getparent().remove(r._element)
    else:
        par.add_run(new_text)


def insert_text_before(anchor, text, style=None):
    p = anchor.insert_paragraph_before(text, style=style)
    return p


def insert_image_before(anchor, image, width_in):
    """Image paragraph (no caption) immediately before anchor."""
    img_p = anchor.insert_paragraph_before()
    run = img_p.add_run()
    run.add_picture(image, width=Inches(width_in))
    img_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    return img_p


def insert_figure_before(anchor, image, width_in, caption):
    """Image paragraph followed by its caption, both immediately before anchor."""
    cap = anchor.insert_paragraph_before(caption, style="Figure Caption")
    img_p = cap.insert_paragraph_before()
    run = img_p.add_run()
    run.add_picture(image, width=Inches(width_in))
    img_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    return cap


def main():
    doc = docx.Document(SRC)

    # ---- anchors located by exact current text (robust against index drift)
    cap31 = find_par(doc, "Figure 3.1: System Architecture")
    h32 = find_par(doc, "3.2 SYSTEM WORKFLOW")
    cap32 = find_par(doc, "Figure 3.2: System Workflow")
    cap33 = find_par(doc, "Figure 3.3: UML Use Case Diagram")
    h34 = find_par(doc, "3.4 DATABASE DESIGNS")
    cap34 = find_par(doc, "Figure 3.4: Database Design (ER Diagram)")
    h35 = find_par(doc, "3.5 Interface / Wireframes")
    cap35 = find_par(doc, "Figure 3.5: Login and Registration Page")
    cap36 = find_par(doc, "Figure 3.6: Main Dashboard")
    cap37 = find_par(doc, "Figure 3.7: Demand Forecasting Output")
    h36 = find_par(doc, "3.6 Technology Stack and Tools")
    h5 = find_par(doc, "5. TESTING AND RESULTS")

    DW = 5.7   # diagram width in inches (body text is ~5.77 in wide)

    # ---- 3.1: existing caption keeps number 3.1
    insert_image_before(cap31, f"{DIAG}\\fig3_1_architecture.png", DW)

    # ---- 3.2 block diagram at the end of section 3.1
    insert_figure_before(h32, f"{DIAG}\\fig3_2_block.png", DW,
                         "Figure 3.2: Block Diagram of the Proposed System")

    # ---- 3.3 overall workflow (renamed from 3.2)
    rename(cap32, "Figure 3.3: Overall System Workflow")
    insert_image_before(cap32, f"{DIAG}\\fig3_3_workflow.png", DW)

    # ---- 3.4 use case (renamed from 3.3)
    rename(cap33, "Figure 3.4: UML Use Case Diagram")
    insert_image_before(cap33, f"{DIAG}\\fig3_4_usecase.png", DW)

    # ---- 3.5-3.9 UML views at the end of section 3.3
    insert_text_before(
        h34,
        "In addition to the use case view, the design is documented with an "
        "activity diagram, two sequence diagrams, a component diagram and a "
        "deployment diagram, shown in Figures 3.5 to 3.9. All of them model "
        "the behaviour and the structure that is actually implemented in the "
        "React frontend, the Spring Boot backend and the Python ML service.")
    insert_figure_before(h34, f"{DIAG}\\fig3_5_activity.png", DW,
                         "Figure 3.5: Activity Diagram of the System Workflow")
    insert_figure_before(h34, f"{DIAG}\\fig3_6_seq_products.png", DW,
                         "Figure 3.6: Sequence Diagram - Product Management")
    insert_figure_before(h34, f"{DIAG}\\fig3_7_seq_forecast.png", DW,
                         "Figure 3.7: Sequence Diagram - Demand Forecast")
    insert_figure_before(h34, f"{DIAG}\\fig3_8_component.png", DW,
                         "Figure 3.8: Component Diagram")
    insert_figure_before(h34, f"{DIAG}\\fig3_9_deployment.png", DW,
                         "Figure 3.9: Deployment Diagram")

    # ---- 3.10 ER (renamed from 3.4)
    rename(cap34, "Figure 3.10: Database Design (ER Diagram)")
    insert_image_before(cap34, f"{DIAG}\\fig3_10_er.png", DW)

    # ---- 3.11 schema at the end of section 3.4
    insert_text_before(
        h35,
        "Figure 3.11 shows the physical schema of the two tables exactly as "
        "they are created by Hibernate inside the grocery_inventory database "
        "of MySQL 8.0, including the keys and check constraints used by the "
        "entities.")
    insert_figure_before(h35, f"{DIAG}\\fig3_11_schema.png", DW,
                         "Figure 3.11: Physical Database Schema (MySQL 8.0)")

    # ---- new section 3.5 DATA FLOW DIAGRAMS with figures 3.12-3.14
    insert_text_before(h35, "3.5 DATA FLOW DIAGRAMS", style="Heading 2")
    insert_text_before(
        h35,
        "Figures 3.12 to 3.14 describe the movement of data through the "
        "system at three levels of detail: the context-level diagram, the "
        "level-1 diagram with the five implemented processes, and the "
        "level-2 explosion of the demand-forecasting process.")
    insert_figure_before(h35, f"{DIAG}\\fig3_12_dfd0.png", DW,
                         "Figure 3.12: Context-Level Data Flow Diagram (Level 0)")
    insert_figure_before(h35, f"{DIAG}\\fig3_13_dfd1.png", DW,
                         "Figure 3.13: Data Flow Diagram - Level 1")
    insert_figure_before(h35, f"{DIAG}\\fig3_14_dfd2.png", DW,
                         "Figure 3.14: Data Flow Diagram - Level 2 "
                         "(Explosion of Process 4.0)")

    # ---- interface section renumbered, screenshots 3.15-3.17
    rename(h35, "3.6 Interface / Wireframes")
    rename(cap35, "Figure 3.15: Login Page")
    insert_image_before(cap35, f"{SHOT}\\fig3_15_login.jpeg", 5.3)
    rename(cap36, "Figure 3.16: Main Dashboard")
    insert_image_before(cap36, f"{SHOT}\\fig3_16_dashboard.jpeg", 5.3)
    rename(cap37, "Figure 3.17: Demand Forecasting Output")
    insert_image_before(cap37, f"{SHOT}\\fig3_17_forecast.jpeg", 4.3)

    # ---- 3.6 -> 3.7 technology stack
    rename(h36, "3.7 Technology Stack and Tools")

    # ---- new section 4.6 with figures 4.1-4.4
    insert_text_before(h5, "4.6 Machine Learning Methodology and Workflow "
                            "Diagrams", style="Heading 2")
    insert_text_before(
        h5,
        "Figures 4.1 to 4.4 document the machine-learning methodology that "
        "is actually implemented in the local Python service "
        "(ml_service/app.py): the training workflow reproduced from the "
        "notebook, the feature preprocessing pipeline, the runtime "
        "prediction path and the complete request flow including its "
        "error handling.")
    insert_figure_before(h5, f"{DIAG}\\fig4_1_ml_workflow.png", DW,
                         "Figure 4.1: Machine Learning Workflow - Training Phase")
    insert_figure_before(h5, f"{DIAG}\\fig4_2_preprocessing.png", DW,
                         "Figure 4.2: Feature Preprocessing and Model Pipeline")
    insert_figure_before(h5, f"{DIAG}\\fig4_3_prediction_workflow.png", DW,
                         "Figure 4.3: Runtime Prediction Workflow of the ML Service")
    insert_figure_before(h5, f"{DIAG}\\fig4_4_forecast_flowchart.png", DW,
                         "Figure 4.4: Demand Forecasting Flowchart with "
                         "Error Handling")

    doc.save(DST)
    print("saved", DST)

    # quick verification
    chk = docx.Document(DST)
    caps = [p.text.strip() for p in chk.paragraphs
            if p.style.name == "Figure Caption"]
    print("captions (%d):" % len(caps))
    for c in caps:
        print("  ", c)
    print("inline images:", len(chk.inline_shapes))


if __name__ == "__main__":
    main()
