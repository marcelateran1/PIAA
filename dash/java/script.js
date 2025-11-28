// =================== NAVEGACIÓN HORIZONTAL ===================
const btnLeft = document.querySelector(".left-btn");
const btnRight = document.querySelector(".right-btn");
const tabMenu = document.querySelector(".tab-menu");

const IconVisibility = () => {
	let scrollLeftValue = Math.ceil(tabMenu.scrollLeft);
	let scrollableWidth = tabMenu.scrollWidth - tabMenu.clientWidth; 
	
	btnLeft.style.display = scrollLeftValue > 0 ? "block" : "none";
	btnRight.style.display = scrollableWidth > scrollLeftValue ? "block" : "none";
}

if (btnRight && btnLeft && tabMenu) {
	btnRight.addEventListener("click", () => {
		tabMenu.scrollLeft += 150;
		setTimeout(() => IconVisibility(), 50);
	});

	btnLeft.addEventListener("click", () => {
	tabMenu.scrollLeft -= 150;
	//IconVisibility();
	setTimeout(() => IconVisibility(), 50);
	});

window.addEventListener('load', function(){
		btnRight.style.display = tabMenu.scrollWidth > tabMenu.clientWidth || tabMenu.scrollWidth >= window.innerWidth ? "block" : "none";
		btnLeft.style.display = tabMenu.scrollWidth >= window.innerWidth ? "" : "none";
	});

	window.addEventListener('resize', function(){
		btnRight.style.display = tabMenu.scrollWidth > tabMenu.clientWidth || tabMenu.scrollWidth >= window.innerWidth ? "block" : "none";
		btnLeft.style.display = tabMenu.scrollWidth >= window.innerWidth ? "" : "none";

		let scrollLeftValue = Math.round(tabMenu.scrollLeft);
		btnLeft.style.display = scrollLeftValue > 0 ? "block" : "none";
	});


//Menú de navegación arrastable
let activeDrag = false;
tabMenu.addEventListener("mousemove", (drag) => {
	if(!activeDrag) return;
	tabMenu.scrollLeft -= drag.movementX;
	IconVisibility();
	tabMenu.classList.add("dragging");
});

document.addEventListener("mouseup", () => {
	activeDrag = false;
	tabMenu.classList.remove("dragging");
});

tabMenu.addEventListener("mousedown", () => {
	activeDrag = true;
});

}

//============== VER TABLA DE CONTENIDO ===============
const tabs = document.querySelectorAll(".tab");
const tabBtns = document.querySelectorAll(".tab-btn");

const tab_Nav = function(tabBtnClick){
	// Activar pestaña seleccionada
	tabBtns.forEach((tabBtn) => tabBtn.classList.remove("active"));
	tabs.forEach((tab) => tab.classList.remove("active"));
	
	if (tabBtns[tabBtnClick]) tabBtns[tabBtnClick].classList.add("active");
	if (tabs[tabBtnClick]) tabs[tabBtnClick].classList.add("active");
	
	// Forzar renderizado de gráficos cuando se cambie a una pestaña específica
	setTimeout(() => {
		const activeTab = tabs[tabBtnClick];
		if (activeTab) {
			// Verificar si contiene gráficos de vías de señalización
			if (activeTab.id === "vias-señalizacion" || activeTab.querySelector("#vias-señalizacion")) {
				ensurePathwayCharts();
			}
			// Disparar evento resize para gráficos de Chart.js
			window.dispatchEvent(new Event('resize'));
		}
	}, 100);
};

if (tabBtns.length > 0) {
	tabBtns.forEach((tabBtn, i) => tabBtn.addEventListener("click", () => tab_Nav(i)));
}


// =================== EPIDEMIOLOGÍA ===================
document.addEventListener('DOMContentLoaded', function() {
	// Verificar si Chart.js está disponible
	if (typeof Chart === 'undefined') {
		console.warn('Chart.js no está disponible');
		return;
	}

// --Gráfico Lineal--

const lineChartCanvas = document.getElementById('lineChart');
	if (lineChartCanvas) {
		const ctxLine = lineChartCanvas.getContext('2d');
		new Chart(ctxLine, {
			type: 'line',
			data: {
				labels: ['América', 'Europa', 'África', 'Asia', 'Oceanía', 'Tal'],
				datasets: [{
					label: 'Distribución por región (%)',
					data: [12, 9, 24, 8, 10, 6],
					fill: true,
					tension: 0.4,
					backgroundColor: 'rgba(91, 133, 255, 0.1)',
					borderColor: 'rgba(91, 133, 255, 1)',
					pointBackgroundColor: '#5b85ff',
					pointBorderColor: '#fff',
					pointRadius: 5,
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						beginAtZero: true,
						ticks: { color: '#fff' },
						grid: { color: 'rgba(255,255,255,0.1)' }
					},
					x: {
						ticks: { color: '#fff' },
						grid: { color: 'rgba(255,255,255,0.1)' }
					}
				},
				plugins: {
					legend: { labels: { color: '#fff' } },
					tooltip: {
						backgroundColor: '#2e2e41',
						titleColor: '#fff',
						bodyColor: '#fff'
					}
				}
			}
		});
	}

// --Gráfico Geográfico--

const geoChartCanvas = document.getElementById('geoChart');
	if (geoChartCanvas) {
		const ctxGeo = geoChartCanvas.getContext('2d');
		new Chart(ctxGeo, {
			type: 'bar',
			data: {
				labels: ['Norteamérica', 'Sudamérica', 'Europa', 'África', 'Asia', 'Oceanía'],
				datasets: [{
					label: 'Prevalencia (%)',
					data: [10.5, 12, 9, 24, 8, 10],
					backgroundColor: [
						'#1f77b4', '#2ca02c', '#ff7f0e', '#d62728', '#9467bd', '#8c564b'
					],
					borderRadius: 6
				}]
			},
			options: {
				indexAxis: 'y',
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						beginAtZero: true,
						ticks: { color: '#fff' },
						grid: { color: 'rgba(255,255,255,0.1)' }
					},
					y: {
						ticks: { color: '#fff' },
						grid: { color: 'rgba(255,255,255,0.1)' }
					}
				},
				plugins: {
					legend: { display: false },
					tooltip: {
						backgroundColor: '#2e2e41',
						titleColor: '#fff',
						bodyColor: '#fff'
					}
				}
			}
		});
	}
});


