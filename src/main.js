// /**
//  * Функция для расчета выручки
//  * @param purchase запись о покупке
//  * @param _product карточка товара
//  * @returns {number}
//  */
//    // @TODO: Расчет выручки от операции
//    function calculateSimpleRevenue(purchase, _product) {
//     const discountFactor = 1 - (purchase.discount / 100);
//     const revenue = purchase.sale_price * purchase.quantity * discountFactor;
//     return revenue; 
// }

// /**
//  * Функция для расчета бонусов
//  * @param index порядковый номер в отсортированном массиве
//  * @param total общее число продавцов
//  * @param seller карточка продавца
//  * @returns {number}
//  */

// function calculateBonusByProfit(index, total, seller) {
//     // @TODO: Расчет бонуса от позиции в рейтинге
//     const { profit } = seller;
//     let bonusPercentage;
    
//     if (index === 0) {
//         bonusPercentage = 0.15; 
//     } else if (index <= 2 && index > 0) {
//         bonusPercentage = 0.10; 
//     } else if (index < total - 1) {
//         bonusPercentage = 0.05; 
//     } else {
//         bonusPercentage = 0; 
//     }
//       return profit * bonusPercentage;
// }

// /**
//  * Функция для анализа данных продаж
//  * @param data
//  * @param options
//  * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
//  */

// function analyzeSalesData(data, options) {
    
//     // Проверка основных данных
//     if (!data
//         || !Array.isArray(data.sellers) || data.sellers.length === 0
//         || !Array.isArray(data.products) || data.products.length === 0
//         || !Array.isArray(data.purchase_records) || data.purchase_records.length === 0
//     ) {
//         throw new Error('Некорректные входные данные: данные должны содержать непустые массивы sellers, products и purchase_records');
//     }

//     // Проверка структуры данных
//     const hasInvalidSellers = data.sellers.some(s => 
//         !s.id || !s.first_name || !s.last_name
//     );
    
//     const hasInvalidProducts = data.products.some(p => 
//         !p.sku || !p.purchase_price || !p.sale_price
//     );
    
//     const hasInvalidPurchases = data.purchase_records.some(p => 
//         !p.seller_id || !p.items || !Array.isArray(p.items) || p.items.length === 0
//     );

//     if (hasInvalidSellers
//         || hasInvalidProducts
//         || hasInvalidPurchases
//     ) {
//         throw new Error('Некорректная структура данных: проверьте обязательные поля');
//     }

//     // Проверка items в purchase_records
//     const hasInvalidItems = data.purchase_records.some(p => 
//         p.items.some(item => 
//             !item.sku || !item.quantity || !item.sale_price
//         )
//     );

//     if (hasInvalidItems) {
//         throw new Error('Некорректные данные в items: проверьте sku, quantity и sale_price');
//     }

//     //определю новые опции
//     const calculateRevenue =calculateSimpleRevenue;
//    const calculateBonus = calculateBonusByProfit;

//     // Проверка опций
//     // const { calculateRevenue, calculateBonus } = options;

//     // Создаем индексы
//     const sellerIndex = {};
//     const productIndex = {};
    
//     try {
//         // Индекс продавцов
//         data.sellers.forEach(seller => {
//             if (!seller.id || !seller.first_name || !seller.last_name) {
//                 throw new Error('Не все обязательные поля продавца заполнены');
//             }
//             sellerIndex[seller.id] = seller;
//         });

//         // Индекс товаров 
//         data.products.forEach(product => {
//             if (!product.sku) {
//                 throw new Error('Не все обязательные поля товара заполнены');
//             }
//             productIndex[product.sku] = product;
//         });
//     } catch (e) {
//         throw new Error(`Некорректная структура данных: ${e.message}`);
//     }

//     // Инициализация статистики
//     const sellerStats = data.sellers.map(seller => ({
//         id: seller.id,
//         name: `${seller.first_name} ${seller.last_name}`,
//         revenue: 0,
//         profit: 0,
//         sales_count: 0,
//         products_sold: {},
//         bonus_amount: 0
//     }));

