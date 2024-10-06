require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  maxProteinLength: process.env.MAX_PROTEIN_LENGTH || 2000,
  s3: {
    bucketName: process.env.S3_BUCKET_NAME,
    region: process.env.AWS_REGION
  }
};