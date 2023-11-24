/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable no-template-curly-in-string */
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

const cardsWrapper = document.querySelector<HTMLDivElement>('.js-card-wrapper');

type Card = {
    id: number;
    image: string;
    title: string;
    description: string;
    mood: string;
    createdAt: string;
}

const imageArray: string[] = [
  'assets/images/image-1.jpeg',
  'assets/images/image-2.jpeg',
  'assets/images/image-3.jpeg',
  'assets/images/image-4.jpeg',
  'assets/images/image-5.jpeg',
  'assets/images/image-6.jpeg',
  'assets/images/image-7.jpeg',
  'assets/images/image-8.jpeg',
];

function getRandomIndex(array: string[]): number {
  return Math.floor(Math.random() * array.length);
}

const randomIndex: number = getRandomIndex(imageArray);
const randomImageUrl: string = imageArray[randomIndex];
const randomImageElement: HTMLImageElement | null = document.querySelector('.random-image') as HTMLImageElement | null;
if (randomImageElement) {
  randomImageElement.src = randomImageUrl;
}

const drawCards = (): void => {
  cardsWrapper.innerHTML = '';

  axios.get<Card[]>('http://localhost:3004/cards').then(({ data }): void => {
    data.forEach((card: Card): void => {
      cardsWrapper.innerHTML += `
            <div class="card">
                <img class="card__image" src="${card.image}">
                <div class="card__title">${card.title}</div>
                <div class="card__description">${card.description}</div>
                <div class="card__mood">${card.mood}</div>
                <button class="js-card-delete card__delete-button" data-card-id="${card.id}">Delete</button>
                <p class="card__postDate">Created: ${formatDistanceToNow(new Date(), { locale: enUS })} ago</p>
            </div>
        `;
    });

    const cardDeleteButtons = document.querySelectorAll<HTMLButtonElement>('.js-card-delete');

    cardDeleteButtons.forEach((cardBtn): void => {
      cardBtn.addEventListener('click', (): void => {
        const { cardId } = cardBtn.dataset;

        axios.delete(`http://localhost:3004/cards/${cardId}`).then((): void => {
          drawCards();
        });
      });
    });
  });
};

drawCards();

const getRandomImage = (): string => imageArray[Math.floor(Math.random() * imageArray.length)];

const cardForm = document.querySelector('.js-card-form');

cardForm.addEventListener('submit', (event: Event): void => {
  event.preventDefault();

  const cardImage = cardForm.querySelector<HTMLImageElement>('.random-image');
  const cardImageSrc = cardImage.src;
  const cardTitleInput = cardForm.querySelector<HTMLInputElement>('input[name="title"]');
  const cardTitleInputValue = cardTitleInput.value;
  const cardDescriptionInput = cardForm.querySelector<HTMLInputElement>('input[name="description"]');
  const cardDescriptionInputValue = cardDescriptionInput.value;
  const cardMoodInput = cardForm.querySelector<HTMLInputElement>('input[name="mood"]');
  const cardMoodInputValue = cardMoodInput.value;

  axios.post<Card>('http://localhost:3004/cards', {
    image: cardImageSrc,
    title: cardTitleInputValue,
    description: cardDescriptionInputValue,
    mood: cardMoodInputValue,
    createdAt: new Date(),
  }).then(() => {
    cardImage.src = getRandomImage();
    cardTitleInput.value = '';
    cardDescriptionInput.value = '';
    cardMoodInput.value = '';
    drawCards();
  });
});
