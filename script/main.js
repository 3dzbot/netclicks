const SERVER = 'https://api.themoviedb.org/3';
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = 'f7c24f0ca847ceef4e83470c26ef1ff2';
const tvShows = document.querySelector('.tv-shows');

const tvCardImg = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('.modal__link');
const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');

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

  getTestCard = () => {
    return this.getData('card.json');
  }

  getSearchResult = (query) => {
    return this.getData(`${SERVER}/search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`)
  }

  getTvShow = id => {
    //https://api.themoviedb.org/3/tv/33?api_key=<<api_key>>&language=en-US
    return this.getData(`${SERVER}/tv/${id}?api_key=${API_KEY}&language=ru-RU`)
  }
}
//https://api.themoviedb.org/3/search/tv?api_key=<<api_key>>&language=en-US&page=1&query=000&include_adult=false

console.log(new DBService().getSearchResult('НЯНя'));

//создаем прелоадер!!!
const loading = document.createElement('div');
loading.classList.add('loading');

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
  e.preventDefault();
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
    vote_average: vote,
    id
  } = item;

  const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
  const backdropIMG = poster ? IMG_URL + backdrop : '';
  const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

  const card = document.createElement('li');
  card.classList.add('tv-shows__item');
  card.innerHTML = `
    <a href="#" class="tv-card" id=${id}>
      ${voteElem}
      <img class="tv-card__img"
           src="${posterIMG}"
           data-backdrop="${backdropIMG}"
           alt="${title}">
      <h4 class="tv-card__head">${title}</h4>
    </a>
  `;
  //удаляем прелоадера
  loading.remove();
  tvShowList.append(card);
};

const renderCard = (data) => {
  tvShowList.textContent = '';
  data.results.forEach(callback);
}

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const value = searchFormInput.value.trim();
  if(value){
    searchForm.reset();
    tvShows.append(loading);
    new DBService().getSearchResult(value).then(renderCard).then(()=>{loading.remove()})
  }
})

{
  tvShows.append(loading);
  new DBService().getTestData().then(renderCard)
}

//открываем модальное окно
tvShowList.addEventListener('click', (e)=>{
  e.preventDefault();
  const target = e.target;
  const card = target.closest('.tv-card');
  if(card){
    const preloader = document.querySelector('.preloader');
    preloader.style.display = 'block';

    new DBService().getTvShow(card.id)
      .then(data => {
        console.log(data);
        tvCardImg.alt = data.name;
        tvCardImg.src = IMG_URL + data.poster_path;
        modalTitle.textContent = data.name;
        genresList.innerHTML = data.genres.reduce((acc, item)=> `${acc}<li>${item.name}</li>`, '');
        rating.textContent = data.vote_average;
        description.textContent = data.overview;
        modalLink.href = data.homepage;
      })
      .then(()=>{
        preloader.style.display = '';
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
      })
  }
});

modal.addEventListener('click', e =>{
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