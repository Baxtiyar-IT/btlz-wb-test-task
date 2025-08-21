import { migrate, seed } from '#postgres/knex.js';
import { startScheduler } from '#cron/scheduler.js';
// если надо будет сделать тестовый вызов
// import { fetchTariffs } from '#api/fetchTariffs.js';
// import { updateSheets } from '#api/updateSheets.js';
// import env from '#config/env/env.js';
import log4js from 'log4js';

// Настройка логирования
log4js.configure({
  appenders: { console: { type: 'console' } },
  categories: { default: { appenders: ['console'], level: 'info' } },
});
const logger = log4js.getLogger();

async function main() {
  try {
    // Запуск миграций
    await migrate.latest();
    logger.info('All migrations have been run');

    // Запуск сидов
    await seed.run();
    logger.info('All seeds have been run');

    // // Тестовый вызов fetchTariffs
    // const tariffs = await fetchTariffs(env.WB_TOKEN);

    // // Тестовый вызов updateSheets
    // const sheetData = await updateSheets(
    //   env.GOOGLE_SHEET_IDS.split(','),
    //   JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_KEY)
    // );
    // logger.info('Simulated Google Sheets update completed', sheetData);

    // Запуск планировщика
    startScheduler();
    logger.info('Scheduler started');
  } catch (error) {
    logger.error('Error in main:', error);
    process.exit(1);
  }
}

main();



// если надо будет сделать тестовый вызов
// import { fetchTariffs } from '#api/fetchTariffs.js';
// import { updateSheets } from '#api/updateSheets.js';