/**
 * One-shot asset ingestion: copies source screenshots/PDFs from the local
 * machine into public/assets with clean names, converting raster images to
 * optimized WebP (max 2400px wide). Safe to re-run; outputs are overwritten.
 *
 * Run: npm run ingest
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const DESKTOP = "C:/Users/imtia/OneDrive/Desktop";
const OUT = join(process.cwd(), "public", "assets");

type Entry = { src: string; dest: string };

/** Images: converted to WebP. Keys are destinations relative to public/assets. */
const images: Entry[] = [
  // BRACU Vault
  { src: `${DESKTOP}/bracuVault_landing_page.png`, dest: "projects/bracu-vault/landing.webp" },
  { src: `${DESKTOP}/bracuVault_orbit.png`, dest: "projects/bracu-vault/orbit.webp" },
  { src: `${DESKTOP}/bracuVault_c1.png`, dest: "projects/bracu-vault/course-view.webp" },
  { src: `${DESKTOP}/bracuVault_courses_code.png`, dest: "projects/bracu-vault/courses-code.webp" },
  { src: `${DESKTOP}/bracuVault_landing_page1_LIGHTMODE.png`, dest: "projects/bracu-vault/landing-light.webp" },
  // Polaris
  { src: `${DESKTOP}/polaris landing page2.png`, dest: "projects/polaris/landing-hero.webp" },
  { src: `${DESKTOP}/polaris landing page.png`, dest: "projects/polaris/landing.webp" },
  { src: `${DESKTOP}/polaris landing page1.png`, dest: "projects/polaris/landing-alt.webp" },
  // E-Gamer Hub
  { src: `${DESKTOP}/E Gamer Hub.png`, dest: "projects/e-gamer-hub/cover.webp" },
  { src: `${DESKTOP}/E Gamer Hub_1.png`, dest: "projects/e-gamer-hub/screen-1.webp" },
  // Cholo
  { src: `${DESKTOP}/Cholo Ride-Sharing App_landing_page.png`, dest: "projects/cholo/landing.webp" },
  // CampusSync
  { src: `${DESKTOP}/campus_sync_land.webp`, dest: "projects/campus-sync/landing.webp" },
  { src: `${DESKTOP}/campus_sync.png`, dest: "projects/campus-sync/app.webp" },
  // UniBoard
  { src: `${DESKTOP}/UniBoard_landing_page.png`, dest: "projects/uniboard/landing.webp" },
  { src: `${DESKTOP}/UniBoard_browse_events.png`, dest: "projects/uniboard/browse-events.webp" },
  { src: `${DESKTOP}/UniBoard_explore_clubs.png`, dest: "projects/uniboard/explore-clubs.webp" },
  // AI project hero figures
  { src: `${DESKTOP}/braintumo_demo_brisc2025_test_00004_gl_ax_t1.png`, dest: "projects/brain-tumor/demo-inference.webp" },
  { src: `${DESKTOP}/Multi-Class News Topic Classification_wordclouds.png`, dest: "projects/news-classification/wordclouds.webp" },
  { src: `${DESKTOP}/ai_generated_text_detectiontsne_2d.png`, dest: "projects/text-detection/tsne-2d.webp" },
  { src: `${DESKTOP}/Predicting Software Quality Using Machine Learning_kmeans_pca.png`, dest: "projects/software-quality/kmeans-pca.webp" },
  // Games
  { src: `${DESKTOP}/house_in_rainfall.png`, dest: "projects/games/house-rainfall.webp" },
  { src: `${DESKTOP}/house in rain windy_left.png`, dest: "projects/games/house-rainfall-windy.webp" },
  { src: `${DESKTOP}/catch_the_diamonds.png`, dest: "projects/games/catch-diamonds.webp" },
  { src: `${DESKTOP}/catch_the_diamonds_1.png`, dest: "projects/games/catch-diamonds-alt.webp" },
  { src: `${DESKTOP}/Star Wars.png`, dest: "projects/games/star-wars.webp" },
  { src: `${DESKTOP}/star_wars_gameplay.png`, dest: "projects/games/star-wars-gameplay.webp" },
  { src: `${DESKTOP}/A modest proposal_1_Main_menu.png`, dest: "projects/games/proposers-dilemma-menu.webp" },
  // Research figures
  { src: `${DESKTOP}/Obscrowd_Research_1.png`, dest: "research/unlinkability/figure-1.webp" },
  { src: `${DESKTOP}/Obscrowd_Research.png`, dest: "research/unlinkability/figure-2.webp" },
];

/* ------------------------------------------------------------------ */
/* Original lab figures straight from the project repos (full quality) */
/* ------------------------------------------------------------------ */

const BRAIN = "D:/Brain-Tumor-Segmentation-Classification/Brain-tumor-segmentation-classification";
const TEXTDET = "D:/AI-Generated Text Detection/Results/figures";
const NEWS = "D:/News_Headline_Classification/artifacts/plots";
const SWQ = "D:/BRAC-University/8th Semester/CSE422/Lab/Project/Report/Images";

