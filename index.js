import gplay from 'google-play-scraper';
import { parse } from 'json2csv';
import fs from 'fs';

const appId = 'com.dafturn.mypertamina';
const batchSize = 1000; // Jumlah ulasan dalam setiap batch
const totalReviews = 12000; // Total ulasan yang ingin diambil
const delayBetweenRequests = 5000; // Penundaan antara setiap permintaan (dalam milidetik)

const options = {
  appId: appId,
  lang: 'id',
  country: 'id',
  sort: gplay.sort.NEWEST,
  num: batchSize // Mengatur jumlah ulasan yang akan diminta dalam setiap permintaan
};

let allReviews = []; // Variabel untuk menyimpan semua ulasan

// Fungsi untuk mengambil ulasan dalam batch
async function fetchReviews(startIndex) {
  const reviews = await gplay.reviews({ ...options, start: startIndex });
  return reviews.data;
}

// Fungsi untuk menunggu sebelum melakukan permintaan berikutnya
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fungsi utama untuk mengambil semua ulasan dalam beberapa permintaan
async function getAllReviews() {
  let startIndex = 0;
  while (startIndex < totalReviews) {
    const reviewsBatch = await fetchReviews(startIndex);
    allReviews = allReviews.concat(reviewsBatch);
    startIndex += batchSize;
    console.log(`Fetched ${startIndex} reviews`);
    await delay(delayBetweenRequests); // Menunggu sebelum permintaan berikutnya
  }
}

// Memanggil fungsi utama untuk mengambil semua ulasan
getAllReviews()
  .then(() => {
    // Menentukan kolom-kolom yang akan dimasukkan ke dalam file CSV
    const fields = ['score', 'text', 'date', 'version', 'userName']; // Menambahkan kolom userName

    // Mengonversi ulasan menjadi format CSV
    const csv = parse(allReviews, { fields });

    // Menyimpan data CSV ke dalam file
    fs.writeFileSync('reviews.csv', csv, 'utf-8');

    console.log('CSV file has been created successfully.');
  })
  .catch(console.log);
