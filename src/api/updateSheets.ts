import knex from '#postgres/knex.js';
// Закомментированный код для реального Google Sheets API
// import { google } from 'googleapis';

export async function updateSheets(sheetIds: string[], serviceAccountKey: any) {
  try {
    // Получаем последние данные за сегодня
    const today = new Date().toISOString().split('T')[0];
    console.log('Fetching tariffs from DB for date:', today);
    const tariffs = await knex('tariffs')
      .where('date', today)
      .orderBy('coefficient', 'asc')
      .select('date', 'box_type', 'coefficient', 'raw_data');
    console.log('Fetched tariffs from DB:', tariffs);

    const values = [
      ['Date', 'Box Type', 'Coefficient'], // Заголовки
      ...tariffs.map((t) => [t.date, t.box_type, t.coefficient]),
    ];

    // Имитация записи в Google Sheets
    console.log('Simulated Google Sheets update for sheetIds:', sheetIds);
    console.log('Data to be written to stocks_coefs:', values);

    // Закомментированный код для реального Google Sheets API
    /*
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccountKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // Обновляем все таблицы
    for (const sheetId of sheetIds) {
      console.log('Updating Google Sheet:', sheetId);
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'stocks_coefs!A1',
        valueInputOption: 'RAW',
        requestBody: { values },
      });
      console.log(`Updated Google Sheet ${sheetId}`);
    }
    */

    return values; // Возвращаем данные для проверки
  } catch (error) {
    console.error('Error in updateSheets:', error);
    throw error;
  }
}