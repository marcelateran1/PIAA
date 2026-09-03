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
			// Disparar evento resize para gráficos de Chart.js de otras secciones
			window.dispatchEvent(new Event('resize'));
		}
	}, 100);
};

if (tabBtns.length > 0) {
	tabBtns.forEach((tabBtn, i) => tabBtn.addEventListener("click", () => tab_Nav(i)));
}


// =================== EPIDEMIOLOGÍA ===================
// Datos embebidos: fracción (%) de los casos de asma atribuible a sensibilización
// alérgica (atopia), por país, según estudios poblacionales independientes.
// Cada país usa una definición de atopia y un grupo de edad distintos (ver notas
// en cada fuente); se listan de menor a mayor fracción atribuible.
const EPIDEMIO_COUNTRY_DISTRIBUTION = {
	labels: ['Turquía (Ankara)', 'Brasil', 'Europa (ECRHS, 13 países)', 'Taiwán', 'Estados Unidos', 'China (Guangzhou)'],
	values: [0, 24.5, 30, 50.4, 56.3, 93.8],
	sources: [
		'Weinmayr G et al., 2007 (ISAAC Fase II, niños 8–12 años)',
		'Cunha SS et al., 2010 (Salvador, niños)',
		'Sunyer J et al., 2004 (ECRHS, adultos)',
		'Wu et al. / estudio PATCH, 2021 (niños y adolescentes)',
		'Arbes SJ et al., 2007 (NHANES III, todas las edades)',
		'Weinmayr G et al., 2007 (ISAAC Fase II, niños 8–12 años)'
	]
};

// Hallazgos clave con referencia bibliográfica (PMID/DOI)
const EPIDEMIO_CATEGORY_LABELS = {
	"carga-global": "Carga global",
	"variacion-regional": "Variación regional",
	"tendencias-temporales": "Tendencias temporales",
	"fenotipo-alergico": "Fenotipo alérgico"
};

const EPIDEMIO_FINDINGS = [
	{
		id: "gbd2021",
		category: "carga-global",
		title: "La carga mundial del asma sigue creciendo, aunque su prevalencia ajustada disminuye",
		detail: "El estudio de Carga Global de Enfermedad (GBD) 2021 estimó la prevalencia, incidencia, mortalidad y años de vida ajustados por discapacidad (DALY) de asma y dermatitis atópica en 204 países y territorios entre 1990 y 2021, con proyecciones hasta 2050. El número absoluto de personas afectadas continúa en aumento, principalmente por el crecimiento poblacional, mientras que la prevalencia estandarizada por edad muestra una tendencia decreciente a nivel global.",
		study: { authors: "GBD 2021 Asthma and Allergic Diseases Collaborators", year: "2025", journal: "The Lancet Respiratory Medicine", vol: "13(5):425–446", pmid: "40147466", doi: "10.1016/S2213-2600(25)00003-7" }
	},
	{
		id: "shin2023",
		category: "variacion-regional",
		title: "Los países con mayor desarrollo socioeconómico concentran más casos, pero menor mortalidad",
		detail: "Un análisis del estudio de Carga Global de Enfermedad (GBD 2019) sobre trastornos alérgicos en 204 países encontró que las regiones con mayor índice sociodemográfico (SDI) presentan una prevalencia de asma más alta, pero una mortalidad y morbilidad asociadas más bajas que las regiones de menor SDI, un patrón que probablemente refleja diferencias en el acceso a diagnóstico y tratamiento.",
		study: { authors: "Shin YH, Hwang J, Kwon R, et al.", year: "2023", journal: "Allergy", vol: "78(8):2232–2254", pmid: "37431853", doi: "10.1111/all.15807" }
	},
	{
		id: "pearce2007",
		category: "tendencias-temporales",
		title: "Entre 1993 y 2003 la prevalencia de sibilancias evolucionó de forma distinta según la región",
		detail: "Al repetir la encuesta ISAAC entre 5 y 10 años después (Fase I → Fase III) en más de 500.000 niños y adolescentes de decenas de países, la prevalencia media de sibilancias en el último año cambió muy poco a nivel global, pero con patrones regionales opuestos: aumentó en África, América Latina y partes de Asia, mientras se mantuvo estable o disminuyó ligeramente en varios países de ingresos altos. El gráfico de esta sección resume ese cambio anual por región.",
		study: { authors: "Pearce N, Aït-Khaled N, Beasley R, et al.", year: "2007", journal: "Thorax", vol: "62(9):758–766", pmid: "17504817", doi: "10.1136/thx.2006.070169" }
	},
	{
		id: "lai2009",
		category: "variacion-regional",
		title: "Existen diferencias de hasta 40 veces en la prevalencia de sibilancias entre países",
		detail: "La Fase Tres de ISAAC, con cerca de 1,2 millones de niños y adolescentes de 97 países, encontró que la prevalencia de sibilancias en el último año variaba entre 0,8% (Tíbet, China) y 32,6% (Wellington, Nueva Zelanda) en adolescentes de 13-14 años, y entre 2,4% (Jodhpur, India) y 37,6% (Costa Rica) en niños de 6-7 años. Los síntomas de asma tendieron a ser más frecuentes en países de ingresos altos, pero más graves en los de ingresos más bajos.",
		study: { authors: "Lai CKW, Beasley R, Crane J, et al.", year: "2009", journal: "Thorax", vol: "64(6):476–483", pmid: "", doi: "10.1136/thx.2008.106609" }
	},
	{
		id: "asher2021",
		category: "tendencias-temporales",
		title: "En un seguimiento de 27 años, más niños y adolescentes reportaron haber tenido asma alguna vez",
		detail: "El estudio Global Asthma Network (GAN) Fase I, que comparó datos de 119.795 participantes en 27 centros de 14 países frente a ISAAC (1993-2020), halló que la prevalencia de sibilancias actuales disminuyó en países de bajos ingresos, aumentó en países de ingresos medios-bajos y se mantuvo estable en los de ingresos medios-altos y altos. En paralelo, la proporción de quienes reportaron haber tenido asma alguna vez aumentó de forma sostenida en casi todos los grupos.",
		study: { authors: "Asher MI, Rutter CE, Bissell K, et al.", year: "2021", journal: "The Lancet", vol: "398(10311):1569–1580", pmid: "34755626", doi: "10.1016/S0140-6736(21)01450-1" }
	},
	{
		id: "custovic2024",
		category: "fenotipo-alergico",
		title: "El fenotipo alérgico sigue siendo el más frecuente, pero es clínicamente heterogéneo",
		detail: "Revisiones recientes sobre sensibilización alérgica infantil y su relación con el asma muestran que, aunque la sensibilización a aeroalérgenos sigue siendo el mecanismo dominante en el asma pediátrica, no toda sensibilización por IgE tiene relevancia clínica. El uso de diagnóstico molecular (component-resolved diagnostics) permite distinguir subtipos de sensibilización realmente asociados a síntomas de aquellos que no lo están, abriendo camino a un fenotipado más preciso.",
		study: { authors: "Custovic A, Custovic D, Fontanella S.", year: "2024", journal: "Current Opinion in Allergy and Clinical Immunology", vol: "24(2):79–87", pmid: "38359101", doi: "10.1097/ACI.0000000000000967" }
	}
];

let EPIDEMIO_FILTERED = [];

