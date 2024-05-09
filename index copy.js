import gplay from 'google-play-scraper';

const appId = 'com.ss.android.ugc.trill';

const options = {
  appId: appId,
  lang: 'id',
  country: 'id',
  sort: gplay.sort.NEWEST,
  num: 400
};

gplay.reviews(options)
  .then(response => {
    const reviews = response.data; // Mendapatkan array ulasan dari properti data
    reviews.forEach((review, index) => {
      console.log(`Review ${index + 1}:`);
      console.log('Rating:', review.score);
      console.log('Review Text:', review.text);
      console.log('Date:', review.date);
      console.log('Version:', review.version);
      console.log('----------------------------------');
    });
  })
  .catch(console.log);
