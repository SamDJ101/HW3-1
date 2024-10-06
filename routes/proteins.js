const express = require('express');
const router = express.Router();
const { authorizeUser } = require('../middleware/auth');
const { saveProtein, getProtein, listProteins, deleteProtein } = require('../services/s3Service');
const { predictSecondaryStructure, generateStructureSVG } = require('../services/structurePrediction');
const Protein = require('../models/protein');

router.get('/', authorizeUser('read'), async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const proteins = await listProteins(limit, offset);
    res.json(proteins);
  } catch (error) {
    next(error);
  }
});

router.get('/:proteinId', authorizeUser('read'), async (req, res, next) => {
  try {
    const protein = await getProtein(req.params.proteinId);
    res.json(protein);
  } catch (error) {
    next(error);
  }
});

router.post('/', authorizeUser('write'), async (req, res, next) => {
  try {
    const protein = new Protein(req.body);
    await saveProtein(protein);
    res.status(201).json(protein);
  } catch (error) {
    next(error);
  }
});

router.put('/:proteinId', authorizeUser('write'), async (req, res, next) => {
  try {
    let protein = await getProtein(req.params.proteinId);
    protein = new Protein({ ...protein, ...req.body, updatedAt: new Date().toISOString() });
    await saveProtein(protein);
    res.json(protein);
  } catch (error) {
    next(error);
  }
});

router.delete('/:proteinId', authorizeUser('delete'), async (req, res, next) => {
  try {
    await deleteProtein(req.params.proteinId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get('/:proteinId/structure', authorizeUser('read'), async (req, res, next) => {
  try {
    const protein = await getProtein(req.params.proteinId);
    const structure = predictSecondaryStructure(protein.sequence);
    
    if (req.accepts('json')) {
      res.json(structure);
    } else if (req.accepts('svg')) {
      const svg = generateStructureSVG(protein.sequence, structure.secondaryStructure);
      res.type('svg').send(svg);
    } else {
      res.status(406).json({ error: 'Not Acceptable' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;