// =================== GENÉTICA ===================
// Enlaces y descripciones por gen para el modal
const GENE_LINKS = {
  IL5: {
    description: "Codifica la interleucina-5, una citocina que regula la producción, diferenciación y activación de eosinófilos. Es fundamental en la respuesta inmune tipo 2 y juega un papel crítico en el asma alérgica al promover la inflamación eosinofílica de las vías respiratorias.",
    ncbi: { url: "https://www.ncbi.nlm.nih.gov/gene/3567", id: "3567" },
    genecards: { url: "https://www.genecards.org/cgi-bin/carddisp.pl?gene=IL5", id: "GC05M132541" },
    uniprot: { url: "https://www.uniprot.org/uniprotkb/P05113", id: "P05113" },
    refseq: { url: "https://www.ncbi.nlm.nih.gov/nuccore/NM_000879", id: "NM_000879" },
    tissues: { url: "https://www.proteinatlas.org/ENSG00000113525-IL5", id: "Ver recurso" },
    hgnc: { url: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:6016", id: "HGNC:6016" },
    ensembl: { url: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000113525", id: "ENSG00000113525" },
    omim: { url: "https://www.omim.org/entry/147850", id: "147850" },
    literature: [
      { url: "https://pubmed.ncbi.nlm.nih.gov/18849614/", pmid: "18849614" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/17362254/", pmid: "17362254" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/17508963/", pmid: "17508963" }
    ]
  },
  IL13: {
    description: "Codifica la interleucina-13, una citocina central en la patogénesis del asma alérgica. Induce hipersecreción de moco, hiperreactividad bronquial, fibrosis subepitelial y switching de IgE. Comparte vías de señalización con IL-4 a través del receptor IL-4Rα.",
    ncbi: { url: "https://www.ncbi.nlm.nih.gov/gene/3596", id: "3596" },
    genecards: { url: "https://www.genecards.org/cgi-bin/carddisp.pl?gene=IL13", id: "GC05P132656" },
    uniprot: { url: "https://www.uniprot.org/uniprotkb/P35225", id: "P35225" },
    refseq: { url: "https://www.ncbi.nlm.nih.gov/nuccore/NM_002188", id: "NM_002188" },
    tissues: { url: "https://www.proteinatlas.org/ENSG00000169194-IL13", id: "Ver recurso" },
    hgnc: { url: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:5973", id: "HGNC:5973" },
    ensembl: { url: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000169194", id: "ENSG00000169194" },
    omim: { url: "https://www.omim.org/entry/147683", id: "147683" },
    literature: [
      { url: "https://pubmed.ncbi.nlm.nih.gov/16120094/", pmid: "16120094 " },
      { url: "https://pubmed.ncbi.nlm.nih.gov/9856949/", pmid: "9856949" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/15546393/", pmid: "15546393" }
    ]
  },
  TSLP: {
    description: "Codifica la linfopoyetina estromal tímica, una citocina epitelial crucial en la iniciación de respuestas alérgicas tipo 2. Activa células dendríticas que promueven la diferenciación de células T helper 2 (Th2), siendo un mediador clave en el asma alérgica.",
    ncbi: { url: "https://www.ncbi.nlm.nih.gov/gene/85480", id: "85480" },
    genecards: { url: "https://www.genecards.org/cgi-bin/carddisp.pl?gene=TSLP", id: "GC05P110403" },
    uniprot: { url: "https://www.uniprot.org/uniprotkb/Q969D9", id: "Q969D9" },
    refseq: { url: "https://www.ncbi.nlm.nih.gov/nuccore/NM_033035", id: "NM_033035" },
    tissues: { url: "https://www.proteinatlas.org/ENSG00000145777-TSLP", id: "Ver recurso" },
    hgnc: { url: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:30743", id: "HGNC:30743" },
    ensembl: { url: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000145777", id: "ENSG00000145777" },
    omim: { url: "https://www.omim.org/entry/607003", id: "607003" },
    literature: [
      { url: "https://pubmed.ncbi.nlm.nih.gov/15322115", pmid: "15322115" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/20395474", pmid: "20395474" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/25686105", pmid: "25686105" }
    ]
  },
  POSTN: {
    description: "Codifica periostina, una proteína de la matriz extracelular que se sobreexpresa en el epitelio de las vías respiratorias asmáticas. Participa en el remodelado de las vías aéreas, fibrosis subepitelial y es un biomarcador de inflamación tipo 2 en asma severa.",
    ncbi: { url: "https://www.ncbi.nlm.nih.gov/gene/10631", id: "10631" },
    genecards: { url: "https://www.genecards.org/cgi-bin/carddisp.pl?gene=POSTN", id: "GC13M037041" },
    uniprot: { url: "https://www.uniprot.org/uniprotkb/Q15063", id: "Q15063" },
    refseq: { url: "https://www.ncbi.nlm.nih.gov/nuccore/NM_006475", id: "NM_006475" },
    tissues: { url: "https://www.proteinatlas.org/ENSG00000133110-POSTN", id: "Ver recurso" },
    hgnc: { url: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:16953", id: "HGNC:16953" },
    ensembl: { url: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000133110", id: "ENSG00000133110" },
    omim: { url: "https://www.omim.org/entry/608777", id: "608777" },
    literature: [
      { url: "https://pubmed.ncbi.nlm.nih.gov/22190034", pmid: "22190034" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/23063127", pmid: "23063127" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/28506265", pmid: "28506265" }
    ]
  },
  IL5RA: {
    description: "Codifica la subunidad alfa del receptor de interleucina-5, específica para la unión de IL-5. Este receptor es crucial para la supervivencia, diferenciación y activación de eosinófilos, células centrales en la patología del asma alérgica.",
    ncbi: { url: "https://www.ncbi.nlm.nih.gov/gene/3568", id: "3568" },
    genecards: { url: "https://www.genecards.org/cgi-bin/carddisp.pl?gene=IL5RA", id: "GC03P008046" },
    uniprot: { url: "https://www.uniprot.org/uniprotkb/Q01344", id: "Q01344" },
    refseq: { url: "https://www.ncbi.nlm.nih.gov/nuccore/NM_000564", id: "NM_000564" },
    tissues: { url: "https://www.proteinatlas.org/ENSG00000091181-IL5RA", id: "Ver recurso" },
    hgnc: { url: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:6017", id: "HGNC:6017" },
    ensembl: { url: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000091181", id: "ENSG00000091181" },
    omim: { url: "https://www.omim.org/entry/147851", id: "147851" },
    literature: [
      { url: "https://pubmed.ncbi.nlm.nih.gov/8479517", pmid: "8479517" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/15634928", pmid: "15634928" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/26985062", pmid: "26985062" }
    ]
  },
  IL33: {
    description: "Codifica la interleucina-33, miembro de la familia IL-1 que actúa como alarma epitelial. Se libera tras daño tisular y activa células linfoides innatas tipo 2 (ILC2), amplificando la respuesta inflamatoria tipo 2 en asma alérgica.",
    ncbi: { url: "https://www.ncbi.nlm.nih.gov/gene/90865", id: "90865" },
    genecards: { url: "https://www.genecards.org/cgi-bin/carddisp.pl?gene=IL33", id: "GC09P006215" },
    uniprot: { url: "https://www.uniprot.org/uniprotkb/O95760", id: "O95760" },
    refseq: { url: "https://www.ncbi.nlm.nih.gov/nuccore/NM_033439", id: "NM_033439" },
    tissues: { url: "https://www.proteinatlas.org/ENSG00000137033-IL33", id: "Ver recurso" },
    hgnc: { url: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:16028", id: "HGNC:16028" },
    ensembl: { url: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000137033", id: "ENSG00000137033" },
    omim: { url: "https://www.omim.org/entry/608678", id: "608678" },
    literature: [
      { url: "https://pubmed.ncbi.nlm.nih.gov/16286920", pmid: "16286920" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/21282985", pmid: "21282985" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/25214509", pmid: "25214509" }
    ]
  },
  IL4: {
    description: "Codifica la interleucina-4, citocina pleiotrópica esencial en la diferenciación de células T helper 2 (Th2) y el cambio de isotipo a IgE. Es fundamental en la patogénesis del asma alérgica al coordinar respuestas inmunes tipo 2 y promover inflamación alérgica.",
    ncbi: { url: "https://www.ncbi.nlm.nih.gov/gene/3565", id: "3565" },
    genecards: { url: "https://www.genecards.org/cgi-bin/carddisp.pl?gene=IL4", id: "GC05P132673" },
    uniprot: { url: "https://www.uniprot.org/uniprotkb/P05112", id: "P05112" },
    refseq: { url: "https://www.ncbi.nlm.nih.gov/nuccore/NM_000589", id: "NM_000589" },
    tissues: { url: "https://www.proteinatlas.org/ENSG00000113520-IL4", id: "Ver recurso" },
    hgnc: { url: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:6014", id: "HGNC:6014" },
    ensembl: { url: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000113520", id: "ENSG00000113520" },
    omim: { url: "https://www.omim.org/entry/147780", id: "147780" },
    literature: [
      { url: "https://pubmed.ncbi.nlm.nih.gov/8226968", pmid: "8226968" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/17632548", pmid: "17632548" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/21765414", pmid: "21765414" }
    ]
  },
  MIR126: {
    description: "Codifica el microRNA-126, un regulador post-transcripcional que modula la inflamación vascular y la función endotelial. En asma, regula la permeabilidad vascular y el reclutamiento de células inflamatorias a las vías respiratorias.",
    ncbi: { url: "https://www.ncbi.nlm.nih.gov/gene/406905", id: "406905" },
    genecards: { url: "https://www.genecards.org/cgi-bin/carddisp.pl?gene=MIR126", id: "GC09P136672" },
    uniprot: { url: "https://www.uniprot.org/uniprotkb/MIR126", id: "N/A" },
    refseq: { url: "https://www.ncbi.nlm.nih.gov/nuccore/NR_029690", id: "NR_029690" },
    tissues: { url: "https://www.proteinatlas.org/ENSG00000199094-MIR126", id: "Ver recurso" },
    hgnc: { url: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:31568", id: "HGNC:31568" },
    ensembl: { url: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000199094", id: "ENSG00000199094" },
    omim: { url: "https://www.omim.org/entry/611373", id: "611373" },
    literature: [
      { url: "https://pubmed.ncbi.nlm.nih.gov/18483486", pmid: "18483486" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/22623808", pmid: "22623808" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/25516281", pmid: "25516281" }
    ]
  },
  IL4R: {
    description: "Codifica la subunidad alfa del receptor de interleucina-4, compartida por los receptores de IL-4 e IL-13. Polimorfismos en este gen están asociados con asma alérgica, atopia elevada de IgE e hiperreactividad bronquial.",
    ncbi: { url: "https://www.ncbi.nlm.nih.gov/gene/3566", id: "3566" },
    genecards: { url: "https://www.genecards.org/cgi-bin/carddisp.pl?gene=IL4R", id: "GC16P027334" },
    uniprot: { url: "https://www.uniprot.org/uniprotkb/P24394", id: "P24394" },
    refseq: { url: "https://www.ncbi.nlm.nih.gov/nuccore/NM_000418", id: "NM_000418" },
    tissues: { url: "https://www.proteinatlas.org/ENSG00000077238-IL4R", id: "Ver recurso" },
    hgnc: { url: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:6015", id: "HGNC:6015" },
    ensembl: { url: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000077238", id: "ENSG00000077238" },
    omim: { url: "https://www.omim.org/entry/147781", id: "147781" },
    literature: [
      { url: "https://pubmed.ncbi.nlm.nih.gov/9288740", pmid: "9288740" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/10742106", pmid: "10742106" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/20008293", pmid: "20008293" }
    ]
  },
  MIR3162: {
    description: "Codifica el microRNA-3162, un regulador epigenético recientemente identificado que modula la expresión de genes relacionados con la respuesta inmune. Su papel en asma está en investigación, con evidencia de regulación de vías inflamatorias.",
    ncbi: { url: "https://www.ncbi.nlm.nih.gov/gene/100422919", id: "100422919" },
    genecards: { url: "https://www.genecards.org/cgi-bin/carddisp.pl?gene=MIR3162", id: "GC11P062092" },
    uniprot: { url: "https://www.uniprot.org/uniprotkb/MIR3162", id: "N/A" },
    refseq: { url: "https://www.ncbi.nlm.nih.gov/nuccore/NR_037933", id: "NR_037933" },
    tissues: { url: "https://www.proteinatlas.org/ENSG00000266524-MIR3162", id: "Ver recurso" },
    hgnc: { url: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:38255", id: "HGNC:38255" },
    ensembl: { url: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000266524", id: "ENSG00000266524" },
    omim: { url: "https://www.omim.org/entry/MIR3162", id: "N/A" },
    literature: [
      { url: "https://pubmed.ncbi.nlm.nih.gov/23034410", pmid: "23034410" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/24499489", pmid: "24499489" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/26490953", pmid: "26490953" }
    ]
  },
  CLCA1: {
    description: "Codifica el canal de cloruro accesorio 1, regulado por calcio. Se sobreexpresa en células caliciformes de vías aéreas asmáticas y contribuye a la hipersecreción de moco, un rasgo característico del asma alérgica.",
    ncbi: { url: "https://www.ncbi.nlm.nih.gov/gene/1179", id: "1179" },
    genecards: { url: "https://www.genecards.org/cgi-bin/carddisp.pl?gene=CLCA1", id: "GC01P086927" },
    uniprot: { url: "https://www.uniprot.org/uniprotkb/P15516", id: "P15516" },
    refseq: { url: "https://www.ncbi.nlm.nih.gov/nuccore/NM_001285", id: "NM_001285" },
    tissues: { url: "https://www.proteinatlas.org/ENSG00000016490-CLCA1", id: "Ver recurso" },
    hgnc: { url: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:2017", id: "HGNC:2017" },
    ensembl: { url: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000016490", id: "ENSG00000016490" },
    omim: { url: "https://www.omim.org/entry/602025", id: "602025" },
    literature: [
      { url: "https://pubmed.ncbi.nlm.nih.gov/11157480", pmid: "11157480" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/12626616", pmid: "12626616" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/19805654", pmid: "19805654" }
    ]
  },
  IL17A: {
    description: "Codifica la interleucina-17A, citocina proinflamatoria producida por células Th17. En asma severa, contribuye a inflamación neutrofílica y resistencia a corticoesteroides, definiendo un endotipo distinto de asma.",
    ncbi: { url: "https://www.ncbi.nlm.nih.gov/gene/3605", id: "3605" },
    genecards: { url: "https://www.genecards.org/cgi-bin/carddisp.pl?gene=IL17A", id: "GC06P052186" },
    uniprot: { url: "https://www.uniprot.org/uniprotkb/Q16552", id: "Q16552" },
    refseq: { url: "https://www.ncbi.nlm.nih.gov/nuccore/NM_002190", id: "NM_002190" },
    tissues: { url: "https://www.proteinatlas.org/ENSG00000112115-IL17A", id: "Ver recurso" },
    hgnc: { url: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:5981", id: "HGNC:5981" },
    ensembl: { url: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000112115", id: "ENSG00000112115" },
    omim: { url: "https://www.omim.org/entry/603149", id: "603149" },
    literature: [
      { url: "https://pubmed.ncbi.nlm.nih.gov/16498451", pmid: "16498451" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/23817571", pmid: "23817571" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/25393534", pmid: "25393534" }
    ]
  },
  PTGDR2: {
    description: "Codifica el receptor 2 de prostaglandina D2 (CRTH2), expresado en células Th2, eosinófilos y basófilos. Media la quimiotaxis de estas células hacia sitios de inflamación alérgica, siendo un objetivo terapéutico en asma.",
    ncbi: { url: "https://www.ncbi.nlm.nih.gov/gene/11251", id: "11251" },
    genecards: { url: "https://www.genecards.org/cgi-bin/carddisp.pl?gene=PTGDR2", id: "GC11P060912" },
    uniprot: { url: "https://www.uniprot.org/uniprotkb/Q9Y5Y4", id: "Q9Y5Y4" },
    refseq: { url: "https://www.ncbi.nlm.nih.gov/nuccore/NM_004778", id: "NM_004778" },
    tissues: { url: "https://www.proteinatlas.org/ENSG00000183134-PTGDR2", id: "Ver recurso" },
    hgnc: { url: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:9601", id: "HGNC:9601" },
    ensembl: { url: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000183134", id: "ENSG00000183134" },
    omim: { url: "https://www.omim.org/entry/604687", id: "604687" },
    literature: [
      { url: "https://pubmed.ncbi.nlm.nih.gov/11067875", pmid: "11067875" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/15249581", pmid: "15249581" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/23520185", pmid: "23520185" }
    ]
  },
  IL25: {
    description: "Codifica la interleucina-25 (IL-17E), citocina epitelial que inicia respuestas tipo 2. Activa ILC2 y células Th2, promoviendo producción de IL-4, IL-5 e IL-13, siendo crucial en asma alérgica inducida por alérgenos.",
    ncbi: { url: "https://www.ncbi.nlm.nih.gov/gene/64806", id: "64806" },
    genecards: { url: "https://www.genecards.org/cgi-bin/carddisp.pl?gene=IL25", id: "GC14P023674" },
    uniprot: { url: "https://www.uniprot.org/uniprotkb/Q9H293", id: "Q9H293" },
    refseq: { url: "https://www.ncbi.nlm.nih.gov/nuccore/NM_022789", id: "NM_022789" },
    tissues: { url: "https://www.proteinatlas.org/ENSG00000163678-IL25", id: "Ver recurso" },
    hgnc: { url: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:13765", id: "HGNC:13765" },
    ensembl: { url: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000163678", id: "ENSG00000163678" },
    omim: { url: "https://www.omim.org/entry/605658", id: "605658" },
    literature: [
      { url: "https://pubmed.ncbi.nlm.nih.gov/11923494", pmid: "11923494" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/15665828", pmid: "15665828" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/22955619", pmid: "22955619" }
    ]
  },
  EPX: {
    description: "Codifica la eosinófilo-peroxidasa, enzima característica de eosinófilos que cataliza la formación de especies reactivas de oxígeno. Contribuye al daño tisular y la disfunción epitelial en las vías respiratorias asmáticas.",
    ncbi: { url: "https://www.ncbi.nlm.nih.gov/gene/8288", id: "8288" },
    genecards: { url: "https://www.genecards.org/cgi-bin/carddisp.pl?gene=EPX", id: "GC17P056385" },
    uniprot: { url: "https://www.uniprot.org/uniprotkb/P11678", id: "P11678" },
    refseq: { url: "https://www.ncbi.nlm.nih.gov/nuccore/NM_000502", id: "NM_000502" },
    tissues: { url: "https://www.proteinatlas.org/ENSG00000121053-EPX", id: "Ver recurso" },
    hgnc: { url: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:3423", id: "HGNC:3423" },
    ensembl: { url: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000121053", id: "ENSG00000121053" },
    omim: { url: "https://www.omim.org/entry/131399", id: "131399" },
    literature: [
      { url: "https://pubmed.ncbi.nlm.nih.gov/7538697", pmid: "7538697" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/10072545", pmid: "10072545" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/21357384", pmid: "21357384" }
    ]
  },
  MUC5AC: {
    description: "Codifica la mucina 5AC, glicoproteína formadora de gel secretada por células caliciformes. Su sobreproducción en asma alérgica causa hipersecreción de moco, obstrucción de las vías aéreas y exacerbaciones.",
    ncbi: { url: "https://www.ncbi.nlm.nih.gov/gene/4586", id: "4586" },
    genecards: { url: "https://www.genecards.org/cgi-bin/carddisp.pl?gene=MUC5AC", id: "GC11P001171" },
    uniprot: { url: "https://www.uniprot.org/uniprotkb/P98088", id: "P98088" },
    refseq: { url: "https://www.ncbi.nlm.nih.gov/nuccore/NM_017511", id: "NM_017511" },
    tissues: { url: "https://www.proteinatlas.org/ENSG00000215182-MUC5AC", id: "Ver recurso" },
    hgnc: { url: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:7516", id: "HGNC:7516" },
    ensembl: { url: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000215182", id: "ENSG00000215182" },
    omim: { url: "https://www.omim.org/entry/158372", id: "158372" },
    literature: [
      { url: "https://pubmed.ncbi.nlm.nih.gov/10072544", pmid: "10072544" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/15247915", pmid: "15247915" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/22511982", pmid: "22511982" }
    ]
  },
  CDHR3: {
    description: "Codifica el miembro 3 de la familia relacionada con cadherina, receptor del rinovirus-C. Variantes genéticas están asociadas con asma infantil y exacerbaciones virales, vinculando infecciones respiratorias con desarrollo de asma.",
    ncbi: { url: "https://www.ncbi.nlm.nih.gov/gene/222256", id: "222256" },
    genecards: { url: "https://www.genecards.org/cgi-bin/carddisp.pl?gene=CDHR3", id: "GC07P105675" },
    uniprot: { url: "https://www.uniprot.org/uniprotkb/Q6UWW0", id: "Q6UWW0" },
    refseq: { url: "https://www.ncbi.nlm.nih.gov/nuccore/NM_152609", id: "NM_152609" },
    tissues: { url: "https://www.proteinatlas.org/ENSG00000128536-CDHR3", id: "Ver recurso" },
    hgnc: { url: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:14550", id: "HGNC:14550" },
    ensembl: { url: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000128536", id: "ENSG00000128536" },
    omim: { url: "https://www.omim.org/entry/609363", id: "609363" },
    literature: [
      { url: "https://pubmed.ncbi.nlm.nih.gov/25913989", pmid: "25913989" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/26479867", pmid: "26479867" },
      { url: "https://pubmed.ncbi.nlm.nih.gov/28130542", pmid: "28130542" }
    ]
  }
};

// Helper: construir estructura de enlaces por gen
function buildGeneLinks(geneName) {
  return GENE_LINKS[geneName] || {};
}

// Datos de genes
const genesData = [
  { gen: "IL5", nombre: "Interleucina-5", ubicacion: "5q31.1", expresion: "Sangre, Sistema inmunitario, Pulmón, Médula ósea, Intestino", modal: buildGeneLinks("IL5") },
  { gen: "IL13", nombre: "Interleucina-13", ubicacion: "5q31.1", expresion: "Sistema inmunitario, Sangre, Pulmón, Intestino, Médula ósea", modal: buildGeneLinks("IL13") },
  { gen: "TSLP", nombre: "Linfopoyetina Estromal Tímica", ubicacion: "5q22.1", expresion: "Sistema inmunitario, Sangre, Pulmón, Intestino", modal: buildGeneLinks("TSLP") },
  { gen: "POSTN", nombre: "Periostina", ubicacion: "13q13.3", expresion: "Corazón, Sangre, Sistema vascular, Sistema inmunitario, Pulmón", modal: buildGeneLinks("POSTN") },
  { gen: "IL5RA", nombre: "Subunidad Alfa del Receptor de Interleucina 5", ubicacion: "3p26.2", expresion: "Sangre, Sistema inmunitario, Médula ósea, Pulmón", modal: buildGeneLinks("IL5RA") },
  { gen: "IL33", nombre: "Interleucina-33", ubicacion: "9p24.1", expresion: "Sistema inmunitario, Sangre, Pulmón, Intestino, Corazón, Sistema vascular, Médula ósea", modal: buildGeneLinks("IL33") },
  { gen: "IL4", nombre: "Interleucina-4", ubicacion: "5q31.1", expresion: "Sistema inmunitario, Sangre, Pulmón, Médula ósea, Intestino, Sistema vascular, Hígado, Cerebro", modal: buildGeneLinks("IL4") },
  { gen: "MIR126", nombre: "MicroARN miR-126", ubicacion: "9q34.3", expresion: "Corazón, Sistema vascular, Sangre, Músculo, Sistema inmunitario, Pulmón, Hígado", modal: buildGeneLinks("MIR126") },
  { gen: "IL4R", nombre: "Receptor de interleucina 4", ubicacion: "16p12.1", expresion: "Sistema inmunitario, Sangre, Pulmón, Médula ósea, Intestino", modal: buildGeneLinks("IL4R") },
  { gen: "MIR3162", nombre: "MicroARN 3162", ubicacion: "11q12.1", expresion: "Sangre, Riñon, Sistema inmunitario, Hígado, Médula ósea", modal: buildGeneLinks("MIR3162") },
  { gen: "CLCA1", nombre: "Accesorio 1 del Canal de Cloruro", ubicacion: "1p22.3", expresion: "Pulmón, Sangre, Músculo, Sistema inmunitario", modal: buildGeneLinks("CLCA1") },
  { gen: "IL17A", nombre: "Interleucina-17A", ubicacion: "6p12.2", expresion: "Sistema inmunitario, Sangre, Pulmón, Intestino, Médula ósea, Sistema vascular, Corazón", modal: buildGeneLinks("IL17A") },
  { gen: "PTGDR2", nombre: "Receptor 2 de prostaglandina D2", ubicacion: "11q12.2", expresion: "Sangre, Sistema inmunitario, Pulmón, Intestino, Médula ósea", modal: buildGeneLinks("PTGDR2") },
  { gen: "IL25", nombre: "Interleucina-25", ubicacion: "14q11.2", expresion: "Sangre, Sistema inmunitario, Pulmón, Intestino, Sistema vascular, Corazón", modal: buildGeneLinks("IL25") },
  { gen: "EPX", nombre: "Eosinófilo-peroxidasa", ubicacion: "17q22", expresion: "Sistema inmunitario, Pulmón, Sangre, Médula ósea", modal: buildGeneLinks("EPX") },
  { gen: "MUC5AC", nombre: "Mucina 5AC", ubicacion: "11p15.5", expresion: "Pulmón, Intestino, Sangre", modal: buildGeneLinks("MUC5AC") },
  { gen: "CDHR3", nombre: "Miembro 3 de la familia relacionada con la cadherina", ubicacion: "7q22.3", expresion: "Pulmón, Sangre, Sistema inmunitario", modal: buildGeneLinks("CDHR3") }
];

// Helper functions
const getExpresion = (g) => (g?.expresion || "").toString().trim();
const getChr = (loc) => (loc || "").split(/[pq]/)[0].trim();

// Estado para filtros + paginación
let genesFiltered = [...genesData];
let currentPage = 1;
const pageSize = 10;

// KPIs Genética
function renderGeneticsKPIs(rows) {
  const k1 = document.getElementById('kpiGenes');
  const k2 = document.getElementById('kpiCromos');
  const k3 = document.getElementById('kpiTejidos');
  const k4 = document.getElementById('kpiTejidoTop');

  if (!k1 || !k2 || !k3 || !k4) return;

  const chromos = new Set(rows.map(r => getChr(r.ubicacion)).filter(Boolean));
  const tissueList = rows.flatMap(r => getExpresion(r).split(',').map(s => s.trim()).filter(Boolean));
  const tissueSet = new Set(tissueList);
  const tissueFreq = tissueList.reduce((acc, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});
  const topTissue = Object.entries(tissueFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  k1.textContent = rows.length;
  k2.textContent = chromos.size;
  k3.textContent = tissueSet.size;
  k4.textContent = topTissue;
}

// Tabla con paginación
function getPagedData() {
  const start = (currentPage - 1) * pageSize;
  return genesFiltered.slice(start, start + pageSize);
}

function updatePager() {
  const totalPages = Math.max(1, Math.ceil(genesFiltered.length / pageSize));
  const prev = document.getElementById('prevPage');
  const next = document.getElementById('nextPage');
  const info = document.getElementById('pageInfo');
  
  if (prev) prev.disabled = currentPage <= 1;
  if (next) next.disabled = currentPage >= totalPages;
  if (info) info.textContent = `${currentPage} / ${totalPages}`;
}

function loadTableData() {
  const tbody = document.querySelector('#genesTable tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  const slice = getPagedData();
  
  slice.forEach(g => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="gene-name" data-gene="${g.gen}">${g.gen}</td>
      <td>${g.nombre}</td>
      <td>${g.ubicacion}</td>
      <td>${g.expresion}</td>
    `;
    tbody.appendChild(row);
  });
  
  // Añadir event listeners a los nombres de genes
  tbody.querySelectorAll('.gene-name').forEach(el => {
    el.addEventListener('click', function() {
      showGeneDetails(this.dataset.gene);
    });
  });
  
  updatePager();
}

// Cargar filtros
function loadFilters() {
  const chromosomeFilter = document.getElementById('chromosomeFilter');
  if (chromosomeFilter) {
    const chromos = Array.from(new Set(genesData
      .map(g => getChr(g.ubicacion))
      .filter(Boolean)))
      .sort((a, b) => {
        // Separar cromosomas numéricos y no numéricos (X, Y)
        const numA = parseInt(a);
        const numB = parseInt(b);
        
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        } else if (!isNaN(numA)) {
          return -1; // Números primero
        } else if (!isNaN(numB)) {
          return 1;
        } else {
          return a.localeCompare(b); // X, Y alfabéticamente
        }
      });
    
    chromos.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = `Cromosoma ${c}`;
      chromosomeFilter.appendChild(opt);
    });
  }

  const tissueFilter = document.getElementById('tissueFilter');
  if (tissueFilter) {
    const tissues = Array.from(new Set(
      genesData.flatMap(g => getExpresion(g).split(',').map(s => s.trim()).filter(Boolean))
    )).sort((a, b) => a.localeCompare(b, 'es'));
    
    tissues.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      tissueFilter.appendChild(opt);
    });
  }
}

// Aplicar filtros
function applyGeneFilters() {
  const chromosomeFilter = document.getElementById('chromosomeFilter');
  const tissueFilter = document.getElementById('tissueFilter');
  const geneSearch = document.getElementById('geneSearch');

  const chr = chromosomeFilter ? chromosomeFilter.value : '';
  const tissue = tissueFilter ? tissueFilter.value : '';
  const q = (geneSearch?.value || "").toLowerCase();

  genesFiltered = genesData.filter(g => {
    const loc = g.ubicacion || "";
    const geneChr = getChr(loc);
    const tissues = (g?.expresion || "").toLowerCase();
    const geneName = (g.gen || "").toLowerCase();

    // Comparación exacta de cromosomas
    const chrOk = (!chr) || geneChr === chr;
    const tisOk = (!tissue) || tissues.split(',').map(s => s.trim()).includes(tissue.toLowerCase());
    const qOk = (!q) || geneName.includes(q);

    return chrOk && tisOk && qOk;
  });

  currentPage = 1;
  loadTableData();
  renderGeneticsKPIs(genesFiltered);
}

// Modal de detalles de gen
function showGeneDetails(name) {
  const g = genesData.find(x => x.gen === name);
  const links = GENE_LINKS[name] || {};
  const modal = document.getElementById('geneModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  if (!g || !modal || !modalTitle || !modalBody) return;

  modalTitle.textContent = `${g.gen} — ${g.nombre ?? ""}`;

  // Descripción específica del gen
  const description = links.description || "Función no disponible.";
  
  // Enlace NCBI en el encabezado
  const ncbiLink = links.ncbi?.url || '#';

  // Identificadores externos con códigos ID
  const extList = [
    { label: "GeneCards", url: links.genecards?.url, id: links.genecards?.id },
    { label: "UniProtKB/Swiss-Prot", url: links.uniprot?.url, id: links.uniprot?.id },
    { label: "RefSeq", url: links.refseq?.url, id: links.refseq?.id },
    { label: "Tissues", url: links.tissues?.url, id: links.tissues?.id },
    { label: "HGNC", url: links.hgnc?.url, id: links.hgnc?.id },
    { label: "Ensembl", url: links.ensembl?.url, id: links.ensembl?.id },
    { label: "OMIM®", url: links.omim?.url, id: links.omim?.id }
  ].map(item => {
    const href = item.url || '#';
    const displayId = item.id || 'N/A';
    return `<li><strong>${item.label}:</strong> <a href="${href}" target="_blank" rel="noopener">${displayId}</a></li>`;
  }).join("");


  // Literatura con PMIDs
  const lit = Array.isArray(links.literature) ? links.literature : [];
  const litList = lit.length ? lit.map(item => {
    const href = item.url || '#';
    const pmid = item.pmid || 'N/A';
    return `<li><a href="${href}" target="_blank" rel="noopener">PMID: ${pmid}</a></li>`;
  }).join("") : '<li>No hay publicaciones disponibles</li>';

  const ubicacion = g.ubicacion || "—";

  modalBody.innerHTML = `
    <div class="gene-details">
      <div class="gene-modal-grid">
        
        <!-- Card principal: función y metadatos -->
        <article class="gene-card gene-card-main">
          <div class="gene-card-header">
            <i class="uil uil-dna"></i>
            <div>
              <span class="gene-tag">Función del gen</span>
            </div>
          </div>
          <p class="gene-card-text">
            ${description}
          </p>
          <div class="gene-meta">
            <div class="gene-chip">
              <span class="gene-chip-label">Ubicación</span>
              <span class="gene-chip-value">${ubicacion}</span>
            </div>
          </div>
          ${ncbiLink ? `
            <a class="gene-primary-link" href="${ncbiLink}" target="_blank" rel="noopener">
              Ver ficha en NCBI
            </a>
          ` : ""}
        </article>

        <!-- Card: Identificadores externos -->
        <article class="gene-card">
          <div class="gene-card-header">
            <i class="uil uil-link-alt"></i>
            <div>
              <span class="gene-tag">Identificadores externos</span>
              <span class="gene-subtitle">Recursos de referencia</span>
            </div>
          </div>
          <ul class="gene-card-list">
            ${extList}
          </ul>
        </article>

        <!-- Card: Literatura -->
        <article class="gene-card">
          <div class="gene-card-header">
            <i class="uil uil-book-open"></i>
            <div>
              <span class="gene-tag">Literatura</span>
              <span class="gene-subtitle">Publicaciones clave</span>
            </div>
          </div>
          <ul class="gene-card-list gene-card-list--compact">
            ${litList}
          </ul>
        </article>

      </div>
    </div>
  `;

  modal.style.display = 'block';
}

// Cerrar modal
function closeModal() {
  const modal = document.getElementById('geneModal');
  if (modal) {
    modal.style.display = 'none';
  }
}


// ================ INICIALIZACIÓN GENÉTICA ================
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar filtros
  loadFilters();
  renderGeneticsKPIs(genesFiltered);
  loadTableData();

  // Event listeners para filtros
  const chromosomeFilter = document.getElementById('chromosomeFilter');
  const tissueFilter = document.getElementById('tissueFilter');
  const geneSearch = document.getElementById('geneSearch');

  if (chromosomeFilter) chromosomeFilter.addEventListener('change', applyGeneFilters);
  if (tissueFilter) tissueFilter.addEventListener('change', applyGeneFilters);
  if (geneSearch) {
    geneSearch.addEventListener('input', () => {
      clearTimeout(window.__geneDebounce);
      window.__geneDebounce = setTimeout(applyGeneFilters, 150);
    });
  }

  // Paginación
  const prev = document.getElementById('prevPage');
  const next = document.getElementById('nextPage');
  
  if (prev) {
    prev.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        loadTableData();
      }
    });
  }
  
  if (next) {
    next.addEventListener('click', () => {
      const totalPages = Math.max(1, Math.ceil(genesFiltered.length / pageSize));
      if (currentPage < totalPages) {
        currentPage++;
        loadTableData();
      }
    });
  }

  // Modal - botón cerrar
  const modal = document.getElementById('geneModal');
  if (modal) {
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Cerrar al hacer clic fuera del modal
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }
});




// =================== ESTUDIOS GENÉTICOS ===================

const studiesData = [
            {
                year: 1989,
                title: "Vinculación entre respuestas de IgE y el cromosoma 11q en asma y rinitis",
                methodology: "Estudios de ligamiento",
                subjects: "24 familias con historia de asma y rinitis alérgica",
                source: "Cookson et al., 1989 (The Lancet)",
                category: "ligamiento"
            },
            {
                year: 1997,
                title: "Asociación del gen IL-4 con asma alérgica",
                methodology: "Estudios de ligamiento",
                subjects: "383 familias con asma",
                source: "Marsh et al., 1997 (Nature Genetics)",
                category: "ligamiento"
            },
            {
                year: 2002,
                title: "Identificación del gen ADAM33 asociado con asma",
                methodology: "Estudios de ligamiento y asociación",
                subjects: "460 familias con asma",
                source: "Van Eerdewegh et al., 2002 (Nature)",
                category: "ligamiento"
            },
            {
                year: 2007,
                title: "Primer GWAS en asma, identificación de ORMDL3",
                methodology: "GWAS en población europea",
                subjects: "994 casos y 1,243 controles",
                source: "Moffatt et al., 2007 (Nature)",
                category: "gwas"
            },
            {
                year: 2010,
                title: "Confirmación de ORMDL3 y GSDMB como genes clave en asma",
                methodology: "GWAS y estudios funcionales",
                subjects: "10,365 casos y 16,110 controles",
                source: "Moffatt et al., 2010 (NEJM)",
                category: "gwas"
            },
            {
                year: 2011,
                title: "Meta-análisis de GWAS en poblaciones norteamericanas diversas",
                methodology: "Meta-análisis de GWAS",
                subjects: "6,675 casos y 8,736 controles",
                source: "Torgerson et al., 2011 (Nature Genetics)",
                category: "gwas"
            },
            {
                year: 2013,
                title: "Asociación genómica de IgE sérica total y específica para ácaros en asma",
                methodology: "GWAS",
                subjects: "855 pacientes con asma",
                source: "Kim et al., 2013 (PLoS ONE)",
                category: "gwas"
            },
            {
                year: 2015,
                title: "Estudio epigenómico de IgE sérica total",
                methodology: "Epigenómica",
                subjects: "1,000 individuos con asma y alergias",
                source: "Liang et al., 2015 (Nature)",
                category: "epigenomica"
            },
            {
                year: 2016,
                title: "Metilación del ADN en células pulmonares asociada con endotipos de asma y riesgo genético",
                methodology: "Epigenómica, RNA-Seq, GWAS",
                subjects: "66 muestras de tejido pulmonar de pacientes asmáticos y controles",
                source: "Nicodemus-Johnson et al., 2016 (JCI Insight)",
                category: "epigenomica"
            },
            {
                year: 2018,
                title: "Análisis genético compartido entre asma y otras enfermedades alérgicas",
                methodology: "GWAS y análisis de rasgos compartidos",
                subjects: "450,000 individuos (UK Biobank)",
                source: "Zhu et al., 2018 (Nature Genetics)",
                category: "gwas"
            },
            {
                year: 2020,
                title: "Contribución de vías inmunológicas a la genética del asma",
                methodology: "GWAS y análisis funcional",
                subjects: "394,052 individuos (UK Biobank y EVE Consortium)",
                source: "Han et al., 2020 (Nature Communications)",
                category: "funcional"
            },
            {
                year: 2023,
                title: "CST1 como biomarcador de vías aéreas unificadas en asma y rinitis alérgica",
                methodology: "Transcriptómica y análisis bioinformático",
                subjects: "197 pacientes con asma o rinitis alérgica",
                source: "Wang et al., 2023 (Frontiers in Immunology)",
                category: "funcional"
            }
        ];

       

        // Generar elementos de la timeline
        function generateTimelineItems(data) {
	const timelineContainer = document.getElementById('timeline-items');
	if (!timelineContainer) return;
	
	timelineContainer.innerHTML = '';
	
	data.forEach((study) => {
		const item = document.createElement('div');
		item.className = 'timeline-item';
		item.dataset.category = study.category;
		
		item.innerHTML = `
			<div class="timeline-dot"></div>
			<div class="timeline-content">
				<div class="timeline-year">${study.year}</div>
				<div class="timeline-title">${study.title}</div>
				<div class="timeline-methodology">${study.methodology}</div>
				<div class="timeline-subjects"><strong>Sujetos:</strong> ${study.subjects}</div>
				<div class="timeline-source">${study.source}</div>
			</div>
		`;
		
		timelineContainer.appendChild(item);
	});
}

// Filtrar estudios
function filterStudies(category) {
	document.querySelectorAll('.timeline-item').forEach(item => {
		if (category === 'all' || item.dataset.category === category) {
			item.classList.remove('hidden');
			item.classList.add('visible');
		} else {
			item.classList.add('hidden');
			item.classList.remove('visible');
		}
	});
}

// Inicialización de estudios genéticos
document.addEventListener('DOMContentLoaded', function() {
	const filterButtons = document.querySelectorAll('.filter-btn');
	
	// Event listeners para filtros
	filterButtons.forEach(button => {
		button.addEventListener('click', () => {
			// Actualizar botones activos
			filterButtons.forEach(b => b.classList.remove('active'));
			button.classList.add('active');
			
			// Filtrar estudios
			filterStudies(button.dataset.filter);
		});
	});
	
	// Inicializar
	generateTimelineItems(studiesData);
});



// =================== ALÉRGENOS ===================
const ALERG_DATA = [
  // Ácaros
  {Categoria:'Ácaros del polvo', Alergeno:'Dermatophagoides pteronyssinus', Fuente:'Colchones, ropa de cama', Asociacion:'Alta', Exposicion:82, Regiones:'América, Europa, Asia', Referencia:'WAO, 2022'},
  {Categoria:'Ácaros del polvo', Alergeno:'Dermatophagoides farinae', Fuente:'Polvo doméstico', Asociacion:'Alta', Exposicion:78, Regiones:'América, Asia', Referencia:'WAO, 2022'},
  {Categoria:'Ácaros del polvo', Alergeno:'Blomia tropicalis', Fuente:'Ambientes húmedos', Asociacion:'Media', Exposicion:55, Regiones:'Latinoamérica, Sudeste Asiático', Referencia:'Revisión regional'},

  // Hongos
  {Categoria:'Hongos', Alergeno:'Alternaria alternata', Fuente:'Aire exterior (verano/otoño)', Asociacion:'Media', Exposicion:33, Regiones:'Regiones templadas', Referencia:'Bush & Prochnau, 2004'},
  {Categoria:'Hongos', Alergeno:'Cladosporium herbarum', Fuente:'Aire exterior', Asociacion:'Baja', Exposicion:20, Regiones:'Europa, América del Norte', Referencia:'D’Amato et al., 2007'},

  // Polen
  {Categoria:'Polen', Alergeno:'Betula pendula', Fuente:'Árboles (abedul)', Asociacion:'Alta', Exposicion:41, Regiones:'Europa, Norteamérica', Referencia:'D’Amato et al., 2007'},
  {Categoria:'Polen', Alergeno:'Lolium perenne', Fuente:'Gramíneas', Asociacion:'Alta', Exposicion:48, Regiones:'Europa, Oceanía', Referencia:'Revisión gramíneas'},
  {Categoria:'Polen', Alergeno:'Ambrosia artemisiifolia', Fuente:'Herbáceas (ambrosía)', Asociacion:'Alta', Exposicion:45, Regiones:'América del Norte, Europa', Referencia:'Revisión ambrosía'},

  // Animales
  {Categoria:'Animales', Alergeno:'Fel d 1 (Gato)', Fuente:'Caspa, saliva', Asociacion:'Alta', Exposicion:60, Regiones:'Global', Referencia:'Revisión felinos'},
  {Categoria:'Animales', Alergeno:'Can f 1 (Perro)', Fuente:'Caspa, saliva', Asociacion:'Media', Exposicion:37, Regiones:'Global', Referencia:'Revisión caninos'},

  // Cucarachas
  {Categoria:'Cucarachas', Alergeno:'Bla g 1 (Blattella germanica)', Fuente:'Restos y excretas', Asociacion:'Media', Exposicion:34, Regiones:'Zonas urbanas', Referencia:'Estudios urbanos'},
  {Categoria:'Cucarachas', Alergeno:'Per a 1 (Periplaneta americana)', Fuente:'Restos y excretas', Asociacion:'Media', Exposicion:29, Regiones:'Zonas urbanas', Referencia:'Estudios urbanos'},

  // Látex (ocupacional/entornos clínicos)
  {Categoria:'Látex', Alergeno:'Hev b 5', Fuente:'Guantes de látex', Asociacion:'Baja', Exposicion:10, Regiones:'Centros de salud', Referencia:'Revisión látex'},

  // Polvo/Moho interior
  {Categoria:'Hongos', Alergeno:'Aspergillus fumigatus', Fuente:'Ambientes interiores húmedos', Asociacion:'Media', Exposicion:22, Regiones:'Global', Referencia:'Revisión aspergillus'}
];

// Estado y referencias a gráficos
let FILTERED = [];
let allergenCharts = { expoCat: null, assocCat: null, top: null };

// Helpers
const unique = (arr) => Array.from(new Set(arr));
const splitRegions = (str) => !str ? [] : String(str).split(',').map(s => s.trim()).filter(Boolean);

// Render KPIs
function renderKPIs(rows){
	const kpiCategorias = document.getElementById('kpiCategorias');
	const kpiAlergenos = document.getElementById('kpiAlergenos');
	const kpiExposicionMedia = document.getElementById('kpiExposicionMedia');
	
	if (!kpiCategorias || !kpiAlergenos || !kpiExposicionMedia) return;
	
	const catCount = unique(rows.map(r => r.Categoria)).length;
	const alergCount = rows.length;
	const expos = rows.map(r => r.Exposicion).filter(v => typeof v === 'number');
	const avg = expos.length ? (expos.reduce((a,b)=>a+b,0)/expos.length) : 0;
	
	kpiCategorias.textContent = catCount;
	kpiAlergenos.textContent = alergCount;
	kpiExposicionMedia.textContent = avg.toFixed(1);
}

// Render Tabla
function renderTable(rows){
	const tbody = document.querySelector('#alergTable tbody');
	if (!tbody) return;
	
	tbody.innerHTML = '';
	const frag = document.createDocumentFragment();
	rows.forEach(r => {
		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td>${r.Categoria}</td>
			<td>${r.Alergeno}</td>
			<td>${r.Fuente}</td>
			<td>${r.Asociacion}</td>
			<td>${(r.Exposicion ?? '').toString()}</td>
			<td>${r.Regiones}</td>
			<td>${r.Referencia}</td>
		`;
		frag.appendChild(tr);
	});
	tbody.appendChild(frag);
}

// Render Charts
function renderCharts(rows){
	if (typeof Chart === 'undefined') return;

  // limpiar previos
  const destroy = (c) => { if(c && c.destroy) c.destroy(); };
	destroy(allergenCharts.expoCat); 
	destroy(allergenCharts.assocCat); 
	destroy(allergenCharts.top);

	// Exposición promedio por categoría
	const byCat = {};
	rows.forEach(r => {
		if(typeof r.Exposicion === 'number'){
			if(!byCat[r.Categoria]) byCat[r.Categoria] = [];
			byCat[r.Categoria].push(r.Exposicion);
		}
	});
	const catLabels = Object.keys(byCat);
	const catMeans = catLabels.map(k => {
		const arr = byCat[k]; 
		return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;
	});
	
	const ctx1 = document.getElementById('chartExpoPorCategoria');
	if (ctx1) {
		allergenCharts.expoCat = new Chart(ctx1.getContext('2d'), {
			type: 'bar',
			data: { labels: catLabels, datasets: [{ label: 'Exposición promedio (%)', data: catMeans }] },
			options: {
				responsive: true, maintainAspectRatio: false,
				scales: { y: { beginAtZero: true, title: { display: true, text: '%' } } },
				plugins: { legend: { display: false } }
			}
		});
	}

  // Distribución de asociación por categoría (apilado)
  const assocLevels = ['Alta', 'Media', 'Baja'];
  const catSet = unique(rows.map(r => r.Categoria));
  const countMatrix = assocLevels.map(level => 
    catSet.map(cat => rows.filter(r => r.Categoria === cat && r.Asociacion === level).length)
  );

  const ctx2 = document.getElementById('chartAsociacionPorCategoria');
	if (ctx2) {
		allergenCharts.assocCat = new Chart(ctx2.getContext('2d'), {
			type: 'bar',
			data: {
				labels: catSet,
				datasets: assocLevels.map((level, idx) => ({
					label: level, data: countMatrix[idx], stack: 'assoc'
				}))
			},
			options: {
				responsive: true, maintainAspectRatio: false,
				scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Conteo' } } }
			}
		});
	}

  // Top 8 por exposición
  const rowsWithExpo = rows.filter(r => typeof r.Exposicion === 'number');
	const top = rowsWithExpo.sort((a,b)=> b.Exposicion - a.Exposicion).slice(0, 8);
	const subTopN = document.getElementById('subTopN');
	if (subTopN) subTopN.textContent = `(según filtros activos: ${top.length})`;
	
	const ctx3 = document.getElementById('chartTopAlergenos');
	if (ctx3) {
		allergenCharts.top = new Chart(ctx3.getContext('2d'), {
			type: 'bar',
			data: { labels: top.map(r => r.Alergeno), datasets: [{ label: 'Exposición (%)', data: top.map(r => r.Exposicion) }] },
			options: {
				indexAxis: 'y', responsive: true, maintainAspectRatio: false,
				scales: { x: { beginAtZero: true, title: { display: true, text: '%' } } },
				plugins: { legend: { display: false } }
			}
		});
	}
}

// Filtros de alérgenos
function applyFilters(){
	const filterCategoria = document.getElementById('filterCategoria');
	const filterAsociacion = document.getElementById('filterAsociacion');
	const filterRegion = document.getElementById('filterRegion');
	const filterSearch = document.getElementById('filterSearch');
	
	const cat = filterCategoria ? filterCategoria.value : '__all__';
	const assoc = filterAsociacion ? filterAsociacion.value : '__all__';
	const reg = filterRegion ? filterRegion.value : '__all__';
	const q = filterSearch ? filterSearch.value.trim().toLowerCase() : '';

	FILTERED = ALERG_DATA.filter(r => {
		const catOk = (cat === '__all__') || (r.Categoria === cat);
		const assocOk = (assoc === '__all__') || (r.Asociacion === assoc);
		const regOk = (reg === '__all__') || splitRegions(r.Regiones).some(rr => rr.toLowerCase().includes(reg.toLowerCase()));
		const qOk = !q || [r.Alergeno, r.Fuente, r.Categoria, r.Regiones].some(v => String(v).toLowerCase().includes(q));
		return catOk && assocOk && regOk && qOk;
	});

	renderKPIs(FILTERED);
	renderTable(FILTERED);
	renderCharts(FILTERED);
}

function resetFilters(){
	const filterCategoria = document.getElementById('filterCategoria');
	const filterAsociacion = document.getElementById('filterAsociacion');
	const filterRegion = document.getElementById('filterRegion');
	const filterSearch = document.getElementById('filterSearch');
	
	if (filterCategoria) filterCategoria.value = '__all__';
	if (filterAsociacion) filterAsociacion.value = '__all__';
	if (filterRegion) filterRegion.value = '__all__';
	if (filterSearch) filterSearch.value = '';
	applyFilters();
}

// Inicializa selects con datos embebidos
function populateSelects(data){
	const selCat = document.getElementById('filterCategoria');
	const selReg = document.getElementById('filterRegion');
	
	if (selCat) {
		unique(data.map(d => d.Categoria)).forEach(v => {
			const opt = document.createElement('option'); 
			opt.value = v; 
			opt.textContent = v; 
			selCat.appendChild(opt);
		});
	}
	
	if (selReg) {
		const allRegs = unique(data.flatMap(d => splitRegions(d.Regiones)));
		allRegs.forEach(v => {
			const opt = document.createElement('option'); 
			opt.value = v; 
			opt.textContent = v; 
			selReg.appendChild(opt);
		});
	}
}

// Eventos de filtros
function bindFilterEvents(){
	const filterCategoria = document.getElementById('filterCategoria');
	const filterAsociacion = document.getElementById('filterAsociacion');
	const filterRegion = document.getElementById('filterRegion');
	const filterSearch = document.getElementById('filterSearch');
	const btnReset = document.getElementById('btnReset');
	
	if (filterCategoria) filterCategoria.addEventListener('change', applyFilters);
	if (filterAsociacion) filterAsociacion.addEventListener('change', applyFilters);
	if (filterRegion) filterRegion.addEventListener('change', applyFilters);
	if (filterSearch) {
		filterSearch.addEventListener('input', () => {
			clearTimeout(window.__alergDebounce);
			window.__alergDebounce = setTimeout(applyFilters, 150);
		});
	}
	if (btnReset) btnReset.addEventListener('click', resetFilters);
}

// Inicialización de alérgenos
document.addEventListener('DOMContentLoaded', function() {
	bindFilterEvents();
	populateSelects(ALERG_DATA);
	resetFilters(); // render inicial con datos embebidos
});



// =================== VÍAS DE SEÑALIZACIÓN ===================
// Datos embebidos
const PATHWAYS = [
  { name:"Vía IL-4/IL-13", components:["IL-4","IL-13","STAT6","JAK1","JAK3"], category:"cytokine", effect:"Diferenciación Th2, aumento de IgE, producción de moco.", reference:"Wills-Karp et al., 2010" },
  { name:"TSLP", components:["TSLP","TSLPR","JAK","STAT"], category:"immune", effect:"Activa células dendríticas, promueve inflamación tipo 2.", reference:"Ziegler & Artis, 2010" },
  { name:"IL-5", components:["IL-5","IL-5R","JAK/STAT"], category:"cytokine", effect:"Supervivencia y activación de eosinófilos.", reference:"Foster et al., 2011" },
  { name:"IL-33/ST2", components:["IL-33","ST2","NF-κB"], category:"immune", effect:"Activación de ILC2 y potenciación de respuesta alérgica.", reference:"Schmitz et al., 2005" },
  { name:"NF-κB", components:["NF-κB","IκB","IKK"], category:"inflammatory", effect:"Transcripción de genes pro-inflamatorios.", reference:"Barnes, 2006" },
  { name:"NLRP3 Inflamasoma", components:["NLRP3","ASC","Caspasa-1","IL-1β"], category:"inflammatory", effect:"Maduración de IL-1β; inflamación de la vía aérea.", reference:"Schroder & Tschopp, 2010" },
  { name:"IgE–FcεRI", components:["IgE","FcεRI","Syk","Lyn"], category:"immune", effect:"Degranulación mastocitaria, liberación de histamina.", reference:"Galli et al., 2008" },
  { name:"Leucotrienos", components:["5-LOX","LTC4","LTD4","LTE4","CysLT1"], category:"inflammatory", effect:"Broncoconstricción y aumento de permeabilidad.", reference:"Peters-Golden & Henderson, 2007" },
  { name:"TGF-β Remodelado", components:["TGF-β","SMAD2/3","SMAD4"], category:"other", effect:"Fibrosis y remodelado de la vía aérea.", reference:"Halwani et al., 2011" },
  { name:"IL-17", components:["IL-17A","IL-17F","ACT1","NF-κB"], category:"inflammatory", effect:"Inflamación neutrofílica, esteroide-resistente en algunos fenotipos.", reference:"Newcomb & Peebles, 2013" }
];

// Estado de filtros y referencias de gráficos
let PWS_FILTERED = [];
let pathwayCharts = { cat:null, top:null };
let chartsReady = false;

// Utils
const splitVisible = (sel) => document.querySelector(sel)?.offsetParent !== null;

// Paleta: n colores distintos (HSL) para barras diferentes
function palette(n){
  const arr = [];
  for (let i = 0; i < n; i++){
    const hue = Math.round((360 / Math.max(1,n)) * i);
    arr.push(`hsl(${hue} 70% 55%)`);
  }
  return arr;
}

// =================== KPIs ===================
function renderPathwaysKPIs(rows){
	const kVias = document.getElementById("kpiVias");
	const kComp = document.getElementById("kpiComponentes");
	const kCats = document.getElementById("kpiCategorias");

	if (!kVias || !kComp || !kCats) return;

	const vias = rows.length;
	const compSet = new Set(rows.flatMap(r => r.components));
	const cats = new Set(rows.map(r => r.category)).size;

	kVias.textContent = vias;
	kComp.textContent = compSet.size;
	kCats.textContent = cats;
}

// =================== Tarjetas (sin modal) ===================
function renderPathwayCards(rows){
	const grid = document.getElementById("pathways-grid");
	if (!grid) return;
	grid.innerHTML = "";

	rows.forEach((p, i) => {
		const card = document.createElement("div");
		card.className = "pathway-card";
		card.style.animationDelay = `${i * 0.06}s`;

		const compsHTML = p.components.map(c => `<span class="component-tag">${c}</span>`).join("");

		card.innerHTML = `
			<div class="pathway-title">${p.name}</div>
			<div class="pathway-components">
				<h4>Componentes Clave</h4>
				<div class="components-tags">${compsHTML}</div>
			</div>
			<div class="pathway-effect">${p.effect || ""}</div>
			<div class="pathway-reference">${p.reference || ""}</div>
		`;

		grid.appendChild(card);
	});
}

// =================== Gráficos ===================
function renderPathwayCharts(rows){
	if (typeof Chart === 'undefined') return;
	if (!splitVisible("#vias-señalizacion")) return;

	const destroy = (c) => { if (c && c.destroy) c.destroy(); };
	destroy(pathwayCharts.cat); 
	destroy(pathwayCharts.top);

  // ---- Gráfico 1: vías por categoría ----
  const catOrder = ["cytokine","immune","inflammatory","other"];
  const labels = ["Citocinas","Inmune","Inflamatorias","Otras"];
  const counts = catOrder.map(k => rows.filter(r => r.category === k).length);
  const colors1 = palette(counts.length);

  const ctx1 = document.getElementById("chartPathwayCategorias");
	if (ctx1) {
		pathwayCharts.cat = new Chart(ctx1.getContext("2d"), {
			type: "bar",
			data: {
				labels,
				datasets: [{
					label: "Vías",
					data: counts,
					backgroundColor: colors1,
					borderColor: colors1.map(c => c.replace("55%)","40%)")),
					borderWidth: 1
				}]
			},
			options: {
				responsive: true, maintainAspectRatio: false,
				scales: { y: { beginAtZero: true, title: { display: true, text: "Conteo" } } },
				plugins: { legend: { display: false } }
			}
		});
	}

  // ---- Gráfico 2: top componentes ----
  const freq = {};
  rows.flatMap(r => r.components).forEach(c => { freq[c] = (freq[c] || 0) + 1; });
  const sortedComps = Object.entries(freq).sort((a,b)=> b[1] - a[1]).slice(0, 10);

  const topMeta = document.getElementById("topCompMeta");
  if (topMeta) topMeta.textContent = `(según filtros activos: ${sortedComps.length})`;

  const labels2 = sortedComps.map(x => x[0]);
  const data2   = sortedComps.map(x => x[1]);
  const colors2 = palette(data2.length);

  const ctx2 = document.getElementById("chartTopComponentes");
	if (ctx2) {
		pathwayCharts.top = new Chart(ctx2.getContext("2d"), {
			type: "bar",
			data: {
				labels: labels2,
				datasets: [{
					label: "Frecuencia",
					data: data2,
					backgroundColor: colors2,
					borderColor: colors2.map(c => c.replace("55%)","40%)")),
					borderWidth: 1
				}]
			},
			options: {
				indexAxis: "y",
				responsive: true, maintainAspectRatio: false,
				scales: { x: { beginAtZero: true, title: { display: true, text: "Apariciones" } } },
				plugins: { legend: { display: false } }
			}
		});
	}

	chartsReady = true;
}

function ensurePathwayCharts(){
	if (!chartsReady) renderPathwayCharts(PWS_FILTERED);
	else Object.values(pathwayCharts).forEach(c => c && c.resize());
}

// =================== Filtros + búsqueda ===================
function applyPathwayFilters(){
	const pathwaySearch = document.getElementById("pathway-search");
	const pathwayFilter = document.getElementById("pathway-filter");
	
	const q = pathwaySearch ? pathwaySearch.value.trim().toLowerCase() : '';
	const filt = pathwayFilter ? pathwayFilter.value : 'all';

	PWS_FILTERED = PATHWAYS.filter(p => {
		const matchesQ = !q || p.name.toLowerCase().includes(q)
			|| p.effect.toLowerCase().includes(q)
			|| p.components.some(c => c.toLowerCase().includes(q));
		const matchesF = (filt === "all") || p.category === filt;
		return matchesQ && matchesF;
	});

	renderPathwaysKPIs(PWS_FILTERED);
	renderPathwayCards(PWS_FILTERED);
	renderPathwayCharts(PWS_FILTERED);
}

// =================== Utils ===================
const debounce = (fn, ms=150) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };


// ================ Inicialización de vías de señalización ================
document.addEventListener("DOMContentLoaded", () => {
	// Estado base (no renderizamos gráficos hasta que el usuario abra la pestaña de vías)
	PWS_FILTERED = [...PATHWAYS];

	// Listeners de filtros/búsqueda
	const pathwaySearch = document.getElementById("pathway-search");
	const pathwayFilter = document.getElementById("pathway-filter");
	
	if (pathwaySearch) {
		pathwaySearch.addEventListener("input", debounce(applyPathwayFilters, 150));
	}
	if (pathwayFilter) {
		pathwayFilter.addEventListener("change", applyPathwayFilters);
	}

	// KPIs + tarjetas iniciales (sin gráficos) por si la pestaña ya está visible
	renderPathwaysKPIs(PWS_FILTERED);
	renderPathwayCards(PWS_FILTERED);

	// Cuando se cambie el tamaño, si la pestaña está visible, ajusta gráficos
	window.addEventListener("resize", () => {
		const viasTab = document.querySelector("#vias-señalizacion");
		if (viasTab && viasTab.offsetParent !== null) {
			Object.values(pathwayCharts).forEach(c => c && c.resize());
		}
	});
});