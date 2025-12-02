// chart-init.js - Load and render pie + line charts from table_data.json

const MAYORS_MEMBERS = ['F0Fner', 'Gokig', 'Jelly_Flash', 'Kqster1'];
const COLORS = [
    '#dc2626', '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
    '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
    '#d946ef', '#ec4899', '#f43f5e'
];

let chartData = null;
let pieChartInstance = null;
let lineChartInstance = null;

// Load JSON data
async function loadData() {
    try {
        const response = await fetch(`table_data.json?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to load data');
        chartData = await response.json();
        console.log('Data loaded:', chartData);
        return chartData;
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

// Calculate total for a player
function getTotal(playerName) {
    const values = chartData.values[playerName];
    if (!values) return 0;
    return Object.values(values).reduce((sum, val) => sum + val, 0);
}

// Create pie chart
function createPieChart() {
    const canvas = document.getElementById('pieChart');
    if (!canvas) {
        console.error('Pie chart canvas not found');
        return;
    }
    const ctx = canvas.getContext('2d');

    // Calculate totals and separate active/inactive
    const players = chartData.rows.map(name => ({
        name,
        total: getTotal(name)
    }));

    const active = players.filter(p => p.total > 0);
    const inactive = players.filter(p => p.total === 0);

    const labels = active.map(p => p.name);
    const values = active.map(p => p.total);
    const colors = active.map((_, i) => COLORS[i % COLORS.length]);

    // Add inactive sector (black, 1% of total)
    if (inactive.length > 0) {
        const totalActive = values.reduce((a, b) => a + b, 0);
        labels.push('Неактивные');
        values.push(totalActive * 0.01);
        colors.push('#000000');
    }

    pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderColor: '#1f2937',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: false,
                    external: createTooltipHandler(active, inactive)
                }
            }
        }
    });

    console.log('Pie chart created');
}

// Tooltip handler for pie chart
function createTooltipHandler(active, inactive) {
    return function(context) {
        let tooltipEl = document.getElementById('pie-tooltip');
        
        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'pie-tooltip';
            tooltipEl.style.cssText = `
                position:absolute;
                background:rgba(17,24,39,0.95);
                color:#e5e7eb;
                border:2px solid #dc2626;
                border-radius:8px;
                padding:12px;
                pointer-events:none;
                opacity:0;
                transition:opacity 0.1s;
                z-index:9999;
            `;
            document.body.appendChild(tooltipEl);
        }

        const tooltip = context.tooltip;
        if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
        }

        if (tooltip.body) {
            const index = tooltip.dataPoints[0].dataIndex;
            const label = tooltip.dataPoints[0].label;
            
            let html = '<div style="display:flex;flex-direction:column;gap:6px;">';
            
            if (label === 'Mayors') {
                html += '<b>Mayors:</b>';
                MAYORS_MEMBERS.forEach(name => {
                    html += `
                        <div style="display:flex;align-items:center;gap:8px;">
                            <img src="avatars/${name}.png" 
                                 style="width:24px;height:24px;image-rendering:pixelated;" 
                                 onerror="this.style.display='none'">
                            <span>${name}</span>
                        </div>`;
                });
            } else if (label === 'Неактивные') {
                html += '<b>Неактивные:</b>';
                inactive.forEach(p => {
                    html += `
                        <div style="display:flex;align-items:center;gap:8px;">
                            <img src="avatars/${p.name}.png" 
                                 style="width:20px;height:20px;image-rendering:pixelated;" 
                                 onerror="this.style.display='none'">
                            <span>${p.name}</span>
                        </div>`;
                });
            } else {
                html += `
                    <div style="display:flex;align-items:center;gap:10px;">
                        <img src="avatars/${label}.png" 
                             style="width:32px;height:32px;image-rendering:pixelated;" 
                             onerror="this.style.display='none'">
                        <div>
                            <div style="font-weight:bold;">${label}</div>
                            <div style="color:#9ca3af;">Total: ${active[index].total}</div>
                        </div>
                    </div>`;
            }
            
            html += '</div>';
            tooltipEl.innerHTML = html;
        }

        const pos = context.chart.canvas.getBoundingClientRect();
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = pos.left + window.pageXOffset + tooltip.caretX + 'px';
        tooltipEl.style.top = pos.top + window.pageYOffset + tooltip.caretY + 'px';
    };
}

// Create line chart
function createLineChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) {
        console.error('Line chart canvas not found');
        return;
    }
    const ctx = canvas.getContext('2d');

    const datasets = [];
    let colorIndex = 0;

    chartData.rows.forEach(name => {
        const playerValues = chartData.values[name];
        if (!playerValues) return;

        const hasActivity = Object.values(playerValues).some(v => v > 0);
        if (!hasActivity) return;

        const data = chartData.columns.map(col => playerValues[col] || 0);
        const color = COLORS[colorIndex % COLORS.length];
        colorIndex++;

        datasets.push({
            label: name,
            data,
            borderColor: color,
            backgroundColor: color + '80',
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0,
            fill: false
        });
    });

    lineChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.columns,
            datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'point',
                intersect: true
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(17,24,39,0.95)',
                    borderWidth: 2,
                    padding: 10,
                    callbacks: {
                        title: ctx => ctx[0].dataset.label,
                        label: () => null,
                        titleColor: ctx => ctx[0].dataset.borderColor,
                        borderColor: ctx => ctx[0].dataset.borderColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: 'rgba(156,163,175,0.1)' }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: '#9ca3af' },
                    grid: { color: 'rgba(156,163,175,0.1)' }
                }
            }
        }
    });

    console.log('Line chart created');
}

// Initialize everything
async function init() {
    console.log('Initializing charts...');
    
    const data = await loadData();
    if (!data) {
        console.error('Failed to load data, cannot create charts');
        return;
    }

    createPieChart();
    createLineChart();
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