//     // Обработка покупок
//     data.purchase_records.forEach(record => {
//         if (!record.seller_id || !record.items) {
//             console.warn('Пропущена запись о продаже с неполными данными', record);
//             return;
//         }

//         const seller = sellerIndex[record.seller_id];
//         if (!seller) {
//             console.warn(`Продавец с ID ${record.seller_id} не найден`);
//             return;
//         }

//         const sellerStat = sellerStats.find(s => s.id === seller.id);
//         if (!sellerStat) return;

//         sellerStat.sales_count += 1;

//         record.items.forEach(item => {
//             if (!item.sku || !item.quantity || !item.sale_price) {
//                 console.warn('Пропущен товар с неполными данными', item);
//                 return;
//             }

//             const product = productIndex[item.sku];
//             if (!product) {
//                 console.warn(`Товар с артикулом ${item.sku} не найден`);
//                 return;
//             }

//             // Расчет показателей
//          const revenue = options.calculateRevenue({
//             sale_price: item.sale_price,
//             quantity: item.quantity,
//             discount: item.discount || 0
//         }, product);
        
//         const cost = product.purchase_price * item.quantity;
//         const profit = revenue - cost; 

//         // Обновление статистики 
//         sellerStat.revenue += revenue;
//         sellerStat.profit += profit;
    
//             // Обновление счетчика товаров
//             if (!sellerStat.products_sold[item.sku]) {
//                 sellerStat.products_sold[item.sku] = 0;
//             }
//             sellerStat.products_sold[item.sku] += item.quantity;
//         });
//     });

     
// // Сортировка по прибыли
// sellerStats.sort((a, b) => b.profit - a.profit);

// // Назначение бонусов
// sellerStats.forEach((seller, index) => { 
//     seller.bonus_amount = options.calculateBonus(index, sellerStats.length, seller);
    
//     // Формирование топ-10 товаров
//     seller.top_products = Object.entries(seller.products_sold)
//         .map(([sku, quantity]) => ({ sku, quantity }))
//         .sort((a, b) => b.quantity - a.quantity)
//         .slice(0, 10);
// });

//     // Формирование результата
//    return sellerStats.map(seller => ({
//     seller_id: seller.id.toString(),
//     name: seller.name,
//     revenue: Math.ceil(+seller.revenue * 100) / 100,
//     profit: +seller.profit.toFixed(2),
//     sales_count: seller.sales_count,
//     top_products: seller.top_products,
//     bonus: +seller.bonus_amount.toFixed(2) 
// }));
// }


// function analyzeSalesData(data, options) {
    
//     // Проверка основных данных
//     if (!data
//         || !Array.isArray(data.sellers) || data.sellers.length === 0
//         || !Array.isArray(data.products) || data.products.length === 0
//         || !Array.isArray(data.purchase_records) || data.purchase_records.length === 0
//     ) {
//         throw new Error('Некорректные входные данные: данные должны содержать непустые массивы sellers, products и purchase_records');
//     }

//     // Проверка структуры данных
//     const hasInvalidSellers = data.sellers.some(s => 
//         !s.id || !s.first_name || !s.last_name
//     );
    
//     const hasInvalidProducts = data.products.some(p => 
//         !p.sku || !p.purchase_price || !p.sale_price
//     );
    
//     const hasInvalidPurchases = data.purchase_records.some(p => 
//         !p.seller_id || !p.items || !Array.isArray(p.items) || p.items.length === 0
//     );

//     if (hasInvalidSellers || hasInvalidProducts || hasInvalidPurchases) {
//         throw new Error('Некорректная структура данных: проверьте обязательные поля');
//     }

//     // Проверка items в purchase_records
//     const hasInvalidItems = data.purchase_records.some(p => 
//         p.items.some(item => !item.sku || !item.quantity || !item.sale_price)
//     );

//     if (hasInvalidItems) {
//         throw new Error('Некорректные данные в items: проверьте sku, quantity и sale_price');
//     }

