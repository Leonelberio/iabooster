import jsPDF from "jspdf";
import { ResultatAnalyse } from "./types";

// Helper function to safely encode text for PDF
const safeText = (text: string): string => {
  return text
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ñ]/g, "n")
    .replace(/[ç]/g, "c")
    .replace(/[œ]/g, "oe")
    .replace(/[æ]/g, "ae")
    .replace(/[ÿ]/g, "y")
    .replace(/[À-ÿ]/g, "?") // Replace other special chars with ?
    .replace(/[^\x00-\x7F]/g, "?"); // Replace non-ASCII with ?
};

export function genererRapportPDF(
  resultat: ResultatAnalyse,
  nomEntreprise: string = "Votre Entreprise",
  secteur: string = ""
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let currentY = 30;

  // Header
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246); // Blue-600
  doc.text("IA BOOSTER", margin, currentY);

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(
    safeText(`Rapport genere le ${new Date().toLocaleDateString("fr-FR")}`),
    margin,
    currentY + 10
  );

  currentY += 30;

  // Titre entreprise
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text(
    safeText(`Plan d'optimisation IA pour ${nomEntreprise}`),
    margin,
    currentY
  );

  if (secteur) {
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(safeText(`Secteur: ${secteur}`), margin, currentY + 10);
    currentY += 20;
  }

  currentY += 20;

  // Score et résumé
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Resume de l'analyse", margin, currentY);

  currentY += 15;
  doc.setFontSize(11);
  doc.text(
    safeText(`Score d'optimisation IA: ${resultat.score}/100`),
    margin + 5,
    currentY
  );
  doc.text(
    safeText(`Temps economise estime: ${resultat.tempsMoyenEconomise}`),
    margin + 5,
    currentY + 8
  );
  doc.text(
    safeText(`Domaines identifies: ${resultat.domainesAOptimiser.length}`),
    margin + 5,
    currentY + 16
  );

  currentY += 35;

  // Recommandations
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Recommandations personnalisees", margin, currentY);
  currentY += 20;

  resultat.recommandations.forEach((rec, index) => {
    // Vérifier si on a assez de place pour la recommandation
    if (currentY > 250) {
      doc.addPage();
      currentY = 30;
    }

    // Priorité avec couleur
    if (rec.priorite === "haute") {
      doc.setTextColor(220, 38, 38);
    } else if (rec.priorite === "moyenne") {
      doc.setTextColor(245, 158, 11);
    } else {
      doc.setTextColor(34, 197, 94);
    }

    doc.setFontSize(12);
    doc.text(
      safeText(`${index + 1}. ${rec.domaine} (${rec.priorite.toUpperCase()})`),
      margin,
      currentY
    );

    currentY += 10;
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);

    // Description avec retour à la ligne
    const descriptionLines = doc.splitTextToSize(
      safeText(rec.description),
      pageWidth - 2 * margin
    );
    doc.text(descriptionLines, margin + 5, currentY);
    currentY += descriptionLines.length * 5 + 5;

    // Impact
    doc.setTextColor(34, 197, 94);
    doc.text(safeText(`Impact: ${rec.impact}`), margin + 5, currentY);
    currentY += 10;

    // Outils recommandés
    doc.setTextColor(0, 0, 0);
    doc.text("Outils recommandes:", margin + 5, currentY);
    currentY += 8;

    rec.outils.slice(0, 3).forEach((outil) => {
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(
        safeText(`• ${outil.nom} - ${outil.prix}`),
        margin + 10,
        currentY
      );
      currentY += 5;

      const outilDescLines = doc.splitTextToSize(
        safeText(outil.description),
        pageWidth - 2 * margin - 15
      );
      doc.text(outilDescLines, margin + 12, currentY);
      currentY += outilDescLines.length * 4 + 3;
    });

    currentY += 10;
  });

  // Footer
  if (currentY > 250) {
    doc.addPage();
    currentY = 30;
  }

  currentY = 270;
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(
    safeText(
      "Ce rapport a ete genere par IA Booster - Optimisez votre entreprise avec l'IA"
    ),
    margin,
    currentY
  );
  doc.text(
    "Pour plus d'informations: contact@iabooster.com",
    margin,
    currentY + 8
  );

  // Télécharger le PDF
  doc.save(
    `ia-booster-rapport-${nomEntreprise.toLowerCase().replace(/\s+/g, "-")}.pdf`
  );
}

export function genererRapportHTML(
  resultat: ResultatAnalyse,
  nomEntreprise: string = "Votre Entreprise",
  secteur: string = ""
): string {
  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rapport IA Booster - ${nomEntreprise}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .header { color: #3b82f6; font-size: 24px; font-weight: bold; }
            .score { background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0; }
            .recommendation { margin: 20px 0; padding: 15px; border-left: 4px solid #3b82f6; }
            .haute { border-left-color: #dc2626; }
            .moyenne { border-left-color: #f59e0b; }
            .faible { border-left-color: #22c55e; }
            .tool { margin: 10px 0; padding: 10px; background: #f9fafb; border-radius: 8px; }
        </style>
    </head>
    <body>
        <div class="header">IA BOOSTER</div>
        <p>Rapport généré le ${new Date().toLocaleDateString("fr-FR")}</p>
        
        <h2>Plan d'optimisation IA pour ${nomEntreprise}</h2>
        ${secteur ? `<p><strong>Secteur:</strong> ${secteur}</p>` : ""}
        
        <div class="score">
            <h3>📊 Résumé de l'analyse</h3>
            <p><strong>Score d'optimisation IA:</strong> ${
              resultat.score
            }/100</p>
            <p><strong>Temps économisé estimé:</strong> ${
              resultat.tempsMoyenEconomise
            }</p>
            <p><strong>Domaines identifiés:</strong> ${
              resultat.domainesAOptimiser.length
            }</p>
        </div>
        
        <h3>🎯 Recommandations personnalisées</h3>
        ${resultat.recommandations
          .map(
            (rec, index) => `
            <div class="recommendation ${rec.priorite}">
                <h4>${index + 1}. ${
              rec.domaine
            } (${rec.priorite.toUpperCase()})</h4>
                <p>${rec.description}</p>
                <p><strong>💡 Impact:</strong> ${rec.impact}</p>
                
                <h5>🔧 Outils recommandés:</h5>
                ${rec.outils
                  .slice(0, 3)
                  .map(
                    (outil) => `
                    <div class="tool">
                        <strong>${outil.nom}</strong> - ${outil.prix}<br>
                        <small>${outil.description}</small>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `
          )
          .join("")}
        
        <hr style="margin: 40px 0;">
        <small style="color: #666;">
            Ce rapport a été généré par IA Booster - Optimisez votre entreprise avec l'IA<br>
            Pour plus d'informations: contact@iabooster.com
        </small>
    </body>
    </html>
  `;

  return html;
}