const labFigures: Entry[] = [
  // Brain tumor: demo inference panels (Original | Ground Truth | Prediction)
  { src: `${BRAIN}/figures/demo_1_glioma.png`, dest: "lab/brain-tumor/demo-glioma.webp" },
  { src: `${BRAIN}/figures/demo_2_meningioma.png`, dest: "lab/brain-tumor/demo-meningioma.webp" },
  { src: `${BRAIN}/figures/demo_3_no.png`, dest: "lab/brain-tumor/demo-no-tumor.webp" },
  { src: `${BRAIN}/figures/demo_4_pituitary.png`, dest: "lab/brain-tumor/demo-pituitary.webp" },
  { src: `${BRAIN}/figures/demo_attention_1_glioma.png`, dest: "lab/brain-tumor/demo-attention-glioma.webp" },
  { src: `${BRAIN}/figures/demo_brisc2025_test_00004_gl_ax_t1.png`, dest: "lab/brain-tumor/demo-test-glioma-axial.webp" },
  { src: `${BRAIN}/figures/demo_brisc2025_test_00115_gl_co_t1.png`, dest: "lab/brain-tumor/demo-test-glioma-coronal.webp" },
  { src: `${BRAIN}/figures/demo_brisc2025_test_00258_me_ax_t1.png`, dest: "lab/brain-tumor/demo-test-meningioma.webp" },
  { src: `${BRAIN}/figures/demo_brisc2025_test_00570_no_ax_t1.png`, dest: "lab/brain-tumor/demo-test-no-tumor.webp" },
  { src: `${BRAIN}/figures/demo_brisc2025_test_00795_pi_ax_t1.png`, dest: "lab/brain-tumor/demo-test-pituitary.webp" },
  // Brain tumor: source MRI inputs
  { src: `${BRAIN}/Demo Images/Demo Images/1_glioma.jpg`, dest: "lab/brain-tumor/input-glioma.webp" },
  { src: `${BRAIN}/Demo Images/Demo Images/2_meningioma.jpg`, dest: "lab/brain-tumor/input-meningioma.webp" },
  { src: `${BRAIN}/Demo Images/Demo Images/3_no.jpg`, dest: "lab/brain-tumor/input-no-tumor.webp" },
  { src: `${BRAIN}/Demo Images/Demo Images/4_pituitary.jpg`, dest: "lab/brain-tumor/input-pituitary.webp" },
  // Brain tumor: evaluation figures
  { src: `${BRAIN}/figures/densenet_classifier_confusion_matrix.png`, dest: "lab/brain-tumor/cm-densenet.webp" },
  { src: `${BRAIN}/figures/efficientnet_classifier_confusion_matrix.png`, dest: "lab/brain-tumor/cm-efficientnet.webp" },
  { src: `${BRAIN}/figures/mobilenet_classifier_confusion_matrix.png`, dest: "lab/brain-tumor/cm-mobilenet.webp" },
  { src: `${BRAIN}/figures/unet_training_curves.png`, dest: "lab/brain-tumor/curves-unet.webp" },
  { src: `${BRAIN}/figures/attention_unet_training_curves.png`, dest: "lab/brain-tumor/curves-attention-unet.webp" },
  { src: `${BRAIN}/figures/densenet_training_curves.png`, dest: "lab/brain-tumor/curves-densenet.webp" },
  { src: `${BRAIN}/figures/all_segmentation_models_comparison.png`, dest: "lab/brain-tumor/segmentation-comparison.webp" },
  { src: `${BRAIN}/figures/bonus3_heatmap.png`, dest: "lab/brain-tumor/hyperparam-heatmap.webp" },
  { src: `${BRAIN}/figures/bonus3_comparison.png`, dest: "lab/brain-tumor/hyperparam-comparison.webp" },
  { src: `${BRAIN}/figures/bonus4_unet_bifpn_comparison.png`, dest: "lab/brain-tumor/unet-bifpn-comparison.webp" },
  // Text detection
  { src: `${TEXTDET}/classifier_comparison.png`, dest: "lab/text-detection/classifier-comparison.webp" },
  { src: `${TEXTDET}/confusion_matrices_HC3.png`, dest: "lab/text-detection/cm-hc3.webp" },
  { src: `${TEXTDET}/confusion_matrices_Cross_M4_dev.png`, dest: "lab/text-detection/cm-m4-dev.webp" },
  { src: `${TEXTDET}/roc_curves_HC3.png`, dest: "lab/text-detection/roc-hc3.webp" },
  { src: `${TEXTDET}/roc_curves_Cross_M4_dev.png`, dest: "lab/text-detection/roc-m4-dev.webp" },
  { src: `${TEXTDET}/feature_selection_comparison.png`, dest: "lab/text-detection/feature-selection.webp" },
  { src: `${TEXTDET}/feature_distributions.png`, dest: "lab/text-detection/feature-distributions.webp" },
  { src: `${TEXTDET}/feature_correlation_heatmap.png`, dest: "lab/text-detection/feature-correlation.webp" },
  { src: `${TEXTDET}/pca_2d.png`, dest: "lab/text-detection/pca-2d.webp" },
  { src: `${TEXTDET}/tsne_2d.png`, dest: "lab/text-detection/tsne-2d.webp" },
  // News classification: EDA + results
  { src: `${NEWS}/01_class_dist.png`, dest: "lab/news-classification/class-distribution.webp" },
  { src: `${NEWS}/02_length_hist.png`, dest: "lab/news-classification/length-histogram.webp" },
  { src: `${NEWS}/04_top_words.png`, dest: "lab/news-classification/top-words.webp" },
  { src: `${NEWS}/05_wordclouds.png`, dest: "lab/news-classification/wordclouds.webp" },
  { src: `${NEWS}/10_macro_f1_grid.png`, dest: "lab/news-classification/macro-f1-grid.webp" },
  // Software quality
  { src: `${SWQ}/kmeans_pca.png`, dest: "lab/software-quality/kmeans-pca.webp" },
  { src: `${SWQ}/elbow_method.png`, dest: "lab/software-quality/elbow-method.webp" },
  { src: `${SWQ}/Correlation heatmap.png`, dest: "lab/software-quality/correlation-heatmap.webp" },
  { src: `${SWQ}/Distribution of Quality Label.png`, dest: "lab/software-quality/label-distribution.webp" },
  { src: `${SWQ}/Feature histograms.png`, dest: "lab/software-quality/feature-histograms.webp" },
  { src: `${SWQ}/Performance comparison bar chart.png`, dest: "lab/software-quality/performance-comparison.webp" },
  { src: `${SWQ}/ROC curve.png`, dest: "lab/software-quality/roc-curves.webp" },
  { src: `${SWQ}/Confusion matrices_Decision_Tree.png`, dest: "lab/software-quality/cm-decision-tree.webp" },
  { src: `${SWQ}/Confusion matrices_KNN.png`, dest: "lab/software-quality/cm-knn.webp" },
  { src: `${SWQ}/Confusion matrices_NN.png`, dest: "lab/software-quality/cm-neural-network.webp" },
  { src: `${SWQ}/Random_Forest.png`, dest: "lab/software-quality/cm-random-forest.webp" },
];

