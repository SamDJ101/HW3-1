const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({ region: process.env.AWS_REGION });

let users = [];
let roles = [];

async function loadUsers() {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: 'users.json'
  };

  try {
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);
    const data = await response.Body.transformToString();
    users = JSON.parse(data).users;
    console.log('Users loaded successfully');
  } catch (error) {
    console.error('Error loading users:', error);
    throw error;
  }
}

async function loadRoles() {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: 'roles.json'
  };

  try {
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);
    const data = await response.Body.transformToString();
    roles = JSON.parse(data).roles;
    console.log('Roles loaded successfully');
  } catch (error) {
    console.error('Error loading roles:', error);
    throw error;
  }
}

async function saveProtein(protein) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `proteins/${protein.id}.json`,
    Body: JSON.stringify(protein),
    ContentType: "application/json"
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    console.log(`Protein ${protein.id} saved to S3`);
    await updateProteinsList(protein.id, protein.name);
  } catch (error) {
    console.error(`Error saving protein ${protein.id}:`, error);
    throw error;
  }
}

async function getProtein(proteinId) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `proteins/${proteinId}.json`
  };

  try {
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);
    const data = await response.Body.transformToString();
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error retrieving protein ${proteinId}:`, error);
    throw error;
  }
}

async function deleteProtein(proteinId) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `proteins/${proteinId}.json`
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    console.log(`Protein ${proteinId} deleted from S3`);
    await removeFromProteinsList(proteinId);
  } catch (error) {
    console.error(`Error deleting protein ${proteinId}:`, error);
    throw error;
  }
}

async function listProteins(limit = 10, offset = 0) {
  const proteinsList = await getProteinsList();
  const total = proteinsList.proteins.length;
  const proteins = proteinsList.proteins.slice(offset, offset + limit);

  return {
    proteins,
    total,
    limit: parseInt(limit),
    offset: parseInt(offset)
  };
}

async function getProteinsList() {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: 'proteins.json'
  };

  try {
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);
    const data = await response.Body.transformToString();
    return JSON.parse(data);
  } catch (error) {
    console.error('Error retrieving proteins list:', error);
    return { proteins: [] };
  }
}

async function updateProteinsList(proteinId, proteinName) {
  const proteinsList = await getProteinsList();
  const existingIndex = proteinsList.proteins.findIndex(p => p.id === proteinId);

  if (existingIndex !== -1) {
    proteinsList.proteins[existingIndex].name = proteinName;
  } else {
    proteinsList.proteins.push({ id: proteinId, name: proteinName });
  }

  await saveProteinsList(proteinsList);
}

async function removeFromProteinsList(proteinId) {
  const proteinsList = await getProteinsList();
  proteinsList.proteins = proteinsList.proteins.filter(p => p.id !== proteinId);
  await saveProteinsList(proteinsList);
}

async function saveProteinsList(proteinsList) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: 'proteins.json',
    Body: JSON.stringify(proteinsList),
    ContentType: "application/json"
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    console.log('Proteins list updated in S3');
  } catch (error) {
    console.error('Error saving proteins list:', error);
    throw error;
  }
}

function getUsers() {
  return users;
}

function getRoles() {
  return roles;
}

module.exports = {
  loadUsers,
  loadRoles,
  saveProtein,
  getProtein,
  deleteProtein,
  listProteins,
  getUsers,
  getRoles
};