//     // ВАЖНО: Получаем функции ИЗ ПЕРЕДАННЫХ ОПЦИЙ
//     const { calculateRevenue, calculateBonus } = options;
    
//     // Проверяем, что функции действительно переданы
//     if (typeof calculateRevenue !== 'function' || typeof calculateBonus !== 'function') {
//         throw new Error('Некорректные опции: должны быть переданы функции calculateRevenue и calculateBonus');
//     }

//     // Создаем индексы
//     const sellerIndex = {};
//     const productIndex = {};
    
//     // Индекс продавцов
//     data.sellers.forEach(seller => {
//         if (!seller.id || !seller.first_name || !seller.last_name) {
//             throw new Error('Не все обязательные поля продавца заполнены');
//         }
//         sellerIndex[seller.id] = seller;
//     });

//     // Индекс товаров 
//     data.products.forEach(product => {
//         if (!product.sku) {
//             throw new Error('Не все обязательные поля товара заполнены');
//         }
//         productIndex[product.sku] = product;
//     });

//     // Инициализация статистики
//     const sellerStats = data.sellers.map(seller => ({
//         id: seller.id,
//         name: `${seller.first_name} ${seller.last_name}`,
//         revenue: 0,
//         profit: 0,
//         sales_count: 0,
//         products_sold: {},
//         bonus_amount: 0
//     }));

//     // Обработка покупок
//     data.purchase_records.forEach(record => {
//         if (!record.seller_id || !record.items) {
//             console.warn('Пропущена запись о продаже с неполными данными', record);
//             return;
//         }

//         const seller = sellerIndex[record.seller_id];
//         if (!seller) {
//             console.warn(`Продавец с ID ${record.seller_id} не найден`);
//             return;
//         }

//         const sellerStat = sellerStats.find(s => s.id === seller.id);
//         if (!sellerStat) return;

//         sellerStat.sales_count += 1;

//         record.items.forEach(item => {
//             if (!item.sku || !item.quantity || !item.sale_price) {
//                 console.warn('Пропущен товар с неполными данными', item);
//                 return;
//             }

//             const product = productIndex[item.sku];
//             if (!product) {
//                 console.warn(`Товар с артикулом ${item.sku} не найден`);
//                 return;
//             }

//             // ВАЖНО: Используем функции ИЗ ОПЦИЙ
//             const revenue = calculateSimpleRevenue({
//                 sale_price: item.sale_price,
//                 quantity: item.quantity,
//                 discount: item.discount || 0
//             }, product);
            
//             const cost = product.purchase_price * item.quantity;
//             const profit = revenue - cost; 

//             sellerStat.revenue += revenue;
//             sellerStat.profit += profit;
        
//             if (!sellerStat.products_sold[item.sku]) {
//                 sellerStat.products_sold[item.sku] = 0;
//             }
//             sellerStat.products_sold[item.sku] += item.quantity;
//         });
//     });

//     // Сортировка по прибыли
//     sellerStats.sort((a, b) => b.profit - a.profit);

//     // Назначение бонусов - используем функцию ИЗ ОПЦИЙ
//     sellerStats.forEach((seller, index) => { 
//         seller.bonus_amount = calculateBonus(index, sellerStats.length, seller);
        
//         seller.top_products = Object.entries(seller.products_sold)
//             .map(([sku, quantity]) => ({ sku, quantity }))
//             .sort((a, b) => b.quantity - a.quantity)
//             .slice(0, 10);
//     });

//     return sellerStats.map(seller => ({
//         seller_id: seller.id.toString(),
//         name: seller.name,
//         revenue: +seller.revenue.toFixed(3),
//         profit: +seller.profit.toFixed(2),
//         sales_count: seller.sales_count,
//         top_products: seller.top_products,
//         bonus: +seller.bonus_amount.toFixed(2) 
//     }));
// }



// //пишу код снова
// function calculateSimpleRevenue(purchase, _product) {
//     const { discount, sale_price, quantity } = purchase;
//     const discountFactor = 1 - (discount / 100);
//     return sale_price * quantity * discountFactor; 
// }

