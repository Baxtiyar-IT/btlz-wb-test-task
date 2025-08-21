import axios, { AxiosError } from 'axios';
import knex from '#postgres/knex.js';

interface WBTariff {
  warehouseName: string;
  boxDeliveryMarketplaceCoefExpr: string;
  [key: string]: any; // Для дополнительных полей в raw_data
}

interface WBResponse {
  response: {
    data: {
      dtNextBox: string;
      dtTillMax: string;
      warehouseList: WBTariff[];
    };
  };
}

export async function fetchTariffs(token: string) {
  try {
    const today = new Date().toISOString().split('T')[0]; // Формат YYYY-MM-DD
    console.log('Making request to WB API with token:', token, 'and date:', today);
    const response = await axios.get<WBResponse>('https://common-api.wildberries.ru/api/v1/tariffs/box', {
      headers: { Authorization: `Bearer ${token}` },
      params: { date: today },
    });
    console.log('WB API response:', response.data);
    const tariffs = response.data.response.data.warehouseList;

    // Проверяем, является ли tariffs массивом
    if (!Array.isArray(tariffs)) {
      throw new Error('Expected warehouseList to be an array');
    }

    // Преобразуем данные для БД
    const tariffRows = tariffs.map((tariff) => ({
      date: today,
      box_type: tariff.warehouseName,
      coefficient: tariff.boxDeliveryMarketplaceCoefExpr === '-' || !tariff.boxDeliveryMarketplaceCoefExpr
        ? 0
        : parseFloat(tariff.boxDeliveryMarketplaceCoefExpr),
      raw_data: JSON.stringify(tariff),
    }));

    // Логируем tariffRows для отладки
    console.log('Prepared tariff rows:', tariffRows);

    // UPSERT в БД
    await knex('tariffs')
      .insert(tariffRows)
      .onConflict(['date', 'box_type'])
      .merge(['coefficient', 'raw_data']);
    
    console.log(`Fetched and saved ${tariffRows.length} tariffs`);
    return tariffRows;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string; origin?: string; requestId?: string }>;
    console.error('Error fetching tariffs:', axiosError.message, axiosError.response?.data || error);
    throw error;
  }
}