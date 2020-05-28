const DBService = class {
  getData = async (url) => {
    const res = await fetch(url);
    if(res.ok){
      return res.json();
    } else {
      throw new Error(`Не удалось получить данные по адресу ${url}`)
    }
  }

  getTestData = async () => {
    return await this.getData('test.json');
  }
}

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = 'f7c24f0ca847ceef4e83470c26ef1ff2';

hamburger.addEventListener('click', ()=>{
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
});

document.addEventListener('click', (e)=>{
  if(!e.target.closest('.left-menu')){
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
  }
});

leftMenu.addEventListener('click', (e)=>{
  let target = e.target;
  const dropdown = target.closest('.dropdown');
  if(dropdown){
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }
});

const callback = item => {  
  //деструктурируем обьект!!
  const { 
    backdrop_path: backdrop, 
    name: title, 
    poster_path: poster, 
    vote_average: vote 
  } = item;

  const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
  const backdropIMG = poster ? IMG_URL + backdrop : 'img/no-poster.jpg';
  const voteElem = vote ? vote : ' ';

  const card = document.createElement('li');
  card.classList.add('tv-shows__item');
  card.innerHTML = `
    <a href="#" class="tv-card">
      <span class="tv-card__vote">${vote}</span>
      <img class="tv-card__img"
           src="${posterIMG}"
           data-backdrop="${backdropIMG}"
           alt="${title}">
      <h4 class="tv-card__head">${title}</h4>
    </a>
  `;

  tvShowList.append(card);
};

const renderCard = (data) => {
  console.log(data);
  tvShowList.textContent = '';
  data.results.forEach(callback);
}

new DBService().getTestData().then(renderCard);

tvShowList.addEventListener('click', (e)=>{
  e.preventDefault();
  const target = e.target;
  const card = target.closest('.tv-card');
  if(card){
    document.body.style.overflow = 'hidden';
    modal.classList.remove('hide');
  }
});

modal.addEventListener('click', e =>{
  console.log(e.target.classList.contains('modal'));
  if(e.target.closest('.cross') || 
    e.target.classList.contains('modal')){
    document.body.style.overflow = '';
    modal.classList.add('hide');
  }
})

//смена карточки
const changeImage = (e) => {
  const card = e.target.closest('.tv-shows__item');

  if(card){
    const img = card.querySelector('.tv-card__img');
    const changeImg = img.dataset.backdrop;
    if(changeImg){
      [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
      // img.dataset.backdrop = img.src;
      // img.src = changeImg;
    }
  }
}

tvShowList.addEventListener('mouseover', changeImage);
tvShowList.addEventListener('mouseout', changeImage);