// All 27 news confusion matrices for the interactive model x variant explorer.
const newsModels = ["LogReg", "DNN", "RNN", "GRU", "LSTM", "BiRNN", "BiGRU", "BiLSTM", "BERTBase"];
const newsVariants = ["none", "extreme", "optimum"];
for (const model of newsModels) {
  for (const variant of newsVariants) {
    labFigures.push({
      src: `${NEWS}/cm_${model}_${variant}.png`,
      dest: `lab/news-classification/cm/${model.toLowerCase()}-${variant}.webp`,
    });
  }
}

/** Documents: copied verbatim. */
const documents: Entry[] = [
  { src: `${DESKTOP}/BrainTumorSegmentationandClassification.pdf`, dest: "papers/brain-tumor-segmentation-report.pdf" },
  { src: `${DESKTOP}/Multi-Class News Topic Classification.pdf`, dest: "papers/news-topic-classification-report.pdf" },
  { src: `${DESKTOP}/ai_generated text detection_report.pdf`, dest: "papers/ai-text-detection-report.pdf" },
  { src: `${DESKTOP}/Predicting Software Quality Using Machine Learning.pdf`, dest: "papers/software-quality-prediction-report.pdf" },
  { src: `${DESKTOP}/Cleaning Data in Python.pdf`, dest: "certificates/cleaning-data-in-python.pdf" },
  { src: `${DESKTOP}/Data Manipulation in Python.pdf`, dest: "certificates/data-manipulation-in-python.pdf" },
  { src: `${DESKTOP}/Understanding Machine Learning.pdf`, dest: "certificates/understanding-machine-learning.pdf" },
];

async function ingestImage({ src, dest }: Entry) {
  const out = join(OUT, dest);
  mkdirSync(dirname(out), { recursive: true });
  const image = sharp(src, { limitInputPixels: false });
  const meta = await image.metadata();
  const width = meta.width && meta.width > 2400 ? 2400 : undefined;
  await image
    .resize(width ? { width } : undefined)
    .webp({ quality: 82 })
    .toFile(out);
  console.log(`  img  ${dest}`);
}

function ingestDocument({ src, dest }: Entry) {
  const out = join(OUT, dest);
  mkdirSync(dirname(out), { recursive: true });
  copyFileSync(src, out);
  console.log(`  doc  ${dest}`);
}

async function main() {
  const allImages = [...images, ...labFigures];
  const missing = [...allImages, ...documents].filter((e) => !existsSync(e.src));
  if (missing.length > 0) {
    console.error("Missing sources:");
    for (const m of missing) console.error(`  ${m.src}`);
    process.exit(1);
  }
  console.log(`Ingesting ${allImages.length} images -> WebP`);
  for (const entry of allImages) await ingestImage(entry);
  console.log(`Copying ${documents.length} documents`);
  for (const entry of documents) ingestDocument(entry);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