// function calculateBonusByProfit(index, total, seller) {
//     const { profit } = seller;
//     let bonusPercentage;
    
//     if (index === 0) {
//         bonusPercentage = 0.15; 
//     } else if (index <= 2 && index > 0) {
//         bonusPercentage = 0.10; 
//     } else if (index < total - 1) {
//         bonusPercentage = 0.05; 
//     } else {
//         bonusPercentage = 0; 
//     }
//     return profit * bonusPercentage;
// }

// function analyzeSalesData(data, options) {
//     // Проверка входных данных
//     if (!data || !Array.isArray(data.sellers) || !Array.isArray(data.products) || !Array.isArray(data.purchase_records)) {
//         throw new Error('Некорректные входные данные.');
//     }

//     // Проверка опций
//     if (!options || typeof options.calculateRevenue !== 'function' || typeof options.calculateBonus !== 'function') {
//         throw new Error('Чего-то не хватает');
//     }

//     const { calculateRevenue, calculateBonus } = options;

//     // Подготовка статистики продавцов
//     const sellerStats = data.sellers.map(seller => ({
//         id: seller.id,
//         name: `${seller.first_name} ${seller.last_name}`,
//         revenue: 0,
//         profit: 0,
//         sales_count: 0,
//         products_sold: {}
//     })); 

//     // Индексация
//     const sellerIndex = Object.fromEntries(sellerStats.map(seller => [seller.id, seller]));
//     const productIndex = Object.fromEntries(data.products.map(product => [product.sku, product]));

//     // Обработка записей о покупках
//     data.purchase_records.forEach(record => {
//         const seller = sellerIndex[record.seller_id];
        
//         if (seller) {
//             seller.sales_count += 1;
//             seller.revenue += record.total_amount;
            
//             record.items.forEach(item => {
//                 const product = productIndex[item.sku];
                
//                 if (product) {
//                     const cost = product.purchase_price * item.quantity;
//                     const revenue = calculateRevenue({
//                         sale_price: item.price,
//                         quantity: item.quantity,
//                         discount: item.discount
//                     });
//                     const profit = revenue - cost;
                    
//                     seller.profit += profit;
                    
//                     // Учет проданных товаров
//                     if (!seller.products_sold[item.sku]) {
//                         seller.products_sold[item.sku] = 0;
//                     }
//                     seller.products_sold[item.sku] += item.quantity;
//                 }
//             });
//         }
//     });

//     // Сортировка по прибыли
//     sellerStats.sort((a, b) => b.profit - a.profit);

//     // Назначение бонусов и формирование топ-10
//     sellerStats.forEach((seller, index) => {
//         seller.bonus = calculateBonus(index, sellerStats.length, seller);
        
//         // Формирование топ-10 товаров
//         seller.top_products = Object.entries(seller.products_sold)
//             .map(([sku, quantity]) => ({ sku, quantity }))
//             .sort((a, b) => b.quantity - a.quantity)
//             .slice(0, 10);
//     });

//     // Подготовка итогового результата
//     return sellerStats.map(seller => ({
//         seller_id: seller.id.toString(),
//         name: seller.name.toString(),
//         revenue: +seller.revenue.toFixed(2),
//         profit: +seller.profit.toFixed(2),
//         sales_count: seller.sales_count,
//         top_products: seller.top_products,
//         bonus: +seller.bonus.toFixed(2)
//     }));
// }


// return sellerStats.map(seller => ({
// //     seller_id: seller.id.toString(),
// //     name: seller.name,
// //     revenue: Math.ceil(+seller.revenue * 100) / 100,
// //     profit: +seller.profit.toFixed(2),
// //     sales_count: seller.sales_count,
// //     top_products: seller.top_products,
// //     bonus: +seller.bonus_amount.toFixed(2) 




