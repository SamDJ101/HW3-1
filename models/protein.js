const { v4: uuidv4 } = require('uuid');

class Protein {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.sequence = data.sequence.toUpperCase();
    this.molecularWeight = data.molecularWeight || this.calculateMolecularWeight();
    this.description = data.description || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  calculateMolecularWeight() {
    const aminoAcidWeights = {
      A: 89.09, R: 174.20, N: 132.12, D: 133.10, C: 121.16, 
      E: 147.13, Q: 146.15, G: 75.07, H: 155.16, I: 131.17,
      L: 131.17, K: 146.19, M: 149.21, F: 165.19, P: 115.13,
      S: 105.09, T: 119.12, W: 204.23, Y: 181.19, V: 117.15
    };

    let weight = 0;
    for (const amino of this.sequence) {
      if (aminoAcidWeights[amino]) {
        weight += aminoAcidWeights[amino];
      }
    }
    return weight;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      sequence: this.sequence,
      molecularWeight: this.molecularWeight,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Protein;
