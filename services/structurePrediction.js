const propensityTable = {
    A: { alpha: 1.42, beta: 0.83, coil: 0.80 },
    R: { alpha: 1.21, beta: 0.84, coil: 0.96 },
    N: { alpha: 0.67, beta: 0.89, coil: 1.34 },
    D: { alpha: 1.01, beta: 0.54, coil: 1.35 },
    C: { alpha: 0.70, beta: 1.19, coil: 1.06 },
    Q: { alpha: 1.11, beta: 1.10, coil: 0.84 },
    E: { alpha: 1.51, beta: 0.37, coil: 1.08 },
    G: { alpha: 0.57, beta: 0.75, coil: 1.56 },
    H: { alpha: 1.00, beta: 0.87, coil: 1.09 },
    I: { alpha: 1.08, beta: 1.60, coil: 0.47 },
    L: { alpha: 1.21, beta: 1.30, coil: 0.59 },
    K: { alpha: 1.16, beta: 0.74, coil: 1.07 },
    M: { alpha: 1.45, beta: 1.05, coil: 0.60 },
    F: { alpha: 1.13, beta: 1.38, coil: 0.59 },
    P: { alpha: 0.57, beta: 0.55, coil: 1.72 },
    S: { alpha: 0.77, beta: 0.75, coil: 1.39 },
    T: { alpha: 0.83, beta: 1.19, coil: 0.96 },
    W: { alpha: 1.08, beta: 1.37, coil: 0.64 },
    Y: { alpha: 0.69, beta: 1.47, coil: 0.87 },
    V: { alpha: 1.06, beta: 1.70, coil: 0.41 }
};

function predictSecondaryStructure(sequence) {
    let secondaryStructure = '';
    const confidenceScores = [];

    for (let i = 0; i < sequence.length; i++) {
        const residue = sequence[i];
        const propensities = propensityTable[residue];
        
        // Get propensities for alpha, beta, and coil
        const propArray = [
            { type: 'H', value: propensities.alpha },
            { type: 'E', value: propensities.beta },
            { type: 'C', value: propensities.coil }
        ];

        // Sort propensities in descending order to find the top two
        propArray.sort((a, b) => b.value - a.value);

        // Assign structure with the highest propensity
        secondaryStructure += propArray[0].type;

        // Calculate confidence score as the difference between the top two propensities
        const confidence = propArray[0].value - propArray[1].value;
        confidenceScores.push(confidence);
    }

    return { secondaryStructure, confidenceScores };
}


function generateStructureSVG(sequence, secondaryStructure) {
    const svgWidth = sequence.length * 10;
    const svgHeight = 50;
    let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
    for (let i = 0; i < sequence.length; i++) {
    let color;
    switch(secondaryStructure[i]) {
    case 'H': color = 'red'; break;
    case 'E': color = 'yellow'; break;
    default: color = 'gray';
    }
    svg += `<rect x="${i * 10}" y="0" width="10" height="30" fill="${color}"
    />`;
    }
    // Add legend
    svg += `
    <rect x="10" y="35" width="10" height="10" fill="red" />
    <text x="25" y="45" font-size="10">alpha-helix</text>
    <rect x="70" y="35" width="10" height="10" fill="yellow" />
    <text x="85" y="45" font-size="10">beta-strand</text>
    <rect x="140" y="35" width="10" height="10" fill="gray" />
    <text x="155" y="45" font-size="10">coil</text>
    `;
    svg += '</svg>';
    return svg;
    }
    

module.exports = {
  predictSecondaryStructure,
  generateStructureSVG
};