// /**
//  * Функция для расчета выручки
//  * @param purchase запись о покупке
//  * @param _product карточка товара
//  * @returns {number}
//  */
//    // @TODO: Расчет выручки от операции
//    function calculateSimpleRevenue(purchase, _product) {
//     const discountFactor = 1 - (purchase.discount / 100);
//     const revenue = purchase.sale_price * purchase.quantity * discountFactor;
//    revenue = Math.round.revenue.toFixed(2);
//     return revenue; 
// }

// /**
//  * Функция для расчета бонусов
//  * @param index порядковый номер в отсортированном массиве
//  * @param total общее число продавцов
//  * @param seller карточка продавца
//  * @returns {number}
//  */

// function calculateBonusByProfit(index, total, seller) {
//     // @TODO: Расчет бонуса от позиции в рейтинге
//     const { profit } = seller;
//     let bonusPercentage;
    
//     if (index === 0) {
//         bonusPercentage = 0.15; 
//     } else if (index <= 2 && index > 0) {
//         bonusPercentage = 0.10; 
//     } else if (index < total - 1) {
//         bonusPercentage = 0.05; 
//     } else {
//         bonusPercentage = 0; 
//     }
//       return profit * bonusPercentage;
// }

// /**
//  * Функция для анализа данных продаж
//  * @param data
//  * @param options
//  * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
//  */

// function analyzeSalesData(data, options) {
//     // Проверка основных данных
//     if (!data
//         || !Array.isArray(data.sellers) || data.sellers.length === 0
//         || !Array.isArray(data.products) || data.products.length === 0
//         || !Array.isArray(data.purchase_records) || data.purchase_records.length === 0
//     ) {
//         throw new Error('Некорректные входные данные: данные должны содержать непустые массивы sellers, products и purchase_records');
//     }

//     // Проверка структуры данных
//     const hasInvalidSellers = data.sellers.some(s => 
//         !s.id || !s.first_name || !s.last_name
//     );
    
//     const hasInvalidProducts = data.products.some(p => 
//         !p.sku || !p.purchase_price || !p.sale_price
//     );
    
//     const hasInvalidPurchases = data.purchase_records.some(p => 
//         !p.seller_id || !p.items || !Array.isArray(p.items) || p.items.length === 0
//     );

//     if (hasInvalidSellers
//         || hasInvalidProducts
//         || hasInvalidPurchases
//     ) {
//         throw new Error('Некорректная структура данных: проверьте обязательные поля');
//     }

//     // Проверка items в purchase_records
//     const hasInvalidItems = data.purchase_records.some(p => 
//         p.items.some(item => 
//             !item.sku || !item.quantity || !item.sale_price
//         )
//     );

//     if (hasInvalidItems) {
//         throw new Error('Некорректные данные в items: проверьте sku, quantity и sale_price');
//     }

//     // Проверка опций
//     if (!options
//         || typeof options.calculateRevenue !== 'function'
//         || typeof options.calculateBonus !== 'function'
//     ) {
//         throw new Error('Некорректные опции: должны быть переданы функции calculateRevenue и calculateBonus');
//     }

//     // Создаем индексы
//     const sellerIndex = {};
//     const productIndex = {};
    
//     try {
//         // Индекс продавцов
//         data.sellers.forEach(seller => {
//             if (!seller.id || !seller.first_name || !seller.last_name) {
//                 throw new Error('Не все обязательные поля продавца заполнены');
//             }
//             sellerIndex[seller.id] = seller;
//         });

//         // Индекс товаров 
//         data.products.forEach(product => {
//             if (!product.sku) {
//                 throw new Error('Не все обязательные поля товара заполнены');
//             }
//             productIndex[product.sku] = product;
//         });
//     } catch (e) {
//         throw new Error(`Некорректная структура данных: ${e.message}`);
//     }

//     // Инициализация статистики
//     const sellerStats = data.sellers.map(seller => ({
//         id: seller.id,
//         name: `${seller.first_name} ${seller.last_name}`,
//         revenue: 0,
//         profit: 0,
//         sales_count: 0,
//         products_sold: {},
//         bonus_amount: 0
//     }));

