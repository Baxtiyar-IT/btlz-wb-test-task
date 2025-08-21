import cron from 'node-cron';
import { fetchTariffs } from '#api/fetchTariffs.js';
import { updateSheets } from '#api/updateSheets.js';
import env from '#config/env/env.js';

export function startScheduler() {
  // Ежечасный фетч тарифов
  cron.schedule('0 * * * *', async () => {
    console.log('Running tariff fetch job');
    try {
      await fetchTariffs(env.WB_TOKEN);
    } catch (error) {
      console.error('Error in tariff fetch job:', error);
    }
  });

  // Обновление Sheets каждые 30 минут
  cron.schedule('*/30 * * * *', async () => {
    console.log('Running Google Sheets update job');
    try {
      await updateSheets(
        env.GOOGLE_SHEET_IDS.split(','),
        JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_KEY)
      );
    } catch (error) {
      console.error('Error in Google Sheets update job:', error);
    }
  });
}