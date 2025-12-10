// Configuration file for Showcrete website
const ShowcreteConfig = {
    // Site information
    site: {
        name: 'Showcrete',
        version: '10.1.0',
        description: 'Herramienta para Diseño de Elementos Estructurales de Hormigón Armado',
        url: 'https://showcretecuba.com',
        email: 'soporte@showcretecuba.com'
    },

    // Contact information
    contact: {
        support: 'soporte@showcretecuba.com',
        aicros: 'aicros@aicros.cu',
        whatsapp: '+5352160495',
        location: 'La Habana, Cuba CP 10400'
    },

    // Social media links
    social: {
        youtube: 'https://www.youtube.com/channel/UCfyVgRiQNVyGTPWhauZkiow'
    },

    // Partners
    partners: {
        aicros: {
            name: 'AICROS',
            url: 'http://www.aicros.cu',
            description: 'Distribuidor exclusivo de Showcrete en Cuba'
        },
        csiCaribe: {
            name: 'CSI Caribe',
            url: 'https://www.csicaribe-bolivia.com/showcrete/',
            description: 'Versión internacional de Showcrete'
        }
    },

    // Download links
    downloads: {
        current: {
            version: '10.1.0',
            date: 'Marzo 2021',
            url: 'https://bit.ly/31xffqv'
        }
    },

    // Features and modules
    modules: [
        {
            id: 'flexion',
            name: 'Elementos a Flexión',
            icon: 'fas fa-calculator',
            description: 'Cálculo de refuerzo longitudinal en elementos solicitados a flexión'
        },
        {
            id: 'flexocompresion',
            name: 'Flexocompresión y Flexotracción',
            icon: 'fas fa-compress-arrows-alt',
            description: 'Cálculo de refuerzo longitudinal con generación de planos'
        },
        {
            id: 'cortante',
            name: 'Elementos a Cortante',
            icon: 'fas fa-cut',
            description: 'Cálculo de refuerzo transversal en elementos solicitados a cortante'
        },
        {
            id: 'deformacion',
            name: 'Deformación',
            icon: 'fas fa-chart-line',
            description: 'Cálculo de deformación en elementos solicitados a flexión'
        },
        {
            id: 'fisuras',
            name: 'Abertura de Fisuras',
            icon: 'fas fa-crack',
            description: 'Cálculo de abertura de fisuras en elementos a flexión'
        },
        {
            id: 'cimientos',
            name: 'Cimientos Aislados',
            icon: 'fas fa-home',
            description: 'Diseño geotécnico y estructural de cimientos superficiales'
        },
        {
            id: 'muros',
            name: 'Muros de Contención',
            icon: 'fas fa-wall-brick',
            description: 'Diseño geotécnico y estructural de muros de contención de tierra'
        },
        {
            id: 'losas',
            name: 'Losas (MDD)',
            icon: 'fas fa-layer-group',
            description: 'Cálculo de solicitaciones en losas por Método de Diseño Directo'
        },
        {
            id: 'pilotes',
            name: 'Pilotes Aislados',
            icon: 'fas fa-columns',
            description: 'Diseño geotécnico y estructural de pilotes aislados'
        },
        {
            id: 'combinados',
            name: 'Cimientos Combinados',
            icon: 'fas fa-object-group',
            description: 'Diseño geotécnico y estructural de cimientos combinados'
        }
    ],

    // Animation settings
    animations: {
        duration: 600,
        easing: 'ease-out',
        delay: 100
    },

    // Form settings
    forms: {
        maxFileSize: 10485760, // 10MB
        allowedFileTypes: ['.pdf', '.doc', '.docx', '.jpg', '.png', '.zip'],
        requiredFields: ['name', 'email', 'message']
    },

    // SEO settings
    seo: {
        keywords: [
            'software estructura',
            'estructural elementos',
            'hormigón armado',
            'diseño estructural',
            'ACI 318',
            'norma cubana',
            'SAP2000',
            'ETABS',
            'Revit',
            'AutoCAD',
            'cimientos',
            'muros contención',
            'pilotes',
            'flexión',
            'cortante'
        ]
    },

    // System requirements
    requirements: {
        os: ['Windows XP', 'Windows 7', 'Windows 8', 'Windows 10', 'Windows 11'],
        ram: '2 GB mínimo',
        storage: '500 MB',
        processor: '1 GHz',
        additional: ['AutoCAD (opcional)', 'Revit (opcional)', 'SAP2000/ETABS (opcional)']
    },

    // Statistics
    stats: {
        modules: 10,
        loadCombinations: 9999,
        trialDays: 30,
        companies: '100+'
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShowcreteConfig;
}