//     // Обработка покупок
//     data.purchase_records.forEach(record => {
//         if (!record.seller_id || !record.items) {
//             console.warn('Пропущена запись о продаже с неполными данными', record);
//             return;
//         }

//         const seller = sellerIndex[record.seller_id];
//         if (!seller) {
//             console.warn(`Продавец с ID ${record.seller_id} не найден`);
//             return;
//         }

//         const sellerStat = sellerStats.find(s => s.id === seller.id);
//         if (!sellerStat) return;

//         sellerStat.sales_count += 1;

//         record.items.forEach(item => {
//             if (!item.sku || !item.quantity || !item.sale_price) {
//                 console.warn('Пропущен товар с неполными данными', item);
//                 return;
//             }

//             const product = productIndex[item.sku];
//             if (!product) {
//                 console.warn(`Товар с артикулом ${item.sku} не найден`);
//                 return;
//             }

//             // Расчет показателей
//          const revenue = options.calculateRevenue({
//             sale_price: item.sale_price,
//             quantity: item.quantity,
//             discount: item.discount || 0
//         }, product);
        
//         const cost = product.purchase_price * item.quantity;
//         const profit = revenue - cost; 

//         // Обновление статистики 
//         sellerStat.revenue += revenue;
//         sellerStat.profit += profit;
    
//             // Обновление счетчика товаров
//             if (!sellerStat.products_sold[item.sku]) {
//                 sellerStat.products_sold[item.sku] = 0;
//             }
//             sellerStat.products_sold[item.sku] += item.quantity;
//         });
//     });

     
// // Сортировка по прибыли
// sellerStats.sort((a, b) => b.profit - a.profit);

// // Назначение бонусов
// sellerStats.forEach((seller, index) => { 
//     seller.bonus_amount = options.calculateBonus(index, sellerStats.length, seller);
    
//     // Формирование топ-10 товаров
//     seller.top_products = Object.entries(seller.products_sold)
//         .map(([sku, quantity]) => ({ sku, quantity }))
//         .sort((a, b) => b.quantity - a.quantity)
//         .slice(0, 10);
// });

//     // Формирование результата
//    return sellerStats.map(seller => ({
//     seller_id: seller.id.toString(),
//     name: seller.name,
//     revenue: +seller.revenue.toFixed(2),
//     profit: +seller.profit.toFixed(2),
//     sales_count: seller.sales_count,
//     top_products: seller.top_products,
//     bonus: +seller.bonus_amount.toFixed(2) 
// }));
// }

// calculateRevenue








// НОВЫЙ ______ КОД
/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
   // @TODO: Расчет выручки от операции
   function calculateSimpleRevenue(purchase, _product) {
    const discountFactor = 1 - (purchase.discount / 100);
    const revenue = purchase.sale_price * purchase.quantity * discountFactor;
    return revenue; 
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */

function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
    const { profit } = seller;
    let bonusPercentage;
    
    if (index === 0) {
        bonusPercentage = 0.15; 
    } else if (index <= 2 && index > 0) {
        bonusPercentage = 0.10; 
    } else if (index < total - 1) {
        bonusPercentage = 0.05; 
    } else {
        bonusPercentage = 0; 
    }
      return profit * bonusPercentage;
}
const result = analyzeSalesData(data, {
    calculateRevenue: calculateSimpleRevenue,
    calculateBonus: calculateBonusByProfit
});
/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */

