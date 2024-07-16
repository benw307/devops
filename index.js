const { RunServiceClient } = require('@google-cloud/run');
const { google } = require('googleapis');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const auth = new google.auth.GoogleAuth({
  // Scopes can be specified either as an array or as a single, space-delimited string.
  scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/spreadsheets']
});

async function getCloudRunData() {
  const run = new RunServiceClient({ authClient: await auth.getClient() });

  // Replace with your project IDs or use logic to fetch them
  const projects = [next24-demo-project];

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

async function updateGoogleSheet(totalInstances, totalProjects) {
  const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
  const spreadsheetId = 1sFg82nPo0CFXkw7w-OK4h6OSrqxnx-fzKg-5U-jYrm8;
  const range = 'Sheet1!A2:D';

  const values = [[new Date().toISOString().slice(0, 10), new Date().getHours(), totalProjects, totalInstances]];
  const resource = {
    values,
  };

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource,
  });
}

async function main() {
  const { totalInstances, totalProjects } = await getCloudRunData();
  await updateGoogleSheet(totalInstances, totalProjects);
  console.log('Data updated in Google Sheets successfully!');
}

main().catch(console.error);