// =================== Gráfico de distribución por país ===================
function renderEpidemioChart(){
	const canvas = document.getElementById('epidemioTrendChart');
	if (!canvas || typeof Chart === 'undefined') return;

	new Chart(canvas.getContext('2d'), {
		type: 'line',
		data: {
			labels: EPIDEMIO_COUNTRY_DISTRIBUTION.labels,
			datasets: [{
				label: 'Fracción de asma atribuible a atopia (%)',
				data: EPIDEMIO_COUNTRY_DISTRIBUTION.values,
				fill: true,
				tension: 0.35,
				backgroundColor: 'rgba(91, 133, 255, 0.15)',
				borderColor: 'rgba(91, 133, 255, 1)',
				pointBackgroundColor: '#5b85ff',
				pointHoverBackgroundColor: '#ff6b6b',
				pointBorderColor: '#fff',
				pointRadius: 6,
				pointHoverRadius: 8
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				y: {
					min: 0,
					max: 100,
					title: { display: true, text: '% de casos de asma atribuible a atopia', color: '#fff' },
					ticks: { color: '#fff' },
					grid: { color: 'rgba(255,255,255,0.1)' }
				},
				x: {
					ticks: { color: '#fff', maxRotation: 30, minRotation: 10 },
					grid: { color: 'rgba(255,255,255,0.06)' }
				}
			},
			plugins: {
				legend: { display: false },
				tooltip: {
					backgroundColor: '#2e2e41',
					titleColor: '#fff',
					bodyColor: '#fff',
					callbacks: {
						afterLabel: (ctx) => EPIDEMIO_COUNTRY_DISTRIBUTION.sources[ctx.dataIndex] || ''
					}
				}
			}
		}
	});
}

// =================== Tabla de hallazgos ===================
function renderEpidemioTable(rows){
	const tbody = document.querySelector("#epidemioTable tbody");
	if (!tbody) return;
	tbody.innerHTML = "";

	if (rows.length === 0){
		tbody.innerHTML = `<tr class="epidemio-empty-row"><td colspan="3">No se encontraron hallazgos con los filtros seleccionados.</td></tr>`;
		return;
	}

	rows.forEach(f => {
		const tr = document.createElement("tr");
		tr.innerHTML = `
			<td class="epidemio-category-cell">${EPIDEMIO_CATEGORY_LABELS[f.category]}</td>
			<td class="epidemio-finding-cell"><button type="button" class="epidemio-name-link" data-id="${f.id}">${f.title}</button></td>
			<td class="epidemio-source-cell">${f.study.authors} (${f.study.year})<br><em>${f.study.journal}</em></td>
		`;
		tbody.appendChild(tr);
	});

	tbody.querySelectorAll(".epidemio-name-link").forEach(btn => {
		btn.addEventListener("click", () => showEpidemioDetails(btn.getAttribute("data-id")));
	});
}

// =================== Filtros + búsqueda ===================
function applyEpidemioFilters(){
	const search = document.getElementById("epidemioSearch");
	const categoryFilter = document.getElementById("epidemioCategoryFilter");

	const q = search ? search.value.trim().toLowerCase() : "";
	const category = categoryFilter ? categoryFilter.value : "__all__";

	EPIDEMIO_FILTERED = EPIDEMIO_FINDINGS.filter(f => {
		const matchesCategory = category === "__all__" || f.category === category;
		const matchesQ = !q
			|| f.title.toLowerCase().includes(q)
			|| f.study.authors.toLowerCase().includes(q)
			|| f.study.journal.toLowerCase().includes(q);
		return matchesCategory && matchesQ;
	});

	renderEpidemioTable(EPIDEMIO_FILTERED);
}

function populateEpidemioSelects(){
	const categoryFilter = document.getElementById("epidemioCategoryFilter");
	if (!categoryFilter) return;

	Object.entries(EPIDEMIO_CATEGORY_LABELS).forEach(([key, label]) => {
		const opt = document.createElement("option");
		opt.value = key;
		opt.textContent = label;
		categoryFilter.appendChild(opt);
	});
}

// =================== Modal de detalle ===================
function showEpidemioDetails(id){
	const f = EPIDEMIO_FINDINGS.find(x => x.id === id);
	const modal = document.getElementById("epidemioModal");
	const modalTitle = document.getElementById("epidemioModalTitle");
	const modalBody = document.getElementById("epidemioModalBody");

	if (!f || !modal || !modalTitle || !modalBody) return;

	modalTitle.textContent = f.title;

	modalBody.innerHTML = `
		<div class="gene-card">
			<div class="gene-card-header">
				<i class="uil uil-chart-line"></i>
				<div>
					<span class="gene-tag">${EPIDEMIO_CATEGORY_LABELS[f.category]}</span>
					<span class="gene-subtitle">Hallazgo epidemiológico</span>
				</div>
			</div>
			<p class="gene-card-text">${f.detail}</p>

			<div class="epidemio-ref-block">
				<h4 class="modal-section-title" style="margin:0 0 8px 0; font-size:1.05rem; color:#e9eefc;">Referencia bibliográfica</h4>
				<ul class="gene-card-list gene-card-list--compact">
					<li>
						<strong>${f.study.authors}</strong> (${f.study.year}). <em>${f.study.journal}</em>. ${f.study.vol}.<br>
						<span class="gene-chip-label">${literatureId(f.study)}</span>
						— <a href="${literatureLink(f.study)}" target="_blank" rel="noopener">Ver publicación</a>
					</li>
				</ul>
			</div>
		</div>
	`;

	// Igual que en Genética/Biomarcadores: el modal se posiciona dentro de la
	// sección (no tapa el tab-nav-bar) pero su fondo debe cubrir toda la sección,
	// incluida la tabla, aunque sea más alta que un viewport.
	const section = document.getElementById("epidemio");
	modal.style.minHeight = section ? section.scrollHeight + "px" : "100vh";

	modal.style.display = "block";
}

function closeEpidemioModal(){
	const modal = document.getElementById("epidemioModal");
	if (modal) {
		modal.style.display = "none";
		modal.style.minHeight = "";
	}
}

// =================== Inicialización de Epidemiología ===================
document.addEventListener('DOMContentLoaded', function() {
	if (!document.getElementById("epidemio")) return;

	renderEpidemioChart();

	populateEpidemioSelects();
	EPIDEMIO_FILTERED = [...EPIDEMIO_FINDINGS];
	renderEpidemioTable(EPIDEMIO_FILTERED);

	const search = document.getElementById("epidemioSearch");
	const categoryFilter = document.getElementById("epidemioCategoryFilter");

	if (search) search.addEventListener("input", debounce(applyEpidemioFilters, 150));
	if (categoryFilter) categoryFilter.addEventListener("change", applyEpidemioFilters);

	// Modal - cierre
	const modal = document.getElementById("epidemioModal");
	if (modal) {
		const closeBtn = modal.querySelector(".close");
		if (closeBtn) closeBtn.addEventListener("click", closeEpidemioModal);
		modal.addEventListener("click", (event) => {
			if (event.target === modal) closeEpidemioModal();
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
// Etiquetas de categoría (para insignias y filtros)
const ALERG_CATEGORY_LABELS = {
	acaros: "Ácaros del polvo",
	hongos: "Hongos",
	polen: "Polen",
	animales: "Animales",
	cucarachas: "Cucarachas",
	latex: "Látex"
};

// Construye un enlace de búsqueda a PubMed a partir de autores/año/tema (no se inventan PMID)
function allergenPubmedLink(ref){
	const term = ref.term || `${ref.authors} ${ref.year}`;
	return `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(term)}`;
}

// Enlaces a bases de datos especializadas en alérgenos, construidos a partir del código de nomenclatura y el nombre científico
function allergenDatabaseLinks(code, name){
	return [
		{
			label: "Allergen Nomenclature (WHO/IUIS)",
			description: "Base de datos oficial de nomenclatura de alérgenos, con la clasificación y familia proteica del alérgeno.",
			url: `http://www.allergen.org/search.php?allergenname=${encodeURIComponent(code)}`
		},
		{
			label: "UniProt",
			description: "Secuencia, dominios funcionales y estructura de la proteína alergénica.",
			url: `https://www.uniprot.org/uniprotkb?query=${encodeURIComponent(code)}`
		}
	];
}

// Datos embebidos: alérgenos relevantes en el desarrollo del asma alérgica
const ALLERGENS = [
	{
		id: "der-p",
		category: "acaros",
		name: "Dermatophagoides pteronyssinus",
		code: "Der p 1",
		source: "Colchones, ropa de cama, alfombras",
		association: "Alta",
		exposure: 82,
		regions: "América, Europa, Asia",
		description: "Ácaro del polvo doméstico predominante en climas templados y húmedos. Der p 1 es una cisteín-proteasa que altera las uniones estrechas del epitelio bronquial, facilitando la penetración de otros alérgenos y activando directamente receptores tipo PAR-2 en la vía aérea.",
		relevance: "Es el aeroalérgeno perenne más frecuentemente implicado en la sensibilización de pacientes con asma alérgica a nivel mundial; su exposición sostenida se asocia con inflamación T2 persistente.",
		reference: { authors: "Calderón MA, Linneberg A, Kleine-Tebbe J, et al.", year: "2015", journal: "J Allergy Clin Immunol", term: "house dust mite respiratory allergy asthma" }
	},
	{
		id: "der-f",
		category: "acaros",
		name: "Dermatophagoides farinae",
		code: "Der f 1",
		source: "Polvo doméstico, textiles",
		association: "Alta",
		exposure: 78,
		regions: "América, Asia",
		description: "Ácaro del polvo doméstico con amplia reactividad cruzada con Der p 1. Su alérgeno mayor, Der f 1, comparte función de cisteín-proteasa y contribuye a la disrupción de la barrera epitelial bronquial.",
		relevance: "Predomina en climas más secos que Der pteronyssinus; su cosensibilización con Der p 1 es habitual y complica la interpretación de pruebas cutáneas individuales.",
		reference: { authors: "Calderón MA, Linneberg A, Kleine-Tebbe J, et al.", year: "2015", journal: "J Allergy Clin Immunol", term: "Dermatophagoides farinae allergen asthma" }
	},
	{
		id: "blo-t",
		category: "acaros",
		name: "Blomia tropicalis",
		code: "Blo t 5",
		source: "Ambientes húmedos, zonas tropicales",
		association: "Media",
		exposure: 55,
		regions: "Latinoamérica, Sudeste asiático",
		description: "Ácaro de almacenamiento con amplia distribución en regiones tropicales y subtropicales. Blo t 5 tiene baja homología estructural con los alérgenos de Dermatophagoides, por lo que se comporta como una fuente de sensibilización parcialmente independiente.",
		relevance: "En regiones tropicales puede ser una fuente de sensibilización tan relevante como los ácaros del género Dermatophagoides, por lo que su inclusión en paneles diagnósticos regionales es importante.",
		reference: { authors: "Fernández-Caldas E, Puerta L, Caraballo L.", year: "2007", journal: "Clin Rev Allergy Immunol", term: "Blomia tropicalis allergen asthma" }
	},
	{
		id: "alt-a",
		category: "hongos",
		name: "Alternaria alternata",
		code: "Alt a 1",
		source: "Aire exterior (verano y otoño)",
		association: "Media",
		exposure: 33,
		regions: "Regiones templadas",
		description: "Hongo filamentoso ambiental cuyas esporas alcanzan concentraciones máximas en climas cálidos y secos. Alt a 1 es una proteína única del reino fúngico, sin homología con proteínas humanas conocidas, lo que favorece su alta inmunogenicidad.",
		relevance: "La sensibilización a Alternaria se asocia consistentemente con asma más grave, mayor riesgo de exacerbaciones y de paro respiratorio súbito ligado a tormentas eléctricas (asma por tormenta).",
		reference: { authors: "Bush RK, Prochnau JJ.", year: "2004", journal: "J Allergy Clin Immunol", term: "Alternaria allergen asthma severity" }
	},
	{
		id: "cla-h",
		category: "hongos",
		name: "Cladosporium herbarum",
		code: "Cla h 1",
		source: "Aire exterior, vegetación en descomposición",
		association: "Baja",
		exposure: 20,
		regions: "Europa, América del Norte",
		description: "Uno de los hongos con mayor concentración de esporas en el aire exterior a nivel mundial. Su alérgeno mayor, Cla h 1, pertenece a la familia de las proteínas dependientes del ácido asártico (aspártico proteasas).",
		relevance: "Aunque su prevalencia de sensibilización es menor que la de Alternaria, contribuye a la carga alergénica estacional total, especialmente en climas templados-húmedos.",
		reference: { authors: "Simon-Nobbe B, Denk U, Poll V, et al.", year: "2008", journal: "Int Arch Allergy Immunol", term: "Cladosporium fungal allergen asthma" }
	},
	{
		id: "asp-f",
		category: "hongos",
		name: "Aspergillus fumigatus",
		code: "Asp f 1",
		source: "Ambientes interiores húmedos",
		association: "Media",
		exposure: 22,
		regions: "Global",
		description: "Hongo ubicuo capaz de colonizar la vía aérea, además de actuar como fuente alergénica. Asp f 1 es una ribotoxina con actividad citotóxica directa sobre el epitelio respiratorio.",
		relevance: "Su sensibilización se relaciona con fenotipos de asma grave, incluida la aspergilosis broncopulmonar alérgica (ABPA), y con mayor deterioro de la función pulmonar a largo plazo.",
		reference: { authors: "Denning DW, O'Driscoll BR, Hogaboam CM, et al.", year: "2006", journal: "Eur Respir J", term: "Aspergillus fumigatus severe asthma sensitization" }
	},
	{
		id: "bet-v",
		category: "polen",
		name: "Betula pendula (abedul)",
		code: "Bet v 1",
		source: "Polen de árboles, floración primaveral",
		association: "Alta",
		exposure: 41,
		regions: "Europa, Norteamérica",
		description: "Alérgeno mayor del polen de abedul, miembro de la familia PR-10, con amplia reactividad cruzada frente a alérgenos alimentarios (síndrome polen-alimento). Su liberación es estacional, concentrada en primavera.",
		relevance: "Es uno de los alérgenos de polen arbóreo más relevantes en el hemisferio norte y un desencadenante frecuente de exacerbaciones estacionales de asma alérgica.",
		reference: { authors: "D'Amato G, Cecchi L, Bonini S, et al.", year: "2007", journal: "Allergy", term: "tree pollen allergy asthma climate" }
	},
	{
		id: "lol-p",
		category: "polen",
		name: "Lolium perenne (gramíneas)",
		code: "Lol p 1",
		source: "Polen de gramíneas, campos y parques",
		association: "Alta",
		exposure: 48,
		regions: "Europa, Oceanía",
		description: "Alérgeno mayor del polen de gramíneas, con estructura de expansina de pared celular. Las gramíneas liberan grandes cantidades de polen en periodos cálidos, generando picos de exposición ambiental muy elevados.",
		relevance: "El polen de gramíneas es la causa más común de rinitis y asma estacional en muchas regiones templadas, con fuerte correlación entre recuentos polínicos y consultas de urgencia por asma.",
		reference: { authors: "D'Amato G, Cecchi L, Bonini S, et al.", year: "2007", journal: "Allergy", term: "grass pollen allergy asthma" }
	},
	{
		id: "amb-a",
		category: "polen",
		name: "Ambrosia artemisiifolia (ambrosía)",
		code: "Amb a 1",
		source: "Polen de herbáceas, floración de fin de verano",
		association: "Alta",
		exposure: 45,
		regions: "América del Norte, Europa",
		description: "Alérgeno mayor del polen de ambrosía, una pectato-liasa con altísima capacidad inmunogénica. Su temporada de polinización se está prolongando en varias regiones por efecto del cambio climático.",
		relevance: "Es uno de los alérgenos de mayor impacto en la carga alergénica de fin de verano/otoño y un modelo frecuentemente citado del efecto del cambio climático sobre la prevalencia de asma alérgica.",
		reference: { authors: "D'Amato G, Cecchi L, Bonini S, et al.", year: "2007", journal: "Allergy", term: "ragweed pollen allergy asthma" }
	},
	{
		id: "fel-d",
		category: "animales",
		name: "Felis catus (gato)",
		code: "Fel d 1",
		source: "Caspa, saliva, glándulas sebáceas",
		association: "Alta",
		exposure: 60,
		regions: "Global",
		description: "Alérgeno mayor del gato doméstico, una uteroglobina secretada en glándulas sebáceas y salivales. Por su tamaño reducido y adherencia electrostática, permanece suspendido en el aire y se dispersa fácilmente en ambientes sin exposición directa al animal (colegios, transporte público).",
		relevance: "La exposición puede persistir meses en el hogar tras retirar al animal; se asocia con sensibilización de alta prevalencia incluso en personas sin contacto directo con gatos.",
		reference: { authors: "Konradsen JR, Fujisawa T, van Hage M, et al.", year: "2015", journal: "J Allergy Clin Immunol", term: "cat allergen Fel d 1 asthma" }
	},
	{
		id: "can-f",
		category: "animales",
		name: "Canis familiaris (perro)",
		code: "Can f 1",
		source: "Caspa, saliva, pelo",
		association: "Media",
		exposure: 37,
		regions: "Global",
		description: "Alérgeno mayor del perro doméstico, perteneciente a la familia de las lipocalinas. Existe variabilidad significativa en la producción alergénica entre razas e individuos, sin que exista una raza verdaderamente 'hipoalergénica'.",
		relevance: "Es una fuente relevante de sensibilización en el ámbito doméstico y ocupacional (veterinaria), con impacto directo sobre el control del asma en hogares con mascotas.",
		reference: { authors: "Konradsen JR, Fujisawa T, van Hage M, et al.", year: "2015", journal: "J Allergy Clin Immunol", term: "dog allergen furry animal asthma" }
	},
	{
		id: "bla-g",
		category: "cucarachas",
		name: "Blattella germanica",
		code: "Bla g 1",
		source: "Restos corporales, saliva y excretas",
		association: "Media",
		exposure: 34,
		regions: "Zonas urbanas",
		description: "Cucaracha común en ambientes urbanos con infraestructura deficiente. Sus alérgenos se acumulan en el polvo doméstico y son un componente central del fenotipo de 'asma del interior de la ciudad' (inner-city asthma).",
		relevance: "La exposición a alérgenos de cucaracha en viviendas urbanas se asocia con mayor morbilidad de asma infantil, especialmente en poblaciones de bajos recursos con alta densidad de infestación.",
		reference: { authors: "Pomés A, Mueller GA, Randall TA, et al.", year: "2017", journal: "Curr Allergy Asthma Rep", term: "cockroach allergen inner-city asthma" }
	},
	{
		id: "per-a",
		category: "cucarachas",
		name: "Periplaneta americana",
		code: "Per a 1",
		source: "Restos corporales, saliva y excretas",
		association: "Media",
		exposure: 29,
		regions: "Zonas urbanas",
		description: "Especie de cucaracha de mayor tamaño, frecuente en climas cálidos y sistemas de alcantarillado urbano. Comparte reactividad cruzada parcial con Blattella germanica a través de tropomiosinas conservadas.",
		relevance: "Contribuye a la carga alergénica doméstica en zonas urbanas de clima cálido, con relevancia particular en poblaciones expuestas a infraestructura sanitaria deficiente.",
		reference: { authors: "Pomés A, Mueller GA, Randall TA, et al.", year: "2017", journal: "Curr Allergy Asthma Rep", term: "cockroach allergen asthma" }
	},
	{
		id: "hev-b",
		category: "latex",
		name: "Hevea brasiliensis (látex natural)",
		code: "Hev b 5",
		source: "Guantes y dispositivos de látex",
		association: "Baja",
		exposure: 10,
		regions: "Centros de salud (exposición ocupacional)",
		description: "Alérgeno del látex natural de caucho, relevante principalmente en el ámbito ocupacional sanitario. Hev b 5 es una proteína ácida de estructura similar a proteínas estructurales vegetales, con reactividad cruzada frente a algunos alimentos (síndrome látex-fruta).",
		relevance: "Su asociación con asma ocupacional se limita fundamentalmente a personal de salud con exposición repetida por vía inhalatoria al polvo de los guantes de látex empolvados.",
		reference: { authors: "Wagner S, Breiteneder H.", year: "2002", journal: "Biochem Soc Trans", term: "latex allergy Hevea brasiliensis occupational asthma" }
	}
];

// Pre-calcula los enlaces a bases de datos para cada alérgeno
ALLERGENS.forEach(a => { a.databases = allergenDatabaseLinks(a.code, a.name); });

// Estado de filtros
let ALERG_FILTERED = [];
let alergCurrentPage = 1;
const ALERG_PAGE_SIZE = 10;

// Helpers
const alergUnique = (arr) => Array.from(new Set(arr));
const alergSplitRegions = (str) => !str ? [] : String(str).split(',').map(s => s.trim()).filter(Boolean);
const alergAssocClass = (assoc) => String(assoc || '').toLowerCase();

// =================== Paginación ===================
function getAlergPagedData(){
	const start = (alergCurrentPage - 1) * ALERG_PAGE_SIZE;
	return ALERG_FILTERED.slice(start, start + ALERG_PAGE_SIZE);
}

function updateAlergPager(){
	const totalPages = Math.max(1, Math.ceil(ALERG_FILTERED.length / ALERG_PAGE_SIZE));
	const prev = document.getElementById("alergPrevPage");
	const next = document.getElementById("alergNextPage");
	const info = document.getElementById("alergPageInfo");

	if (prev) prev.disabled = alergCurrentPage <= 1;
	if (next) next.disabled = alergCurrentPage >= totalPages;
	if (info) info.textContent = `${alergCurrentPage} / ${totalPages}`;
}

// =================== Tabla (nombre clicable → modal de detalle) ===================
function renderAllergensTable(rows){
	const tbody = document.querySelector('#alergTable tbody');
	if (!tbody) return;

	if (!rows.length) {
		tbody.innerHTML = `<tr class="alerg-empty-row"><td colspan="5">No se encontraron alérgenos con los filtros seleccionados.</td></tr>`;
		updateAlergPager();
		return;
	}

	tbody.innerHTML = rows.map(a => `
		<tr>
			<td>${ALERG_CATEGORY_LABELS[a.category]}</td>
			<td class="alerg-name-cell">
				<button type="button" class="alerg-name-link" data-id="${a.id}">${a.name}</button>
				<span class="alerg-code">${a.code}</span>
			</td>
			<td>${a.source}</td>
			<td>${a.association}</td>
			<td>${a.regions}</td>
		</tr>
	`).join("");

	tbody.querySelectorAll(".alerg-name-link").forEach(btn => {
		btn.addEventListener("click", () => showAllergenDetails(btn.getAttribute("data-id")));
	});

	updateAlergPager();
}

// =================== Modal de detalle (descripción, bases de datos y referencia bibliográfica) ===================
function showAllergenDetails(id){
	const a = ALLERGENS.find(x => x.id === id);
	const modal = document.getElementById("alergenoModal");
	const modalTitle = document.getElementById("alergModalTitle");
	const modalBody = document.getElementById("alergModalBody");

	if (!a || !modal || !modalTitle || !modalBody) return;

	modalTitle.textContent = `${a.name} (${a.code})`;

	const dbHTML = a.databases.map(d => `
		<li>
			<strong>${d.label}</strong>
			<span class="alerg-db-desc">${d.description}</span><br>
			<a href="${d.url}" target="_blank" rel="noopener">Consultar en ${d.label}</a>
		</li>
	`).join("");

	modalBody.innerHTML = `
		<div class="alerg-modal-grid">
			<div class="gene-card alerg-card-funcion">
				<div class="gene-card-header">
					<i class="uil uil-leaf"></i>
					<div>
						<span class="gene-tag">Descripción del alérgeno</span>
						<span class="gene-subtitle">Origen, mecanismo y relevancia clínica</span>
					</div>
				</div>
				<div class="alerg-modal-meta">
					<span class="alerg-badge ${a.category}">${ALERG_CATEGORY_LABELS[a.category]}</span>
					<span class="alerg-assoc ${alergAssocClass(a.association)}">Asociación ${a.association}</span>
					<span class="alerg-chip"><span class="alerg-chip-label">Exposición:</span> <span class="alerg-chip-value">${a.exposure}%</span></span>
					<span class="alerg-chip"><span class="alerg-chip-label">Regiones:</span> <span class="alerg-chip-value">${a.regions}</span></span>
				</div>
				<p class="gene-card-text"><strong>Fuente de exposición:</strong> ${a.source}</p>
				<p class="gene-card-text">${a.description}</p>
				<h4 class="biomark-subhead">Relevancia clínica</h4>
				<p class="gene-card-text">${a.relevance}</p>
			</div>

			<div class="gene-card alerg-card-db">
				<div class="gene-card-header">
					<i class="uil uil-database"></i>
					<div>
						<span class="gene-tag">Bases de datos a consultar</span>
					</div>
				</div>
				<ul class="gene-card-list gene-card-list--compact">
					${dbHTML}
				</ul>
			</div>

			<div class="gene-card alerg-card-ref">
				<div class="gene-card-header">
					<i class="uil uil-book-open"></i>
					<div>
						<span class="gene-tag">Referencia bibliográfica</span>
					</div>
				</div>
				<ul class="gene-card-list gene-card-list--compact">
					<li>
						<a href="${allergenPubmedLink(a.reference)}" target="_blank" rel="noopener">Buscar en PubMed</a>
					</li>
				</ul>
			</div>
		</div>
	`;

	modal.style.display = "block";
}

function closeAllergenModal(){
	const modal = document.getElementById("alergenoModal");
	if (modal) modal.style.display = "none";
}

// =================== Filtros + búsqueda ===================
function populateAllergenSelects(){
	const selCat = document.getElementById("alergCategoriaFilter");
	const selReg = document.getElementById("alergRegionFilter");

	if (selCat) {
		alergUnique(ALLERGENS.map(a => a.category)).forEach(cat => {
			const opt = document.createElement("option");
			opt.value = cat;
			opt.textContent = ALERG_CATEGORY_LABELS[cat] || cat;
			selCat.appendChild(opt);
		});
	}

	if (selReg) {
		const allRegs = alergUnique(ALLERGENS.flatMap(a => alergSplitRegions(a.regions)));
		allRegs.forEach(v => {
			const opt = document.createElement("option");
			opt.value = v;
			opt.textContent = v;
			selReg.appendChild(opt);
		});
	}
}

function applyAllergenFilters(){
	const catFilter = document.getElementById("alergCategoriaFilter");
	const assocFilter = document.getElementById("alergAsociacionFilter");
	const regFilter = document.getElementById("alergRegionFilter");
	const search = document.getElementById("alergSearch");

	const cat = catFilter ? catFilter.value : "__all__";
	const assoc = assocFilter ? assocFilter.value : "__all__";
	const reg = regFilter ? regFilter.value : "__all__";
	const q = search ? search.value.trim().toLowerCase() : "";

	ALERG_FILTERED = ALLERGENS.filter(a => {
		const catOk = (cat === "__all__") || (a.category === cat);
		const assocOk = (assoc === "__all__") || (a.association === assoc);
		const regOk = (reg === "__all__") || alergSplitRegions(a.regions).some(r => r.toLowerCase().includes(reg.toLowerCase()));
		const qOk = !q || [a.name, a.code, a.source, a.regions].some(v => String(v).toLowerCase().includes(q));
		return catOk && assocOk && regOk && qOk;
	});

	alergCurrentPage = 1;
	renderAllergensTable(getAlergPagedData());
}

// ================ Inicialización de Alergénos ================
document.addEventListener("DOMContentLoaded", () => {
	if (!document.getElementById("alergTable")) return;

	populateAllergenSelects();
	ALERG_FILTERED = [...ALLERGENS];
	alergCurrentPage = 1;

	renderAllergensTable(getAlergPagedData());

	const catFilter = document.getElementById("alergCategoriaFilter");
	const assocFilter = document.getElementById("alergAsociacionFilter");
	const regFilter = document.getElementById("alergRegionFilter");
	const search = document.getElementById("alergSearch");

	if (catFilter) catFilter.addEventListener("change", applyAllergenFilters);
	if (assocFilter) assocFilter.addEventListener("change", applyAllergenFilters);
	if (regFilter) regFilter.addEventListener("change", applyAllergenFilters);
	if (search) {
		search.addEventListener("input", () => {
			clearTimeout(window.__alergDebounce);
			window.__alergDebounce = setTimeout(applyAllergenFilters, 150);
		});
	}

	// Paginación
	const alergPrev = document.getElementById("alergPrevPage");
	const alergNext = document.getElementById("alergNextPage");

	if (alergPrev) {
		alergPrev.addEventListener("click", () => {
			if (alergCurrentPage > 1) {
				alergCurrentPage--;
				renderAllergensTable(getAlergPagedData());
			}
		});
	}

	if (alergNext) {
		alergNext.addEventListener("click", () => {
			const totalPages = Math.max(1, Math.ceil(ALERG_FILTERED.length / ALERG_PAGE_SIZE));
			if (alergCurrentPage < totalPages) {
				alergCurrentPage++;
				renderAllergensTable(getAlergPagedData());
			}
		});
	}

	// Modal de detalle - cierre
	const modal = document.getElementById("alergenoModal");
	if (modal) {
		const closeBtn = modal.querySelector(".close");
		if (closeBtn) closeBtn.addEventListener("click", closeAllergenModal);
		modal.addEventListener("click", (event) => {
			if (event.target === modal) closeAllergenModal();
		});
	}
});



// =================== VÍAS DE SEÑALIZACIÓN ===================
// Etiquetas de categoría (para insignias, gráficos y filtros)
const PATHWAY_CATEGORY_LABELS = {
	cytokine: "Citocinas",
	immune: "Sistema inmune",
	inflammatory: "Inflamatorias",
	other: "Otras"
};

// Construye un enlace de búsqueda a PubMed a partir de autores/año/tema (no se inventan PMID)
function pathwayPubmedLink(ref){
	const term = ref.term || `${ref.authors} ${ref.year}`;
	return `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(term)}`;
}

// Enlaces a bases de datos especializadas, construidos a partir de los componentes clave de la vía.
// "overrides" permite fijar un enlace directo y específico para una base de datos puntual (p. ej. la página exacta de un WPID en WikiPathways).
function pathwayDatabaseLinks(components, overrides = {}){
	const list = Array.isArray(components) ? components : [];
	const textTerm = list.join(" "); // término de búsqueda para WikiPathways / PathCards / Reactome
	const stringIds = list.map(c => encodeURIComponent(c)).join("%0d"); // identificadores para la red de STRING

	return [
		{
			label: "WikiPathways",
			description: "Diagrama colaborativo de la vía con los genes, proteínas y metabolitos que la componen.",
			url: overrides.WikiPathways || `https://www.wikipathways.org/search.html?query=${encodeURIComponent(textTerm)}`
		},
		{
			label: "PathCards",
			description: "Ficha unificada de la vía (SuperPath) que agrupa fuentes como Reactome, KEGG y WikiPathways.",
			url: overrides.PathCards || `https://pathcards.genecards.org/Search/Results?q=${encodeURIComponent(list[0] || textTerm)}`
		},
		{
			label: "STRING",
			description: "Red de interacción proteína-proteína entre los componentes clave de la vía.",
			url: overrides.STRING || `https://string-db.org/cgi/network?identifiers=${stringIds}&species=9606`
		},
		{
			label: "Reactome",
			description: "Base de datos de vías biológicas revisada por expertos, con representación molecular detallada de cada paso.",
			url: overrides.Reactome || `https://reactome.org/content/query?q=${encodeURIComponent(textTerm)}`
		}
	];
}

// Datos embebidos: vías moleculares relevantes en asma alérgica
const PATHWAYS = [
	{
		id: "il4-il13",
		name: "Vía IL-4/IL-13",
		category: "cytokine",
		components: ["IL-4", "IL-13", "IL-4Rα", "STAT6", "JAK1", "JAK3"],
		effect: "Diferenciación Th2, aumento de IgE, producción de moco.",
		description: "IL-4 e IL-13 comparten el receptor IL-4Rα y señalizan a través de JAK1/JAK3 y el factor de transcripción STAT6. Esta vía dirige la diferenciación de linfocitos Th2, el cambio de isotipo a IgE en linfocitos B, la hiperplasia de células caliciformes y la hipersecreción de moco, siendo el eje central de la inflamación tipo 2 en el asma alérgica.",
		reference: { authors: "Wills-Karp M, Finkelman FD", year: "2008", journal: "Sci Signal", term: "IL-4 IL-13 STAT6 asthma signaling" },
	},
	{
		id: "tslp",
		name: "TSLP",
		category: "immune",
		components: ["TSLP", "TSLPR", "IL-7Rα", "JAK1/2", "STAT5"],
		effect: "Activa células dendríticas, promueve inflamación tipo 2.",
		description: "La linfopoyetina estromal tímica (TSLP) es liberada por el epitelio bronquial dañado y actúa como una alarmina 'maestra': activa células dendríticas e ILC2, amplificando la respuesta Th2 río arriba de IL-4, IL-5 e IL-13. Es diana de terapias biológicas dirigidas al epitelio (p. ej., tezepelumab).",
		reference: { authors: "Ziegler SF, Artis D", year: "2010", journal: "Nat Immunol", term: "TSLP thymic stromal lymphopoietin asthma" },
		dbOverrides: { WikiPathways: "https://www.wikipathways.org/pathways/WP3191.html" }
	},
	{
		id: "il5",
		name: "Vía IL-5",
		category: "cytokine",
		components: ["IL-5", "IL-5Rα", "βc", "JAK2", "STAT5"],
		effect: "Supervivencia y activación de eosinófilos.",
		description: "IL-5 se une a IL-5Rα junto a la cadena común βc, activando JAK2/STAT5. Regula la diferenciación en médula ósea, la supervivencia y la activación efectora de los eosinófilos, siendo la diana directa de terapias anti-IL-5/IL-5R como mepolizumab y benralizumab.",
		reference: { authors: "Foster PS, Hogan SP", year: "2011", journal: "Immunol Rev", term: "IL-5 eosinophil asthma signaling" },
		dbOverrides: { WikiPathways: "https://www.wikipathways.org/pathways/WP968.html" }
	},
	{
		id: "il33-st2",
		name: "IL-33/ST2",
		category: "immune",
		components: ["IL-33", "ST2 (IL1RL1)", "IL1RAP", "MyD88", "NF-κB"],
		effect: "Activación de ILC2 y potenciación de respuesta alérgica.",
		description: "IL-33 es liberada por el epitelio ante daño o alérgenos y se une al receptor ST2, señalizando vía MyD88 hacia NF-κB. Activa potentemente a las ILC2 y a los mastocitos, amplificando la producción de IL-5 e IL-13 y potenciando la respuesta alérgica de tipo 2.",
		reference: { authors: "Schmitz J, Owyang A, Oldham E, et al.", year: "2005", journal: "Immunity", term: "IL-33 ST2 asthma signaling" },
	},
	{
		id: "nfkb",
		name: "NF-κB",
		category: "inflammatory",
		components: ["NF-κB", "IκB", "IKK"],
		effect: "Transcripción de genes pro-inflamatorios.",
		description: "El complejo IKK fosforila a IκB, que se degrada y libera al factor de transcripción NF-κB para translocarse al núcleo. Allí activa la transcripción de citocinas, quimiocinas y moléculas de adhesión pro-inflamatorias, funcionando como un nodo de convergencia de múltiples vías inflamatorias en la vía aérea.",
		reference: { authors: "Barnes PJ", year: "2006", journal: "J Clin Invest", term: "NF-kB asthma airway inflammation" },
		dbOverrides: { PathCards: "https://pathcards.genecards.org/search/results?q=NF-KB" }
	},
	{
		id: "nlrp3",
		name: "NLRP3 Inflamasoma",
		category: "inflammatory",
		components: ["NLRP3", "ASC", "Caspasa-1", "IL-1β"],
		effect: "Maduración de IL-1β; inflamación de la vía aérea.",
		description: "El inflamasoma NLRP3 se ensambla ante señales de daño celular y activa a la caspasa-1, que escinde pro-IL-1β a su forma madura y activa. Este eje se asocia a fenotipos de asma neutrofílica, con inflamación más resistente a corticoides.",
		reference: { authors: "Schroder K, Tschopp J", year: "2010", journal: "Cell", term: "NLRP3 inflammasome asthma IL-1beta" },
	},
	{
		id: "ige-fceri",
		name: "IgE–FcεRI",
		category: "immune",
		components: ["IgE", "FcεRI", "Lyn", "Syk"],
		effect: "Degranulación mastocitaria, liberación de histamina.",
		description: "El entrecruzamiento de IgE unida al receptor de alta afinidad FcεRI por el alérgeno activa las cinasas Lyn y Syk, desencadenando la degranulación de mastocitos y basófilos con liberación de histamina y otros mediadores. Es el mecanismo central de la reacción de hipersensibilidad inmediata (tipo I).",
		reference: { authors: "Galli SJ, Tsai M, Piliponsky AM", year: "2008", journal: "Nature", term: "IgE FceRI mast cell degranulation asthma" },
	},
	{
		id: "leucotrienos",
		name: "Leucotrienos",
		category: "inflammatory",
		components: ["5-LOX", "FLAP", "LTC4", "LTD4", "LTE4", "CysLT1"],
		effect: "Broncoconstricción y aumento de permeabilidad.",
		description: "El ácido araquidónico es procesado por 5-LOX (con la proteína FLAP) hasta generar los cisteinil-leucotrienos LTC4, LTD4 y LTE4, que actúan sobre el receptor CysLT1 del músculo liso bronquial. Producen broncoconstricción potente, aumento de la permeabilidad vascular e hipersecreción de moco; es la diana de antileucotrienos como montelukast.",
		reference: { authors: "Peters-Golden M, Henderson WR Jr", year: "2007", journal: "N Engl J Med", term: "cysteinyl leukotrienes asthma signaling" },
	},
	{
		id: "tgfb-remodelado",
		name: "TGF-β / Remodelado",
		category: "other",
		components: ["TGF-β", "TβRI/II", "SMAD2/3", "SMAD4"],
		effect: "Fibrosis y remodelado de la vía aérea.",
		description: "TGF-β activa a sus receptores de superficie, que fosforilan a SMAD2/3; estos se asocian a SMAD4 y regulan genes implicados en fibrosis subepitelial, hiperplasia del músculo liso y depósito de matriz extracelular, procesos característicos del remodelado crónico de la vía aérea.",
		reference: { authors: "Halwani R, Al-Muhsen S, Hamid Q", year: "2011", journal: "Am J Respir Cell Mol Biol", term: "TGF-beta SMAD airway remodeling asthma" },
	},
	{
		id: "il17",
		name: "Vía IL-17",
		category: "inflammatory",
		components: ["IL-17A", "IL-17F", "IL-17RA", "ACT1", "NF-κB"],
		effect: "Inflamación neutrofílica, esteroide-resistente en algunos fenotipos.",
		description: "Los linfocitos Th17 producen IL-17A/F, que señalizan a través de IL-17RA y el adaptador ACT1 hacia NF-κB, promoviendo la producción de quimiocinas reclutadoras de neutrófilos. Este eje se relaciona con fenotipos de asma grave, neutrofílica y con menor respuesta a corticoides inhalados.",
		reference: { authors: "Newcomb DC, Peebles RS Jr", year: "2013", journal: "Curr Opin Immunol", term: "IL-17 Th17 asthma neutrophilic signaling" },
	}
];

// Bases de datos a consultar por vía, calculadas a partir de sus componentes clave
PATHWAYS.forEach(p => { p.databases = pathwayDatabaseLinks(p.components, p.dbOverrides); });

// Estado de filtros
let PWS_FILTERED = [];

// =================== Tabla (nombre clicable → modal de detalle) ===================
function renderPathwaysTable(rows){
	const tbody = document.querySelector("#pathwaysTable tbody");
	if (!tbody) return;

	if (!rows.length) {
		tbody.innerHTML = `<tr class="pathway-empty-row"><td colspan="3">No se encontraron vías de señalización con los filtros seleccionados.</td></tr>`;
		return;
	}

	tbody.innerHTML = rows.map(p => {
		return `
			<tr>
				<td class="pathway-name-cell"><button type="button" class="pathway-name-link" data-id="${p.id}">${p.name}</button></td>
				<td>${p.components.join(", ")}</td>
				<td>${p.effect || ""}</td>
			</tr>
		`;
	}).join("");

	tbody.querySelectorAll(".pathway-name-link").forEach(btn => {
		btn.addEventListener("click", () => showPathwayDetails(btn.getAttribute("data-id")));
	});
}

// =================== Modal de detalle (descripción, componentes, referencia y bases de datos) ===================
function showPathwayDetails(id){
	const p = PATHWAYS.find(x => x.id === id);
	const modal = document.getElementById("pathwayModal");
	const modalTitle = document.getElementById("pathwayModalTitle");
	const modalBody = document.getElementById("pathwayModalBody");

	if (!p || !modal || !modalTitle || !modalBody) return;

	modalTitle.textContent = p.name;

	const dbHTML = p.databases.map(d => `
		<li>
			<strong>${d.label}</strong>
			<span class="pathway-db-desc">${d.description}</span><br>
			<a href="${d.url}" target="_blank" rel="noopener">Consultar en ${d.label}</a>
		</li>
	`).join("");

	modalBody.innerHTML = `
		<div class="pathway-modal-grid">
			<div class="gene-card pathway-card-funcion">
				<div class="gene-card-header">
					<i class="uil uil-share-alt"></i>
					<div>
						<span class="gene-tag">Descripción de la vía</span>
						<span class="gene-subtitle">Mecanismo molecular y efecto biológico</span>
					</div>
				</div>
				<div class="pathway-modal-meta">
					<span class="pathway-badge ${p.category}">${PATHWAY_CATEGORY_LABELS[p.category]}</span>
				</div>
				<p class="gene-card-text">${p.description}</p>
				<h4 class="biomark-subhead">Componentes Clave</h4>
				<p class="gene-card-text">${p.components.join(", ")}</p>
			</div>

			<div class="gene-card pathway-card-db">
				<div class="gene-card-header">
					<i class="uil uil-database"></i>
					<div>
						<span class="gene-tag">Bases de datos a consultar</span>
					</div>
				</div>
				<ul class="gene-card-list gene-card-list--compact">
					${dbHTML}
				</ul>
			</div>

			<div class="gene-card pathway-card-ref">
				<div class="gene-card-header">
					<i class="uil uil-book-open"></i>
					<div>
						<span class="gene-tag">Referencia bibliográfica</span>
					</div>
				</div>
				<ul class="gene-card-list gene-card-list--compact">
					<li>
						<a href="${pathwayPubmedLink(p.reference)}" target="_blank" rel="noopener">Buscar en PubMed</a>
					</li>
				</ul>
			</div>
		</div>
	`;

	modal.style.display = "block";
}

function closePathwayModal(){
	const modal = document.getElementById("pathwayModal");
	if (modal) modal.style.display = "none";
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
			|| p.description.toLowerCase().includes(q)
			|| p.components.some(c => c.toLowerCase().includes(q));
		const matchesF = (filt === "all") || p.category === filt;
		return matchesQ && matchesF;
	});

	renderPathwaysTable(PWS_FILTERED);
}

// =================== Utils ===================
const debounce = (fn, ms=150) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };


// ================ Inicialización de vías de señalización ================
document.addEventListener("DOMContentLoaded", () => {
	if (!document.getElementById("pathwaysTable")) return;

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

	renderPathwaysTable(PWS_FILTERED);

	// Modal de detalle - cierre
	const pathwayModal = document.getElementById("pathwayModal");
	if (pathwayModal) {
		const closeBtn = pathwayModal.querySelector(".close");
		if (closeBtn) closeBtn.addEventListener("click", closePathwayModal);
		pathwayModal.addEventListener("click", (event) => {
			if (event.target === pathwayModal) closePathwayModal();
		});
	}
});



// =================== BIOMARCADORES ===================
// Datos embebidos: biomarcadores clínicos relevantes en asma alérgica
const CATEGORY_LABELS = {
	tipo2: "Inflamación tipo 2 / eosinofílica"
};

const SAMPLE_LABELS = {
	sangre: "Sangre / Suero",
	esputo: "Esputo inducido",
	aire: "Aire exhalado"
};

// Construye el enlace de una referencia: prioriza PMID, luego DOI
function literatureLink(lit){
	if (lit.pmid) return `https://pubmed.ncbi.nlm.nih.gov/${lit.pmid}/`;
	if (lit.doi) return `https://doi.org/${lit.doi}`;
	return `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(lit.term || "")}`;
}

function literatureId(lit){
	if (lit.pmid) return `PMID: ${lit.pmid}`;
	if (lit.doi) return `DOI: ${lit.doi}`;
	return "";
}

// Genera los 3 enlaces de identificadores externos a partir del símbolo del gen/proteína
function geneDatabaseLinks(symbol){
	return [
		{
			label: "GeneCards",
			description: "Ficha completa del gen: función, sinónimos y enfermedades asociadas.",
			url: `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${encodeURIComponent(symbol)}`
		},
		{
			label: "UniProt",
			description: "Secuencia, dominios funcionales y ubicación subcelular de la proteína.",
			url: `https://www.uniprot.org/uniprotkb?query=gene:${encodeURIComponent(symbol)}+AND+organism_id:9606&facets=reviewed:true`
		},
		{
			label: "Human Protein Atlas",
			description: "Expresión tisular, celular y subcelular de la proteína (inmunohistoquímica).",
			url: `https://www.proteinatlas.org/search/${encodeURIComponent(symbol)}`
		}
	];
}

// La identidad del eosinófilo no depende de una sola proteína
function eosinophilReceptorIdentity(){
	return {
		intro: "La biología única y la identidad celular del eosinófilo no dependen de una sola proteína: están definidas por la combinación y la alta densidad de tres receptores de superficie clave, que determinan su desarrollo, reclutamiento y funciones efectoras.",
		receptors: [
			{
				symbol: "IL-5Rα",
				gene: "IL5RA",
				name: "Cadena alfa del receptor de Interleucina-5",
				role: "Regula el desarrollo, la maduración y la supervivencia del eosinófilo en la médula ósea en respuesta a IL-5. Es la diana terapéutica directa de mepolizumab y benralizumab.",
				url: `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${encodeURIComponent("IL5RA")}`
			},
			{
				symbol: "CCR3",
				gene: "CCR3",
				name: "Receptor de quimiocina CC tipo 3",
				role: "Receptor de eotaxinas que dirige el reclutamiento y la migración del eosinófilo desde la sangre hacia el tejido inflamado de la vía aérea.",
				url: `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${encodeURIComponent("CCR3")}`
			},
			{
				symbol: "Siglec-8",
				gene: "SIGLEC8",
				name: "Lectina tipo inmunoglobulina de unión al ácido siálico 8",
				role: "Receptor inhibitorio casi exclusivo del eosinófilo; su activación induce apoptosis selectiva, por lo que es diana de nuevas terapias en desarrollo.",
				url: `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${encodeURIComponent("SIGLEC8")}`
			}
		]
	};
}


const BIOMARKERS = [
	{
		id: "eos",
		name: "Eosinófilos",
		fullname: "Eosinófilos en sangre (EOS)",
		category: "tipo2",
		sample: "sangre",
		cutoff: "≥150–300 células/µL",
		description: "Recuento de eosinófilos circulantes, células efectoras clave de la inflamación tipo 2 reclutadas y activadas principalmente por IL-5.",
		utility: "Biomarcador principal para seleccionar candidatos a terapias anti-IL5/IL5R y predecir exacerbaciones.",
		refInterpretation: {
			unit: "Los resultados se expresan en células/µL (recuento absoluto en sangre periférica).",
			guideline: "Los ensayos clínicos de terapias anti-IL5 (mepolizumab: Ortega et al., 2014; Pavord et al., 2012) emplearon umbrales de 150 células/µL en el momento de la evaluación o 300 células/µL en el último año para definir el fenotipo eosinofílico.",
			rows: [
				{ range: "&lt; 150 células/µL", classification: "Bajo", meaning: "Inflamación tipo 2 poco probable; considerar endotipo no eosinofílico." },
				{ range: "150 – 300 células/µL", classification: "Intermedio", meaning: "Posible fenotipo eosinofílico; valorar junto con FeNO e IgE." },
				{ range: "≥ 300 células/µL", classification: "Alto", meaning: "Fenotipo eosinofílico; buen candidato a terapia anti-IL5/IL5R." }
			]
		},
		receptorIdentity: eosinophilReceptorIdentity(),
		literature: [
			{ type: "guideline", authors: "Ortega HG et al.", year: "2014", journal: "N Engl J Med", pmid: "25199059" },
			{ type: "role", authors: "Fahy JV.", year: "2015", journal: "Nat Rev Immunol", pmid: "25534623" },
			{ type: "role", authors: "Pavord ID et al.", year: "2012", journal: "Lancet", pmid: "22901886" }
		]
	},
	{
		id: "feno",
		name: "FeNO",
		fullname: "Fracción de Óxido Nítrico Exhalado",
		category: "tipo2",
		sample: "aire",
		cutoff: "< 25 ppb (< 20 ppb en niños) Bajo / Normal",
		description: "Mide el óxido nítrico exhalado, producto de la vía de la sintasa de óxido nítrico inducible (iNOS) en el epitelio bronquial. Se eleva con la actividad de IL-4 e IL-13 y refleja inflamación eosinofílica de la vía aérea.",
		utility: "Apoya el diagnóstico, ajusta dosis de corticoides inhalados y predice respuesta a terapias anti-tipo 2.",
		refInterpretation: {
			unit: "Los resultados se expresan en partes por billón (ppb).",
			guideline: "Según las guías de la American Thoracic Society (ATS, 2011), recogidas también por GINA y GEMA, los valores de referencia difieren entre adultos y niños.",
			rows: [
				{ range: "&lt; 25 ppb (&lt; 20 ppb en niños)", classification: "Bajo / Normal", meaning: "Inflamación eosinofílica poco probable; considerar diagnósticos alternativos." },
				{ range: "25 – 50 ppb (20 – 35 ppb en niños)", classification: "Intermedio", meaning: "Interpretar junto con la clínica, la exposición a corticoides y otros biomarcadores tipo 2." },
				{ range: "&gt; 50 ppb (&gt; 35 ppb en niños)", classification: "Elevado", meaning: "Inflamación eosinofílica probable; buena respuesta esperada a corticoides inhalados." }
			]
		},
		databases: geneDatabaseLinks("NOS2"),
		literature: [
			{ type: "guideline", authors: "Dweik RA et al.", year: "2011", journal: "Am J Respir Crit Care Med", pmid: "21885636" },
			{ type: "role", authors: "Alving K et al.", year: "1993", journal: "Eur Respir J", pmid: "7507065" },
			{ type: "role", authors: "Petsky HL et al.", year: "2018", journal: "Thorax", pmid: "29858277" }
		]
	},
	{
		id: "ige",
		name: "IgE Total",
		fullname: "Inmunoglobulina E (IgE) Total",
		category: "tipo2",
		sample: "sangre",
		cutoff: "30–700 UI/mL (dependiente de edad/peso)",
		description: "Anticuerpo central en la respuesta alérgica; su producción es inducida por IL-4 e IL-13 durante el cambio de isotipo de linfocitos B. Niveles elevados se asocian a fenotipo atópico.",
		utility: "Criterio de elegibilidad y dosificación para terapia anti-IgE (omalizumab).",
		refInterpretation: {
			unit: "Los resultados se expresan en UI/mL (equivalente a kUI/L).",
			guideline: "Los valores normales varían con la edad. Para la elegibilidad a omalizumab, el estudio INNOVATE (Humbert et al., 2005) utilizó un rango pretratamiento de 30–700 UI/mL, aunque la ficha técnica del fármaco contempla dosificación hasta 1500 UI/mL.",
			rows: [
				{ range: "&lt; 100 UI/mL", classification: "Normal", meaning: "Baja probabilidad de sensibilización alérgica mediada por IgE." },
				{ range: "100 – 700 UI/mL", classification: "Elevado", meaning: "Sugiere fenotipo atópico; rango típico de elegibilidad para terapia anti-IgE." },
				{ range: "&gt; 700 UI/mL", classification: "Muy elevado", meaning: "Requiere ajuste de dosis según peso corporal y ficha técnica del fármaco." }
			]
		},
		databases: geneDatabaseLinks("IGHE"),
		literature: [
			{ type: "guideline", authors: "Humbert M et al.", year: "2005", journal: "Allergy", pmid: "15679715" },
			{ type: "role", authors: "Gould HJ, Sutton BJ.", year: "2008", journal: "Nat Rev Immunol", pmid: "18301424" },
			{ type: "role", authors: "Busse WW et al.", year: "2011", journal: "N Engl J Med", pmid: "21410369" }
		]
	},
	{
		id: "ige-especifica",
		name: "IgE Específica",
		fullname: "Inmunoglobulina E (IgE) específica a aeroalérgenos perennes",
		category: "tipo2",
		sample: "sangre",
		cutoff: "Prick test (+) o IgE específica (+) a aeroalérgenos de todo el año",
		description: "Anticuerpo IgE dirigido contra un alérgeno concreto (ácaros, epitelios, hongos u otros aeroalérgenos perennes). Se determina mediante prueba cutánea (prick test) o mediante IgE específica sérica, y confirma la sensibilización alérgica que sustenta el diagnóstico de asma alérgica dentro del endotipo T2.",
		utility: "Confirma la sensibilización a aeroalérgenos perennes; orienta evitación ambiental, inmunoterapia y elegibilidad a terapia anti-IgE.",
		refInterpretation: {
			unit: "Prick test: diámetro de la pápula en mm. IgE específica sérica: kUA/L (clases 0–6 del sistema CAP-RAST).",
			guideline: "Según el consenso europeo de estandarización del prick test (Heinzerling et al., 2013), se considera positivo un habón ≥3 mm de diámetro. Para IgE específica sérica, el parámetro de práctica clínica de Hamilton y Adkinson (2003) considera positivo un valor ≥0.35 kUA/L.",
			rows: [
				{ range: "Prick test &lt; 3 mm / IgE específica &lt; 0.35 kUA/L", classification: "Negativo", meaning: "Sensibilización a ese aeroalérgeno poco probable." },
				{ range: "Prick test ≥ 3 mm / IgE específica 0.35 – 3.5 kUA/L (clase 1–2)", classification: "Positivo bajo-moderado", meaning: "Sensibilización presente; correlacionar con la relevancia clínica de los síntomas." },
				{ range: "IgE específica &gt; 3.5 kUA/L (clase ≥ 3)", classification: "Positivo alto", meaning: "Alta probabilidad de relevancia clínica de la sensibilización a ese aeroalérgeno." }
			]
		},
		databases: geneDatabaseLinks("IGHE"),
		literature: [
			{ type: "guideline", authors: "Heinzerling L et al.", year: "2013", journal: "Clin Transl Allergy", pmid: "23369181" },
			{ type: "role", authors: "Hamilton RG, Adkinson NF Jr.", year: "2003", journal: "J Allergy Clin Immunol", pmid: "12592314" }
		]
	},
	{
		id: "periostina",
		name: "Periostina",
		fullname: "Periostina sérica (POSTN)",
		category: "tipo2",
		sample: "sangre",
		cutoff: ">50 ng/mL (variable según ensayo)",
		description: "Proteína de matriz extracelular inducida por IL-13 en el epitelio bronquial; se considera un marcador sustituto sérico de la actividad de IL-13 en la vía aérea.",
		utility: "Predice respuesta a terapias anti-IL13 y se asocia con obstrucción fija en asma tipo 2.",
		refInterpretation: {
			unit: "Los resultados se expresan en ng/mL; el valor absoluto depende del ensayo utilizado.",
			guideline: "En los estudios de lebrikizumab (Corren et al., 2011; Jia et al., 2012) se definió \"periostina alta\" a partir de 50 ng/mL, umbral asociado a mayor beneficio del bloqueo de IL-13.",
			rows: [
				{ range: "&lt; 20 ng/mL", classification: "Bajo", meaning: "Actividad de IL-13 poco probable en la vía aérea." },
				{ range: "20 – 50 ng/mL", classification: "Intermedio", meaning: "Interpretar junto con FeNO y eosinófilos." },
				{ range: "≥ 50 ng/mL", classification: "Alto (periostina-high)", meaning: "Mayor probabilidad de respuesta a terapias anti-IL13." }
			]
		},
		databases: geneDatabaseLinks("POSTN"),
		literature: [
			{ type: "guideline", authors: "Jia G et al.", year: "2012", journal: "J Allergy Clin Immunol", pmid: "22857879" },
			{ type: "role", authors: "Izuhara K et al.", year: "2017", journal: "Cell Mol Life Sci", pmid: "28887633" },
			{ type: "role", authors: "Corren J et al.", year: "2011", journal: "N Engl J Med", pmid: "21812663" }
		]
	},
	{
		id: "esputo-eos",
		name: "Eos. Esputo",
		fullname: "Eosinófilos en Esputo Inducido",
		category: "tipo2",
		sample: "esputo",
		cutoff: "≥ 3% del recuento celular total",
		description: "Recuento diferencial de eosinófilos en esputo obtenido mediante inducción con suero salino hipertónico. Refleja de forma directa la inflamación eosinofílica presente en la propia vía aérea, a diferencia de los eosinófilos en sangre, que son una medida indirecta. Se considera el biomarcador avanzado de laboratorio de referencia (\"gold standard\") para el fenotipado T2, aunque su uso rutinario está limitado por la complejidad técnica del procesamiento de la muestra.",
		utility: "Guía el ajuste de tratamiento antiinflamatorio y confirma el fenotipo eosinofílico cuando los biomarcadores indirectos (sangre) son discordantes con la clínica.",
		refInterpretation: {
			unit: "Los resultados se expresan como porcentaje (%) de eosinófilos sobre el recuento celular no escamoso total del esputo.",
			guideline: "Pizzichini et al. (2018) consolidan el punto de corte de ≥3% de eosinófilos como definición estándar de \"esputo eosinofílico\", usado para guiar el tratamiento antiinflamatorio en asma.",
			rows: [
				{ range: "&lt; 2%", classification: "Normal", meaning: "Sin evidencia de inflamación eosinofílica de la vía aérea." },
				{ range: "2 – 3%", classification: "Límite", meaning: "Correlacionar con clínica y con los demás biomarcadores tipo 2." },
				{ range: "≥ 3%", classification: "Elevado (esputo eosinofílico)", meaning: "Inflamación eosinofílica activa de la vía aérea; orienta intensificación del tratamiento antiinflamatorio." }
			]
		},
		receptorIdentity: eosinophilReceptorIdentity(),
		literature: [
			{ type: "guideline", authors: "Pizzichini E et al.", year: "2018", journal: "Lancet Respir Med", pmid: "29935930" },
			{ type: "role", authors: "Pizzichini E et al.", year: "1997", journal: "J Allergy Clin Immunol", pmid: "9111500" },
			{ type: "role", authors: "D'Silva L et al.", year: "2021", journal: "ERJ Open Res", pmid: "33692994" }
		]
	}
];

// Estado de filtros
let BIOM_FILTERED = [];

// =================== Tabla ===================
function renderBiomarkTable(rows){
	const tbody = document.querySelector("#biomarkTable tbody");
	if (!tbody) return;
	tbody.innerHTML = "";

	if (rows.length === 0){
		tbody.innerHTML = `<tr class="biomark-empty-row"><td colspan="3">No se encontraron biomarcadores con los filtros seleccionados.</td></tr>`;
		return;
	}

	rows.forEach(b => {
		const tr = document.createElement("tr");
		tr.innerHTML = `
			<td class="biomark-name-cell"><button type="button" class="biomark-name-link" data-id="${b.id}">${b.name}</button></td>
			<td>${b.fullname}</td>
			<td>${SAMPLE_LABELS[b.sample]}</td>
		`;
		tbody.appendChild(tr);
	});

	tbody.querySelectorAll(".biomark-name-link").forEach(btn => {
		btn.addEventListener("click", () => showBiomarkerDetails(btn.getAttribute("data-id")));
	});
}

// =================== Filtros + búsqueda ===================
function applyBiomarkFilters(){
	const search = document.getElementById("biomSearch");
	const sampleFilter = document.getElementById("biomSampleFilter");

	const q = search ? search.value.trim().toLowerCase() : "";
	const sample = sampleFilter ? sampleFilter.value : "";

	BIOM_FILTERED = BIOMARKERS.filter(b => {
		const matchesQ = !q || b.name.toLowerCase().includes(q) || b.fullname.toLowerCase().includes(q);
		const matchesSample = !sample || b.sample === sample;
		return matchesQ && matchesSample;
	});

	renderBiomarkTable(BIOM_FILTERED);
}

function populateBiomarkSelects(){
	const sampleFilter = document.getElementById("biomSampleFilter");
	if (!sampleFilter) return;

	Object.entries(SAMPLE_LABELS).forEach(([key, label]) => {
		const opt = document.createElement("option");
		opt.value = key;
		opt.textContent = label;
		sampleFilter.appendChild(opt);
	});
}

// =================== Modal de detalle (3 cards, estilo Genética) ===================
function showBiomarkerDetails(id){
	const b = BIOMARKERS.find(x => x.id === id);
	const modal = document.getElementById("biomarkerModal");
	const modalTitle = document.getElementById("biomModalTitle");
	const modalBody = document.getElementById("biomModalBody");

	if (!b || !modal || !modalTitle || !modalBody) return;

	modalTitle.textContent = `${b.name} — ${b.fullname}`;

	const dbLinksHTML = b.receptorIdentity
		? `
			<p class="gene-card-text">${b.receptorIdentity.intro}</p>
			<ul class="gene-card-list gene-card-list--compact biomark-receptor-list">
				${b.receptorIdentity.receptors.map(r => `
					<li>
						<strong>${r.symbol}</strong> <span class="biomark-receptor-name">(${r.name})</span>
						<span class="biomark-db-desc">${r.role}</span>
						<a href="${r.url}" target="_blank" rel="noopener">Consultar ${r.gene} en GeneCards</a>
					</li>
				`).join("")}
			</ul>
		`
		: `
			<ul class="gene-card-list gene-card-list--compact">
				${b.databases.map(d => `
					<li>
						<strong>${d.label}</strong>
						<span class="biomark-db-desc">${d.description}</span><br>
						<a href="${d.url}" target="_blank" rel="noopener">Consultar en ${d.label}</a>
					</li>
				`).join("")}
			</ul>
		`;

	const litHTML = b.literature.map(l => `
		<li>
			<strong>${l.authors}</strong> (${l.year}). <em>${l.journal}</em>.<br>
			<span class="gene-chip-label">${literatureId(l)}</span>
			— <a href="${literatureLink(l)}" target="_blank" rel="noopener">Ver publicación</a>
		</li>
	`).join("");

	const refRowsHTML = b.refInterpretation.rows.map(r => `
		<tr><td>${r.range}</td><td>${r.classification}</td><td>${r.meaning}</td></tr>
	`).join("");

	modalBody.innerHTML = `
		<div class="biomark-modal-grid">
			<div class="gene-card biomark-card-funcion">
				<div class="gene-card-header">
					<i class="uil uil-dna"></i>
					<div>
						<span class="gene-tag">Función del biomarcador</span>
						<span class="gene-subtitle">Rol biológico y utilidad clínica</span>
					</div>
				</div>
				<div class="biomark-inline-meta">
					<span class="biomark-badge ${b.category}">${CATEGORY_LABELS[b.category]}</span>
					<span class="biomark-chip"><span class="biomark-chip-label">Muestra:</span> <span class="biomark-chip-value">${SAMPLE_LABELS[b.sample]}</span></span>
				</div>
				<p class="gene-card-text">${b.description}</p>
				<p class="gene-card-text"><strong>Utilidad clínica:</strong> ${b.utility}</p>

				<h4 class="biomark-subhead">Valores de Referencia e Interpretación</h4>
				<p class="gene-card-text">${b.refInterpretation.unit}</p>
				<p class="gene-card-text">${b.refInterpretation.guideline}</p>
				<div class="biomark-ref-table-wrap">
					<table class="biomark-ref-table">
						<thead>
							<tr><th>Rango</th><th>Clasificación</th><th>Significado clínico</th></tr>
						</thead>
						<tbody>${refRowsHTML}</tbody>
					</table>
				</div>
			</div>

			<div class="gene-card biomark-card-ident">
				<div class="gene-card-header">
					<i class="uil uil-database"></i>
					<div>
						<span class="gene-tag">Identificadores externos</span>
						<span class="gene-subtitle">Bases de datos para consultar</span>
					</div>
				</div>
				${dbLinksHTML}
			</div>

			<div class="gene-card biomark-card-lit">
				<div class="gene-card-header">
					<i class="uil uil-book-open"></i>
					<div>
						<span class="gene-tag">Literatura</span>
					</div>
				</div>
				<ul class="gene-card-list gene-card-list--compact">
					${litHTML}
				</ul>
			</div>
		</div>
	`;

	modal.style.display = "block";
}

function closeBiomarkModal(){
	const modal = document.getElementById("biomarkerModal");
	if (modal) modal.style.display = "none";
}

// =================== Inicialización de Biomarcadores ===================
document.addEventListener("DOMContentLoaded", () => {
	if (!document.getElementById("biomarkTable")) return;

	populateBiomarkSelects();
	BIOM_FILTERED = [...BIOMARKERS];

	renderBiomarkTable(BIOM_FILTERED);

	const search = document.getElementById("biomSearch");
	const sampleFilter = document.getElementById("biomSampleFilter");

	if (search) search.addEventListener("input", debounce(applyBiomarkFilters, 150));
	if (sampleFilter) sampleFilter.addEventListener("change", applyBiomarkFilters);

	// Modal - cierre
	const modal = document.getElementById("biomarkerModal");
	if (modal) {
		const closeBtn = modal.querySelector(".close");
		if (closeBtn) closeBtn.addEventListener("click", closeBiomarkModal);
		modal.addEventListener("click", (event) => {
			if (event.target === modal) closeBiomarkModal();
		});
	}
});