function analyzeSalesData(data, options) {
    // Проверка основных данных
    if (!data
        || !Array.isArray(data.sellers) || data.sellers.length === 0
        || !Array.isArray(data.products) || data.products.length === 0
        || !Array.isArray(data.purchase_records) || data.purchase_records.length === 0
    ) {
        throw new Error('Некорректные входные данные: данные должны содержать непустые массивы sellers, products и purchase_records');
    }

    // Проверка структуры данных
    const hasInvalidSellers = data.sellers.some(s => 
        !s.id || !s.first_name || !s.last_name
    );
    
    const hasInvalidProducts = data.products.some(p => 
        !p.sku || !p.purchase_price || !p.sale_price
    );
    
    const hasInvalidPurchases = data.purchase_records.some(p => 
        !p.seller_id || !p.items || !Array.isArray(p.items) || p.items.length === 0
    );

    if (hasInvalidSellers
        || hasInvalidProducts
        || hasInvalidPurchases
    ) {
        throw new Error('Некорректная структура данных: проверьте обязательные поля');
    }

    // Проверка items в purchase_records
    const hasInvalidItems = data.purchase_records.some(p => 
        p.items.some(item => 
            !item.sku || !item.quantity || !item.sale_price
        )
    );

    if (hasInvalidItems) {
        throw new Error('Некорректные данные в items: проверьте sku, quantity и sale_price');
    }

    // Проверка опций
    if (!options
        || typeof options.calculateRevenue !== 'function'
        || typeof options.calculateBonus !== 'function'
    ) {
        throw new Error('Некорректные опции: должны быть переданы функции calculateRevenue и calculateBonus');
    }

    // Создаем индексы
    const sellerIndex = {};
    const productIndex = {};
    
    try {
        // Индекс продавцов
        data.sellers.forEach(seller => {
            if (!seller.id || !seller.first_name || !seller.last_name) {
                throw new Error('Не все обязательные поля продавца заполнены');
            }
            sellerIndex[seller.id] = seller;
        });

        // Индекс товаров 
        data.products.forEach(product => {
            if (!product.sku) {
                throw new Error('Не все обязательные поля товара заполнены');
            }
            productIndex[product.sku] = product;
        });
    } catch (e) {
        throw new Error(`Некорректная структура данных: ${e.message}`);
    }

    // Инициализация статистики
    const sellerStats = data.sellers.map(seller => ({
        id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        revenue: 0,
        profit: 0,
        sales_count: 0,
        products_sold: {},
        bonus: 0
    }));

    // Обработка покупок
    data.purchase_records.forEach(record => {
        if (!record.seller_id || !record.items) {
            console.warn('Пропущена запись о продаже с неполными данными', record);
            return;
        }

        const seller = sellerIndex[record.seller_id];
        if (!seller) {
            console.warn(`Продавец с ID ${record.seller_id} не найден`);
            return;
        }

        const sellerStat = sellerStats.find(s => s.id === seller.id);
        if (!sellerStat) return;

        sellerStat.sales_count += 1;

        record.items.forEach(item => {
            if (!item.sku || !item.quantity || !item.sale_price) {
                console.warn('Пропущен товар с неполными данными', item);
                return;
            }

            const product = productIndex[item.sku];
            if (!product) {
                console.warn(`Товар с артикулом ${item.sku} не найден`);
                return;
            }

            // Расчет показателей
         const revenue = options.calculateRevenue({
            sale_price: item.sale_price,
            quantity: item.quantity,
            discount: item.discount || 0
        }, product);
        
        const cost = product.purchase_price * item.quantity;
        const profit = revenue - cost; 

        // Обновление статистики 
        sellerStat.revenue += revenue;
        sellerStat.profit += profit;
    
            // Обновление счетчика товаров
            if (!sellerStat.products_sold[item.sku]) {
                sellerStat.products_sold[item.sku] = 0;
            }
            sellerStat.products_sold[item.sku] += item.quantity;
        });
    });

     
// Сортировка по прибыли
sellerStats.sort((a, b) => b.profit - a.profit);

// Назначение бонусов
sellerStats.forEach((seller, index) => { 
    seller.bonus = options.calculateBonus(index, sellerStats.length, seller);
    
    // Формирование топ-10 товаров
    seller.top_products = Object.entries(seller.products_sold)
        .map(([sku, quantity]) => ({ sku, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);
});

    // Формирование результата
   return sellerStats.map(seller => ({
    seller_id: seller.id,
    name: seller.name,
    revenue: +seller.revenue.toFixed(2),
    profit: +seller.profit.toFixed(2),
    sales_count: seller.sales_count,
    top_products: seller.top_products,
    bonus: +seller.bonus.toFixed(2) 
}));
}

