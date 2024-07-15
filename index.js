// index.js
const { PubSub } = require('@google-cloud/pubsub');
const { RunServiceClient } = require('@google-cloud/run');
const { google } = require('googleapis');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const projectId = bw-cbv2-sample-1;  // Replace with your actual project ID
const topicName = 'cloud-run-instance-data'; // Pub/Sub topic name
const pubsub = new PubSub({ projectId });
const secretManagerClient = new SecretManagerServiceClient();

async function accessSecretVersion() {
  const name = 'projects/YOUR_PROJECT_ID/secrets/cloud-run-tracker-sa-key/versions/latest'; //replace with actual secret name
  const [version] = await secretManagerClient.accessSecretVersion({
    name: name,
  });

  const payload = version.payload.data.toString();
  return payload;
}


async function getCloudRunData() {
  // Access the secret and create auth object
  const secretValue = await accessSecretVersion();
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(secretValue),
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });

  const run = new RunServiceClient({ authClient: await auth.getClient() });

  // Replace with your project IDs or use logic to fetch them
  const projects = ['YOUR_PROJECT_ID_1', 'YOUR_PROJECT_ID_2']; 

  let totalInstances = 0;
  let totalProjects = 0;

  for (const projectId of projects) {
    try {
      const [services] = await run.listServices({parent: `projects/${projectId}/locations/-`});
      totalInstances += services.length;
      totalProjects++;
    } catch (err) {
      console.error(`Error processing project ${projectId}:`, err);
    }
  }

  return { totalInstances, totalProjects };
}

async function publishToPubSub(data) {
  const dataBuffer = Buffer.from(JSON.stringify(data));
  try {
    const messageId = await pubsub.topic(topicName).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
  }
}

async function main() {
  const { totalInstances, totalProjects } = await getCloudRunData();
  await publishToPubSub({ totalInstances, totalProjects });
}

main().catch(console.error);

